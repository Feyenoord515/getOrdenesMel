import React, { useState } from "react";
import App from "./App";
import Login from "./Login";

const RootComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <React.StrictMode>
      {isAuthenticated ? (
        <App currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.StrictMode>
  );
};

export default RootComponent; 