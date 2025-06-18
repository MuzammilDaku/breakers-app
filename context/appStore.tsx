import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  phone: string;
  role?: 'owner' | 'user';
  _id: string;
  status: string;
  date: Date;
}

export interface Table {
  name: string;
  minute_rate?: number;
  created_by: string;
  six_red_rate: Number;
  ten_red_rate: Number;
  century_rate: Number;
  one_red_rate: Number
  _id?:string;
  date?:Date
}

export interface History {
  created_by: string;
  total_frame: number;
  status: 'paid' | 'unpaid';
  total_bill: number;
  table_id: string;
  customer_name: string;
  customer_phone: string;
  received_amount: number;
  date?: any;
  _id: string;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;

  tables: Table[];
  setTables: (tables: Table[] ) => void;
  addTable: (table: Table) => void;
  resetTableId: string;
  setResetTableId: (id: string) => void;

  history: History[] | null;
  setHistory: (history: History[] | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      tables: [],
      setTables: (tables) => set({ tables }),

      resetTableId: '',
      setResetTableId: (id) => set({ resetTableId: id }),

      history: [],
      setHistory: (history) => set({ history }),

      addTable: (table) => set({ tables: [...(get().tables || []), table] }),
    }),
    {
      name: 'app-store', // key in AsyncStorage
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
