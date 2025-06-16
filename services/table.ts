import Api from "./base";

export const AddTable = async(data:any) => {
    const res = await Api.post("/table",data);
    const json = res.data;
    return json;
}

export const GetTables = async() => {
    const res = await Api.get("/table");
    const json = res.data;
    return json;
}

export const AddCheckIn = async (data:any) => {
    const res = await Api.post("/check-in",data)
    const json = res.data;
    return json;
}


export const GetHistory = async() => {
    const res = await Api.get("/check-in");
    const json = res.data;
    return json;
}