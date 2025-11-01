import React, {useEffect, useState} from "react";
import {Button, Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {LOCAL_API_PATH} from "../constants/constants";
import {Separator} from "./ui/separator";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {IoMailOutline} from "react-icons/io5";
import EditUserProfile from "./editUserProfile";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();
    // Username is now passed as a prop
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const goToRooms = () => {
        navigate(`/room/user/`);
    }
    // TODO: Edit Profile Feature
    const handleUpdateProfile = (updatedUser) => {
        setUser(updatedUser);
        setIsEditOpen(false);
    };

    // const updateUserProfile = async () => {
    //     try{
    //         const response = await fetch(`${LOCAL_API_PATH}/user/`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${accessToken}`,
    //
    //             },
    //             body: JSON.stringify({
    //
    //
    //             })
    //         });
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch user profile");
    //         }
    //         const data = await response.json();
    //         console.log("user profile", data);
    //         setUser(data);
    //
    //     }catch(err){
    //         console.log("Error not updated properly",err);
    //     }
    // }
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

    useEffect(() => {

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
        <div className="flex flex-col">
            <div>
                {/*<div className="flex items-center justify-between mb-8">*/}
                {/*    <h1 className="text-2xl font-bold">Profile</h1>*/}
                {/*</div>*/}

                <div className="flex flex-col mb-8">
                    <Avatar className=" rounded-lg w-[75%] h-1/3 self-center  mb-4">
                        <AvatarImage src={user?.pic_url} alt={user?.fullname || username} />
                        <AvatarFallback className="text-xl">
                            {getInitials(user?.fullname || username || '')}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex justify-between mt-20">
                        <h2 className="text-xl font-semibold">{user?.fullname || username}</h2>
                        {/*<a href="#"><strong>Edit</strong></a>*/}
                        <Button variant="outlined"
                                className="border-0 text-blue-600 hover:text-blue-800 hover:bg-transparent p-2"
                                onClick={() => setIsEditOpen(true)}>
                            Edit
                        </Button>
                    </div>
                </div>
                <div className="w-full">
                    <Separator className="bg-gray-400 h-[2px]" />
                </div>
                <div className="space-y-6">
                    <div className="py-2">
                        <div className="flex justify-between">
                        <h3 className="text-black-500 text-lg font-bold mb-2">Contact Information</h3>
                            <Button variant="outlined"
                                    className="border-0 text-blue-600 hover:text-blue-800 hover:bg-transparent p-2"
                                    onClick={() => setIsEditOpen(true)}>
                                Edit
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <IoMailOutline className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email address</p>
                                    <a href="#">{user?.email || 'Not provided'}</a>
                                </div>
                            </div>
                            <div className="w-full">
                                <Separator className="bg-gray-400 h-[2px]" />
                                {/* gray color, 2px thick */}
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <p className="text-black-500 text-lg font-bold">About me</p>
                                    <Button variant="outlined"
                                            className="border-0 text-blue-600 hover:text-blue-800 hover:bg-transparent p-2"
                                            onClick={() => setIsEditOpen(true)}>
                                        Edit
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>

            </div>
                {
                    isEditOpen && (
                        <EditUserProfile user={user} onClose={() => setIsEditOpen(false)}
                                         onUserUpdated={handleUpdateProfile}
                        />
                    )
                }
            </div>
            <button className="self-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={goToRooms}>Go to Rooms</button>

        </div>
    )


}

export default UserProfile;