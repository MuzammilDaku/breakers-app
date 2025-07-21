import TablesComp from "@/components/New/NewTablesComp";
import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { connectPrinter, scanDevices, StartBluetooth } from "@/services/printer";
import {
  GetCustomers,
  GetGameHistory,
  GetHistory,
  GetInUseTables,
} from "@/services/table";
import { requestBluetoothPermissions } from "@/services/utilities/getBluetoothPermissions";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

export default function HomeScreen() {
  const user = useAppStore((state) => state?.user);
  const syncQueue = useOfflineStore((state) => state?.syncQueue);
  const syncing = useOfflineStore((state) => state?.syncing);
  const loadData = useOfflineStore((state) => state?.loadData);


  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pollAndSync = async () => {
      const isConnected = await isInternetConnected();
      if (isConnected && !syncing) {
        await syncQueue();
      }
    };

    intervalRef.current = setInterval(pollAndSync, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncing]);

  const setAllCustomers = useAppStore((state) => state.setAllCustomers);
  const setAllInUseTables = useAppStore((state) => state.setAllInUseTables);
  const setAllPaidBills = useAppStore((state) => state.setAllPaidBills);
  const setAllBillTables = useAppStore((state) => state.setAllBillTables);

  async function GetCustomer() {
    const res = await GetCustomers(user?._id);
    setAllCustomers(res);
  }

  async function GetInUseTable() {
    const res = await GetInUseTables(user?._id);
    setAllInUseTables(res);
  }

  async function GetPaidBills() {
    const res = await GetHistory(user?._id);
    setAllPaidBills(res);
  }

  async function GetGamesHistory() {
    const res = await GetGameHistory(user?._id);
    setAllBillTables(res);
  }

  useEffect(() => {
    if (loadData === "load" || loadData === "load1") {
      GetCustomer();
      GetInUseTable();
      GetPaidBills();
      GetGamesHistory();
    }
  }, [loadData]);

  async function ScanDevices() {
    const devices = await scanDevices();
    console.log("devices",devices)
    if (devices) {
      const { paired, found } = devices;
      const allDevices = [...paired, ...found];

      if (allDevices.length === 0) {
        Alert.alert(
          "No Devices Found",
          "Make sure your printer is powered on and in range."
        );
        return;
      }
      Alert.alert(
        "Select Printer",
        "Tap to connect:",
        allDevices.map((device) => ({
          text: `${device.name || "Unknown"} (${device.address})`,
          onPress: async () => {
            try {
              await connectPrinter(device.address);
              Alert.alert(
                "Connected",
                `Printer: ${device.name || device.address}`
              );
            } catch (err: any) {
              Alert.alert("Connection Failed", err.message || "Unknown error");
            }
          },
        })),
        { cancelable: true }
      );
    }
    else Alert.alert("Bluetooth",JSON.stringify(devices))
  }
  useEffect(() => {
    async function initBluetooth() {
      await requestBluetoothPermissions();
      await StartBluetooth()
      console.log("Requesting Bluetooth permissions...");
      await ScanDevices(); // only run scan after permission is granted
    }

    initBluetooth();
  }, []);

  return <TablesComp />;
}
