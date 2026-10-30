import { useDashboardStats } from "@/hooks/useInvoices";
import { ArrowRight, CircleAlert } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

type OverdueBadgeProps = {
  navigate: NavigateFunction;
};

const OverdueBadge = ({ navigate }: OverdueBadgeProps) => {
  const { data: stats } = useDashboardStats();
  return (
    <>
      {stats?.overdue !== 0 && (
        <div className="flex items-center justify-between mt-4 w-full px-6 py-3 bg-red-200 text-red-900 dark:bg-[#3c0e0e] dark:text-[#ec7e7e] border border-border rounded-md">
          <div className="inline-flex gap-2 items-center justify-between tracking-wide">
            <CircleAlert size={20} />
            {stats?.overdue === 1 ? (
              <span>
                {stats.overdue} invoice is overdue. Review it before it is past
                30 days.
              </span>
            ) : (
              <span>
                {stats?.overdue} invoices are overdue — review them before
                they're past 30 days.
              </span>
            )}
          </div>
          <a
            onClick={() => navigate("/invoices?tab=overdue")}
            className="text-red-900 dark:text-[#ec7e7e] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            View Overdue <ArrowRight size={16} />
          </a>
        </div>
      )}
    </>
  );
};

export default OverdueBadge;
