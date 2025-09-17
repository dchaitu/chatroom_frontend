import React, {useEffect, useState} from "react";
import {avatar, Button, Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {LOCAL_API_PATH, REST_API_PATH} from "../constants/constants";
import {Separator} from "./ui/separator";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {IoMailOutline} from "react-icons/io5";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // Username is now passed as a prop
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const goToRooms = () => {
        navigate(`/room/user/`);
    }
    // TODO: Edit Profile Feature
    const updateUserProfile = async () => {
        try{
            const response = await fetch(`${LOCAL_API_PATH}/user/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,

                },
                body: JSON.stringify({
                    fullname: "Chaitanya Bharat Dokara",


                })
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }
            const data = await response.json();
            console.log("user profile", data);
            setUser(data);

        }catch(err){
            console.log("Error not updated properly",err);
        }
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
        return (<div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
        );
    }

    if (error) {
        return <Typography color="red">{error}</Typography>;
    }
    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="p-4">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>

                <div className="flex flex-col  mb-8">
                    <Avatar className="h-24 self-center w-24 mb-4">
                        <AvatarImage src={user?.avatar} alt={user?.fullname || username} />
                        <AvatarFallback className="text-xl">
                            {getInitials(user?.fullname || username || '')}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">{user?.fullname || username}</h2>
                        <a href="#"><strong>Edit</strong></a>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between">
                        <h3 className="text-black-500 text-sm font-medium mb-2">Contact Information</h3>
                        <a href="#"><strong>Edit</strong></a>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <IoMailOutline className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email address</p>
                                    <a href="#">{user?.email || 'Not provided'}</a>
                                </div>
                            </div>
                            <Separator className="my-4"/>
                            <div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-500">About me</p>
                                    <a href="#"><b>Edit</b></a>
                                </div>
                            </div>

                        </div>
                    </div>

            <Separator className="my-4 "/>

        </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={goToRooms}>Go to Rooms</button>

        </div>
    )


}

export default UserProfile;