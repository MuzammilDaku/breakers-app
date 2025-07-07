import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function Assign() {
    const [matchInfo, setMatchInfo] = useState({
        player_name: '',
        matchType: '1 v 1',
        price_frame: ''
    })
    return (
        <View style={styles.conatiner}>
            <View style={{ marginHorizontal: 25 }}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Player Name *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} />
                </View>
                <View style={{marginTop:15}}>
                    <Text style={styles.inputLabel}>Mode</Text>

                <View style={styles.tabContainer}>
                    
                    <TouchableOpacity style={[styles.pill, matchInfo.matchType === '1 v 1' && styles.pillSelected]} onPress={() => setMatchInfo({ ...matchInfo, matchType: '1 v 1' })}>
                        <Text style={styles.pillText}>1 v 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.pill, matchInfo.matchType === '2 v 2' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, matchType: '2 v 2' }) }}>
                        <Text style={styles.pillText}>2 v 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.pill, matchInfo.matchType === 'Friendly Match' && styles.pillSelected]} onPress={() => { setMatchInfo({ ...matchInfo, matchType: 'Friendly Match' }) }}>
                        <Text style={styles.pillText}>Friendly Match</Text>
                    </TouchableOpacity>
                </View>
                </View>
                 <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Price Per Frame *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} />
                </View>
                <View style={styles.btn}>
                    <TouchableOpacity>
                        <Text style={{textAlign:"center",color:"#fefefe",fontSize:16}}>Start Match</Text>
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
    btn:{
        marginVertical:15,
        height:50,
        // textAlign:"center",
        backgroundColor:"#475ba3",
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#475ba3'
    }
})