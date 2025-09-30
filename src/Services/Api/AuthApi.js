import Api from "./Api";

const AuthApi = {
    login : (data) => Api.post("/Auth/login", data),
    register : (data) => Api.post("/Auth/register", data),
    logout : () => Api.post("/Auth/logout"),
    refreshToken : () => Api.post("/Auth/refresh-token"),
}
export default AuthApi;