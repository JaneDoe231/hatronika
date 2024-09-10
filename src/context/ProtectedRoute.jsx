import
  React, {
  useEffect
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "./AuthContext";

import {
  jwtDecode
} from "jwt-decode";

import {
  DataStore,
  Logger,
  Utils
} from "common";

const isTokenExpired = (token) => {
  try {

    const { exp } = jwtDecode(token);
    
    if (exp) {

      const currentTime = Date.now() / 1000;
      return exp < currentTime;
    }

    return true;
  } catch (error) {

    Logger.error("ProtectedRoute", "isTokenExpired", error);

    return true;
  }
};

const ProtectedRoute = ({
  permission,
  children
}) => {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleAuthentication = async () => {

    let token = DataStore.get("ACCESS_TOKEN");
    if (!token || isTokenExpired(token)) {

      // token = await AuthApi.requestRefreshToken();
      if(!token) {

        logout();
      }
    }
  }

  useEffect(() => {
    handleAuthentication();
  }, [navigate, logout]);

  const hasPermission = !permission || Utils.hasLoggedInUserPermission(permission);

  if (!Utils.isLoggedIn() || !hasPermission) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
