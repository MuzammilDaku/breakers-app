import Api from "./base";

export const AddTable = async(data:any) => {
    const res = await Api.post("/table",data);
    const json = res.data;
    return json;
}

export const GetTables = async(id:string) => {
    const res = await Api.get(`/table?user_id=${id}`);
    const json = res.data;
    return json;
}

export const AddCheckIn = async (data:any) => {
    const res = await Api.post("/check-in",data)
    const json = res.data;
    return json;
}


export const GetHistory = async(id:string) => {
    const res = await Api.get(`/check-in?user_id=${id}`);
    const json = res.data;
    return json;
}

export const updateTable = async(data:any) => {
    const res = await Api.put("/table",data);
    const json = res.data;
    return json;
}


export const DeleteTable = async(data:any) => {
    const res = await Api.delete(`/table?user_id=${data._id}`);
    const json = res.data;
    return json;
}