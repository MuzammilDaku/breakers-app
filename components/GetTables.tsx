import HistoryModal from "@/app/history-modal";
import { AppContext } from "@/context/AppContext";
import { GetHistory, GetTables } from "@/services/table";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type TableProps = {
    name: string;
    minute_rate: string;
    _id: string
};


type StopwatchProps = {
    rate: string;
    id: string;
    tableName: string;
};

const Stopwatch: React.FC<StopwatchProps> = ({ rate, id, tableName }) => {
    const context = useContext(AppContext);
    const { user, resetTableId, setResetTableId, setHistory, history } = context;
    const [running, setRunning] = useState(false);
    const [payloadCheckIn, setPayloadCheckIn] = useState({
        total_frame: 0,
        total_bill: 0,
        table_id: "",
        created_by: user?._id,
    })

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setPayloadCheckIn({ ...payloadCheckIn, total_frame: counter, total_bill: counter * Number(rate), table_id: id, created_by: user?._id })
    }, [counter])

    const handleCheckOut = async () => {
        // setRunning(false)        
        router.navigate({
            pathname: '/modal',
            params: {
                table_name: tableName,
                rate,
                total_bill: counter * Number(rate),
                total_frame: counter,
                table_id: id
            }
        });
    }

    async function getHistory() {
        const res = await GetHistory();
        setHistory(res);
    }

    useEffect(() => {
        getHistory()
    }, [resetTableId])

    useEffect(() => {
        if (resetTableId == id) {
            setCounter(0);
            setRunning(false);
            setResetTableId("")
        }
    }, [resetTableId])

    const [showModal,setShowModal] = useState(false)
    const onCloseModal = () => {
        setShowModal(false)
    }
    return (
        <View style={styles.stopwatchContainer}>
            {/* <Text style={styles.timeText}>{formatTime(seconds)}</Text> */}
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <HistoryModal visible={showModal} onClose={onCloseModal} history={Array.isArray(history) ? history.filter((e: any) => e.table_id === id) : []}/>
                {Array.isArray(history) && history.some((e: any) => e.table_id === id) && (
                    <TouchableOpacity
                        onPress={() => {
                            setShowModal(true)
                        }}
                        style={styles.historyButton}
                    >
                        <Text style={styles.buttonText}><FontAwesome name="history" /> View History</Text>
                    </TouchableOpacity>
                )}

                {running && (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                            <Text style={styles.timeText1} onPress={() => {
                                if (counter > 1) {
                                    setCounter(counter - 1);
                                }
                            }}>-</Text>
                            <Ionicons name="arrow-forward-outline" size={20} color="#fefefe" style={{ marginHorizontal: 5 }} />
                            <Text style={styles.timeText2} onPress={() => {
                                setCounter(counter + 1)
                            }}>+</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.timeText}>{counter}</Text>
                            <Text style={styles.timeText}>
                                Rs {counter * Number(rate)}
                            </Text>
                        </View>
                    </>
                )}
                {!running && (
                    <TouchableOpacity
                        onPress={() => {
                            setRunning(!running);
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}><Ionicons name="play" /> Play Game</Text>
                    </TouchableOpacity>
                )}

                {running && <TouchableOpacity
                    onPress={handleCheckOut}
                    style={styles.buttonStop}
                >
                    <Text style={styles.buttonText}><Ionicons name="print" /> View & Print Bill</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );
};

const TableCard: React.FC<TableProps> = ({ name, minute_rate, _id }) => (
    <View style={styles.card}>
        <Image source={require("../assets/images/snooker.jpg")} style={styles.image} resizeMode="cover" />
        <View style={styles.cardContent}>
            <Text style={styles.tableName}>{name}</Text>
            <Text style={styles.rate}>(Rs{minute_rate}/min)</Text>
            <Stopwatch rate={minute_rate} id={_id} tableName={name} />
        </View>
    </View>
);

const TableCreate = () => {
    return (
        <TouchableOpacity
            onPress={() => {
                router.navigate("/create-table")
            }}
            style={styles.button}
        >
            <Text style={styles.buttonText}> + Create Table</Text>
        </TouchableOpacity>


    )
}
const TableCardCreate: React.FC = () => (
    <View style={styles.card}>
        <Image source={require("../assets/images/snooker.jpg")} style={styles.image} resizeMode="cover" />
        <View style={styles.cardContent}>
            <Text style={styles.tableName}>Add Table</Text>
            <TableCreate />
        </View>
    </View>
);

const GetTablesComp: React.FC = () => {
    const context = useContext(AppContext);
    const { tables, setTables } = context;
    useEffect(() => {
        async function fetchTables() {
            try {
                const response = await GetTables();
                if (response && Array.isArray(response)) {
                    setTables(response);
                }
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        }
        fetchTables();
    }, [])
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {tables?.map((table) => (
                <TableCard key={table.name} {...table} />
            ))}
            <TableCardCreate />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        width: "90%",
        margin: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        alignItems: "center",
        elevation: 3,
        // height: "100%"
    },
    imageContainer: {
        width: "100%",
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    imageText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        zIndex: 2,
    },
    tableName: {
        fontSize: 16,
        // fontWeight: "bold",
        marginTop: 4,
        textAlign: "center",
        color: "#fefefe",
    },
    cardContent: {
        padding: 16,
        width: "100%",
        alignItems: "center",
    },
    stopwatchContainer: {
        alignItems: "center",
        // marginVertical: 30,
        // marginHorizontal: 20
    },
    timeText: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
        color: "#fefefe",
        fontSize: 16,
    },
    timeText1: {
        backgroundColor: "#008000",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
        color: "#fefefe",
        fontSize: 16,
        cursor: "pointer"
    },
    timeText2: {
        backgroundColor: "#008000",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
        color: "#fefefe",
        fontSize: 16,
        cursor: "pointer",

    },
    button: {
        backgroundColor: "#2e7d32",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
        marginVertical: 30

    },
    buttonStop: {
        backgroundColor: "#c62828",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    historyButton: {
        backgroundColor: "#ffc107",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 5,
        width: 260,
        alignSelf: "stretch",
        // flexGrow: 1,
    },
    buttonText: {
        color: "#fff",
        // fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",

    },
    rate: {
        textAlign: "center",
        // fontWeight: "bold",
        color: "#fefefe",
        // marginTop: 8,
        fontSize: 14,
    },
});

export default GetTablesComp;