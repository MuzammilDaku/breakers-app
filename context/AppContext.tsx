import React, { createContext, Dispatch, ReactNode, useState } from "react";

export interface User {
    name: string;
    phone: string;
    role?: 'owner' | 'user';
    _id: string;
}

export interface Table {
    name: string;
    minute_rate: string;
    created_by:String;
    _id:string
}

export interface AppContextType {
    user: User | null;
    setUser: (user: User ) => void;
    tables: Table[] | null;
    setTables: Dispatch<React.SetStateAction<Table[] | null>>;
    resetTableId:string;
    setResetTableId:(value:string)=>void;
}

// Create the context
export const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => {},
    tables: null,
    setTables: () => {},
    resetTableId:"",
    setResetTableId:()=>{}
});

interface AppProviderProps {
    children: ReactNode;
}

 const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [tables, setTables] = useState<Table[] | null>([]);
    const [resetTableId,setResetTableId] = useState("")

    return (
        <AppContext.Provider value={{ user, setUser ,tables,setTables,resetTableId,setResetTableId}}>
            {children}
        </AppContext.Provider>
    );
};


export default AppProvider;