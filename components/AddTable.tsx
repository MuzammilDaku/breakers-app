import { useAppStore } from '@/context/appStore';
import { AddTable } from '@/services/table';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddTableComp: React.FC = () => {
    const [tableName, setTableName] = useState('');
    const [ratePerMinute, setRatePerMinute] = useState('');
    const { user, addTable } = useAppStore();

    const handleAddTable = async () => {
        try {
            if (!tableName.trim() || !ratePerMinute.trim()) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }
            // Add your submit logic here
            const res = await AddTable({ name: tableName, minute_rate: ratePerMinute, created_by: user?._id })
            if (res.error) {
                return alert(res.error)
            }
            addTable(res)
            Alert.alert('Success', `Table "${tableName}" added at ₹${ratePerMinute}/min`);

            setTableName('');
            setRatePerMinute('');
            router.back();
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
                        Add Snooker Table
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
                        placeholder="Rate per Minute"
                        value={ratePerMinute}
                        onChangeText={setRatePerMinute}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleAddTable}>
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Add Table</Text>
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
