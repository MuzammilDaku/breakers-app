import axios from "axios";

const baseUrl = "https://9b2c-2400-adc7-907-6400-d6b1-f9b2-df18-b3d1.ngrok-free.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 