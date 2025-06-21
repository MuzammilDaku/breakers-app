import axios from "axios";

export const baseUrl = "https://2220-2400-adc7-907-6400-7699-a9de-1e4b-6a9d.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 