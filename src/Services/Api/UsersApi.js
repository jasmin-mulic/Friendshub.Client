import Api from "./Api";

const UsersApi = {
  myData: () => Api.get("/Users/me"),
  changeProfilePicture: () => Api.post("Users/change-profile-picture"),
  followRecommendations: () => Api.get("/Users/follow-recommendations"),
  toggleFollow: (id) => Api.post(`/Users/follow-user?foloweeId=${id}`),
  deleteUser: () => Api.get("delete-user"),
  getFollowers: () => Api.get("/Users/followers-list"),
  getFollowings: () => Api.get("/Users/following-list"),
  removeFollower: (followeeId) => Api.post(`Users/remove-follower/${followeeId}`),
};
export default UsersApi;
