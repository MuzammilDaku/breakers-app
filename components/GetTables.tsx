import HistoryModal from "@/app/history-modal";
import { Table, useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { DeleteTable, GetHistory, GetTables } from "@/services/table";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GamesModal from "./GamesModal";

type StopwatchProps = {
    table: Table
};

const Stopwatch: React.FC<StopwatchProps> = ({ table }) => {
    const { user, resetTableId, setResetTableId, setHistory, history } = useAppStore();
    const [running, setRunning] = useState(false);
    const [payloadCheckIn, setPayloadCheckIn] = useState({
        total_frame: 0,
        total_bill: 0,
        table_id: "",
        created_by: user?._id,
    })

    const [counter, setCounter] = useState(0);
    const { queue, hasLoaded } = useOfflineStore()

    useEffect(() => {
        setPayloadCheckIn({ ...payloadCheckIn, total_frame: counter, total_bill: counter * Number(table.century_rate), table_id: table._id as string, created_by: user?._id })
    }, [counter])

    const handleCheckOut = async () => {
        // setRunning(false)   
        setShowGameModal(false);
        router.navigate({
            pathname: '/modal',
            params: {
                table: JSON.stringify(table),
                selectedGames: JSON.stringify(selectedGames),
                centuryTimer: String(centuryTimer)
            }
        });
    }

    async function getHistory() {
        if (!user?._id) return;
        const res = await GetHistory(user._id);
        setHistory(res);
    }

    useEffect(() => {
        if (hasLoaded && queue.length === 0 && user?._id) {
            getHistory();
        }
    }, [hasLoaded, user])

    useEffect(() => {
        if (resetTableId == table._id) {
            setCounter(0);
            setRunning(false);
            setResetTableId("")
        }
    }, [resetTableId])

    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState("")



    const onCloseModal = () => {
        setShowModal(false)
    }

    const [showGameModal, setShowGameModal] = useState(false);

    const selectedGameText = () => {
        switch (selectedGame) {
            case "One Red":
                return `One Red (Rs${table.one_red_rate}/frame)`;
            case "Six Red":
                return `Six Red (Rs${table.six_red_rate}/frame)`;
            case "Ten Red":
                return `Ten Red (Rs${table.ten_red_rate}/frame)`;
            case "Fifteen Red":
                return `Fifteen Red (Rs${table.fifteen_red_rate}/frame)`;
            case "Century":
                return `Century (Rs${table.century_rate}/min)`;
            default:
                return "";
        }
    }

    const onCloseGameModal = () => {
        setShowGameModal(false);
    }

    const [centuryTimer, setCenturyTimer] = useState(0);
    const [selectedGames, setSelectedGames] = useState({
        ten_red: 0,
        one_red: 0,
        six_red: 0,
        fifteen_red: 0,
        century: 0
    })


    const [startStopWatch, setStartSportWatch] = useState(false);

    // Timer logic for Century mode
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (startStopWatch) {
            timer = setInterval(() => {
                setCenturyTimer((prev) => {
                    const newValue = prev + 1;
                    setSelectedGames((games) => ({
                        ...games,
                        century: newValue
                    }));
                    return newValue;
                });
            }, 1000); // 1 second interval
        }
        // If startStopWatch is false, timer is not running (paused)
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [startStopWatch]);



    return (
        <View style={styles.stopwatchContainer}>
            {selectedGame && <Text style={styles.rate}>{selectedGameText()}</Text>}
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <HistoryModal visible={showModal} onClose={onCloseModal} history={Array.isArray(history) ? history.filter((e: any) => e.table_id === table._id) : []} />
                <GamesModal visible={showGameModal} onClose={onCloseGameModal} selectedGames={selectedGames} setSelectedGames={setSelectedGames} startStopWatch={startStopWatch} setStartSportWatch={setStartSportWatch} centuryTimer={centuryTimer} setCenturyTimer={setCenturyTimer} handleCheckOut={handleCheckOut} />
                {Array.isArray(history) && history.some((e: any) => e.table_id === table._id) && (
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
                                Rs {counter * Number(selectedGame == 'One Red' ? table.one_red_rate : selectedGame == 'Six Red' ? table.six_red_rate :
                                    selectedGame == 'Ten Red' ? table.ten_red_rate : selectedGame == "Fifteen Red" ? table.fifteen_red_rate : table.century_rate
                                )}
                            </Text>
                        </View>
                    </>
                )}
                {!running && !showGameModal && (
                    <TouchableOpacity
                        onPress={() => {
                            // setRunning(!running);
                            setShowGameModal(true)
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}><Ionicons name="play" /> Play Game</Text>
                        {/* Game selection modal */}

                    </TouchableOpacity>

                )}

                {/* {running === false && showGameModal && (
                    <View style={{
                        position: "relative",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 100,
                    }}>
                        <View style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 24,
                            minWidth: 250,
                            alignItems: "center"
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#222" }}>Select Game</Text>
                            {["One Red", "Six Red", "Ten Red", "Fifteen Red", "Century"].map((game, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                        marginVertical: 4,
                                        backgroundColor: "#2e7d32",
                                        borderRadius: 6,
                                        width: 180,
                                    }}
                                    onPress={() => {
                                        setSelectedGame(game);
                                        setShowGameModal(false);
                                        setRunning(true);
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>{idx + 1}- {game}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={{
                                    marginTop: 12,
                                    paddingVertical: 8,
                                    paddingHorizontal: 24,
                                    backgroundColor: "#c62828",
                                    borderRadius: 6,
                                }}
                                onPress={() => setShowGameModal(false)}
                            >
                                <Text style={{ color: "#fff", fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )} */}

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

const TableCard: React.FC<Table> = (table) => {
    const [showOptions, setShowOptions] = useState(false);
    const { deleteTable } = useAppStore()
    const { addToQueue } = useOfflineStore()
    const handleDelete = async () => {
        if (!table._id) return;
        try {
            const isConnected = await isInternetConnected();

            if (isConnected) {
                await DeleteTable({ _id: table._id })
            }
            else {
                await addToQueue({
                    method: "DELETE",
                    url: baseUrl + '/table',
                    body: { _id: table._id },
                    id: getRandomId()
                })
            }
            deleteTable(table)
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.card}>
            <Image source={require("../assets/images/snooker.jpg")} style={styles.image} resizeMode="cover" />
            <View style={styles.cardContent}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, alignItems: "center", position: "relative", left: 15 }}>
                            <Text style={styles.tableName}>{table.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ padding: 4 }}
                        onPress={() => {
                            setShowOptions(true)
                        }}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                {showOptions && (
                    <>
                        <View style={{
                            position: "absolute",
                            top: 40,
                            right: 16,
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            elevation: 5,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            zIndex: 10,
                            minWidth: 120,
                        }}>
                            <TouchableOpacity
                                style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" }}
                                onPress={() => {
                                    setShowOptions(false);
                                    router.navigate({ pathname: "/create-table", params: { table: JSON.stringify(table) } });
                                }}
                            >
                                <Text style={{ color: "#2e7d32", fontSize: 16 }}><Ionicons name="create-outline" /> Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 12 }}
                                onPress={() => {
                                    setShowOptions(false);
                                    // Use Alert for confirmation in React Native
                                    Alert.alert(
                                        "Delete Table",
                                        "Are you sure you want to delete this table?",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Delete", style: "destructive", onPress: handleDelete },
                                        ]
                                    );
                                }}
                            >
                                <Text style={{ color: "#c62828", fontSize: 16 }}><Ionicons name="trash-outline" /> Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}
                            activeOpacity={1}
                            onPress={() => setShowOptions(false)}
                        />
                    </>
                )}
                <Stopwatch table={table} />
            </View>
        </View>
    );
}

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
    const { tables, setTables, user } = useAppStore();
    const { queue, hasLoaded } = useOfflineStore()
    useEffect(() => {

        async function fetchTables() {
            try {
                if (!user) return;
                const response = await GetTables(user._id);
                if (response && Array.isArray(response)) {
                    setTables(response);
                }
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        }
        if (hasLoaded && queue.length === 0) {
            fetchTables();
        }
    }, [hasLoaded, user])
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