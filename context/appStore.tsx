import { baseUrl } from '@/services/base';
import { AddCustomer } from '@/services/table';
import { getCurrentPakistaniTime } from '@/services/utilities/getPakistaniTime';
import { getRandomId } from '@/services/utilities/getRandomId';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useOfflineStore } from './offlineStore';

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
  created_by: any;
}

export interface UserBillTable {
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
  created_by?: any
}

interface Customer {
  name: string;
  date: string;
  _id: string;
}


export interface PaidBill {
  created_by: any;
  total_frame?: number;
  total_bill: number;
  customer_name: string;
  date: any;
  _id: string;
  game_mode: string[]
  time_played?: number;
  game_type: string[];
  table_names: string[];
  bill_type?:string
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
  setAllBillTables: (table: UserBillTable[]) => void;


  customers: Customer[];
  setCustomerOnline: (customers: Customer) => void;
  setCustomerOffline: (customers: Customer) => void;

  setAllCustomers: (customer: Customer[]) => void;
  addPaidStatus: (ids: string[]) => void;

  paidBills: PaidBill[];
  setPaidBills: (bill: PaidBill) => void;
  setAllInUseTables: (table: InUseTable[]) => void;
  setAllPaidBills: (bill: PaidBill[]) => void;

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

      deleteInUseTable: (table: InUseTable) => {
        set({ inUseTables: get().inUseTables.filter((item) => item._id !== table._id) });
      },
      addPaidStatus: (ids) => {
        const stringIds = ids.map(String);
        const updatedBillTables = get().billTables.map(bill => {
          const isMatch = stringIds.includes(String(bill._id));
          console.log(bill._id, isMatch, stringIds);
          return isMatch ? { ...bill, status: 'paid' } : bill;
        });
        set({ billTables: updatedBillTables });
      },
      paidBills: [],
      setPaidBills: (bill) => {
        set({ paidBills: [...(get().paidBills || []), { ...bill, date: getCurrentPakistaniTime() }] })
      },
      setAllCustomers: (customers) => {
        set({ customers: customers })
      },
      setAllInUseTables: (tables) => {
        set({ inUseTables: tables })
      },
      setAllPaidBills: (bills) => {
        set({ paidBills: bills })
      },
      setAllBillTables: (table) => {
        set({ billTables: table })
      },
      setCustomerOnline: async (customer: Customer) => {
        const customers = get().customers || [];
        if (customers.some(c => c.name === customer.name)) {
          set({ customers });
        } else {
          await AddCustomer(customer);
        }
      },
      setCustomerOffline: async (customer: Customer) => {
        const customers = get().customers || [];
        if (!customers.some(c => c.name === customer.name)) {
          set({ customers: [...customers, customer] });
          await useOfflineStore().addToQueue({
            method: "POST",
            url: baseUrl + '/customer',
            id: getRandomId(),
            body: customer
          });
        }

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
