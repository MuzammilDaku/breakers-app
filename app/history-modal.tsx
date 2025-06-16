import React from "react";
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const historyData = [
    { id: 1, date: "2024-06-01", player: "John Doe", score: 120, result: "Win" },
    { id: 2, date: "2024-06-02", player: "Jane Smith", score: 98, result: "Lose" },
    { id: 3, date: "2024-06-03", player: "Alex Lee", score: 110, result: "Win" },
    { id: 4, date: "2024-06-04", player: "Sam Brown", score: 105, result: "Lose" },
];

export default function HistoryModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Match History</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.cell, styles.header]}>Date</Text>
                        <Text style={[styles.cell, styles.header]}>Player</Text>
                        <Text style={[styles.cell, styles.header]}>Score</Text>
                        <Text style={[styles.cell, styles.header]}>Result</Text>
                    </View>
                    <FlatList
                        data={historyData}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                                <Text style={styles.cell}>{item.date}</Text>
                                <Text style={styles.cell}>{item.player}</Text>
                                <Text style={styles.cell}>{item.score}</Text>
                                <Text style={[
                                    styles.cell,
                                    item.result === "Win" ? styles.win : styles.lose,
                                    { fontWeight: "bold" }
                                ]}>
                                    {item.result}
                                </Text>
                            </View>
                        )}
                    />
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
        flex: 1,
        textAlign: "left",
        paddingHorizontal: 4,
        fontSize: 15,
    },
    win: {
        color: "#16a34a",
    },
    lose: {
        color: "#dc2626",
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