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
    <h3 className="text-sm uppercase tracking-wider text-stone mb-1">
      {label}
    </h3>
    <div className="text-[14px] text-stone leading-5.5">
      <p className="font-bold text-lg text-ink">{data.name}</p>
      {data.companyName && <p>{data.companyName}</p>}
      {data.address && <p>{data.address}</p>}
      {data.email && <p>{data.email}</p>}
      {data.phone && <span className="font-numbers">{data.phone}</span>}
    </div>
  </div>
);

const PreviewClientSection = ({
  sender,
  client,
}: PreviewClientSectionProps) => (
  <div className="grid grid-cols-2 gap-6 mb-7 px-8">
    <PartyInfo label="Bill From:" data={sender} />
    <PartyInfo label="Bill To:" data={client} />
  </div>
);

export default PreviewClientSection;
