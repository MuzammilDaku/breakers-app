import axios from "axios";

export const baseUrl = "https://breakersapi.netlify.app/api"; 

const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api;