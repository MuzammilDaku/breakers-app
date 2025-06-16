import axios from "axios";

const baseUrl = "https://breakers-api.vercel.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api; 