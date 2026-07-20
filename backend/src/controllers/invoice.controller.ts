import { Request, Response } from "express";
import { prisma } from "../config/db";
import { InvoiceInput, invoiceSchema } from "../schemas/invoice.schema";
import { ParamsDictionary } from "express-serve-static-core";

interface InvoiceParams extends ParamsDictionary {
  id: string;
}

const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedInvoice = invoiceSchema.safeParse(req.body.invoice);

    if (!parsedInvoice.success) {
      res.status(400).json({
        success: false,
        message: "Invalid invoice",
        errors: parsedInvoice.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const invoice: InvoiceInput = parsedInvoice.data;
    const { lineItems, ...invoiceData } = invoice;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: req.user!.userId,
        ...invoiceData,
        lineItems: { create: lineItems },
      },
      omit: {
        userId: true,
        clientId: true,
      },
      include: {
        lineItems: {
          omit: {
            id: true,
            invoiceId: true,
          },
        },
        sender: {
          omit: {
            id: true,
            password: true,
            createdAt: true,
          },
        },
        client: {
          omit: { id: true, userId: true, createdAt: true, updatedAt: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: newInvoice,
      message: "Invoice created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateInvoice = async (
  req: Request<InvoiceParams>,
  res: Response,
): Promise<void> => {
  try {
    const parsedInvoice = invoiceSchema.safeParse(req.body.invoice);

    if (!parsedInvoice.success) {
      res.status(400).json({
        success: false,
        message: "Invalid Invoice",
        errors: parsedInvoice.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const invoice: InvoiceInput = parsedInvoice.data;
    const invoiceId = req.params.id;

    const exists = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!exists) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    const { lineItems, ...invoiceData } = invoice;

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        userId: req.user!.userId,
        ...invoiceData,
        lineItems: {
          deleteMany: {},
          create: lineItems,
        },
      },
      omit: { userId: true, clientId: true },
      include: {
        lineItems: {
          omit: {
            id: true,
            invoiceId: true,
          },
        },
        sender: {
          omit: {
            id: true,
            password: true,
            createdAt: true,
          },
        },
        client: {
          omit: { id: true, userId: true, createdAt: true, updatedAt: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedInvoice,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getInvoice = async (
  req: Request<InvoiceParams>,
  res: Response,
): Promise<void> => {
  try {
    const invoiceId = req.params.id;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      omit: {
        userId: true,
        clientId: true,
      },
      include: {
        lineItems: {
          omit: {
            id: true,
            invoiceId: true,
          },
        },
        sender: {
          omit: {
            id: true,
            password: true,
            createdAt: true,
          },
        },
        client: {
          omit: { id: true, userId: true, createdAt: true, updatedAt: true },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getInvoices = async (
  req: Request<InvoiceParams>,
  res: Response,
): Promise<void> => {
  try {
    const invoice = await prisma.invoice.findMany({
      omit: {
        userId: true,
        clientId: true,
      },
      include: {
        lineItems: {
          omit: {
            id: true,
            invoiceId: true,
          },
        },
        sender: {
          omit: {
            id: true,
            password: true,
            createdAt: true,
          },
        },
        client: {
          omit: { id: true, userId: true, createdAt: true, updatedAt: true },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteInvoice = async (
  req: Request<InvoiceParams>,
  res: Response,
): Promise<void> => {
  try {
    const invoiceId = req.params.id;

    const invoiceExists = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoiceExists) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { createInvoice, updateInvoice, getInvoice, getInvoices, deleteInvoice };
