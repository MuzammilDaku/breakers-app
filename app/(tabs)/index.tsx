import GetTablesComp from "@/components/GetTables";
import { AppContext } from "@/context/AppContext";
import { router } from "expo-router";
import { useContext, useEffect } from "react";


export default function HomeScreen() {
  const context = useContext(AppContext);
  const {user} = context;
  useEffect(()=>{
     if(!user) {
    router.navigate("/auth/login")
  }
  },[])
  return (
    // <AddTableComp />
    <GetTablesComp />
  );
}

