import api from "@/lib/axios";
import { formDataToClientApiPayload } from "@/mapper/client.mapper";
import type {
  ClientApiPayload,
  ClientFormValues,
  ClientResponse,
  RequestParams,
} from "@/types/invoice";

export const getClients = async (
  params: RequestParams = {},
): Promise<ClientResponse[]> => {
  const res = await api.get("/api/client/getClients", { params });
  return res.data;
};

export const getClient = async (id: string): Promise<ClientResponse> => {
  const res = await api.get(`/api/client/getClient/${id}`);
  return res.data;
};

export const createClient = async (
  clientData: ClientApiPayload,
): Promise<ClientResponse> => {
  const res = await api.post("/api/client/createClient/", clientData);
  return res.data;
};

export const updateClient = async (
  id: string,
  client: ClientFormValues,
): Promise<ClientResponse> => {
  const clientPayload = formDataToClientApiPayload(client);
  const res = await api.put(`/api/client/updateClient/${id}`, clientPayload);
  return res.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const res = await api.delete(`/api/client/deleteClient/${id}`);
  return res.data;
};
