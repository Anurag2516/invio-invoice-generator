import { Skeleton } from "../skeleton";

export const TopbarSkeleton = () => (
  <div className="bg-background border-b border-stone/30">
    <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Skeleton className="h-5 w-5 rounded-md xl:hidden" />

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded-md" />
            <Skeleton className="h-5 w-12 sm:w-16 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 sm:h-11 w-28 sm:w-40 rounded-lg" />
    </div>
  </div>
);

const FormBodySkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-3 w-32" />
      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2 w-32">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2 w-36">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>

    <Skeleton className="h-px w-full" />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[0, 1].map((col) => (
        <div key={col} className="space-y-4">
          <Skeleton className="h-3 w-20" />
          {[
            "h-3 w-24",
            "h-10 w-full",
            "h-3 w-28",
            "h-10 w-full",
            "h-3 w-16",
            "h-10 w-full",
            "h-3 w-12",
            "h-10 w-full",
          ].map((cls, i) => (
            <Skeleton key={i} className={`${cls} rounded-lg`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const PreviewSkeleton = () => (
  <div className="hidden xl:block w-2/5 shrink-0 px-4 bg-[#f7f5f0]">
    <Skeleton className="h-5 w-32 my-8" />
    <Skeleton className="h-140 w-full rounded-lg" />
  </div>
);

export const InvoiceFormSkeleton = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 w-full overflow-hidden">
        <TopbarSkeleton />

        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="w-full xl:w-3/5 px-4 sm:px-6 py-6 overflow-y-auto bg-background">
            <FormBodySkeleton />
          </div>
          <PreviewSkeleton />
        </div>
      </div>
    </div>
  );
};
