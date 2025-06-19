import AddTableComp from "@/components/AddTable";
import { useLocalSearchParams } from "expo-router";

export default function CreateTable () {
    const params = useLocalSearchParams();
    return(
        <AddTableComp {...params}/>
    )
}