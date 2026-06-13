import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

type LineItems = Invoice["lineItems"];

interface PDFLineItemsProps {
  lineItems: LineItems;
  currency: string | undefined;
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 28,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    color: "#8a8070",
    borderBottomWidth: 1,
    borderBottomColor: "#8a8070",
    paddingBottom: 6,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0ebe3",
    color: "#0f0e0c",
    paddingTop: 10,
    paddingBottom: 10,
  },

  headerDescription: {
    width: "40%",
    paddingLeft: 4,
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerQty: {
    width: "15%",
    textAlign: "center",
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerRate: {
    width: "20%",
    textAlign: "right",
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerAmount: {
    width: "25%",
    textAlign: "right",
    paddingRight: 4,
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  cellDescription: {
    width: "40%",
    paddingLeft: 4,
    fontSize: 11,
    fontFamily: "IBM Plex Sans",
  },
  cellQty: {
    width: "15%",
    textAlign: "center",
    fontSize: 11,
    fontFamily: "IBM Plex Mono",
  },
  cellRate: {
    width: "20%",
    textAlign: "right",
    fontSize: 11,
    fontFamily: "IBM Plex Mono",
  },
  cellAmount: {
    width: "25%",
    textAlign: "right",
    paddingRight: 4,
    fontSize: 11,
    fontFamily: "IBM Plex Mono",
  },
});

const PDFLineItems = ({ lineItems, currency }: PDFLineItemsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerDescription}>Description</Text>
        <Text style={styles.headerQty}>Qty</Text>
        <Text style={styles.headerRate}>Rate</Text>
        <Text style={styles.headerAmount}>Amount</Text>
      </View>
      {lineItems.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={styles.cellDescription}>
            {item.description || "Item Description"}
          </Text>
          <Text style={styles.cellQty}>{item.quantity}</Text>
          <Text style={styles.cellRate}>
            {currency}
            {item.rate}
          </Text>
          <Text style={styles.cellAmount}>
            {currency}
            {item.amount}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PDFLineItems;
