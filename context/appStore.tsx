import { getCurrentPakistaniTime } from '@/services/utilities/getPakistaniTime';
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
  fifteen_red_rate: Number;
  _id: string;
  date?: Date
}

export interface History {
  created_by: any;
  total_frame: number;
  status: string;
  total_bill: number;
  table_id: string;
  customer_name: string;
  customer_phone: string;
  received_amount: number;
  date: any;
  _id: string;
  types?: string;
  frames?: string;
}

interface InUseTable {
  table: Table;
  _id: string;
  player_name1: string;
  player_name2?: string;
  player_name3?: string;
  player_name4?: string;
  game_type: string;
  game_mode: string;
  friendly_match: boolean;
  date?: string;
}

interface UserBillTable {
  _id: string;
  inUseTable: InUseTable;
  winner: string;
  loser: string;
  total_bill: number | undefined;
  total_frame?: number;
  total_time?: number;
  total_bill_per_frame?: number;
  total_bill_per_minute?: number;
  date?: string;
  game_type: string;
  status?: string;
}

interface Customer {
  name: string;
  date: string;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;

  tables: Table[];
  setTables: (tables: Table[]) => void;
  addTable: (table: Table) => void;
  editTable: (table: Table) => void
  deleteTable: (table: Table) => void

  addHistory: (history: History) => void;

  resetTableId: string;
  setResetTableId: (id: string) => void;

  history: History[];
  setHistory: (history: History[]) => void;

  inUseTables: InUseTable[];
  setInUseTables: (table: InUseTable) => void;
  deleteInUseTable: (table: InUseTable) => void;


  billTables: UserBillTable[];
  setBillTables: (table: UserBillTable) => void;

  customers: Customer[];
  setCustomers: (customers: Customer) => void;
  addPaidStatus:(ids:string[])=>void;
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
      addHistory: (history) => set({ history: [...(get().history || []), history] }),
      editTable: (table) => set({
        tables: get().tables.map((t) =>
          t._id === table._id
            ? { ...t, ...Object.fromEntries(Object.entries(table).filter(([k, v]) => v !== undefined && k !== '_id')) }
            : t
        ),
      }),
      deleteTable: (table: Table) => {
        set({ tables: get().tables.filter((item) => item._id !== table._id) });
      },
      inUseTables: [],
      setInUseTables: (table: InUseTable) => {
        set({ inUseTables: [...(get().inUseTables || []), { ...table, date: getCurrentPakistaniTime() }] })
      },
      billTables: [],
      setBillTables(table: UserBillTable) {
        set({ billTables: [...(get().billTables || []), { ...table, date: getCurrentPakistaniTime() }] });
      },
      customers: [],
      setCustomers: (customer: Customer) => {
        const customers = get().customers || [];
        if (customers.some(c => c.name === customer.name)) {
          set({ customers });
        } else {
          set({ customers: [...customers, customer] });
        }
      },
      deleteInUseTable: (table: InUseTable) => {
        set({ inUseTables: get().inUseTables.filter((item) => item._id !== table._id) });
      },
      addPaidStatus:(ids)=>{
        
        const updatedBillTables = get().billTables.map(bill =>
          ids.includes(bill._id) ? { ...bill, status: 'paid' } : bill
        );
        set({ billTables: updatedBillTables });
      }
    }),

    {
      name: 'app-store',
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
