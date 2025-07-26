import React, {useEffect, useState} from "react";
import {Button, Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const goToRooms = () => {
        navigate('/rooms');
    }

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
                console.error("Error fetching user profile:", error);
                setError("Failed to load user profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    },[username, navigate]);

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