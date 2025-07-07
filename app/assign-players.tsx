import Checkbox from 'expo-checkbox';
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function Assign() {
    const [matchInfo, setMatchInfo] = useState({
        player_name: '',
        matchType: '1 v 1',
        price_frame: '',
        game_type: 'One Red'
    })
    const [isChecked, setChecked] = useState(true);

    const [isDisabled,setIsDisabled] = useState(true)
    return (
        <View style={styles.conatiner}>
            <View style={{ marginHorizontal: 25 }}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Player 1 Name *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} />
                </View>
                {matchInfo.matchType == "1 v 1" && !isChecked && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Player 2 Name </Text>
                        <TextInput placeholder="Enter Player Name" style={styles.input} />
                    </View>
                )}
                  {matchInfo.matchType == "2 v 2" && isChecked && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Player 2 Name </Text>
                        <TextInput placeholder="Enter Player Name" style={styles.input} />
                    </View>
                )}
                {matchInfo.matchType == "2 v 2" && !isChecked && (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Player 2 Name </Text>
                            <TextInput placeholder="Enter Player Name" style={styles.input} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Player 3 Name </Text>
                            <TextInput placeholder="Enter Player Name" style={styles.input} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Player 4 Name </Text>
                            <TextInput placeholder="Enter Player Name" style={styles.input} />
                        </View>
                    </>

                )}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
                    {/* <Text style={styles.inputLabel}></Text> */}
                    <Checkbox value={isChecked} color={'#475ba3'} onValueChange={setChecked} />
                    <Text style={{ fontSize: 16, marginLeft: 8 }}>Friendly Match</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={styles.inputLabel}>Mode</Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.pill, matchInfo.matchType === '1 v 1' && styles.pillSelected]} onPress={() => setMatchInfo({ ...matchInfo, matchType: '1 v 1' })}>
                            <Text style={styles.pillText}>1 v 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, matchInfo.matchType === '2 v 2' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, matchType: '2 v 2' }) }}>
                            <Text style={styles.pillText}>2 v 2</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={styles.inputLabel}>Game Type</Text>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.pill, matchInfo.game_type === 'One Red' && styles.pillSelected]} onPress={() => setMatchInfo({ ...matchInfo, game_type: 'One Red' })}>
                            <Text style={styles.pillText}>One Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, matchInfo.game_type === 'Six Red' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, game_type: 'Six Red' }) }}>
                            <Text style={styles.pillText}>Six Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, matchInfo.game_type === 'Ten Red' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, game_type: 'Ten Red' }) }}>
                            <Text style={styles.pillText}>Ten Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, matchInfo.game_type === 'Fifteen Red' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, game_type: 'Fifteen Red' }) }}>
                            <Text style={styles.pillText}>Fifteen Red</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.pill, matchInfo.game_type === 'Century' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, game_type: 'Century' }) }}>
                            <Text style={styles.pillText}>Century</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[isDisabled ? styles.btnDisabled:styles.btn]}>
                    <TouchableOpacity onPress={() => router.navigate('/match-tracker')} disabled={isDisabled}>
                        <Text style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}>Start Match</Text>
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
    tabContainer: {
        display: 'flex',
        backgroundColor: "#fefefe",
        borderColor: "#fefefe",
        flexDirection: 'row',
        height: 40,
        justifyContent: "space-between",
        // marginTop: 20,
        alignItems: 'center',
        borderRadius: 15,
    },
    pillText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    pill: {
        borderRadius: 9,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        marginHorizontal: 3
    },
    pillSelected: {
        backgroundColor: "#f4f5f9",
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