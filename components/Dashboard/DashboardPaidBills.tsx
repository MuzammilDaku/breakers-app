import { useAppStore } from "@/context/appStore";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, DataTable, Searchbar } from "react-native-paper";

export default function DashboardPaidBills() {
  const PAGE_SIZE = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const billTables = useAppStore((state) => state?.paidBills);

  // If you want to merge duplicate customer names, implement merging logic here.
  // For now, just use the original billTables array.
  const mergedBillTables = billTables ?? [];

  const filteredBillTables = useMemo(() => {
    return mergedBillTables.filter((item) =>
      item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mergedBillTables]);

  const paginatedData = filteredBillTables.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (page * PAGE_SIZE < filteredBillTables.length) {
      setPage((prev) => prev + 1);
    }
  };

  const hasMore = page * PAGE_SIZE < filteredBillTables.length;
  return (
    <View style={{ flex: 1, marginHorizontal: 20 }}>
      <FlatList
        style={{ flex: 1 }}
        data={paginatedData}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Searchbar
              placeholder="Search"
              onChangeText={(text) => {
                setSearchQuery(text);
                setPage(1); // reset pagination on search
              }}
              value={searchQuery}
              style={{ backgroundColor: "#fff", marginBottom: 10 }}
            />
            <DataTable style={{ backgroundColor: "#fff", borderRadius: 10 }}>
              <DataTable.Header>
                <DataTable.Title>Customer Name</DataTable.Title>
                <DataTable.Title>Time</DataTable.Title>
                <DataTable.Title>Grand Total</DataTable.Title>
              </DataTable.Header>
            </DataTable>
          </View>
        }
        renderItem={({ item }) => (
          <DataTable.Row
            style={{
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <DataTable.Cell>{item.customer_name}</DataTable.Cell>
            <DataTable.Cell>{item.date?.slice(0, 16)}</DataTable.Cell>
            <DataTable.Cell textStyle={{ marginLeft: 20 }}>
              {String(item.total_bill)}
            </DataTable.Cell>
          </DataTable.Row>
        )}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            {hasMore ? (
              <Button
                mode="contained"
                onPress={loadMore}
                style={styles.loadMoreButton}
                labelStyle={{ color: "white" }}
              >
                Load More
              </Button>
            ) : (
              <Text style={styles.endText}>No more bills</Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    // backgroundColor: "#fefefe",
    // padding: 20,
    paddingBottom: 10,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    backgroundColor: "#475ba3",
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  endText: {
    marginTop: 10,
    color: "gray",
  },
});
