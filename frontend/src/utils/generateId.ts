 export const generateId = (): string => crypto.randomUUID();

export const generateInvoiceNumber = (existingNumbers: string[]): string => {
  const nums: number[] = existingNumbers
    .map((n) => parseInt(n.replace(/\D/g, ""), 10))
    .filter(Boolean);

  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

  return `INV-${String(next).padStart(4, "0")}`;
};
