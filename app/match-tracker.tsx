import { useAppStore } from "@/context/appStore";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function MatchTracker() {
    const inUseTables = useAppStore((state)=>state.inUseTables);
    const tables = useAppStore((state)=>state.tables);
    const params = useLocalSearchParams();
    const {table_id} = params;
    const inUseTable = inUseTables.filter((item)=> item.table._id === table_id)[0];
    const table = tables.filter((item)=>item._id === table_id)[0];
    const players : {
        player_name1:string,
        player_name2?:string,
        player_name3?:string,
        player_name4?:string,
    }= {
        player_name1:inUseTable.player_name1
    };
    if(inUseTable.game_mode == "2 v 2" && inUseTable.friendly_match) {
        players.player_name2=inUseTable.player_name2
    }
      if(inUseTable.game_mode == "1 v 1" && !inUseTable.friendly_match) {
        players.player_name2=inUseTable.player_name2
    }
     if(inUseTable.game_mode == "2 v 2" && !inUseTable.friendly_match) {
        players.player_name2=inUseTable.player_name2
        players.player_name3=inUseTable.player_name3
        players.player_name4=inUseTable.player_name4

    }
    return (
        <View style={styles.conatiner}>
            <View style={{ marginHorizontal: 25 }}>
               <View style={{display:"flex",flexDirection:"row",width:"100%"}}>
                 <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Winner *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Loser *</Text>
                    <TextInput placeholder="Enter Player Name" style={styles.input} />
                </View>
               </View>
            
                <View style={styles.btn}>
                    <TouchableOpacity>
                        <Text style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}>End Game & Print Bill</Text>
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
        marginTop: 13,
        flex:1,
        marginRight:5,
        height:"100%",
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        height: 40,
        backgroundColor: "#fefefe",
        borderRadius: 7,
        paddingHorizontal: 10,
        fontSize: 14,
        borderColor: "#eeeff3",
        borderWidth: 1,
    

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
    }
})