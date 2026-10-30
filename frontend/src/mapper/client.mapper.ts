import type {
  ClientApiPayload,
  ClientFormValues,
  ClientResponse,
} from "@/types/invoice";

const optStr = (val?: string) => val?.trim() || undefined;

export const formDataToClientApiPayload = (
  form: ClientFormValues,
): ClientApiPayload => ({
  name: form.name,
  email: optStr(form.email),
  companyName: optStr(form.companyName),
  address: optStr(form.address),
  phone: optStr(form.phone),
  website: optStr(form.website),
});

export const ClientResponseToFormData = (
  client: ClientResponse,
): ClientFormValues => ({
  name: client.name,
  email: client.email ?? "",
  companyName: client.companyName ?? "",
  address: client.address ?? "",
  phone: client.phone ?? "",
  website: client.website ?? "",
});
