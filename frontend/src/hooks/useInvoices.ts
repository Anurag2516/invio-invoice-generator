import {
  autoSaveInvoice,
  createDraftInvoice,
  deleteInvoice,
  getDashboardStats,
  getInvoice,
  getInvoices,
  updateInvoice,
  updateInvoiceStatus,
} from "@/api/invoice.api";
import { invoiceKey } from "@/lib/queryKeys";
import {
  formDataToApiPayload,
  formDataToAutoSavePayload,
  mapInvoice,
} from "@/mapper/invoice.mapper";
import type {
  InvoiceFormValues,
  RequestParams,
  UpdateStatus,
} from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useInvoices(params: RequestParams = {}) {
  return useQuery({
    queryKey: invoiceKey.list(params),
    queryFn: () => getInvoices(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: invoiceKey.stats,
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKey.single(id),
    queryFn: () => getInvoice(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: mapInvoice,
  });
}

export function useCreateDraftInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId?: string) => createDraftInvoice(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKey.all });
      toast.success("Draft invoice created successfully");
    },
    onError: () => {
      toast.error("Failed to create invoice. Please try again.");
    },
  });
}

export function useAutoSaveInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, invoice }: { id: string; invoice: InvoiceFormValues }) =>
      autoSaveInvoice(id, formDataToAutoSavePayload(invoice)),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKey.single(id) });
    },
    onError: (error: any) => {
      console.error(error.response?.data || "Something went wrong");
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UpdateStatus }) =>
      updateInvoiceStatus(id, status),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: invoiceKey.all,
        }),
        queryClient.invalidateQueries({
          queryKey: invoiceKey.single(variables.id),
        }),
      ]);
      toast.success(`Invoice marked as ${variables.status}`);
    },

    onError: () => {
      toast.error("Failed to update invoice status. Please try again.");
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, invoice }: { id: string; invoice: InvoiceFormValues }) =>
      updateInvoice(id, formDataToApiPayload(invoice)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: invoiceKey.all });
      queryClient.invalidateQueries({
        queryKey: invoiceKey.single(variables.id),
      });
      toast.success("Invoice updated successfully");
    },
    onError: () => {
      toast.error("Failed to update invoice. Please try again.");
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: invoiceKey.single(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKey.all });
      toast.success("Invoice deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete invoice. Please try again.");
    },
  });
}
