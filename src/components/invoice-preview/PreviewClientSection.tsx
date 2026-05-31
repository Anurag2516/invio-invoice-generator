import type { useInvoiceStore } from "@/store/invoiceStore";

type Sender = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["sender"];

type Client = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["client"];

interface PreviewClientSectionProps {
  sender: Sender;
  client: Client;
}

const PreviewClientSection = ({
  sender,
  client,
}: PreviewClientSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-7 px-10">
      <div>
        <p className="text-base font-bold uppercase tracking-wider text-stone mb-1">
          Bill From:
        </p>
        <div className="text-[14px] text-stone leading-5.5">
          <p className="font-bold text-lg text-ink">{sender.name}</p>
          {sender.companyName && <p>{sender.companyName}</p>}
          {sender.address && <p>{sender.address}</p>}
          {sender.email && <p>{sender.email}</p>}
          {sender.phone && <span className="mono">{sender.phone}</span>}
        </div>
      </div>
      <div>
        <p className="text-base font-bold uppercase tracking-wider text-stone mb-1">
          Bill To:
        </p>
        <div className="text-[14px] text-stone leading-5.5">
          <p className="font-bold text-lg text-ink">{client.name}</p>
          {client.companyName && <p>{client.companyName}</p>}
          {client.address && <p>{client.address}</p>}
          {client.email && <p>{client.email}</p>}
          {client.phone && <span className="mono">{client.phone}</span>}
        </div>
      </div>
    </div>
  );
};

export default PreviewClientSection;
