import { create } from "zustand";

export const useUserDataStore  = create((set) => ({
    displayUsername : "",
    profileImgUrl : "",
    followersCount : 0,
    followingCount : 0,

  setUserData: (userData) =>
    set(() => ({
      displayUsername: userData.displayUsername,
      profileImgUrl: userData.profileImgUrl,
      followersCount: userData.followersCount,
      followingCount: userData.followingCount,
    })),
      setFollowingCount: () =>
    set((state) => ({
      followingCount: state.followingCount+=1,
    })),
}));