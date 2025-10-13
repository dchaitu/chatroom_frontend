import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_PATH } from "../constants/constants";
import { Menu } from "@headlessui/react";
import {IoCaretDownSharp} from "react-icons/io5";

const RoomSideBar = ({ connected, currentRoomId }) => {
    const [rooms, setRooms] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isRoomsOpen, setIsRoomsOpen] = useState(true);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    useEffect(() => {
        const getUserRooms = async () => {
            try {
                const userRooms = await fetch(`${REST_API_PATH}/room/user/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                const rooms = await userRooms.json();
                setRooms(rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        getUserRooms();
    }, [access_token]);

    const handleRoomClick = (roomId) => {
        if (roomId !== currentRoomId) {
            navigate(`/rooms/${roomId}/messages/`);
        }
    };

    const toggleRooms = () => {
        setIsRoomsOpen(!isRoomsOpen);
    };

    return (
        <div className="w-64 text-white  rounded-lg border  border-gray-700 flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 rounded-lg">
                <h1 className="text-lg font-bold text-indigo-800">{username}'s Rooms</h1>
            </div>


            {/* Channels Section */}
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <Menu as="div" className="relative flex-1">
                        <Menu.Button onClick={toggleRooms} className="flex items-center justify-start w-full text-left text-[#091861CC] hover:text-white font-semibold py-0.5 px-3 rounded-md hover:bg-indigo-100 transition-colors">

                            <IoCaretDownSharp className="w-4 h-4 mr-2" />
                            <span className="text-[15px]">Rooms</span>
                        </Menu.Button>
                        {isRoomsOpen && (
                            <Menu.Items static className="mt-2 space-y-1 p-2">
                                {rooms.map((room) => (
                                    <Menu.Item key={room.room_id}>
                                        {({ focus }) => (
                                            <div
                                                onClick={() => handleRoomClick(room.room_id)}
                                                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-[#091861CC] ${
                                                    currentRoomId === room.room_id
                                                        ? 'bg-[#1E328F] text-[#F1F3FC]'
                                                        : focus
                                                            ? 'bg-gray-100'
                                                            : ''
                                                }`}
                                            >
                                                <span className="text-sm"># {room.room_name}</span>
                                                <span className="text-xs text-gray-500">{room.users?.length || 0}</span>
                                            </div>
                                        )}
                                    </Menu.Item>
                                )

                                )}
                                <Menu.Item className="mt-2 space-y-1">
                                    {/*TODO : Move create room to the bar*/}
                                    <div>
                                    <span className="text-sm text-[#091861CC]">Add Rooms</span>
                                    </div>
                                </Menu.Item>
                            </Menu.Items>
                        )}
                    </Menu>
                    <button className="text-gray-500 hover:text-gray-700">

                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomSideBar;