import type { LineItem, InvoiceTotal } from "../types/invoice";

export const calculateLineAmount = (
  quantity: number,
  rate: number,
): number => {
  return Number((quantity * rate).toFixed(2));
};

export const calculateInvoiceTotal = (
  lineItems: LineItem[],
  taxRate: number,
  discountRate: number,
): InvoiceTotal => {
  const subtotal: number = Number(
    lineItems
      .reduce((initialValue, element) => initialValue + element.amount, 0)
      .toFixed(2),
  );

  const discountAmount: number =
    discountRate !== 0
      ? Number((subtotal * (discountRate / 100)).toFixed(2))
      : 0;

  const taxableAmount = subtotal - discountAmount;

  const taxAmount: number =
    taxRate !== 0 ? Number((taxableAmount * (taxRate / 100)).toFixed(2)) : 0;

  const total: number = Number((taxableAmount + taxAmount).toFixed(2));

  return { subtotal, taxRate, discountRate, taxAmount, discountAmount, total };
};
