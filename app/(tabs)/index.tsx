import TablesComp from "@/components/New/NewTablesComp";
import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import {
  GetCustomers,
  GetGameHistory,
  GetHistory,
  GetInUseTables,
} from "@/services/table";
import { isInternetConnected } from "@/services/utilities/isInternetConnected";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

export default function HomeScreen() {
  const { user } = useAppStore();
  const syncQueue = useOfflineStore((state) => state.syncQueue);
  const syncing = useOfflineStore((state) => state.syncing);
  const loadData = useOfflineStore((state) => state.loadData);



  useEffect(() => {
    if (!user) {
      router.navigate("/auth/login");
    }
  }, []);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pollAndSync = async () => {
      const isConnected = await isInternetConnected();
      if (isConnected && !syncing) {
        // console.log("⏳ Syncing queued items...");
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
    if(loadData === "load" || loadData === "load1") {
        // console.log("Loading initial data...");
        GetCustomer();
        GetInUseTable();
        GetPaidBills();
        GetGamesHistory();
      
    }
  }, [loadData]);
  return (
    <>
      <TablesComp />
    </>
  );
}
