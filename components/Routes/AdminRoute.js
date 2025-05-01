import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setOk(false); // Set ok to false in case of an error
      }
    };

    if (auth?.token) 
      authCheck();
    // } else {
    //   setOk(false); // If no token, immediately set ok to false
    // }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path=""/>;
}