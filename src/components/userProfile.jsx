import React, {useEffect, useState} from "react";
import {Button, Typography} from "@material-tailwind/react";
import {useNavigate, useParams} from "react-router-dom";
import {LOCAL_API_PATH, REST_API_PATH} from "../constants/constants";

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
                const response = await fetch(`${LOCAL_API_PATH}/user/`, {
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
            <h2 className="text-3xl mb-4">User Details</h2>
            {user ? (
                <div className="space-y-2">
                    <p className="text-black"><strong>Full Name:</strong> {user.fullname || 'Not provided'}
                    </p>
                    <p className="text-black"><strong>Email:</strong> {user.email || 'Not provided'}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    {/*<button className="">*/}

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={goToRooms}>Go to Rooms</button>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    )


}

export default UserProfile;