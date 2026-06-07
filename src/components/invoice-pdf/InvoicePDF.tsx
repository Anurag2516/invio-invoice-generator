import "./PDFFonts";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import PDFHeader from "./PDFHeader";
import { useInvoiceStore } from "@/store/invoiceStore";
import PDFClientSection from "./PDFClientSection";
import PDFLineItems from "./PDFLineItems";
import PDFTotals from "./PDFTotals";

type ActiveInvoice = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"];

interface InvoicePDFProp {
  activeInvoice: ActiveInvoice;
  currency: string | undefined;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingBottom: 40,
  },
});

const InvoicePDF = ({ activeInvoice, currency }: InvoicePDFProp) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader
          invoiceNumber={activeInvoice.invoiceNumber}
          issueDate={activeInvoice.issueDate}
          dueDate={activeInvoice.dueDate}
        />
        <PDFClientSection
          sender={activeInvoice.sender}
          client={activeInvoice.client}
        />
        <PDFLineItems lineItems={activeInvoice.lineItems} currency={currency} />
        <PDFTotals
          invoiceTotal={activeInvoice.invoiceTotal}
          currency={currency}
          paymentInfo={activeInvoice.paymentInfo}
          notes={activeInvoice.notes}
        />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
