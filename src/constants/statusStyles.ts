import type { Status } from "@/types/invoice";

export const STATUS_STYLES: Record<Status, string> = {
  Sent: "dark:bg-[#1e2f45] dark:text-[#7ba8e0] bg-[#dce8f7] text-[#3f6fa8]",
  Paid: "dark:bg-[#426F4F]/75 dark:text-[#bce8c7] bg-[#dde9dc] text-[#4d7a52]",
  Draft: "dark:bg-[#2a2825] dark:text-[#b3aa9c] bg-[#ece8e0] text-[#8a8377]",
};