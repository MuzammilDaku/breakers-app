import { Table, useAppStore } from '@/context/appStore';
import { useOfflineStore } from '@/context/offlineStore';
import { AddTable, updateTable } from '@/services/table';
import { isInternetConnected } from '@/services/utilities/isInternetConnected';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import { baseUrl } from '@/services/base';
import { getRandomId } from '@/services/utilities/getRandomId';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddTableComp: React.FC = () => {
    const params = useLocalSearchParams()
    const tableStr = Array.isArray(params?.table) ? params.table[0] : params?.table;
    const table: Table = tableStr ? JSON.parse(tableStr) : null;
    const [tableName, setTableName] = useState(table?.name ? table.name : '');

    const [centuryRateInput, setCenturyRateInput] = useState(table?.century_rate ? String(table.century_rate) : '');
    const [centuryRate, setCenturyRate] = useState<number>(table?.century_rate ? Number(table.century_rate) : 0)

    const [tenRedRateInput, setTenRedRateInput] = useState(table?.ten_red_rate ? String(table.ten_red_rate) : '');
    const [tenRedRate, setTenRedRate] = useState<number>(table?.ten_red_rate ? Number(table.ten_red_rate) : 0)

    const [oneRedRateInput, setOneRedRateInput] = useState(table?.one_red_rate ? String(table.one_red_rate) : '');
    const [oneRedRate, setOneRedRate] = useState<number>(table?.one_red_rate ? Number(table.one_red_rate) : 0)

    const [sixRedRateInput, setSixRedRateInput] = useState(table?.six_red_rate ? String(table.six_red_rate) : '');
    const [sixRedRate, setSixRedRate] = useState<number>(table?.six_red_rate ? Number(table.six_red_rate) : 0)

    const [fifteenRedRateInput, setFifteenRedRateInput] = useState(table?.fifteen_red_rate ? String(table.fifteen_red_rate) : '');
    const [fifteenRedRate, setFifteenRedRate] = useState<number>(table?.fifteen_red_rate ? Number(table.fifteen_red_rate) : 0)

    const { user, addTable, editTable } = useAppStore();
    const { addToQueue } = useOfflineStore()

    const [isLoading, setIsLoading] = useState(false);
    
    const handleAddTable = async () => {
        try {
            if (!tableName.trim() || !oneRedRate || !centuryRate || !sixRedRate || !tenRedRate || !user || !fifteenRedRate) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }
            setIsLoading(true)

            const isConnected = await isInternetConnected();

            if (table && table?._id) {
                // console.log("edit")
                setIsLoading(true)
                const payload = {
                    _id: table._id,
                    name: tableName,
                    created_by: user?._id,
                    one_red_rate: oneRedRate,
                    six_red_rate: sixRedRate,
                    ten_red_rate: tenRedRate,
                    century_rate: centuryRate,
                    fifteen_red_rate: fifteenRedRate
                }

                if (isConnected) {
                    const res = await updateTable(payload);
                    if (res.error) {
                        return Alert.alert('Error', res.error)
                    }

                    editTable(res)
                }
                else {
                    addToQueue({
                        url: `${baseUrl}/table`,
                        id: getRandomId(),
                        method: "PUT",
                        body: payload
                    })
                    editTable(payload)
                }
                setCenturyRate(0);
                setOneRedRate(0)
                setSixRedRate(0)
                setTenRedRate(0)
                setTableName('');
                setIsLoading(false)
                setFifteenRedRateInput('')
                setFifteenRedRate(0)
                Alert.alert('Success', `Table Updated`);
                router.back();
            }
            else {
                const payload = {
                    _id: getRandomId(),
                    name: tableName,
                    created_by: user?._id,
                    date: new Date(),
                    one_red_rate: oneRedRate,
                    six_red_rate: sixRedRate,
                    ten_red_rate: tenRedRate,
                    century_rate: centuryRate,
                    fifteen_red_rate: fifteenRedRate
                }
                if (isConnected) {
                    const res = await AddTable(payload)
                    if (res.error) {
                        return alert(res.error)
                    }
                    addTable(res)
                }
                else {
                    addToQueue({
                        url: `${baseUrl}/table`,
                        id: getRandomId(),
                        method: "POST",
                        body: payload
                    })
                    addTable(payload)
                }
                Alert.alert('Success', `Table "${tableName}" Added`);
                setCenturyRate(0);
                setOneRedRate(0)
                setSixRedRate(0)
                setTenRedRate(0)
                setFifteenRedRate(0)
                setTableName('');
                setIsLoading(false)
                router.back();
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Ionicons name="add-circle-outline" size={28} color="#2e86de" />
                    <Text style={styles.heading}>
                        {table?._id ? "Edit Table" : "Add Snooker Table"}
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cube-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Table Name"
                        value={tableName}
                        onChangeText={setTableName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cash-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Century Rate"
                        value={centuryRateInput}
                        onChangeText={text => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setCenturyRateInput(numeric)
                            setCenturyRate(numeric ? parseInt(numeric, 10) : 0);
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cash-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="One Red Rate"
                        value={oneRedRateInput}
                        onChangeText={text => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setOneRedRateInput(numeric)
                            setOneRedRate(numeric ? parseInt(numeric, 10) : 0); setCenturyRate
                        }} keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cash-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Six Red Rate"
                        value={sixRedRateInput}
                        onChangeText={text => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setSixRedRateInput(numeric)
                            setSixRedRate(numeric ? parseInt(numeric, 10) : 0);
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cash-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Ten Red Rate"
                        value={tenRedRateInput}
                        onChangeText={text => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setTenRedRateInput(numeric)
                            setTenRedRate(numeric ? parseInt(numeric, 10) : 0);
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="cash-outline" size={20} color="#636e72" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Fifteen Red Rate"
                        value={fifteenRedRateInput}
                        onChangeText={text => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setFifteenRedRateInput(numeric)
                            setFifteenRedRate(numeric ? parseInt(numeric, 10) : 0);
                        }}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleAddTable} disabled={isLoading}>
                    {!isLoading && <Ionicons name="save-outline" size={20} color="#fff" />}
                    <Text style={styles.buttonText}>{isLoading ? <ActivityIndicator color={'#fefe'} size={'small'} /> : (
                        (table?._id ? "Edit Table" : "Add Table")
                    )}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    );
};

export default AddTableComp;


const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        display: 'flex',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2e86de',
        marginBottom: 24,
        textAlign: 'center',

    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#dfe6e9',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 18,
        paddingHorizontal: 10,
        backgroundColor: '#f5f6fa',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#2d3436',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#008000',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
});
