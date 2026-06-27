import type { Invoice } from "@/types/invoice";

interface StatsCardsProps {
  invoices: Invoice[];
}

const StatsCards = ({ invoices }: StatsCardsProps) => {
  const statsCards = [
    {
      label: "Total Invoices",
      value: invoices.length,
      sub: "All time",
    },
    {
      label: "Paid Invoices",
      value: invoices.filter((i) => i.status === "Paid").length,
      color: "#4a7c59",
    },
    {
      label: "Outstanding Invoices",
      value: invoices.filter((i) => i.status === "Sent").length,
      color: "#c48a2f",
    },
    {
      label: "Overdue Invoices",
      value: invoices.filter(
        (i) => i.status === "Sent" && new Date(i.dueDate) < new Date(),
      ).length,
      color: "#dc3545",
    },
  ];
  return (
    <div className="bg-background">
      <h1 className="text-2xl text-foreground px-4 sm:px-8 lg:px-24 pt-8 font-medium">
        My Dashboard
      </h1>
      <p className="text-base text-stone px-4 sm:px-8 lg:px-24 pt-2">
        Welcome Back
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 px-4 sm:px-8 lg:px-24">
        {statsCards.map((statsCard) => (
          <div
            key={statsCard.label}
            className="flex flex-col gap-1.5 border border-border rounded-xl py-4 px-6 bg-background shadow-sm"
          >
            <span className="text-[13px] font-normal uppercase tracking-wide text-foreground">
              {statsCard.label}
            </span>
            <span
              className="text-3xl font-normal leading-tight text-foreground"
              style={{ color: statsCard.color }}
            >
              {statsCard.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
