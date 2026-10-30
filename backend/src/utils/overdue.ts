const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const overdueWhere = () => ({
  status: "Sent" as const,
  dueDate: { lt: startOfToday() },
});

export const isOverdue = (inv: { status: string; dueDate: Date | null }) =>
  inv.status === "Sent" && !!inv.dueDate && inv.dueDate < startOfToday();
