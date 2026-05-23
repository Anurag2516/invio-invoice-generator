import { create } from "zustand";
import type { Invoice, InvoiceStore } from "../types/invoice";
import { createEmptyInvoice, defaultLineItem } from "../utils/defaults";
import { calculateInvoiceTotal } from "../utils/calculations";
import { persist } from "zustand/middleware";

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      activeInvoice: createEmptyInvoice(),

      newInvoice: () => {
        const { invoices } = get();
        const existingNumbers = invoices.map((number) => number.invoiceNumber);
        set({
          activeInvoice: createEmptyInvoice(existingNumbers),
        });
      },

      saveInvoice: () => {
        const { invoices, activeInvoice } = get();

        const updated: Invoice = {
          ...activeInvoice,
          updatedAt: new Date().toISOString(),
        };

        const alreadyExists: boolean = invoices.some(
          (invoice) => invoice.id === updated.id,
        );

        set({
          invoices: alreadyExists
            ? invoices.map((invoice) =>
                invoice.id === updated.id ? updated : invoice,
              )
            : [...invoices, updated],
          activeInvoice: updated,
        });
      },

      loadInvoice: (id) => {
        const { invoices } = get();

        const invoice = invoices.find((i) => i.id === id);

        if (invoice) set({ activeInvoice: invoice });
      },

      deleteInvoice: (id) => {
        const { invoices, activeInvoice, newInvoice } = get();

        set({ invoices: invoices.filter((invoice) => invoice.id !== id) });

        if (activeInvoice.id === id) newInvoice();
      },

      updateActiveInvoice: (invoice) => {
        set({ activeInvoice: invoice });
      },

      addLineItem: () => {
        const { activeInvoice } = get();

        const newItem = defaultLineItem();

        set({
          activeInvoice: {
            ...activeInvoice,
            lineItems: [...activeInvoice.lineItems, newItem],
          },
        });
      },

      removeLineItem: (id) => {
        const { activeInvoice } = get();

        const newItems = activeInvoice.lineItems.filter(
          (item) => item.id !== id,
        );

        const totals = calculateInvoiceTotal(
          newItems,
          activeInvoice.invoiceTotal.appliedTax,
          activeInvoice.invoiceTotal.appliedDiscount,
        );

        set({
          activeInvoice: {
            ...activeInvoice,
            lineItems: newItems,
            invoiceTotal: totals,
          },
        });
      },
    }),
    { name: "invoice-store" },
  ),
);
