import axios from "axios";

export const baseUrl = "https://d22968f7467a.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api;