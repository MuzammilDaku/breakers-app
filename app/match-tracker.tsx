import { useAppStore, UserBillTable } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { AddGameHistory, DeleteInUseTable } from "@/services/table";
import { getCurrentPakistaniTime } from "@/services/utilities/getPakistaniTime";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Provider, Text, TextInput } from "react-native-paper";


export default function MatchTracker() {
    const inUseTables = useAppStore((state) => state.inUseTables);
    const tables = useAppStore((state) => state.tables);
    const user = useAppStore((state) => state.user);

    const setBillTables = useAppStore((state) => state.setBillTables);
    const setCustomerOffline = useAppStore((state) => state.setCustomerOffline);
    const setCustomerOnline = useAppStore((state) => state.setCustomerOnline);

    const deleteInUseTable = useAppStore((state) => state.deleteInUseTable);

    const [isDisabled, setIsDisabled] = useState(true);
    const params = useLocalSearchParams();
    const { table_id } = params;

    const inUseTable = inUseTables?.filter((item) => item.table._id === table_id)[0];
    const table = tables?.filter((item) => item._id === table_id)[0];

    const players: string[] = [];
    if (inUseTable?.player_name1) players.push(inUseTable?.player_name1);
    if (
        (inUseTable?.game_mode === "2 v 2" && inUseTable?.friendly_match) ||
        (inUseTable?.game_mode === "1 v 1" && !inUseTable?.friendly_match) ||
        (inUseTable?.game_mode === "2 v 2" && !inUseTable?.friendly_match)
    ) {
        if (inUseTable?.player_name2) players.push(inUseTable?.player_name2);
    }
    if (inUseTable?.game_mode === "2 v 2" && !inUseTable?.friendly_match) {
        if (inUseTable?.player_name3) players.push(inUseTable?.player_name3);
        if (inUseTable?.player_name4) players.push(inUseTable?.player_name4);
    }

    const [winner, setWinner] = useState("");
    const [loser, setLoser] = useState("");
    const [winnerSearch, setWinnerSearch] = useState("");
    const [loserSearch, setLoserSearch] = useState("");
    const [showWinnerDropdown, setShowWinnerDropdown] = useState(false);
    const [showLoserDropdown, setShowLoserDropdown] = useState(false);

    const winnerOptions = players?.filter(
        (p) => p?.toLowerCase()?.includes(winnerSearch.toLowerCase()) && p !== loser
    );
    const loserOptions = players?.filter(
        (p) => p?.toLowerCase()?.includes(loserSearch.toLowerCase()) && p !== winner
    );

    const renderDropdown = (options: string[], onSelect: (p: string) => void) => {
        if (options?.length === 0) return null;

        return (
            <View style={styles.dropdown}>
                {options?.map((p) => (
                    <TouchableOpacity key={p} onPress={() => onSelect(p)}>
                        <Text style={styles.dropdownItem}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(true);

    const totalBill = () => {
        if (inUseTable?.game_type === "Century" && table?.century_rate) {
            return Math.round(Number(table?.century_rate) * elapsedTime / 60);
        }
        if (inUseTable?.game_type === "One Red" && table?.one_red_rate) {
            return Math?.round(Number(table?.one_red_rate));
        }
        if (inUseTable?.game_type === "Six Red" && table?.six_red_rate) {
            return Math.round(Number(table?.six_red_rate));
        }
        if (inUseTable?.game_type === "Ten Red" && table?.ten_red_rate) {
            return Math.round(Number(table?.ten_red_rate));
        }
        if (inUseTable?.game_type === "Fifteen Red" && table?.fifteen_red_rate) {
            return Math.round(Number(table?.fifteen_red_rate));
        }
    };

    const addToQueue = useOfflineStore((state) => state.addToQueue)

    const [isLoading, setIsLoading] = useState(false);
    const handleEndGame = async () => {
        setIsLoading(true)
        setTimerRunning(false);
        const payload: UserBillTable = {
            _id: getRandomId(),
            inUseTable: inUseTable,
            winner: winner,
            loser: loser,
            total_bill: totalBill(),
            game_type: inUseTable.game_type,
            created_by: user?._id,
            date: getCurrentPakistaniTime()
        }
        if (inUseTable.game_type == "Century") {
            payload.total_time = elapsedTime;
        }
        else payload.total_frame = 1;

        const isConnected = await isInternetConnected();

        if (isConnected) {
            setCustomerOnline({ name: loser, date: getCurrentPakistaniTime(), _id: getRandomId() });
            await DeleteInUseTable(inUseTable?._id)
            await AddGameHistory(payload)
        }
        else {
            setCustomerOffline({ name: loser, date: getCurrentPakistaniTime(), _id: getRandomId() });
            addToQueue({
                method: "DELETE",
                url: baseUrl + `/table/in-use?id=${inUseTable?._id}`,
                id: getRandomId()
            })
            addToQueue({
                method: "POST",
                url: baseUrl + '/table/game-history',
                body: payload,
                id: getRandomId()
            })
        }
        setBillTables(payload);
        router.navigate({
            pathname: "/billing", params: {
                customer_name: loser
            }
        })
        deleteInUseTable(inUseTable);
        setTimerRunning(true);
        setIsLoading(false)
    };


    dayjs.extend(utc);
    dayjs.extend(timezone);

    useEffect(() => {
        if (
            inUseTable?.game_type === "Century" &&
            inUseTable?.date &&
            timerRunning
        ) {
            const updateTimer = () => {
                const start = dayjs.tz(inUseTable.date, 'YYYY-MM-DD HH:mm:ss', 'Asia/Karachi');
                const now = dayjs.tz(getCurrentPakistaniTime(), 'YYYY-MM-DD HH:mm:ss', 'Asia/Karachi');

                const secondsElapsed = now.diff(start, 'second'); // ✅ Accurate
                setElapsedTime(secondsElapsed);
            };

            updateTimer(); // First run
            const interval = setInterval(updateTimer, 1000);

            return () => clearInterval(interval);
        }
    }, [inUseTable, timerRunning]);

    const hours = Math.floor(elapsedTime / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((elapsedTime % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (elapsedTime % 60).toString().padStart(2, "0");


    useEffect(() => {
        if (!winner || !loser) {
            setIsDisabled(true);
        }
        else setIsDisabled(false)
    }, [winner, loser])

    return (
        <Provider>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={{ marginHorizontal: 25 }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            {/* Winner Field */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Winner *</Text>
                                <TextInput
                                    mode="outlined"
                                    placeholder="Enter Player Name"
                                    value={winner}

                                    onFocus={() => {
                                        setShowWinnerDropdown(true);
                                    }}
                                    onBlur={() => setShowWinnerDropdown(false)}
                                    onChangeText={(text) => {
                                        setWinner(text);
                                        setWinnerSearch(text);
                                        setShowWinnerDropdown(true);
                                    }}
                                    style={styles.input}
                                />
                                {showWinnerDropdown &&
                                    // winnerSearch.length > 0 &&
                                    renderDropdown(winnerOptions, (p) => {
                                        setWinner(p);
                                        setWinnerSearch(p);
                                        setShowWinnerDropdown(false);
                                        Keyboard.dismiss();
                                    })}
                            </View>

                            {/* Loser Field */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Loser *</Text>
                                <TextInput
                                    mode="outlined"
                                    placeholder="Enter Player Name"
                                    value={loser}
                                    onFocus={() => setShowLoserDropdown(true)}
                                    onChangeText={(text) => {
                                        setLoser(text);
                                        setLoserSearch(text);
                                        setShowLoserDropdown(true);
                                    }}
                                    onBlur={() => setShowLoserDropdown(false)}
                                    style={styles.input}
                                />
                                {showLoserDropdown &&
                                    renderDropdown(loserOptions, (p) => {
                                        setLoser(p);
                                        setLoserSearch(p);
                                        setShowLoserDropdown(false);
                                        Keyboard.dismiss();
                                    })}
                            </View>
                        </View>
                        {inUseTable?.game_type === "Century" &&
                            <View style={styles.centuryMatch}>
                                <Text style={styles.inputLabel}>Match Duration</Text>
                                <View style={styles.timerContainer}>
                                    <MaterialIcons name="multitrack-audio" size={40} color="black" />
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{hours}:{minutes}:{seconds}</Text>
                                </View>

                            </View>}
                        <View style={styles.btnSecondary}>
                            <TouchableOpacity disabled={isDisabled}>
                                <Text style={styles.btnSecondaryText}>
                                    Add One More Game
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[isDisabled ? styles.btnDisabled : styles.btnPrimary]}>
                            <TouchableOpacity onPress={handleEndGame} disabled={isDisabled}>
                                <Text style={styles.btnPrimaryText}>
                                    {!isLoading ? "End Game & Print Bill" : <ActivityIndicator color={'#fefe'} />}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f4f5f9",
        height: "100%",
    },
    inputContainer: {
        marginTop: 13,
        flex: 1,
        marginRight: 5,
        position: "relative",
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
    input: {
        height: 40,
        backgroundColor: "#fefefe",
        borderRadius: 7,
        paddingHorizontal: 10,
        fontSize: 14,
        borderColor: "#eeeff3",
        borderWidth: 1,
        color: "black",
    },
    dropdown: {
        position: "absolute",
        top: 75,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemDisabled: {
        padding: 10,
        fontSize: 14,
        color: "#aaa",
    },
    btn: {
        marginVertical: 15,
        height: 50,
        backgroundColor: "#475ba3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#475ba3",
    },
    centuryMatch: {
        marginVertical: 10
    },
    timerContainer: {
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "#fefefe",
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eeeff3",
    },
    btnPrimary: {
        marginVertical: 15,
        height: 50,
        backgroundColor: "#475ba3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    btnPrimaryText: {
        color: "#fefefe",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },

    btnSecondary: {
        marginTop: 5,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#aaa",
        backgroundColor: "#fefefe",
    },
    btnSecondaryText: {
        color: "#475ba3",
        fontSize: 14,
        fontWeight: "500",
    },
    btnDisabled: {
        marginVertical: 15,
        height: 50,
        // textAlign:"center",
        backgroundColor: "#AAB3D1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#AAB3D1'
    }

});
