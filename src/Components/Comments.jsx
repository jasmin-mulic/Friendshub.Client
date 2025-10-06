import React, { useEffect, useState } from 'react'

const Comments = ({prop}) => {
    const [comments, setComments] = useState([])
    useEffect(() =>{
        setComments(prop);
    },[])
  return (
    <div>
      
    </div>
  )
}
export default Comments
