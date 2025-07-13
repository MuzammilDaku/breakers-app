import { PaidBill, useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { baseUrl } from "@/services/base";
import { AddCheckIn } from "@/services/table";
import { getCurrentPakistaniTime } from "@/services/utilities/getPakistaniTime";
import { getRandomId } from "@/services/utilities/getRandomId";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const types = [
  { label: "One Red", value: "One Red" },
  { label: "Six Red", value: "Six Red" },
  { label: "Ten Red", value: "Ten Red" },
  { label: "Fifteen Red", value: "Fifteen Red" },
  { label: "Century", value: "Century" },
];

const modes = [
  { label: "1 v 1", value: "1 v 1" },
  { label: "2 v 2", value: "2 v 2" },
];

export default function ManualBilling() {
  const [selected, setSelected] = useState([]);
  const [selectedMode, setSelectedMode] = useState([]);

  const tables = useAppStore((state) => state.tables);
  const user = useAppStore((state) => state.user);

  const tableNames = tables?.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [billInfo, setBillInfo] = useState<PaidBill>({
    customer_name: "",
    game_type: [],
    game_mode: [],
    table_names: [],
    total_bill: 0,
    created_by: user?._id,
    date: getCurrentPakistaniTime(),
    _id: getRandomId(),
    bill_type: "manual",
  });

  const handleChange = (field: string, value: any) => {
    setBillInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (
      billInfo.customer_name &&
      billInfo.game_type.length > 0 &&
      billInfo.game_mode.length > 0 &&
      billInfo.table_names.length > 0 &&
      billInfo.total_bill > 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [billInfo]);

  const addToQueue = useOfflineStore((state) => state.addToQueue);
  const setPaidBills = useAppStore((state) => state.setPaidBills);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const payload = {
        ...billInfo,
        date: getCurrentPakistaniTime(),
      };
      const isConnected = await isInternetConnected();
      if (isConnected) {
        const res = await AddCheckIn(payload);
        console.log(res);
        setIsLoading(false);
        setBillInfo({
          customer_name: "",
          game_type: [],
          game_mode: [],
          table_names: [],
          total_bill: 0,
          created_by: user?._id,
          date: getCurrentPakistaniTime(),
          _id: getRandomId(),
        });
        setPaidBills(res);
        ToastAndroid.showWithGravity(
          "Bill Saved",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        addToQueue({
          method: "POST",
          url: baseUrl + "/check-in",
          id: getRandomId(),
          body: payload,
        });
        setPaidBills(payload);
        setIsLoading(false);
        setBillInfo({
          customer_name: "",
          game_type: [],
          game_mode: [],
          table_names: [],
          total_bill: 0,
          created_by: user?._id,
          date: getCurrentPakistaniTime(),
          _id: getRandomId(),
        });
        ToastAndroid.showWithGravity(
          "Bill Saved",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      ToastAndroid.showWithGravity(
        String(error),
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );

      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ marginHorizontal: 20 }}>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{ fontSize: 20, textAlign: "center", fontWeight: "600" }}
          >
            Add Bill
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Customer Name</Text>
          <TextInput
            placeholder="Enter Player Name"
            style={styles.input}
            value={billInfo.customer_name}
            onChangeText={(e) => {
              handleChange("customer_name", e);
            }}
          />
        </View>
        {/* <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Game Type</Text>
          <MultiSelect
            style={styles.dropdown}
            data={types}
            labelField="label"
            valueField="value"
            placeholder="Select items"
            value={billInfo.game_type}
            onChange={(item: string[]) => {
              handleChange("game_type", item);
            }}
            selectedStyle={styles.selectedStyle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Game Mode</Text>
          <MultiSelect
            style={styles.dropdown}
            data={modes}
            labelField="label"
            valueField="value"
            placeholder="Select items"
            value={billInfo.game_mode}
            onChange={(item: any) => {
              // setSelectedMode(item);
              handleChange("game_mode", item);
            }}
            selectedStyle={styles.selectedStyle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Table Names</Text>
          <MultiSelect
            style={styles.dropdown}
            data={tableNames}
            labelField="label"
            valueField="value"
            placeholder="Select items"
            value={billInfo.table_names}
            onChange={(item: any) => {
              // setSelectedMode(item);
              handleChange("table_names", item);
            }}
            selectedStyle={styles.selectedStyle}
          />
        </View> */}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Total Bill</Text>
          <TextInput
            placeholder="Enter Amount"
            style={styles.input}
            value={String(billInfo.total_bill)}
            onChangeText={(e) => {
              handleChange("total_bill", Number(e));
            }}
          />
        </View>
        <View
          style={[isDisabled || isLoading ? styles.btnDisabled : styles.btn]}
        >
          <TouchableOpacity
            onPress={handleClick}
            disabled={isDisabled || isLoading}
          >
            <Text
              style={{ textAlign: "center", color: "#fefefe", fontSize: 16 }}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fefe"} />
              ) : (
                "Save & Print Bill"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f5f9",
    height: "100%",
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: "#D2E0FB",
    padding: 5,
  },
  btn: {
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
  btnDisabled: {
    marginVertical: 15,
    height: 50,
    // textAlign:"center",
    backgroundColor: "#AAB3D1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#AAB3D1",
  },
});
