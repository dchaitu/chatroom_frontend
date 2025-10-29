import {createContext, useContext, useEffect, useState} from "react";
import {REST_API_PATH} from "../constants/constants";

const AllUserContext = createContext();
export function useUsers() {
    return useContext(AllUserContext);
}

export const AllUserProvider = ({children}) => {
    const [usersMap, setUsersMap] = useState({});
    const access_token = localStorage.getItem("access_token");

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/user-details/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            });
            if (response.ok) {
                const allUsers = await response.json();
                const username_wise_users = {}
                allUsers.forEach((user) => {
                    username_wise_users[user.username] = user;
                })
                setUsersMap(username_wise_users);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [access_token]);


    return (
        <AllUserContext.Provider value={usersMap}>
            {children}
        </AllUserContext.Provider>
    );
};