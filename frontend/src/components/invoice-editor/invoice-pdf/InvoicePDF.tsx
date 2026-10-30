import "./PDFFonts";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import PDFHeader from "./PDFHeader";
import PDFClientSection from "./PDFClientSection";
import PDFLineItems from "./PDFLineItems";
import PDFTotals from "./PDFTotals";
import type { InvoiceResponse } from "@/types/invoice";

interface InvoicePDFProp {
  invoice: InvoiceResponse;
  currency: string | undefined;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingBottom: 40,
  },
});

const InvoicePDF = ({ invoice, currency }: InvoicePDFProp) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader
          invoiceNumber={invoice.invoiceNumber}
          issueDate={invoice.issueDate}
          dueDate={invoice.dueDate}
        />
        <PDFClientSection invoice={invoice} />
        <PDFLineItems lineItems={invoice.lineItems} currency={currency} />
        <PDFTotals invoice={invoice} currency={currency} />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
