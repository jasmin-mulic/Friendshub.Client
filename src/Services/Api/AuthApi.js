import axios from "axios";
import { useAuthStore } from "../Stores/AuthStore";

const AuthApi = axios.create({
  baseURL: "https://localhost:44326/api/Auth/",
  withCredentials: true, // šalje refresh token cookie
});
AuthApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
AuthApi.interceptors.response.use(
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

        useAuthStore.getState().login(newAccessToken);

        // ponovi originalni request
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return AuthApi(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default AuthApi;
