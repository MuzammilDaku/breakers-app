import { useAppStore } from "@/context/appStore";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Billing() {
    const params = useLocalSearchParams();
    const customer = params.customer_name;
    const addPaidStatus = useAppStore((state)=>state.addPaidStatus)
    const billTables = useAppStore((state) => state.billTables).filter((item)=>item.status !== "paid");
    const customerBillTables = billTables?.filter((item) => item.loser === customer);
    const tablesName = customerBillTables?.map((item) => item?.inUseTable.table.name);
    const gameNames = customerBillTables?.map((item) => item?.inUseTable.game_type);
    const gameModes = customerBillTables?.map((item) => item?.inUseTable.game_mode);
    const billIds = customerBillTables?.map((item)=>item._id);

    const totalBill = customerBillTables?.reduce((sum, item) => sum + (item.total_bill || 0), 0);
    
    const handleClick = () => {
        addPaidStatus(billIds);
        router.navigate('/(tabs)');
    };


    return (
        <View style={styles.conatiner}>
            <View style={styles.wrapper}>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Customer Name *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={customer as string || ""} editable={false} />
                </View>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.rowText}>
                                Table Name
                            </Text>
                        </View>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>{tablesName?.join(' , ')}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.rowText}>
                                Game Name
                            </Text>
                        </View>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>{gameNames?.join(' , ')}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.rowText}>
                                Game Mode
                            </Text>
                        </View>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>{gameModes?.join(' , ')}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.rowText}>
                                Grand Total
                            </Text>
                        </View>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>{totalBill} RS</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.btnGenerate}>
                    <TouchableOpacity onPress={handleClick}>
                        <Text style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}>Generate & Print Bill</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        backgroundColor: "#f4f5f9",
        height: "100%"
    },
    wrapper: {
        marginHorizontal: 25
    },
    inputContainer: {
        marginTop: 13
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        height: 40,
        backgroundColor: "#fefefe",
        // marginVertical: 10,
        borderRadius: 7,
        paddingHorizontal: 10,
        fontSize: 14,
        borderColor: "#eeeff3",
        borderWidth: 1
    },
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
        flexShrink: 1,
        maxWidth: "70%",
    },
    btnText: {
        fontSize: 14,
        // color: '#a79ac8',
        flexWrap: "wrap"
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
    },
    btnGenerate: {
        marginVertical: 15,
        height: 50,
        // textAlign:"center",
        backgroundColor: "#475ba3",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#475ba3'
    },
})