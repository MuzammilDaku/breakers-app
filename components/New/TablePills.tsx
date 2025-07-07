import { SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function TablePills(props:{
    selectedFilter:string,
    setSelectedFilter:React.Dispatch<SetStateAction<string>>;
}) {

    return (
        <View style={styles.conatiner}>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.pill, props.selectedFilter === 'all' && styles.pillSelected]} onPress={() => props.setSelectedFilter('all')}>
                    <Text style={styles.pillText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pill, props.selectedFilter === 'free' && styles.pillSelected]} onPress={() => props.setSelectedFilter('free')}>
                    <Text style={styles.pillText}>Free</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pill, props.selectedFilter === 'occupied' && styles.pillSelected]} onPress={() => props.setSelectedFilter('occupied')}>
                    <Text style={styles.pillText}>Occupied</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    conatiner: {
        backgroundColor: "#f4f5f9",
        // marginHorizontal: 15
    },
    tabContainer: {
        display: 'flex',
        backgroundColor: "#fefefe",
        borderColor: "#fefefe",
        flexDirection: 'row',
        height: 50,
        justifyContent: "space-between",
        marginTop: 20,
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
    }

})