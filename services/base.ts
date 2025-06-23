import axios from "axios";

export const baseUrl = "https://eeca-2400-adc7-907-6400-a56-6efd-6f29-7ecf.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 