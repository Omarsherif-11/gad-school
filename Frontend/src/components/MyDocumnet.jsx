// MyDocument.jsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 12,
    textAlign: "left",
  },
});

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>My PDF Document</Text>
        <Text style={styles.text}>
          This is an example PDF document created with @react-pdf/renderer.
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
