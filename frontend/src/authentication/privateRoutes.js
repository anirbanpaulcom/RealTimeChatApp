import { Outlet , Navigate } from "react-router-dom";

const PrivateRoutes = () => {
 
    const isAuthenticatedUser = localStorage.getItem('auth');

    return (isAuthenticatedUser ? <Outlet /> : <Navigate to="/" />);
    
}

export default PrivateRoutes;