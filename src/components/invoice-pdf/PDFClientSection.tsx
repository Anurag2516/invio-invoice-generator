import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

type Sender = Invoice["sender"];
type Client = Invoice["client"];

interface PDFClientSectionProps {
  sender: Sender;
  client: Client;
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
    color: "#8a8070",
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
  user,
  label,
}: {
  user: Sender | Client;
  label: string;
}) => (
  <View style={styles.col}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.name}>{user.name}</Text>
    {user.companyName ? (
      <Text style={styles.detail}>{user.companyName}</Text>
    ) : null}
    {user.address ? <Text style={styles.detail}>{user.address}</Text> : null}
    {user.email ? <Text style={styles.detail}>{user.email}</Text> : null}
    {user.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
  </View>
);

const PDFClientSection = ({ sender, client }: PDFClientSectionProps) => {
  return (
    <View style={styles.container}>
      <UserBlock user={sender} label="Bill From:" />
      <UserBlock user={client} label="Bill To:" />
    </View>
  );
};

export default PDFClientSection;
