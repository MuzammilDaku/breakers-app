import axios from "axios";

const baseUrl = "https://5f09-2400-adc7-907-6400-fe7d-e8b7-88e6-e7f4.ngrok-free.app"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 