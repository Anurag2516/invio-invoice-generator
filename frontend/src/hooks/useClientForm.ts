import type { ClientFormValues, ClientResponse } from "@/types/invoice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clientSchema from "@/schema/client.schema";
import { useCreateClient } from "./useClients";

export const useClientForm = () => {
  const { mutate, isPending, isSuccess } = useCreateClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      address: "",
      phone: "",
      website: "",
    },
  });

  const onSubmit = (callbacks?: {
    onSuccess?: (client: ClientResponse) => void;
  }) =>
    form.handleSubmit(async (client: ClientFormValues) => {
      mutate(client, {
        onSuccess: (data) => callbacks?.onSuccess?.(data),
      });
    });

  return { form, onSubmit, isPending, isSuccess };
};
