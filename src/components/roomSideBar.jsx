import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_PATH } from "../constants/constants";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";

const RoomSideBar = ({ connected, currentRoomId }) => {
    const [rooms, setRooms] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const [directMessages, setDirectMessages] = useState([
        { id: 1, name: "John Doe", unread: 3 },
        { id: 2, name: "Jane Smith", unread: 0 },
        { id: 3, name: "Team Alpha", unread: 0 }
    ]);
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

    return (
        <div className="w-64 bg-[rgba(131,56,138,1)] text-white border-r border-gray-200 flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-white">{username}'s Rooms</h1>
            </div>


            {/* Channels Section */}
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <Menu as="div" className="relative flex-1">
                        <Menu.Button className="flex items-center justify-between w-full text-left text-white font-semibold">
                            <span>Rooms</span>
                            <ChevronDownIcon className="w-4 h-4 text-white" />
                        </Menu.Button>
                        <Menu.Items className="mt-2 space-y-1">
                            {rooms.map((room) => (
                                <Menu.Item key={room.room_id}>
                                    {({ active }) => (
                                        <div 
                                            onClick={() => handleRoomClick(room.room_id)}
                                            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                                                currentRoomId === room.room_id 
                                                    ? 'bg-blue-50 text-[rgba(131,56,138,1)]' 
                                                    : active 
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
                                <span className="text-sm">Add Rooms</span>
                                </div>
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                    <button className="text-gray-500 hover:text-gray-700">

                    </button>
                </div>
            </div>

            {/* User Profile */}
            {/*<div className="p-4 border-t border-gray-200">*/}
            {/*    <div className="flex items-center space-x-3">*/}
            {/*        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">*/}
            {/*            {username?.charAt(0).toUpperCase()}*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <p className="text-sm font-medium text-gray-800">{username}</p>*/}
            {/*            <p className="text-xs text-gray-500">*/}
            {/*                {connected ? "Online" : "Offline"}*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default RoomSideBar;