import {
  autoSaveInvoice,
  createDraftInvoice,
  deleteInvoice,
  getDashboardStats,
  getInvoice,
  getInvoices,
  updateInvoice,
} from "@/api/invoice.api";
import { invoiceKey } from "@/lib/queryKeys";
import { formDataToApiPayload, formDataToAutoSavePayload, mapInvoice } from "@/mapper/invoice.mapper";
import type { InvoiceFormValues, RequestParams } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    },
    onError: (error) => {
      console.error(error.message || "Something went wrong");
    },
  });
}

export function useautoSaveInvoice() {
  return useMutation({
    mutationFn: ({ id, invoice }: { id: string; invoice: InvoiceFormValues }) =>
      autoSaveInvoice(id, formDataToAutoSavePayload(invoice)),
    onError: (error: any) => {
      console.error(error.response?.data || "Something went wrong");
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
    },
    onError: (error) => {
      console.error(error.message || "Something went wrong");
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: invoiceKey.all });
      queryClient.removeQueries({ queryKey: invoiceKey.single(id) });
    },
    onError: (error: any) => {
      console.error(error.response?.data?.message || "Something went wrong");
    },
  });
}
