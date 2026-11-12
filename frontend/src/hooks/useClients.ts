import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from "@/api/client.api";
import { clientKey } from "@/lib/queryKeys";
import { formDataToClientApiPayload } from "@/mapper/client.mapper";
import type { ClientFormValues, RequestParams } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClients(
  params: RequestParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: clientKey.list(params),
    queryFn: () => getClients(params),
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKey.single(id),
    queryFn: () => getClient(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData: ClientFormValues) =>
      createClient(formDataToClientApiPayload(clientData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKey.all });
      toast.success("New client created successfully");
    },
    onError: () => {
      toast.error("Failed to create client. Please try again.");
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      clientData,
    }: {
      id: string;
      clientData: ClientFormValues;
    }) => updateClient(id, clientData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKey.all });
      queryClient.invalidateQueries({ queryKey: clientKey.single(id) });
      toast.success("Client details updated successfully");
    },
    onError: () => {
      toast.error("Failed to update client details. Please try again.");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: clientKey.single(id) });
      queryClient.invalidateQueries({ queryKey: clientKey.all });
      toast.success("Client deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete client. Please try again.");
    },
  });
}
