import type { InvoiceResponse } from "@/types/invoice";

interface PreviewClientSectionProps {
  invoice: InvoiceResponse
}

interface NormalizedParty {
  name: string;
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
}

const UserBlock = ({
  party,
  label,
}: {
  party: NormalizedParty;
  label: string;
}) => (
  <div>
    <h3 className="text-[10px] sm:text-sm uppercase tracking-wider text-[#71685a] mb-1">
      {label}
    </h3>
    <div className="text-[11px] sm:text-[14px] text-[#71685a] leading-4 sm:leading-5.5">
      <p className="font-bold text-sm sm:text-lg text-[#0f0e0c]">
        {party.name}
      </p>
      {party.email && <p>{party.email}</p>}
      {party.companyName && <p>{party.companyName}</p>}
      {party.address && <p>{party.address}</p>}
      {party.phone && <span>{party.phone}</span>}
      {party.website && <p>{party.website}</p>}
    </div>
  </div>
);

const PreviewClientSection = ({invoice}: PreviewClientSectionProps) => {
  
  const normalizedSender: NormalizedParty = {
    name: invoice.senderName,
    companyName: invoice.senderCompany,
    address: invoice.senderAddress,
    email: invoice.senderEmail,
    phone: invoice.senderPhone,
    website: invoice.senderWebsite,
  };

  const normalizedClient: NormalizedParty = {
    name: invoice.snapshotClientName,
    companyName: invoice.snapshotClientCompany,
    address: invoice.snapshotClientAddress,
    email: invoice.snapshotClientEmail,
    phone: invoice.snapshotClientPhone,
    website: invoice.snapshotClientWebsite,
  };
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-7 px-3 xs:px-4 sm:px-8">
      <UserBlock party={normalizedSender} label="Bill From:" />
      <UserBlock party={normalizedClient} label="Bill To:" />
    </div>
  );
};

export default PreviewClientSection;
