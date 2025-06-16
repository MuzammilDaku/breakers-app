import Api from "./base";

export const LoginUser = async(data:any) => {
    const res = await Api.post("/auth/login",data);
    const json = res.data;
    return json;
}