import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import ShowUserRooms from "./components/showUserRooms";
import GetMessagesFromRoom from "./components/getMessagesFromRoom";
import UserProfile from "./components/userProfile";
import InvalidRoute from "./components/invalidRoute";
import {userContext} from "./context/context";

function App() {
  const [username, setUsername] = useState('');

  // Function to update auth state from localStorage
  const updateAuthState = () => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    
    if (storedUsername && token) {
      setUsername(storedUsername);
      return true;
    }
    return false;
  };

  // Check auth state on mount and when localStorage changes
  useEffect(() => {
    updateAuthState();
    
    // Listen for storage events to handle login/logout from other tabs
    const handleStorageChange = () => {
      updateAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  return (
    <userContext.Provider value={username}>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/" element={<Home />} />
            <Route
              path="/rooms/:username"
              element={<ShowUserRooms/>}
            />
            <Route 
              exact 
              path="/rooms/:username/:room_id/messages/"
              element={<GetMessagesFromRoom />}
            />
            <Route 
              exact 
              path="/user/:username"
              element={<UserProfile/>}
            />
            <Route path="*" element={<InvalidRoute />} />
          </Routes>
        </div>
      </Router>
    </userContext.Provider>
  );
}

export default App;
