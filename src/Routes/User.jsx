import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
const User = () => {
    useEffect( async() =>{
        
    },[])
    const {username} = useParams();
 return (
    <div className='h-screen text-white'>
      <h1 className='text-2xl'>{username}</h1>
    </div>
  )
}

export default User
