import { create } from "zustand";

export const useUserDataStore = create((set) => ({
  username: null,
  profileImageUrl: null,
  emailAddress : null,
  followersCount: 0,
  followingCount: 0,
  postCount: 0,
  userId: null,
  privateAccount: null,


  setUserData: (userData) =>
    set(() => ({
      username: userData.username,
      profileImgUrl: userData.profileImageUrl,
      followersCount: userData.followersCount,
      followingCount: userData.followingCount,
      postCount: userData.postCount,
      userId: userData.userId,
      privateAccount : userData.privateAccount,
      emailAddress : userData.emailAddress,
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
