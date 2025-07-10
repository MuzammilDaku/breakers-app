import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ManualBilling() {
    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ marginVertical: 20 }}>
                    <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: "600" }}>Add Bill</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Customer Name</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => {}} />
                </View>
                 <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Game Type</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => {}} />
                </View>
                 <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Game Mode</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => {}} />
                </View>
                     <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Total Bill</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} value={''} onChangeText={() => {}} />
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
})