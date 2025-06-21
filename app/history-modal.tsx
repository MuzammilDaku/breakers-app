import { History } from "@/context/appStore";
import React from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HistoryModal({ visible, onClose, history }: { visible: boolean; onClose: () => void, history: History[] | null }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Bill History</Text>
                    <ScrollView horizontal style={{ marginBottom: 10 }}>
                        <View>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.cell, styles.header]}>Date</Text>
                                <Text style={[styles.cell, styles.header]}>Customer Name</Text>
                                <Text style={[styles.cell, styles.header]}>Customer Phone</Text>
                                <Text style={[styles.cell, styles.header]}>Game Type</Text>
                                <Text style={[styles.cell, styles.header]}>Total Frame</Text>
                                <Text style={[styles.cell, styles.header]}>Total Bill</Text>
                                <Text style={[styles.cell, styles.header]}>Received Amount</Text>
                            </View>
                            <ScrollView style={{ maxHeight: 350 }}>
                                {history?.map((item, index) => (
                                    <View key={item._id} style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.date && item.date.slice(0,10)}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.customer_name}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.customer_phone}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.type}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.total_frame}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.total_bill}</Text>
                                        <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{item?.received_amount}</Text>
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
        padding: 20,
        width: width * 0.9,
        maxHeight: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#f3f4f6",
        paddingVertical: 8,
    },
    header: {
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
    },
    rowEven: {
        backgroundColor: "#fff",
    },
    rowOdd: {
        backgroundColor: "#f9fafb",
    },
    cell: {
        minWidth: 120,
        textAlign: "left",
        paddingHorizontal: 4,
        fontSize: 15,
    },
    button: {
        marginTop: 20,
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
