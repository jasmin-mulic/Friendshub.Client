import axios from "axios";
import { useAuthStore } from "../Stores/AuthStore"

const userApi = axios.create({
  baseURL: "https://localhost:44326/api/Users/",
  withCredentials: true 
});
userApi.interceptors.request.use(
    (config) =>{
        const token = useAuthStore.getState().token;
        if(token && token.trim() !== "")
            config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => Promise.reject(error)
)
export default userApi;