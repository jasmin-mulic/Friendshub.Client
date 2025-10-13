import { create } from "zustand";

export const useUserDataStore = create((set) => ({
  username: null,
  profileImgUrl: null,
  followersCount: 0,
  followingCount: 0,
  postCount: 0,
  userId: null,

  setUserData: (userData) =>
    set(() => ({
      username: userData.displayUsername,
      profileImgUrl: userData.profileImgUrl,
      followersCount: userData.followersCount,
      followingCount: userData.followingCount,
      postCount: userData.postCount,
      userId: userData.userId,
    })),

  setFollowingCount: (num) =>
    set((state) => ({
      followingCount: state.followingCount + num,
    })),

  setPostCount: (num) =>
    set((state) => ({
      postCount: state.postCount + num,
    })),

  resetUserData: () =>
    set(() => ({
      username: null,
      profileImgUrl: null,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
      userId: null,
    })),

  setUserId: (id) =>
    set(() => ({
      userId: id,
    })),
}));
