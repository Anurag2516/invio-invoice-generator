import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from "@/api/client.api";
import { clientKey } from "@/lib/queryKeys";
import { formDataToClientApiPayload } from "@/mapper/client.mapper";
import type {
  ClientFormValues,
  RequestParams,
} from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useClients(
  params: RequestParams = {},
  fetchAll: boolean = true,
) {
  return useQuery({
    queryKey: clientKey.list(params),
    queryFn: () => getClients(params),
    staleTime: 1000 * 60 * 5,
    enabled: fetchAll || !!params,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKey.single(id),
    queryFn: () => getClient(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientData: ClientFormValues) =>
      createClient(formDataToClientApiPayload(clientData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKey.all });
    },
    onError: (error: any) => {
      console.log(error.response?.data || "Something went wrong");
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKey.all });
      queryClient.invalidateQueries({
        queryKey: clientKey.single(variables.id),
      });
    },
    onError: (error: any) => {
      console.log(error.response?.data || "Something went wrong");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: clientKey.all });
      queryClient.invalidateQueries({
        queryKey: clientKey.single(id),
      });
    },
    onError: (error: any) => {
      console.log(error.response?.data || "Something went wrong");
    },
  });
}
