import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "./home";
import CaptainHome from "./captainHome";

export const Wrapper = ({ locat }: { locat: any }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    user: { email: "", fullname: "", _id: "", status: "", vehicle_type: "" },
  });

  const checkToken = async (token: any) => {
    try {
      const response = await fetch(
        `https://uber-riding-app.onrender.com/${locat}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setUserData(data);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error, "error while checking token");
    }
  };

  useEffect(() => {
    console.log("Updated userData:", userData);
  }, [userData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found");
      navigate("/");
    } else {
      checkToken(token);
    }
  }, []); // Removed `navigate`

  if (!userData.user._id) {
    return <div>Loading...</div>; // Prevents passing empty data to Home
  }

  return locat === "users" ? (
    <Home userData={userData} />
  ) : locat === "captain" ? (
    <CaptainHome userData={userData} />
  ) : null;
};
