import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceResponse } from "@/types/invoice";

interface PDFTotalsProps {
  invoice: InvoiceResponse;
  currency: string | undefined;
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
    color: "#71685a",
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
    color: "#71685a",
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
    color: "#71685a",
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
    color: "#71685a",
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
  invoice,
  currency,
}: PDFTotalsProps) => {
  const hasPaymentInfo =
    invoice.bankName ||
    invoice.accountHolderName ||
    invoice.accountNumber;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.paymentCol}>
          {hasPaymentInfo ? (
            <>
              <Text style={styles.paymentTitle}>Payment Information</Text>
              {invoice.bankName ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Bank Name: </Text>
                  <Text style={styles.paymentValue}>{invoice.bankName}</Text>
                </View>
              ) : null}
              {invoice.accountHolderName ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Accountholder Name: </Text>
                  <Text style={styles.paymentValue}>
                    {invoice.accountHolderName}
                  </Text>
                </View>
              ) : null}
              {invoice.accountNumber ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Account Number: </Text>
                  <Text style={styles.paymentValueMono}>
                    {invoice.accountNumber}
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
            >{`${currency}${invoice.subtotal}`}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Tax{invoice.taxRate > 0 ? ` (${invoice.taxRate}%)` : ""}
            </Text>
            <Text
              style={styles.totalValue}
            >{`${currency}${invoice.taxAmount}`}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Discount
              {invoice.discountRate > 0 ? ` (${invoice.discountRate}%)` : ""}
            </Text>
            <Text
              style={styles.totalValue}
            >{`${currency}${invoice.discountAmount}`}</Text>
          </View>

          <View style={styles.totalDueBox}>
            <Text style={styles.totalDueLabel}>Total Due</Text>
            <Text
              style={styles.totalDueValue}
            >{`${currency}${invoice.total}`}</Text>
          </View>
        </View>
      </View>

      {invoice.notes ? (
        <View style={styles.notesCol}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{invoice.notes}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default PDFTotals;