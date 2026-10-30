import { useDashboardStats } from "@/hooks/useInvoices";

const StatsCards = () => {
  const { data: stats, isLoading, isError } = useDashboardStats();

  const statsCards = [
    { label: "Total Invoices", value: stats?.total },
    { label: "Paid Invoices", value: stats?.paid, color: "#4a7c59" },
    {
      label: "Outstanding Invoices",
      value: stats?.outstanding,
      color: "#c48a2f",
    },
    { label: "Overdue Invoices", value: stats?.overdue, color: "#dc3545" },
  ];

  return (
    <div className="bg-background">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-2 border border-border rounded-xl py-6 px-6 bg-background shadow-sm"
          >
            <span className="text-[13px] font-normal uppercase tracking-wide text-foreground">
              {card.label}
            </span>

            {isLoading ? (
              <div className="h-9 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <span
                className="text-3xl font-normal leading-tight text-foreground"
                style={{ color: isError ? undefined : card.color }}
              >
                {isError ? "—" : (card.value ?? 0)}
              </span>
            )}
          </div>
        ))}
      </div>

      {isError && (
        <p className="mt-2 text-sm text-foreground/60">
          Couldn't load invoice stats.
        </p>
      )}
    </div>
  );
};

export default StatsCards;
