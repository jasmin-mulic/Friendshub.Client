import axios from "axios";
import { useAuthStore } from "../Stores/AuthStore";

const postApi = axios.create({
    baseURL : "https://localhost:44326/api/Posts/",
    withCredentials : true
})

postApi.interceptors.request.use(
    (config) =>{
        const token = useAuthStore.getState().token;
        if(token && token.trim() !== "")
            config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => Promise.reject(error)
)
export default postApi;