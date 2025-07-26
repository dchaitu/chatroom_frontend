import React, {useEffect, useState} from "react";
import {Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";

const UserProfile = () => {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
                const data = await response.json();
                console.log("user profile", data);
                setUser(data);

            }
            catch (error) {
                console.error(error);
            }
        };
        fetchUserProfile();
    },[username, navigate]);

    return (
        <div>
            <Typography variant="h1">User Details</Typography>
            {
                user && (
                    <Typography variant="body2" color="textSecondary">
                        FullName : {user.fullname}
                        Email : {user.email}
                        Username : {user.username}
                    </Typography>
                )
            }
        </div>
    )


}

export default UserProfile;