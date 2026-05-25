import { useAuth } from "../../context/context.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/");
        toast.success("logout Sucessfully")
      } catch (err) {
        console.log(err.message);
      }
    };

    handleLogout();
  }, []); 

  return <div>Logging out </div>
};

export default Logout;