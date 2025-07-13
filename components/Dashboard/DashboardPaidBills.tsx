import { useAppStore } from "@/context/appStore";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, DataTable, IconButton, Searchbar } from "react-native-paper";

export default function DashboardPaidBills() {
  const PAGE_SIZE = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false); // false = newest first
  const billTables = useAppStore((state) => state?.paidBills);

  const mergedBillTables = billTables ?? [];

  const filteredBillTables = useMemo(() => {
    const filtered = mergedBillTables.filter((item) =>
      item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
  }, [searchQuery, mergedBillTables, sortAsc]);

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
                <DataTable.Title>
                  Time
                  <IconButton
                    icon={sortAsc ? "arrow-up" : "arrow-down"}
                    size={16}
                    onPress={() => {
                      setSortAsc((prev) => !prev);
                      setPage(1);
                    }}
                  />
                </DataTable.Title>
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
