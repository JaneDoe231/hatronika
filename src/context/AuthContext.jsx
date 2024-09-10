import
  React, {
  createContext,
  useContext,
} from "react";

import {
  DataStore,
  Utils
} from "common";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const isAuthenticated = Utils.isLoggedIn();

  const login = (token) => {
    DataStore.set("ACCESS_TOKEN", token);
  };

  const logout = () => {
    DataStore.clear("ACCESS_TOKEN");
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
