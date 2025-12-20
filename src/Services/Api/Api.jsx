import axios from "axios";
import { useAuthStore } from "../Stores/AuthStore";

let isRefreshing = false;
let refreshPromise = null;

const Api = axios.create({
  baseURL: "https://localhost:44326/api",
  withCredentials: true,
});

// ✅ Request interceptor - svaki request automatski dobija token
Api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(
            "https://localhost:44326/api/Auth/refresh-token",
            {},
            { withCredentials: true }
          )
          .then((res) => {
            const newToken = res.data;
            // ✅ update store
            useAuthStore.getState().login(newToken);
            // ✅ update axios default
            Api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
            return newToken;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newToken = await refreshPromise;
      originalRequest.headers["Authorization"] = "Bearer " + newToken;
      return Api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default Api;
