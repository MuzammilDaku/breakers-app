import React, { createContext, Dispatch, ReactNode, useState } from "react";

export interface User {
    name: string;
    phone: string;
    role?: 'owner' | 'user';
    _id: string;
    status:string;
    date:Date;
}

export interface Table {
    name: string;
    minute_rate: string;
    created_by: String;
    _id: string
}

export interface History {
    created_by: string;
    total_frame: number;
    status: "paid" | "unpaid";
    total_bill: number;
    table_id: string;
    customer_name: string;
    customer_phone: string;
    received_amount: number;
    date?: any
    _id:string
}

export interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    tables: Table[] | null;
    setTables: Dispatch<React.SetStateAction<Table[] | null>>;
    resetTableId: string;
    setResetTableId: (value: string) => void;
    history: History[] | null,
    setHistory: Dispatch<React.SetStateAction<History[]|null>>
}

// Create the context
export const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => { },
    tables: null,
    setTables: () => { },
    resetTableId: "",
    setResetTableId: () => { },
    history: null,
    setHistory: () => { }
});

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tables, setTables] = useState<Table[] | null>([]);
    const [resetTableId, setResetTableId] = useState("")
    const [history, setHistory] = useState<History[] | null>([])
    return (
        <AppContext.Provider value={{ user, setUser, tables, setTables, resetTableId, setResetTableId, history, setHistory }}>
            {children}
        </AppContext.Provider>
    );
};


export default AppProvider;