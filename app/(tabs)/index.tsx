import GetTablesComp from "@/components/GetTables";
import { useAppStore } from "@/context/appStore";
import { useOfflineStore } from "@/context/offlineStore";
import { isInternetConnected } from "@/services/hooks/isInternetConnected";
import { router } from "expo-router";
import { useEffect, useRef } from "react";


export default function HomeScreen() {
  const { user } = useAppStore();
  const { queue, syncQueue,syncing } = useOfflineStore()
  useEffect(() => {
    if (!user) {
      router.navigate("/auth/login")
    }
  }, [])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pollAndSync = async () => {
      const isConnected = await isInternetConnected()
      if (isConnected && !syncing) {
        console.log("⏳ Syncing queued items...");
        await syncQueue();
      }
    };

    intervalRef.current = setInterval(pollAndSync, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <GetTablesComp />
  );
}

