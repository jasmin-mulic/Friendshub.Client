import Api from "./Api";

const UsersApi = {

  myData: () => Api.get("/me"),
  updateMyInfo: (data) => Api.put("/me", data),

  followRecommendations: (page = 1) => 
    Api.get(`/me/follow-recommendations?page=${page}`),

  followUser: (id) => Api.post(`/users/${id}/follow`),
  unfollowUser: (id) => Api.delete(`/users/${id}/follow`),

  getFollowers: () => Api.get("/me/followers"),
  getFollowings: () => Api.get("/me/following"),

  userProfile: (username) => Api.get(`/profiles/${username}`)
};

export default UsersApi;
