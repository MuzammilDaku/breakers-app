import axios from "axios";

// Vercel Deployed API LINK
export const baseUrl = "https://breakers-api.vercel.app/api"; 

// Netlify Deployed API LINK
// export const baseUrl = "https://breakersapi.netlify.app/api"; 


const Api = axios.create({
    baseURL: baseUrl, 
    headers: {
        "Content-Type": "application/json",
    }});

export default Api;