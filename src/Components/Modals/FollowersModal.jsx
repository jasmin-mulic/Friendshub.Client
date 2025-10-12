import  { useEffect, useState } from 'react'
import noProfilePic from "../../assets/noProfilePic.jpg"
import UsersApi from '../../Services/Api/UsersApi'
const FollowerModal = () => {

  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(false)

  
  useEffect(() =>{
    const getFollowers = async () =>{
      setLoading(true)
      try {
        const response = await UsersApi.getFollowers();
        if(response.status == 200)
        {
          console.log(response.data.followers)
          setFollowers(response.data)
        }
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }
    getFollowers()
  },[])
  return (
    <div className='flex flex-col gap-3'>
      {followers.length > 0 && 
      followers.map((follower) => 
    <div className='flex w-full justify-between'>
      <img src={follower.ProfileImageUrl == "" ? noProfilePic : follower.ProfileImageUrl } />
      <p>{follower.username}</p>
    </div>)
      }

    </div>
  )
}

export default FollowerModal
