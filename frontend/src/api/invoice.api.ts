import api from "@/lib/axios";
import type {
  AutoSaveApiPayload,
  DashboardStats,
  DraftInvoiceResponse,
  InvoiceApiPayload,
  InvoiceResponse,
  RequestParams,
} from "@/types/invoice";

export const createDraftInvoice = async (
  clientId?: string,
): Promise<DraftInvoiceResponse> => {
  const res = await api.post("/api/invoice/createInvoice/draft", { clientId });
  return res.data;
};

export const autoSaveInvoice = async (id: string, invoice: AutoSaveApiPayload) => {
  const res = await api.patch(`/api/invoice/autoSaveInvoice/${id}`, invoice);
  return res.data;
};

export const updateInvoice = async (
  id: string,
  invoice: InvoiceApiPayload,
): Promise<InvoiceResponse> => {
  const res = await api.put(`/api/invoice/updateInvoice/${id}`, invoice);
  return res.data;
};

export const getInvoice = async (id: string): Promise<InvoiceResponse> => {
  const res = await api.get(`/api/invoice/getInvoice/${id}`);
  return res.data;
};

export const getInvoices = async (
  params: RequestParams = {},
): Promise<InvoiceResponse[]> => {
  const res = await api.get("/api/invoice/getInvoices", { params });
  return res.data;
};

export const deleteInvoice = async (id: string) => {
  const res = await api.delete(`/api/invoice/deleteInvoice/${id}`);
  return res.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/api/invoice/getDashboardStats");
  return res.data;
};
