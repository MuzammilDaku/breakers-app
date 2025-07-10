import { useAppStore } from "@/context/appStore";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DataTable, Searchbar } from "react-native-paper";

export default function Billing() {
    const [searchQuery, setSearchQuery] = useState('');
    const billTables = useAppStore((state) => state?.billTables)?.filter((item) => item?.status !== "paid");
    const mergedBillTables = billTables?.reduce((acc, curr) => {
        const existing:any = acc?.find(item => item?.loser?.toLowerCase() === curr?.loser?.toLowerCase());
        if (existing) {
            existing.total_bill += curr?.total_bill;
            // Optionally, update date to latest
            if (curr?.date && (!existing?.date || curr?.date > existing?.date)) {
                existing.date = curr?.date;
            }
        } else {
            acc?.push({ ...curr });
        }
        return acc;
    }, [] as typeof billTables);

    const filteredBillTables = mergedBillTables.filter((item) =>
        item.loser.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={styles.searchContainer}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={{ backgroundColor: '#fff' }}
                    />
                </View>
                <View style={styles.tableContainer}>
                    <DataTable style={{ backgroundColor: '#fff',borderRadius: 10 }}>
                        <DataTable.Header>
                            <DataTable.Title >Cutomer Name</DataTable.Title>
                            <DataTable.Title >Time</DataTable.Title>
                            <DataTable.Title >Grand Total</DataTable.Title>
                            <DataTable.Title >Action</DataTable.Title>
                        </DataTable.Header>
                        <FlatList data={filteredBillTables} keyExtractor={(item) => item._id} renderItem={({ item }) => {
                            console.log(item.total_bill)
                            return (
                                <DataTable.Row>
                                    <DataTable.Cell>{item.loser}</DataTable.Cell>
                                    <DataTable.Cell>{item.date?.slice(0, 16)}</DataTable.Cell>
                                    <DataTable.Cell textStyle={{ marginLeft: 20 }}>{String(item.total_bill)}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <TouchableOpacity onPress={() => {
                                           router.navigate({pathname:'/billing',params:{
                                            customer_name:item.loser
                                           }})
                                        }}>
                                            <Text style={{ color: 'blue' }}>Print & Pay Bill</Text>
                                        </TouchableOpacity>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )
                        }} />
                    </DataTable>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f4f5f9",
        height: "100%",
    },
    searchContainer: {
        marginVertical: 10
    },
    tableContainer: {
        marginVertical: 10
    }
})