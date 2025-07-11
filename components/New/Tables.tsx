import { Table, useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { GetTables } from "@/services/table";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Tables(props: { selectedFilter: string }) {
    // const { tables, setTables, user, inUseTables } = useAppStore();
    const tables = useAppStore((state) => state.tables);
    const filteredTables = () => {
        if(props.selectedFilter === "all") {
            return tables;
        }
        else  {
            return tables.filter((table)=>{
                const status = gameModeCheck(table);
                if(status == "Free" && props.selectedFilter === "free") {
                    return table
                }
                if((status === "In Use" || status === "Friendly Match") && props.selectedFilter == "occupied") {
                    return table
                }
            })
        }
    }
    const setTables = useAppStore((state) => state.setTables);
    const user = useAppStore((state) => state.user);
    const inUseTables = useAppStore((state) => state.inUseTables);


    const queue = useOfflineStore((state) => state.queue)
    const hasLoaded = useOfflineStore((state) => state.hasLoaded)

    useEffect(() => {
        async function fetchTables() {
            try {
                if (!user) return;
                const response = await GetTables(user._id);
                if (response && Array.isArray(response)) {
                    setTables(response);
                }
            } catch (error) {
                // console.error("Error fetching tables:", error);
            }
        }
        if (hasLoaded && queue.length === 0) {
            fetchTables();
        }
    }, [hasLoaded, user]);

    const gameModeCheck = (table: Table) => {
        const data = inUseTables.length > 0 ? inUseTables?.filter(
            (inUseTable) => String(inUseTable?.table._id) === String(table?._id)
        ):[];

        if (data?.length > 0) {
            const isFriendly = data?.some((inUseTable) => inUseTable?.friendly_match);
            return isFriendly ? "Friendly Match" : "In Use";
        }

        return "Free";
    };



    return (
        <View style={styles.container}>
           {tables?.map((item)=>{
               return (
                        <TouchableOpacity
                        key={item._id   }
                            onPress={() => {
                                const status = gameModeCheck(item);
                                const route = status === "Free" ? "/assign-players" : "/match-tracker";
                                router.push({ pathname: route, params: { table_id: item._id } });
                            }}
                            style={styles.row}
                        >
                            <View>
                                <Text style={styles.rowText}>
                                    {item.name}
                                </Text>
                            </View>
                            {gameModeCheck(item) == "In Use" || gameModeCheck(item) == "Friendly Match" ? (
                                <View style={styles.btnUse}>
                                    <Text style={styles.btnUseText}>{gameModeCheck(item)}</Text>
                                </View>
                            ) :

                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Free</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    )
           })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        backgroundColor: '#fefefe',
        borderRadius: 15,
        padding: 10
    },
    row: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: "red",
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: 10
    },
    rowText: {
        fontSize: 16,
        fontWeight: '400'
    },
    btn: {
        backgroundColor: "#fbf4fe",
        padding: 5,
        borderRadius: 9,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    btnText: {
        fontSize: 14,
        color: '#a79ac8'
    },
    btnUse: {
        backgroundColor: "#e5f6ff",
        padding: 5,
        borderRadius: 9,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    btnUseText: {
        fontSize: 14,
        color: '#7ea4cd'
    }
})