import type { RequestParams } from "@/types/invoice";

export const invoiceKey = {
  all: ["invoices"] as const,
  list: (params: RequestParams = {}) =>
    [...invoiceKey.all, "list", params] as const,
  single: (id: string) => [...invoiceKey.all, "detail", id] as const,
  stats: ["dashboardStats"] as const,
  filter: ["filterTabs"] as const
};

export const userKey = {
  userProfile: ["user-profile"] as const,
};

export const clientKey = {
  all: ["clients"] as const,
  list: (params: RequestParams = {}) =>
    [...clientKey.all, "list", params] as const,
  single: (id: string) => [...clientKey.all, "detail", id] as const,
};
