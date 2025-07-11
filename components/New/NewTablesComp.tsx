import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import TablePills from "./TablePills";
import Tables from "./Tables";
export default function NewTablesComp() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {}, []);
  return (
    <ScrollView style={styles.conatiner}>
      <View style={{ marginHorizontal: 15 }}>
        <TablePills
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <Tables selectedFilter={selectedFilter} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "#f4f5f9",
    // marginHorizontal: 15,
    height: "100%",
  },
});
