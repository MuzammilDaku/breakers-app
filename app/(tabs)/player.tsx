// import React, { useState } from 'react';
// import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// const initialPlayers = [
//     { id: '1', name: 'John Doe' },
//     { id: '2', name: 'Jane Smith' },
//     { id: '3', name: 'Alex Johnson' },
// ];

// export default function Player() {
//     const [players, setPlayers] = useState(initialPlayers);
//     const [search, setSearch] = useState('');
//     const [newPlayer, setNewPlayer] = useState('');

//     const filteredPlayers = players.filter(player =>
//         player.name.toLowerCase().includes(search.toLowerCase())
//     );

//     const addPlayer = () => {
//         if (newPlayer.trim()) {
//             setPlayers([
//                 ...players,
//                 { id: (players.length + 1).toString(), name: newPlayer.trim() },
//             ]);
//             setNewPlayer('');
//         }
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.title}>Players</Text>
//             <TextInput
//                 style={styles.searchBar}
//                 placeholder="Search players..."
//                 value={search}
//                 onChangeText={setSearch}
//             />
//             <FlatList
//                 data={filteredPlayers}
//                 keyExtractor={item => item.id}
//                 renderItem={({ item }) => (
//                     <View style={styles.playerItem}>
//                         <Text style={styles.playerName}>{item.name}</Text>
//                     </View>
//                 )}
//                 ListEmptyComponent={<Text style={styles.emptyText}>No players found.</Text>}
//             />
//             <View style={styles.addPlayerContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Add new player"
//                     value={newPlayer}
//                     onChangeText={setNewPlayer}
//                 />
//                 <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
//                     <Text style={styles.addButtonText}>Add</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//     title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
//     searchBar: {
//         borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
//         padding: 10, marginBottom: 12,
//     },
//     playerItem: {
//         padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee',
//     },
//     playerName: { fontSize: 18 },
//     emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
//     addPlayerContainer: {
//         flexDirection: 'row', alignItems: 'center', marginTop: 16,
//     },
//     input: {
//         flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
//         padding: 10, marginRight: 8,
//     },
//     addButton: {
//         backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 16,
//         borderRadius: 8,
//     },
//     addButtonText: { color: '#fff', fontWeight: 'bold' },
// });