// src/context/UserContext.js
import { createContext, useContext, useState } from 'react';
import {REST_API_PATH} from "../constants/constants";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState({});

    const fetchUser = async (username) => {
        if (users[username]) return users[username];

        try {
            const response = await fetch(`${REST_API_PATH}/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const userData = await response.json();
            setUsers(prev => ({ ...prev, [username]: userData }));
            return userData;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    };

    return (
        <UserContext.Provider value={{ users, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);