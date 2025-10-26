import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../Services/Stores//AuthStore'
const ProtectedRoute = ({children}) => {
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    
      if(isAuthenticated)
        return children;
      
      return (<Navigate to="/login" replace/>)
}

export default ProtectedRoute
