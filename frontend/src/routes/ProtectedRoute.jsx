import {useEffect, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {verifyTokenURL} from "./Url";
import { useGlobal } from "../context/GlobalStete";
function ProtectedRoute({children}) {
  const [verified, setVerified] = useState(null);
  const {current_user, setCurrentUser} = useGlobal();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setVerified(false);

    axios
      .get(verifyTokenURL, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then((res) => {
        setCurrentUser(res.data.user);
        setVerified(true);
      })
      .catch(() => setVerified(false));
  }, []); 
  if (verified === null) return null; // or loader
  if (verified === false) return <Navigate to="/" />; // or loader

  return children;
}

export default ProtectedRoute;
