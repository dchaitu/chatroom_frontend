import React, {useEffect, useState} from "react";
import {Button, Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // Username is now passed as a prop
    const accessToken = localStorage.getItem("access_token");

    const goToRooms = () => {
        navigate(`/rooms/`);
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${REST_API_PATH}/user/`, {
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
                setError("Failed to load user profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    },[navigate]);

    if (loading) {
        return <Typography>Loading user profile...</Typography>;
    }

    if (error) {
        return <Typography color="red">{error}</Typography>;
    }

    return (
        <div className="p-4">
            <Typography variant="h2" className="mb-4">User Details</Typography>
            {user ? (
                <div className="space-y-2">
                    <Typography variant="paragraph"><strong>Full Name:</strong> {user.fullname || 'Not provided'}</Typography>
                    <Typography variant="paragraph"><strong>Email:</strong> {user.email || 'Not provided'}</Typography>
                    <Typography variant="paragraph"><strong>Username:</strong> {user.username}</Typography>
                
                <Button onClick={goToRooms}>Go to Rooms</Button>
                </div>
            ) : (
                <Typography>No user data available</Typography>
            )}
        </div>
    )


}

export default UserProfile;