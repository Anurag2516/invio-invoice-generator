import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceResponse } from "@/types/invoice";

interface PDFClientSectionProps {
 invoice: InvoiceResponse
}

interface NormalizedParty {
  name?: string;
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 28,
    paddingLeft: 50,
    paddingRight: 50,
  },
  col: {
    display: "flex",
    flexDirection: "column",
    color: "#71685a",
    width: "45%",
  },
  colRight: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: "IBM Plex Sans",
    color: "#0f0e0c",
    marginBottom: 1,
  },
  detail: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    marginBottom: 1,
    lineHeight: 1.5,
  },
  phone: {
    fontSize: 10,
    fontFamily: "IBM Plex Sans",
    marginBottom: 1,
  },
});

const UserBlock = ({
  party,
  label,
  isRight = false,
}: {
  party: NormalizedParty;
  label: string;
  isRight?: boolean;
}) => (
  <View style={[styles.col, isRight ? styles.colRight : {}]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.name}>{party.name}</Text>
    {party.companyName && <Text style={styles.detail}>{party.companyName}</Text>}
    {party.address && <Text style={styles.detail}>{party.address}</Text>}
    {party.email && <Text style={styles.detail}>{party.email}</Text>}
    {party.phone && <Text style={styles.phone}>{party.phone}</Text>}
  </View>
)

const PDFClientSection = ({ invoice }: PDFClientSectionProps) => {
  const normalizedSender: NormalizedParty = {
    name: invoice.senderName,
    companyName: invoice.senderCompany,
    address: invoice.senderAddress,
    email: invoice.senderEmail,
    phone: invoice.senderPhone,
  }

  const normalizedClient: NormalizedParty = {
    name: invoice.snapshotClientName,
    companyName: invoice.snapshotClientCompany,
    address: invoice.snapshotClientAddress,
    email: invoice.snapshotClientEmail,
    phone: invoice.snapshotClientPhone,
  }

  return (
    <View style={styles.container}>
      <UserBlock party={normalizedSender} label="Bill From:" />
      <UserBlock party={normalizedClient} label="Bill To:" isRight />
    </View>
  )
}

export default PDFClientSection