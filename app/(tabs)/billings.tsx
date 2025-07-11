import { useAppStore } from "@/context/appStore";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, DataTable, Searchbar } from "react-native-paper";

const PAGE_SIZE = 10;

export default function Billing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const billTables = useAppStore((state) => state?.billTables)?.filter(
    (item) => item?.status !== "paid"
  );

  const mergedBillTables = billTables?.reduce((acc, curr) => {
    const existing: any = acc?.find(
      (item) => item?.loser?.toLowerCase() === curr?.loser?.toLowerCase()
    );
    if (existing) {
      existing.total_bill += curr?.total_bill;
      if (curr?.date && (!existing?.date || curr?.date > existing?.date)) {
        existing.date = curr?.date;
      }
    } else {
      acc?.push({ ...curr });
    }
    return acc;
  }, [] as typeof billTables);

  const filteredBillTables = useMemo(() => {
    return mergedBillTables.filter((item) =>
      item.loser.toLowerCase().includes(searchQuery.toLowerCase())
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
    <FlatList
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
              <DataTable.Title>Action</DataTable.Title>
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
          <DataTable.Cell>{item.loser}</DataTable.Cell>
          <DataTable.Cell>{item.date?.slice(0, 16)}</DataTable.Cell>
          <DataTable.Cell textStyle={{ marginLeft: 20 }}>
            {String(item.total_bill)}
          </DataTable.Cell>
          <DataTable.Cell>
            <TouchableOpacity
              onPress={() => {
                router.navigate({
                  pathname: "/billing",
                  params: { customer_name: item.loser },
                });
              }}
            >
              <Text style={{ color: "blue" }}>Print & Pay Bill</Text>
            </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#f4f5f9",
    padding: 20,
    paddingBottom: 100,
    height: "100%",
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
