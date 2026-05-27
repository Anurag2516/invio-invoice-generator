import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import SectionHeader from "../ui/SectionHeader";

interface ClientSectionProps {
  party: "sender" | "client";
  register: InvoiceFormProps["register"];
  errors: InvoiceFormProps["errors"];
}

const PartyFields = ({
  party,
  register,
  errors,
}: ClientSectionProps) => {
  const error = party === "sender" ? errors.sender : errors.client;
  return (
    <div className="flex flex-col gap-2 ">
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
      <Input
        {...register(`${party}.email`)}
        label="Email"
        error={error?.email?.message}
        placeholder="johndoe@email.com"
      />
      <Input
        {...register(`${party}.phone`)}
        label="Phone"
        error={error?.phone?.message}
        placeholder="+91 98765 43210"
      />
    </div>
  );
};

const ClientSection = ({ register, errors }: InvoiceFormProps) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <SectionHeader label="From" />
            <span className="text-xs text-stone-500 tracking-wide">
              (Your Details)
            </span>
          </div>
          <PartyFields party="sender" register={register} errors={errors} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <SectionHeader label="Bill To" />
            <span className="text-xs text-stone-500 tracking-wide">
              (Client Details)
            </span>
          </div>
          <PartyFields party="client" register={register} errors={errors} />
        </div>
      </div>
    </div>
  );
};

export default ClientSection;
