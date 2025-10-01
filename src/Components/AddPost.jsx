import React from 'react'
import noProfileImg from "../assets/noProfilePic.jpg"
import { useUserDataStore } from '../Services/Stores/useUserDataStore '

const AddPost = () => {
    const { displayUsername, profileImgUrl } = useUserDataStore();
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 bg-gray-400/30 flex items-center justify-center'>
        <div className='w-full sm:w-180 h-140 border-1 bg-white rounded-2xl'>
            <h2 className='text-xl text-center mt-2 border-b-1 border-gray-500/50 pb-10'>Create post</h2>
            <div className='flex items-center gap-2 mt-5'>
                <img className='w-15 rounded-full' src={profileImgUrl ? profileImgUrl : noProfileImg } />
                <span>{displayUsername}</span>
            </div>
        </div>
    </div>
  )
}

export default AddPost
