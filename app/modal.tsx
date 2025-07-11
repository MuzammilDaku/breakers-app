import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { AddCheckIn } from "@/services/table";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
export default function Modal() {
  const params = useLocalSearchParams();
  const table = JSON.parse(
    Array.isArray(params.table) ? params.table[0] : params.table
  );
  const selectedGames = JSON.parse(
    Array.isArray(params.selectedGames)
      ? params.selectedGames[0]
      : params.selectedGames
  );
  const selected = Object.entries(selectedGames)
    .filter(([key, value]) => value !== 0)
    .map(([key]) => key);

  const totalFrames = Object.entries(selectedGames)
    .filter(([key]) => key !== "century")
    .reduce((sum, [, value]: any) => sum + value, 0);
  // console.log(totalFrames)

  const formatted = selected
    .map((item) =>
      item
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(", ");

  const frames = Object.entries(selectedGames)
    .filter(([key, value]) => key !== "century" && value !== 0)
    .map(
      ([key, value]) =>
        key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") + `: ${value}`
    )
    .join(" ");

  const rates = selected
    .filter((key) => table[`${key}_rate`] !== undefined)
    .map((key, idx) => {
      const label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const rate = table[`${key}_rate`];
      return `${label}: ${rate + " Rs"}${
        idx <
        selected.filter((k) => table[`${k}_rate`] !== undefined).length - 1
          ? ", "
          : ""
      }`;
    });

  const totalBill = Object.entries(selectedGames).reduce(
    (total, [key, value]) => {
      const numValue = Number(value);
      if (numValue > 0) {
        if (key === "century") {
          // Convert seconds to minutes and multiply by minute rate
          total += (numValue / 60) * (table.century_rate || 0);
        } else {
          const rateKey = `${key}_rate`;
          const rate = table[rateKey] || 0;
          total += numValue * rate;
        }
      }
      return Math.round(total);
    },
    0
  );

  const { setResetTableId, user, addHistory } = useAppStore();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");

  const [loader, setLoader] = useState(false);
  const { addToQueue } = useOfflineStore();

  const handleAddCheckIn = async () => {
    if (!customerName || !customerPhone || !receivedAmount) {
      return alert("Please fill in all fields !");
    }
    setLoader(true);

    const payload = {
      table_id: table._id as string,
      frames: frames,
      types: formatted,
      total_frame: totalFrames,
      table_name: table.name,
      time_played: String(selectedGames.century),
      customer_name: customerName,
      customer_phone: customerPhone,
      received_amount: Number(receivedAmount),
      total_bill: totalBill,
      created_by: user?._id,
      _id: getRandomId(),
      date: new Date(),
    };

    const isConnected = await isInternetConnected();

    if (isConnected) {
      const response = await AddCheckIn(payload);
      if (!response.error) {
        router.back();
      }
    } else {
      addToQueue({
        method: "POST",
        url: baseUrl + "/check-in",
        body: payload,
        id: getRandomId(),
      });
      router.back();
    }
    addHistory(payload as any);
    setResetTableId(table._id as string);
    setLoader(false);
  };
  return (
    <View style={styles.container}>
      <View style={paramStyles.list}>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Table Name</Text>
          <Text style={paramStyles.value}>{table?.name}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Games Played</Text>
          <Text style={paramStyles.value}>{formatted}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Rates</Text>
          <Text style={paramStyles.value}>{rates}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Frames Played</Text>
          <Text style={paramStyles.value}>{frames}</Text>
        </View>
        {selected.includes("century") && (
          <View style={paramStyles.row}>
            <Text style={paramStyles.key}>Time Played</Text>
            <Text style={paramStyles.value}>
              {selectedGames.century} Seconds{" "}
            </Text>
          </View>
        )}

        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Grand Total</Text>
          <Text style={paramStyles.value}>{String(totalBill)} Rs</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Customer Name *</Text>
          <TextInput
            style={[
              paramStyles.value,
              {
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 10,
                width: "50%",
              },
            ]}
            placeholder="Customer Name"
            value={customerName}
            onChangeText={(value) => setCustomerName(value)}
          />
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Customer Phone *</Text>
          <TextInput
            style={[
              paramStyles.value,
              {
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 10,
                width: "50%",
              },
            ]}
            placeholder="Customer Phone"
            value={customerPhone}
            onChangeText={(value) => setCustomerPhone(value)}
          />
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Received Amount *</Text>
          <TextInput
            style={[
              paramStyles.value,
              {
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 10,
                width: "50%",
              },
            ]}
            placeholder="Received Amount"
            value={receivedAmount}
            onChangeText={(value) => setReceivedAmount(value)}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          marginTop: 24,
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{
              backgroundColor: "#008000",
              color: "#fff",
              textAlign: "center",
              paddingVertical: 14,
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 16,
            }}
            disabled={loader}
            // onPress handler for save and print bill
            onPress={handleAddCheckIn}
          >
            {loader ? (
              <ActivityIndicator color={"#fefe"} />
            ) : (
              "Save & Print Bill"
            )}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              textAlign: "center",
              paddingVertical: 14,
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 16,
            }}
            // onPress handler for close
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
          >
            Close
          </Text>
        </View>
      </View>
    </View>
  );
}

const paramStyles = StyleSheet.create({
  list: {
    marginTop: 24,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    padding: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to next line
    justifyContent: "space-between",
    alignItems: "flex-start", // Align items to the top
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    textAlign: "center",
  },
  key: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
    flexShrink: 1, // Allow shrinking if needed
    marginRight: 8,
  },
  value: {
    color: "#555",
    fontSize: 16,
    flexShrink: 1, // Allow shrinking if needed
    minWidth: 0, // Allow text to wrap
    flexBasis: "50%",
  },
});

// Usage inside Modal component
// Replace <Text>Params: {JSON.stringify(params)}</Text> with:
{
  /* <ParamList params={params} /> */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
