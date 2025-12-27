import Api from "./Api";

const UsersApi = {

  myData: () => Api.get("/Users/me"),
  updateMyInfo: (data) => Api.put("Users/me", data),
  myPosts:(page) => Api.get(`Users/me/posts?page=${page}`),

  followRecommendations: (page = 1) => 
    Api.get(`Users/me/follow-recommendations?page=${page}`),

  followUser: (id) => Api.post(`/Users/${id}/follow`),
  unfollowUser: (id) => Api.delete(`/Users/${id}/follow`),

  getFollowers: () => Api.get("Users/me/followers"),
  getFollowings: () => Api.get("Users/me/followings"),

  userProfile: (username) => Api.get(`/profiles/${username}`),

  removeFollower: (followerId) => Api.delete(`Users/${followerId}/follows`)
};

export default UsersApi;
