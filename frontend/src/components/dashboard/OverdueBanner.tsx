import { useDashboardStats } from "@/hooks/useInvoices";
import { ArrowRight, CircleAlert } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

type OverdueBadgeProps = {
  navigate: NavigateFunction;
};

const OverdueBanner = ({ navigate }: OverdueBadgeProps) => {
  const { data: stats } = useDashboardStats();

  if (!stats || stats.overdue === 0) return null;

  return (
    <div className="mt-4 flex w-full flex-col gap-2 rounded-md border border-border bg-red-200 px-4 py-3 text-red-900 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 dark:bg-[#3c0e0e] dark:text-[#ec7e7e]">
      <div className="flex items-start gap-2 tracking-wide sm:items-center">
        <CircleAlert size={20} className="mt-0.5 shrink-0 sm:mt-0" />
        <span className="text-sm sm:text-base">
          {stats.overdue === 1
            ? "1 invoice is overdue. Review it before it is past 30 days."
            : `${stats.overdue} invoices are overdue — review them before they're past 30 days.`}
        </span>
      </div>

      <button
        type="button"
        onClick={() => navigate("/invoices?tab=overdue")}
        className="inline-flex shrink-0 items-center gap-1 self-start pl-7 text-sm font-medium hover:underline sm:self-auto sm:pl-0 sm:text-base"
      >
        View Overdue <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default OverdueBanner;