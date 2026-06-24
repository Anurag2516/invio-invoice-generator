import type { Invoice } from "@/types/invoice";

export const dateChecker = (invoice: Invoice) => {
  if (invoice.status === "Sent") {
    return new Date() > new Date(invoice.dueDate);
  }
};
