import { Table, useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { DeleteTable } from "@/services/table";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

export default function DashboardTables() {
    const tables = useAppStore((state) => state.tables);
    const deleteTable = useAppStore((state) => state.deleteTable);
    const addToQueue = useOfflineStore((state) => state.addToQueue);

      const handleDelete = async (table: Table) => {
        if (!table._id) return;
        try {
          const isConnected = await isInternetConnected();
    
          if (isConnected) {
            await DeleteTable({ _id: table._id });
          } else {
            await addToQueue({
              method: "DELETE",
              url: baseUrl + "/table",
              body: { _id: table._id },
              id: getRandomId(),
            });
          }
          deleteTable(table);
        } catch (error) {
          console.log(error);
        }
      };
    

      const renderItem = ({ item }: { item: Table }) => (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{item?.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                router.navigate({
                  pathname: "/create-table",
                  params: { table: JSON.stringify(item) },
                });
              }}
            >
              <Ionicons
                name="create-outline"
                color="blue"
                size={20}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Delete Table", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(item),
                  },
                ]);
              }}
            >
              <Ionicons name="trash-outline" color="blue" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      );
  return (
    <ScrollView style={{ flex: 1, marginHorizontal:20 }}>
      <View style={styles.listHeader}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tables</Text>
        <Button
          mode="contained"
          onPress={() => router.navigate("/create-table")}
          style={{ backgroundColor: "#475ba3" }}
          labelStyle={{ color: "white" }}
        >
          Add Table
        </Button>
      </View>
     {tables?.map((table)=>{
      return (
         <View style={styles.tableRow} key={table._id}>
          <Text style={styles.tableCell}>{table?.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                router.navigate({
                  pathname: "/create-table",
                  params: { table: JSON.stringify(table) },
                });
              }}
            >
              <Ionicons
                name="create-outline"
                color="blue"
                size={20}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Delete Table", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(table),
                  },
                ]);
              }}
            >
              <Ionicons name="trash-outline" color="blue" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )
     })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tableRow: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
  },
  tableCell: {
    fontSize: 16,
  },
});
