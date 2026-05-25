import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/context.jsx";
const ProtectedRoute = () => {
const {user, loading }= useAuth();

  //  Wait until auth check completes
  if (loading) {
    return <h1>Loading...</h1>; // or spinner
  }

  // check if not login then throw login page 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

    return <Outlet />;
};

export default ProtectedRoute;