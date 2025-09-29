import axios from "/node_modules/.vite/deps/axios.js?v=7cfbb1a6";
import { useAuthStore } from "/src/Services/Stores/AuthStore.js";

const usersApi = axios.create({
  baseURL: "https://localhost:44326/api/Users/",
  withCredentials: true, 
});

// request interceptor → dodaj access token
usersApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor → ako 401, pokušaj refresh
usersApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // pozovi refresh endpoint (cookie sadrži refresh token)
        const res = await axios.post(
          "https://localhost:44326/api/Auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data;
        localStorage.setItem("token", newAccessToken)

        // spremi ga u zustand store
        useAuthStore.getState().login(newAccessToken);

        // ponovi originalni request
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return usersApi(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default usersApi;
