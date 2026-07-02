import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { format, isValid, parseISO } from "date-fns";

interface PDFHeaderProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#1c1917",
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 36,
    paddingBottom: 36,
    marginBottom: 24,
  },
  invoiceTitle: {
    fontSize: 36,
    fontFamily: "IBM Plex Sans Italic",
    color: "#fffefb",
    fontWeight: 400,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  invoiceNumberBadge: {
    color: "#a89e92",
    backgroundColor: "#ffffff14",
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2.5,
    paddingBottom: 2.5,
    fontSize: 9,
    fontFamily: "IBM Plex Sans",
  },
  dateRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  dateLabel: {
    fontSize: 8,
    fontFamily: "IBM Plex Sans",
    color: "#9b9486",
    letterSpacing: 0.8,
    width: 60,
  },
  dateValue: {
    fontSize: 8,
    fontFamily: "IBM Plex Sans",
    color: "#c4baae",
    letterSpacing: 0.1,
  },
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? format(parsed, "dd MMM yyyy").toUpperCase() : "—";
};

const PDFHeader = ({ invoiceNumber, issueDate, dueDate }: PDFHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.invoiceTitle}>Invoice</Text>

      <View style={styles.rightCol}>
        <Text style={styles.invoiceNumberBadge}>{invoiceNumber}</Text>

        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>ISSUE DATE</Text>
          <Text style={styles.dateValue}>{formatDate(issueDate)}</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>DUE DATE</Text>
          <Text style={styles.dateValue}>{formatDate(dueDate)}</Text>
        </View>
      </View>
    </View>
  );
};

export default PDFHeader;
