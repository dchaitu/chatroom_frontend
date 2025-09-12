import {useEffect, useState} from "react";
import {LOCAL_API_PATH} from "./constants";

const AvatarWithInitials = ({username}) => {
    // const initalizedUsername = username[0].toUpperCase();
    const [user, setUser] = useState({
        "username": "",
        "fullname": "",
        "email": "",
        "avatar": ""
    })
    const accessToken = localStorage.getItem("access_token");
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${LOCAL_API_PATH}/user-details/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,

                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                const data = await response.json();
                console.log("user profile", data);
                setUser(data);
            }
            catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchUserProfile();
    },[]);

    return (
        <div
            className="inline-flex items-center justify-center w-16 h-16 text-5xl text-white rounded-full">
            {/*/!*{initalizedUsername}*!/ 😁*/}
            {user.avatar}
        </div>
    )
}
export default AvatarWithInitials