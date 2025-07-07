import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { GetTables } from "@/services/table";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Tables(props: { selectedFilter: string }) {
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
            <View style={styles.container}>
                <FlatList
                    data={tables}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.row} onPress={()=>router.navigate("/assign-players")}>
                                <View>
                                    <Text style={styles.rowText}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Free</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
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