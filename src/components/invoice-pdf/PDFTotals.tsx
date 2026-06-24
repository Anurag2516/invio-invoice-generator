import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

type InvoiceTotal = Invoice["invoiceTotal"];
type PaymentInfo = Invoice["paymentInfo"];
type Notes = Invoice["notes"];

interface PDFTotalsProps {
  invoiceTotal: InvoiceTotal;
  currency: string | undefined;
  notes: Notes;
  paymentInfo: PaymentInfo;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },

  topRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
  },

  paymentCol: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#8a8070",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  paymentRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paymentLabel: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#8a8070",
  },
  paymentValue: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#0f0e0c",
  },
  paymentValueMono: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#0f0e0c",
  },

  totalsCol: {
    display: "flex",
    flexDirection: "column",
    minWidth: 200,
    gap: 6,
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#8a8070",
  },
  totalValue: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    color: "#0f0e0c",
  },

  totalDueBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f0e0c",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 2,
  },
  totalDueLabel: {
    fontSize: 14,
    fontFamily: "IBM Plex Sans",
    color: "#fffefb",
    letterSpacing: 1,
  },
  totalDueValue: {
    fontSize: 16,
    fontFamily: "IBM Plex Sans",
    color: "#fffefb",
  },

  notesCol: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  notesLabel: {
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    color: "#8a8070",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    color: "#0f0e0c",
    lineHeight: 1.6,
  },
});

const PDFTotals = ({
  invoiceTotal,
  currency,
  notes,
  paymentInfo,
}: PDFTotalsProps) => {
  const hasPaymentInfo =
    paymentInfo.bankName ||
    paymentInfo.accountholderName ||
    paymentInfo.accountNumber;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.paymentCol}>
          {hasPaymentInfo ? (
            <>
              <Text style={styles.paymentTitle}>Payment Information</Text>
              {paymentInfo.bankName ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Bank Name: </Text>
                  <Text style={styles.paymentValue}>
                    {paymentInfo.bankName}
                  </Text>
                </View>
              ) : null}
              {paymentInfo.accountholderName ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Accountholder Name: </Text>
                  <Text style={styles.paymentValue}>
                    {paymentInfo.accountholderName}
                  </Text>
                </View>
              ) : null}
              {paymentInfo.accountNumber ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Account Number: </Text>
                  <Text style={styles.paymentValueMono}>
                    {paymentInfo.accountNumber}
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}
        </View>

        <View style={styles.totalsCol}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text
              style={styles.totalValue}
            >{`${currency}${invoiceTotal.subtotal}`}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Tax{invoiceTotal.taxRate > 0 ? ` (${invoiceTotal.taxRate}%)` : ""}
            </Text>
            <Text
              style={styles.totalValue}
            >{`${currency}${invoiceTotal.taxAmount}`}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Discount
              {invoiceTotal.discountRate > 0
                ? ` (${invoiceTotal.discountRate}%)`
                : ""}
            </Text>
            <Text
              style={styles.totalValue}
            >{`${currency}${invoiceTotal.discountAmount}`}</Text>
          </View>

          <View style={styles.totalDueBox}>
            <Text style={styles.totalDueLabel}>Total Due</Text>
            <Text
              style={styles.totalDueValue}
            >{`${currency}${invoiceTotal.total}`}</Text>
          </View>
        </View>
      </View>

      {notes ? (
        <View style={styles.notesCol}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default PDFTotals;