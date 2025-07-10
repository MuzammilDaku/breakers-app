import Api from "./base";

export const AddTable = async (data: any) => {
    const res = await Api.post("/table", data);
    const json = res.data;
    return json;
}

export const GetTables = async (id: string) => {
    const res = await Api.get(`/table?user_id=${id}`);
    const json = res.data;
    return json;
}

export const AddCheckIn = async (data: any) => {
    const res = await Api.post("/check-in", data)
    const json = res.data;
    return json;
}


export const GetHistory = async (id: any) => {
    const res = await Api.get(`/check-in?user_id=${id}`);
    const json = res.data;
    return json;
}

export const updateTable = async (data: any) => {
    const res = await Api.put("/table", data);
    const json = res.data;
    return json;
}


export const DeleteTable = async (data: any) => {
    const res = await Api.delete(`/table?user_id=${data._id}`);
    const json = res.data;
    return json;
};


export const AddInUseTable = async (data: any) => {
    const res = await Api.post("/table/in-use", data)
    const json = res.data;
    return json;
};

export const GetInUseTables = async (id: any) => {
    const res = await Api.get(`/table/in-use?user_id=${id}`);
    const json = res.data;
    return json;
};

export const AddGameHistory = async (data: any) => {
    const res = await Api.post("/table/game-history", data)
    const json = res.data;
    return json;
}

export const UpdateGameHistory = async (data: any) => {
    const res = await Api.put("/table/game-history", data)
    const json = res.data;
    return json;
}

export const AddCustomer = async (data: any) => {
    const res = await Api.post("/customer", data)
    const json = res.data;
    return json;
}

export const GetCustomers = async (id:any) => {
    const res = await Api.get(`/customer?user_id=${id}`)
    const json = res.data;
    return json;
}

export const GetGameHistory = async(id:any)=>{ 
    const res = await Api.get("/table/game-history?user_id=${id}")
    const json = res.data;
    return json;
}

export const DeleteInUseTable = async (id: any) => {
    const res = await Api.delete(`/table/in-use?id=${id}`);
    const json = res.data;
    return json;
};

