import { Controller } from "react-hook-form";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import SectionHeader from "../ui/SectionHeader";
import { phoneNumberFilter } from "@/utils/inputFilters";

interface ClientSectionProps {
  party: "sender" | "client";
  register: InvoiceFormProps["register"];
  control: InvoiceFormProps["control"];
  errors: InvoiceFormProps["errors"];
}

const PartyFields = ({
  party,
  register,
  control,
  errors,
}: ClientSectionProps) => {
  const error = party === "sender" ? errors.sender : errors.client;
  return (
    <div className="flex flex-col gap-2">
      <Input
        {...register(`${party}.name`)}
        label={party === "sender" ? "Your Name" : "Client Name"}
        error={error?.name?.message}
        placeholder="John Doe"
      />
      <Input
        {...register(`${party}.companyName`)}
        label="Company Name"
        error={error?.companyName?.message}
        placeholder="Example Corp"
      />
      <Input
        {...register(`${party}.address`)}
        label="Address"
        placeholder="New York City, New York"
        error={error?.address?.message}
      />
      <Controller
        name={`${party}.phone`}
        control={control}
        render={({ field }) => (
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            value={field.value as string}
            onChange={(e) => {
              if (phoneNumberFilter(e)) field.onChange(e);
            }}
            error={error?.phone?.message}
          />
        )}
      />
      <Input
        {...register(`${party}.email`)}
        label="Email"
        error={error?.email?.message}
        placeholder="johndoe@email.com"
      />
    </div>
  );
};

const ClientSection = ({ register, control, errors }: InvoiceFormProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <SectionHeader label="From" subLabel="(Your Details)" />
          <PartyFields
            party="sender"
            register={register}
            control={control}
            errors={errors}
          />
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeader label="Bill To" subLabel="(Client Details)" />
          <PartyFields
            party="client"
            register={register}
            control={control}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientSection;
