import { History } from "@/context/appStore";
import React from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HistoryModal({
  visible,
  onClose,
  history,
}: {
  visible: boolean;
  onClose: () => void;
  history: History[] | null;
}) {
  const headers = [
    "Date",
    "Customer Name",
    "Phone",
    "Game Type",
    "Frames Played",
    "Total Frames",
    "Total Bill",
    "Received",
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Bill History</Text>

          <ScrollView horizontal style={styles.scrollX}>
            <View>
              {/* Header */}
              <View style={styles.row}>
                {headers.map((header) => (
                  <View key={header} style={styles.cell}>
                    <Text style={styles.headerText}>{header}</Text>
                  </View>
                ))}
              </View>

              {/* Rows */}
              <ScrollView style={styles.scrollY}>
                {history?.map((item, index) => (
                  <View
                    key={item._id}
                    style={[
                      styles.row,
                      index % 2 === 0 ? styles.even : styles.odd,
                    ]}
                  >
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>
                        {typeof item.date === "string"
                          ? item.date.slice(0, 10)
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>{item.customer_name}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>
                        {item.customer_phone}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>{item.types}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>{item.frames}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>{item.total_frame}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>{item.total_bill}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellText}>
                        {item.received_amount}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: width * 0.95,
    maxHeight: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollX: {
    marginBottom: 12,
  },
  scrollY: {
    maxHeight: 350,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  even: {
    backgroundColor: "#f9f9f9",
  },
  odd: {
    backgroundColor: "#ffffff",
  },
  cell: {
    width: 130,
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#111827",
  },
  cellText: {
    fontSize: 15,
    color: "#333",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
