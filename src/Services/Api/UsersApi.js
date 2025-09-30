import Api from "./Api";

const UsersApi = {
  myData: () => Api.get("/Users/me"),
  changeProfilePicture: () => Api.post("Users/change-profile-picture"),
  followRecommendations: () => Api.get("/Users/follow-recommendations"),
  followUser: (id) => Api.post(`/Users/follow-user?foloweeId=${id}`),
  deleteUser: () => Api.get("delete-user"),
};
export default UsersApi;
