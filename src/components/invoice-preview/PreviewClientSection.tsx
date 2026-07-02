import type { useInvoiceStore } from "@/store/invoiceStore";

type Sender = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["sender"];
type Client = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["client"];

interface PartyInfoProps {
  label: string;
  data: Sender | Client;
}

interface PreviewClientSectionProps {
  sender: Sender;
  client: Client;
}

const PartyInfo = ({ label, data }: PartyInfoProps) => (
  <div>
    <h3 className="text-[10px] sm:text-sm uppercase tracking-wider text-[#71685a] mb-1">
      {label}
    </h3>
    <div className="text-[11px] sm:text-[14px] text-[#71685a] leading-4 sm:leading-5.5">
      <p className="font-bold text-sm sm:text-lg text-[#0f0e0c]">{data.name}</p>
      {data.companyName && <p>{data.companyName}</p>}
      {data.address && <p>{data.address}</p>}
      {data.email && <p>{data.email}</p>}
      {data.phone && <span>{data.phone}</span>}
    </div>
  </div>
);

const PreviewClientSection = ({
  sender,
  client,
}: PreviewClientSectionProps) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-7 px-3 xs:px-4 sm:px-8">
    <PartyInfo label="Bill From:" data={sender} />
    <PartyInfo label="Bill To:" data={client} />
  </div>
);

export default PreviewClientSection;
