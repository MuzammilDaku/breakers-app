import {
  GetCustomers,
  GetGameHistory,
  GetHistory,
  GetInUseTables,
} from "@/services/table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { useAppStore } from "./appStore";

type OfflineApiCall = {
  id: string;
  url: string;
  method: "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

type OfflineStore = {
  queue: OfflineApiCall[];
  syncing: boolean;
  hasLoaded: boolean;
  addToQueue: (call: OfflineApiCall) => void;
  syncQueue: () => Promise<void>;
};

const QUEUE_KEY = "offline_api_queue";

export const useOfflineStore = create<OfflineStore>((set, get) => {
  const persistQueue = async (queue: OfflineApiCall[]) => {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  const loadQueue = async () => {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    if (data) {
      set({ queue: JSON.parse(data) });
    }
    set({ hasLoaded: true });
  };

  loadQueue();

  return {
    queue: [],
    syncing: false,
    hasLoaded: false,

    addToQueue: (call) => {
      const updatedQueue = [...get().queue, call];
      set({ queue: updatedQueue });
      persistQueue(updatedQueue);
    },

    syncQueue: async () => {
      const queue = [...get().queue];
      if (queue.length === 0) return;

      set({ syncing: true });
      const successfulIds: string[] = [];

      for (const call of queue) {
        try {
          const response = await fetch(call.url, {
            method: call.method,
            headers: {
              "Content-Type": "application/json",
              ...(call.headers || {}),
            },
            body: call.body ? JSON.stringify(call.body) : undefined,
          });

          const result = await response.json();
          if (!result.error) {
            successfulIds.push(call.id);
          } else {
            console.log("API error:", result.error);
          }
        } catch (error) {
          console.log("Sync error:", error);
        }
      }

      const remaining = queue.filter(
        (item) => !successfulIds.includes(item.id)
      );
      if (remaining.length === 0) {
        const user = useAppStore.getState().user;
        const setAllCustomers = useAppStore.getState().setAllCustomers;
        const setAllInUseTables = useAppStore.getState().setAllInUseTables;
        const setAllPaidBills = useAppStore.getState().setAllPaidBills;
        const setAllBillTables = useAppStore.getState().setAllBillTables;
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
        GetCustomer();
        GetInUseTable();
        GetPaidBills();
        GetGamesHistory();
      }
      // console.log("remaining", remaining);
      set({ queue: remaining, syncing: false });
      persistQueue(remaining);
    },
  };
});
