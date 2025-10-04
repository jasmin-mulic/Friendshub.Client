import { create } from "zustand";

export const useUserDataStore = create((set) => ({
  displayUsername: null,
  profileImgUrl: null,
  followersCount: 0,
  followingCount: 0,
  postCount: 0,
  userId: null,

  setUserData: (userData) =>
    set(() => ({
      displayUsername: userData.displayUsername,
      profileImgUrl: userData.profileImgUrl,
      followersCount: userData.followersCount,
      followingCount: userData.followingCount,
      postCount: userData.postCount,
      userId: userData.userId,
    })),

  setFollowingCount: () =>
    set((state) => ({
      followingCount: state.followingCount + 1,
    })),

  setPostCount: () =>
    set((state) => ({
      postCount: state.postCount + 1,
    })),

  resetUserData: () =>
    set(() => ({
      displayUsername: "",
      profileImgUrl: "",
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      userId: "",
    })),

  setUserId: (id) =>
    set(() => ({
      userId: id,
    })),
}));
