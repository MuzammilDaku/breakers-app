import axios from "axios";

export const baseUrl = "https://db8258ce638e.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api;