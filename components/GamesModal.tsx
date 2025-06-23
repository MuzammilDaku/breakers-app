import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { SetStateAction } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GamesModalProps {
    visible: boolean;
    onClose: () => void;
    selectedGames: any;
    setSelectedGames: React.Dispatch<SetStateAction<any>>;
    startStopWatch: boolean;
    setStartSportWatch: React.Dispatch<SetStateAction<boolean>>;
    centuryTimer: number;
    setCenturyTimer: React.Dispatch<SetStateAction<number>>;
    handleCheckOut:()=>void;
}

export default function GamesModal({ visible, onClose, selectedGames, setSelectedGames, startStopWatch, setStartSportWatch, centuryTimer, setCenturyTimer,handleCheckOut }: GamesModalProps) {
    // console.log(centuryTimer)
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Add Games</Text>
                    <ScrollView horizontal style={{ marginBottom: 10 }}>
                        <View style={{
                            position: "relative",
                            top: 0, left: 0, right: 0, bottom: 0,
                            //   backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100,
                        }}>
                            <ScrollView contentContainerStyle={{ flex: 1, width: width * 0.85, justifyContent: "center" }}>
                                <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: 10,
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            marginVertical: 8,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text style={{ fontSize: 17, fontWeight: "600", color: "#222" }}>
                                            One Red
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                }}
                                                onPress={() => {
                                                    if (selectedGames.one_red === 0) return;
                                                    setSelectedGames({ ...selectedGames, one_red: selectedGames.one_red - 1 })
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 19, fontWeight: "bold", minWidth: 28, textAlign: "center" }}>
                                                {/* Replace 0 with actual counter value */}
                                                {selectedGames.one_red}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#388e3c",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    // increment counter logic here
                                                    setSelectedGames({ ...selectedGames, one_red: selectedGames.one_red + 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: 10,
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            marginVertical: 8,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text style={{ fontSize: 17, fontWeight: "600", color: "#222" }}>
                                            Six Red
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                }}
                                                onPress={() => {
                                                    // decrement counter logic here
                                                    if (selectedGames.six_red === 0) return;
                                                    setSelectedGames({ ...selectedGames, six_red: selectedGames.six_red - 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 19, fontWeight: "bold", minWidth: 28, textAlign: "center" }}>
                                                {/* Replace 0 with actual counter value */}
                                                {selectedGames.six_red}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#388e3c",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    setSelectedGames({ ...selectedGames, six_red: selectedGames.six_red + 1 })
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: 10,
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            marginVertical: 8,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text style={{ fontSize: 17, fontWeight: "600", color: "#222" }}>
                                            Ten Red
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                }}
                                                onPress={() => {
                                                    // decrement counter logic here
                                                    if (selectedGames.ten_red === 0) return;
                                                    setSelectedGames({ ...selectedGames, ten_red: selectedGames.ten_red - 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 19, fontWeight: "bold", minWidth: 28, textAlign: "center" }}>
                                                {/* Replace 0 with actual counter value */}
                                                {selectedGames.ten_red}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#388e3c",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    // increment counter logic here
                                                    setSelectedGames({ ...selectedGames, ten_red: selectedGames.ten_red + 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: 10,
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            marginVertical: 8,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text style={{ fontSize: 17, fontWeight: "600", color: "#222" }}>
                                            Fiteen Red
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                }}
                                                onPress={() => {
                                                    // decrement counter logic here
                                                    if (selectedGames.fifteen_red === 0) return;
                                                    setSelectedGames({ ...selectedGames, fifteen_red: selectedGames.fifteen_red - 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 19, fontWeight: "bold", minWidth: 28, textAlign: "center" }}>
                                                {/* Replace 0 with actual counter value */}
                                                {selectedGames.fifteen_red}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#388e3c",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    // increment counter logic here
                                                    setSelectedGames({ ...selectedGames, fifteen_red: selectedGames.fifteen_red + 1 })

                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: 10,
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            marginVertical: 8,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Text style={{ fontSize: 17, fontWeight: "600", color: "#222" }}>
                                            Century
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                    alignContent: "center"
                                                }}
                                                onPress={() => {
                                                    setStartSportWatch(true)
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22, textAlign: 'center' }}>
                                                    <FontAwesome name="play" size={18} color="black" />
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 19, fontWeight: "bold", minWidth: 28, textAlign: "center" }}>
                                                {String(centuryTimer)} Seconds
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#388e3c",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    setStartSportWatch(false)
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>
                                                    <Entypo name="controller-stop" size={24} color="black" />
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: "#f44336",
                                                    borderRadius: 20,
                                                    width: 36,
                                                    height: 36,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginLeft: 10,
                                                }}
                                                onPress={() => {
                                                    setCenturyTimer(0);
                                                    setStartSportWatch(false);
                                                }}
                                            >
                                                <Text style={{ color: "#fff", fontSize: 22 }}>
                                                    <Entypo name="ccw" size={20} color="black" />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </ScrollView>
                            </ScrollView>
                        </View>
                    </ScrollView>
                    <View style={{display:"flex",flexDirection:'row'}}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>{
                            setSelectedGames({...selectedGames,century:centuryTimer})
                            handleCheckOut()
                        }}>
                            <Text style={styles.buttonText}>View & Print Bill</Text>
                        </TouchableOpacity>

                    </View>

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
        backgroundColor: "#008000",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        flex:1,
        marginHorizontal:10
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: "#f44336", // <-- This is the background color of the close button
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        flex:1,
        marginHorizontal:10
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
