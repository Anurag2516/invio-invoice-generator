import type { useInvoiceStore } from "@/store/invoiceStore";
import { format, isValid, parseISO } from "date-fns";

type InvoiceNumber = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["invoiceNumber"];

type IssueDate = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["issueDate"];

type dueDate = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["dueDate"];

interface PreviewHeaderProp {
  invoiceNumber: InvoiceNumber;
  issueDate: IssueDate;
  dueDate: dueDate;
}

const PreviewHeader = ({
  invoiceNumber,
  issueDate,
  dueDate,
}: PreviewHeaderProp) => {
  return (
    <div className="flex justify-between items-start border-b-2 border-stone-400 bg-ink pb-4 sm:pb-6 mb-4 sm:mb-6 px-3 xs:px-4 sm:px-8 py-6 sm:py-14 gap-5">
      <h1 className="text-[26px] sm:text-[40px] font-normal text-paper italic leading-none">
        Invoice
      </h1>
      <div className="flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-stone">
        <p className="font-normal text-[#a89e92] bg-[#ffffff14] w-fit px-1.5 sm:px-2 py-0.5 sm:py-1 border border-[#ffffff1a] rounded ">
          #{invoiceNumber}
        </p>
        <p className="font-normal">
          ISSUE DATE
          <span className="font-normal text-[#c4baae] pl-1.5 sm:pl-3 ">
            {issueDate && isValid(parseISO(issueDate))
              ? format(parseISO(issueDate), "dd MMM yyyy").toUpperCase()
              : "No issue date"}
          </span>
        </p>
        <p className="font-normal">
          DUE DATE
          <span className="font-normal text-[#c4baae] pl-1.5 sm:pl-3 ">
            {dueDate && isValid(parseISO(dueDate))
              ? format(parseISO(dueDate), "dd MMM yyyy").toUpperCase()
              : "No due date"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PreviewHeader;
