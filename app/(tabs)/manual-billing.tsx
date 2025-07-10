import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";


const data = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
];
export default function ManualBilling() {
    const [selected, setSelected] = useState([]);
    const [selectedMode, setSelectedMode] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const types = [
        { label: "One Red", value: "One Red" },
        { label: "Six Red", value: "Six Red" },
        { label: "Ten Red", value: "Ten Red" },
        { label: "Fifteen Red", value: "Fifteen Red" },
        { label: "Century", value: "Century" },
    ];

    const modes = [
        {label:"1 v 1",value:"1 v 1"},
        {label:"2 v 2",value:"2 v 2"},
    ]
    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ marginVertical: 20 }}>
                    <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: "600" }}>Add Bill</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Customer Name</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => { }} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Game Type</Text>
                    <MultiSelect
                        style={styles.dropdown}
                        data={types}
                        labelField="label"
                        valueField="value"
                        placeholder="Select items"
                        value={selected}
                        onChange={item => {
                            setSelected(item);
                        }}
                        selectedStyle={styles.selectedStyle}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Game Mode</Text>
                    <MultiSelect
                        style={styles.dropdown}
                        data={modes}
                        labelField="label"
                        valueField="value"
                        placeholder="Select items"
                        value={selectedMode}
                        onChange={item => {
                            setSelectedMode(item);
                        }}
                        selectedStyle={styles.selectedStyle}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Total Bill</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => { }} />
                </View>
                <View style={[isDisabled || isLoading ? styles.btnDisabled : styles.btn]}>
                    <TouchableOpacity onPress={() => { }} disabled={isDisabled || isLoading}>
                        <Text style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}>
                            {isLoading ? <ActivityIndicator color={'#fefe'} /> : 'Save & Print Bill'}
                        </Text>
                    </TouchableOpacity>
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
    dropdown: { height: 50, borderColor: "gray", borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 },
    selectedStyle: {
        borderRadius: 12,
        backgroundColor: "#D2E0FB",
        padding: 5,
    },
    btn: {
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
})