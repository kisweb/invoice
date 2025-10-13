import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { styles } from "./style";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { tableData, totalData } from "./data";
import { Invoice } from "@/type";

interface FacturePDFProps {
  invoice: Invoice;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("fr-FR", options);
}


const Invoice2 = ( invoice : Invoice) => {
  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, styles.textBold]}>INVOICE</Text>
            <Text>Invoice {invoice?.name}</Text>
          </View>
          <View style={styles.spaceY}>
            <Text style={styles.textBold}>Company Name</Text>
            <Text> {invoice?.issuerName} </Text>
            <Text> {invoice?.issuerAddress} </Text>
          </View>
        </View>

        <View style={styles.spaceY}>
          <Text style={[styles.billTo, styles.textBold]}>Bill To:</Text>
          <Text> {invoice?.clientName} </Text>
          <Text> {invoice?.clientAddress} </Text>
          <Text>City, State ZIP</Text>
        </View>

        {/* Render the table */}
        <Table style={styles.table}>
          <TH style={[styles.tableHeader, styles.textBold]}>
            <TD style={styles.td}>Description</TD>
            <TD style={styles.td}>Quantity</TD>
            <TD style={styles.td}>Unit Price</TD>
            <TD style={styles.td}>Total</TD>
          </TH>
          {invoice?.lines.map((item, index) => (
            <TR key={index}>
              <TD style={styles.td}>{item.description}</TD>
              <TD style={styles.td}>{item.quantity}</TD>
              <TD style={styles.td}>${item.unitPrice.toFixed(2)}</TD>
              <TD style={styles.td}> $ { item.quantity * item.unitPrice  } </TD>
            </TR>
          ))}
        </Table>

        {/* <View style={styles.totals}>
          <View
          key={0}
            style={{
              minWidth: "256px"
            }}
          >
            {totalData.map((item) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Text style={item.label === "Total" ? styles.textBold : {}}>
                  {item.label}
                </Text>
                <Text style={item.label === "Total" ? styles.textBold : {}}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View> */}
      </Page>
    </Document>
  );
  return (
    <div className="max-w-2xl mx-auto my-10">
      <div className="w-full h-[500px]">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF />
        </PDFViewer>
      </div>
      <div className="mt-6 flex justify-center">
        <PDFDownloadLink document={<InvoicePDF />} fileName="invoice.pdf">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Download PDF
          </button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default Invoice2;
