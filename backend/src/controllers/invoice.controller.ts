import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import {
  AutoSaveInput,
  autoSaveSchema,
  invoiceSchema,
  listInvoicesQuerySchema,
  updateInvoiceStatusSchema,
} from "../schema/invoice.schema";
import { Params } from "../types/params";
import { overdueWhere } from "../utils/overdue";
import { Prisma } from "../../generated/prisma/client";

const createDraftInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      omit: {
        id: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { clientId } = req.body;

    const client = clientId
      ? await prisma.client.findUnique({
          where: { id: clientId },
          omit: { userId: true, createdAt: true, updatedAt: true },
        })
      : null;

    const result = await prisma.$transaction(async (tx) => {
      const lastInvoice = await tx.invoice.findFirst({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" },
        select: { invoiceNumber: true },
      });

      let nextNumber = "INV-001";

      if (lastInvoice) {
        const last = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
        nextNumber = `INV-${String(last + 1).padStart(3, "0")}`;
      }

      return await tx.invoice.create({
        data: {
          userId: req.user!.userId,
          invoiceNumber: nextNumber,
          status: "Draft",
          issueDate: new Date(),
          senderName: user?.name,
          senderEmail: user?.email,
          senderCompany: user?.companyName,
          senderAddress: user?.address,
          senderPhone: user?.phone,
          senderWebsite: user?.website,
          accountHolderName: user?.accountHolderName,
          accountNumber: user?.accountNumber,
          bankName: user?.bankName,
          ...(client && {
            clientId: client.id,
            snapshotClientName: client.name,
            snapshotClientEmail: client.email,
            snapshotClientCompany: client.companyName,
            snapshotClientAddress: client.address,
            snapshotClientPhone: client.phone,
            snapshotClientWebsite: client.website,
          }),
          lineItems: {
            create: {
              rate: 0,
              quantity: 1,
              amount: 0,
            },
          },
        },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          issueDate: true,
          senderName: true,
          senderEmail: true,
          senderCompany: true,
          senderAddress: true,
          senderPhone: true,
          senderWebsite: true,
          bankName: true,
          accountHolderName: true,
          accountNumber: true,
          clientId: true,
          snapshotClientName: true,
          snapshotClientEmail: true,
          snapshotClientCompany: true,
          snapshotClientAddress: true,
          snapshotClientPhone: true,
          snapshotClientWebsite: true,
          lineItems: true,
        },
      });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const autoSaveInvoice = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = autoSaveSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }
    const { lineItems, clientId, ...invoiceData }: AutoSaveInput = parsed.data;
    const invoiceId = req.params.id;

    const invoiceExists = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
    });

    if (!invoiceExists) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    if (invoiceExists.status !== "Draft") {
      res.status(403).json({
        message: "Only draft invoices can be edited.",
      });
      return;
    }

    await prisma.invoice.update({
      where: { id: invoiceId, userId: req.user.userId, status: "Draft" },
      data: {
        ...invoiceData,
        ...(clientId !== undefined && {
          client:
            clientId === null
              ? { disconnect: true }
              : { connect: { id: clientId } },
        }),
        ...(lineItems && {
          lineItems: {
            deleteMany: {},
            create: lineItems,
          },
        }),
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const saveInvoice = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedInvoice = invoiceSchema.safeParse(req.body);

    if (!parsedInvoice.success) {
      res.status(400).json({
        errors: parsedInvoice.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const { lineItems, ...invoice } = parsedInvoice.data;
    const invoiceId = req.params.id;

    const invoiceExists = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!invoiceExists) {
      res.status(404).json({
        message: "Invoice not found",
      });
      return;
    }

    if (invoiceExists.status !== "Draft") {
      res.status(403).json({
        message: "Only draft invoices can be edited",
      });
      return;
    }

    const savedInvoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
        userId: req.user.userId,
        status: "Draft",
      },
      data: {
        ...invoice,
        lineItems: {
          deleteMany: {},
          create: lineItems,
        },
      },
      include: {
        lineItems: {
          omit: { invoiceId: true },
        },
      },
      omit: {
        userId: true,
      },
    });

    res.status(200).json(savedInvoice);
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(409).json({
        message: "Invoice status changed. Refresh before editing.",
      });
      return;
    }

    next(error);
  }
};

const updateInvoiceStatus = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = updateInvoiceStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid invoice status",
      });
      return;
    }

    const { status } = parsed.data;
    const invoiceId = req.params.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!invoice) {
      res.status(404).json({
        message: "Invoice not found",
      });
      return;
    }

    const allowedTransitions = {
      Draft: ["Sent", "Paid", "Cancelled"],
      Sent: ["Paid", "Cancelled"],
      Paid: [],
      Cancelled: [],
    } as const;

    const allowedStatuses = allowedTransitions[invoice.status];

    if (!allowedStatuses.includes(status as never)) {
      res.status(409).json({
        message: `Cannot change invoice status from ${invoice.status} to ${status}.`,
      });
      return;
    }

    const updated = await prisma.invoice.updateMany({
      where: {
        id: invoiceId,
        userId: req.user.userId,
        status: invoice.status,
      },
      data: {
        status,
      },
    });

    if (updated.count === 0) {
      res.status(409).json({
        message: "Invoice status has changed. Please refresh and try again.",
      });
      return;
    }

    res.status(200).json({
      id: invoiceId,
      status,
      message: `Invoice marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const invoiceId = req.params.id;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
      omit: {
        userId: true,
      },
      include: {
        lineItems: {
          omit: {
            invoiceId: true,
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({
        message: "Invoice not found",
      });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = listInvoicesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const { search, limit, sort, order, filter } = parsed.data;

    const invoice = await prisma.invoice.findMany({
      where: {
        userId: req.user.userId,
        ...(search && {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            { snapshotClientName: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(filter === "overdue" && overdueWhere()),
        ...(filter === "paid" && { status: "Paid" }),
        ...(filter === "outstanding" && { status: "Sent" }),
        ...(filter === "cancelled" && { status: "Cancelled" }),
      },
      ...(limit && { take: limit }),
      orderBy: { [sort]: order },
      omit: {
        userId: true,
      },
      include: {
        lineItems: {
          omit: {
            invoiceId: true,
          },
        },
      },
    });

    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const invoiceId = req.params.id;

    const invoiceExists = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
    });

    if (!invoiceExists) {
      res.status(404).json({
        message: "Invoice not found",
      });
      return;
    }

    await prisma.invoice.delete({
      where: {
        id: invoiceId,
        userId: req.user.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [total, overdue, paid, outstanding] = await Promise.all([
      prisma.invoice.count({
        where: {
          userId: req.user.userId,
        },
      }),
      prisma.invoice.count({
        where: {
          userId: req.user.userId,
          ...overdueWhere(),
        },
      }),
      prisma.invoice.count({
        where: {
          userId: req.user.userId,
          status: "Paid",
        },
      }),
      prisma.invoice.count({
        where: {
          userId: req.user.userId,
          status: "Sent",
        },
      }),
    ]);

    res.status(200).json({ total, overdue, paid, outstanding });
  } catch (error) {
    next(error);
  }
};

export {
  createDraftInvoice,
  autoSaveInvoice,
  saveInvoice,
  updateInvoiceStatus,
  getInvoice,
  getInvoices,
  deleteInvoice,
  getDashboardStats,
};
