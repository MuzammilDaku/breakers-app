import GetTablesComp from "@/components/GetTables";
import { useAppStore } from "@/context/appStore";
import { router } from "expo-router";
import { useEffect } from "react";


export default function HomeScreen() {
  const {user} = useAppStore();
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

