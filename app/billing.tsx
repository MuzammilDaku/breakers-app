import { PaidBill, useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { AddCheckIn, UpdateGameHistory } from "@/services/table";
import { getCurrentPakistaniTime } from "@/services/utilities/getPakistaniTime";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Billing() {
  const params = useLocalSearchParams();
  const customer = params.customer_name;
  const addPaidStatus = useAppStore((state) => state.addPaidStatus);
  const billTables = useAppStore((state) => state.billTables).filter(
    (item) => item.status !== "paid"
  );
  const customerBillTables = billTables?.filter(
    (item) => item.loser === customer
  );
  const tablesName = customerBillTables
    ?.map((item) => item?.inUseTable?.table.name)
    .filter((name): name is string => typeof name === "string");
    // console.log(tables)
  const gameNames = customerBillTables
    ?.map((item) => item?.inUseTable?.game_type)
    .filter((name): name is string => typeof name === "string");
  const gameModes = customerBillTables
    ?.map((item) => item?.inUseTable?.game_mode)
    .filter((name): name is string => typeof name === "string");
  const billIds = customerBillTables?.map((item) => item._id);

  const totalBill = customerBillTables?.reduce(
    (sum, item) => sum + (item.total_bill || 0),
    0
  );
  const totalFrames = customerBillTables?.reduce(
    (sum, item) => sum + (item.total_frame || 0),
    0
  );
  const totoalTimePlayed = customerBillTables?.reduce(
    (sum, item) => sum + (item.total_time || 0),
    0
  );

  const setPaidBills = useAppStore((state) => state.setPaidBills);
  const user = useAppStore((state) => state.user);
  const addToQueue = useOfflineStore((state) => state.addToQueue);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      if (typeof customer == "string" && user?._id) {
        setIsLoading(true);
        const isConnected = await isInternetConnected();
        const payload: PaidBill = {
          customer_name: customer,
          created_by: user._id,
          total_bill: totalBill,
          _id: getRandomId(),
          date: getCurrentPakistaniTime(),
        };

        if (tablesName.length > 0) {
          payload.table_names = tablesName.filter((name): name is string => typeof name === "string");
        }
        if (gameNames.length>0) {
          payload.game_type = gameNames.filter((name): name is string => typeof name === "string");
        }

        if(gameModes.length>0) {
          payload.game_mode = gameModes.filter((name): name is string => typeof name === "string");
        }

        // if()

        if (totalFrames) payload.total_frame = totalFrames;
        if (totoalTimePlayed) payload.time_played = totoalTimePlayed;

        if (isConnected) {
          const res = await AddCheckIn(payload);
          console.log(res);
          for (const billId of billIds) {
            const bill = customerBillTables?.find(
              (item) => item._id === billId
            );
            if (bill) {
              await UpdateGameHistory({
                _id: bill._id,
                status: "paid",
                paid_bill_id: payload._id,
              });
            }
          }
          await UpdateGameHistory({
            bill_ids: billIds,
            status: "paid",
          });
        } else {
          addToQueue({
            url: baseUrl + "/check-in",
            method: "POST",
            body: payload,
            id: getRandomId(),
          });
          for (const billId of billIds) {
            const bill = customerBillTables?.find(
              (item) => item._id === billId
            );
            if (bill) {
              addToQueue({
                url: baseUrl + "/table/game-history",
                method: "PUT",
                body: {
                  _id: bill._id,
                  status: "paid",
                },
                id: getRandomId(),
              });
            }
          }
        }
        setPaidBills(payload);
        addPaidStatus(billIds);
        // await printBill(generateBillText(payload))
        router.navigate("/(tabs)");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  return (
    <View style={styles.conatiner}>
      <View style={styles.wrapper}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Customer Name *</Text>
          <TextInput
            placeholder="Enter Player Name"
            style={styles.input}
            value={(customer as string) || ""}
            editable={false}
          />
        </View>
        <View style={styles.container}>
          {tablesName.length>0 &&
          <View style={styles.row}>
            <View>
              <Text style={styles.rowText}>Table Name</Text>
            </View>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{tablesName?.filter(Boolean).join(" , ")}</Text>
            </View>
          </View>
          }
          
          {gameNames.length > 0 && <View style={styles.row}>
            <View>
              <Text style={styles.rowText}>Game Name</Text>
            </View>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{gameNames?.filter(Boolean).join(" , ")}</Text>
            </View>
          </View> }
          
          {gameModes.length >0 && <View style={styles.row}>
            <View>
              <Text style={styles.rowText}>Game Mode</Text>
            </View>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{gameModes?.filter(Boolean).join(" , ")}</Text>
            </View>
          </View>}
          
          <View style={styles.rowLast}>
            <View>
              <Text style={styles.rowText}>Grand Total</Text>
            </View>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{totalBill} RS</Text>
            </View>
          </View>
        </View>
        <View >
          <TouchableOpacity onPress={handleClick} style={styles.btnGenerate}>
            <Text
              style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}
            >
              {!isLoading ? (
                "Generate & Print Bill"
              ) : (
                <ActivityIndicator color={"#fefefe"} />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: "#f4f5f9",
    height: "100%",
  },
  wrapper: {
    marginHorizontal: 25,
  },
  inputContainer: {
    marginTop: 13,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    backgroundColor: "#fefefe",
    // marginVertical: 10,
    borderRadius: 7,
    paddingHorizontal: 10,
    fontSize: 14,
    borderColor: "#eeeff3",
    borderWidth: 1,
    color: "black",
  },
  container: {
    marginVertical: 20,
    backgroundColor: "#fefefe",
    borderRadius: 15,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "red",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 10,
  },
    rowLast: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "red",
    paddingHorizontal: 8,
    // borderBottomWidth: 1,
    // borderColor: "#E0E0E0",
    paddingVertical: 10,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "400",
  },
  btn: {
    flexShrink: 1,
    maxWidth: "70%",
  },
  btnText: {
    fontSize: 14,
    // color: '#a79ac8',
    flexWrap: "wrap",
  },
  btnUse: {
    backgroundColor: "#e5f6ff",
    padding: 5,
    borderRadius: 9,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  btnUseText: {
    fontSize: 14,
    color: "#7ea4cd",
  },
  btnGenerate: {
    marginVertical: 15,
    height: 50,
    // textAlign:"center",
    backgroundColor: "#475ba3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#475ba3",
  },
});
