import axios from "axios";

export const baseUrl = "https://ddec-2400-adc7-907-6400-81c2-c8a6-9b33-1294.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 