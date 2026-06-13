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
    <div className="flex justify-between items-start border-b-2 border-stone-400 bg-ink pb-6 mb-6 px-8 py-14">
      <h1 className="text-[40px] font-normal text-paper italic leading-none mb-3">
        Invoice
      </h1>
      <div className="flex flex-col gap-2 text-sm text-stone">
        <p className="font-normal text-[#a89e92] bg-[#ffffff14] w-fit px-2 py-1 border border-[#ffffff1a] rounded font-numbers">
          #{invoiceNumber}
        </p>
        <p className="font-normal">
          ISSUE DATE
          <span className="font-normal text-[#c4baae] pl-3 font-numbers">
            {issueDate && isValid(parseISO(issueDate))
              ? format(parseISO(issueDate), "dd MMM yyyy").toUpperCase()
              : "No issue date"}
          </span>
        </p>
        <p className="font-normal">
          DUE DATE
          <span className="font-normal text-[#c4baae] pl-3 font-numbers">
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
