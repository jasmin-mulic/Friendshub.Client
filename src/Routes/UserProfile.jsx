import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import UsersApi from '../Services/Api/UsersApi';
const UserProfile = () => {
  const {id} = useParams();
    useEffect( () =>{
      const getProfile = async() => {
        try {
          const response = await UsersApi.userProfile(id)
          console.log(response.data)
        } catch (error) {
          
        }
      }
      getProfile();
    },[])
 return (
    <div className='h-screen text-white'>
      <h1 className='text-2xl'>{id}</h1>
    </div>
  )
}

export default UserProfile
