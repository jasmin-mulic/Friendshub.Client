import { create } from "zustand";

export const useUserDataStore  = create((set) => ({
    displayUsername : "",
    profileImgUrl : "",
    followersCount : 0,
    followingCount : 0,
    postCount : 0,

  setUserData: (userData) =>
    set(() => ({
      displayUsername: userData.displayUsername,
      profileImgUrl: userData.profileImgUrl,
      followersCount: userData.followersCount,
      followingCount: userData.followingCount,
      postCount : userData.postCount
    })),
      setFollowingCount: () =>
    set((state) => ({
      followingCount: state.followingCount+=1,
    })),
    setPostCount : () =>
      set((state) =>({
        postCount : state.postCount+=1
      })),
      resetUserData: () =>
        set((state) =>({
      displayUsername: "",
      profileImgUrl: "",
      followersCount: 0,
      followingCount: 0,
      postCount : 0
        }))

}));