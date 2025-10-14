import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_PATH } from "../constants/constants";
import { Menu } from "@headlessui/react";
import {IoCaretDownSharp} from "react-icons/io5";
import {PlusIcon} from "@heroicons/react/24/solid";
import {FaPlusSquare} from "react-icons/fa";
import {AiFillPlusSquare} from "react-icons/ai";

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
        <div className="w-[275px] h-full rounded-bl-lg  rounded-tl-lg  bg-gray-300 flex flex-col">
            {/* Header */}
            <div className="p-4">
                <h1 className="text-lg font-bold text-text-on-content">{username}</h1>
            </div>


            {/* Channels Section */}
            <div className="p-4 flex-1 rounded-bl-2xl">
                <div className="flex items-center justify-between mb-2 ">
                    <Menu as="div" className="relative flex-1">
                        <Menu.Button onClick={toggleRooms} className="flex items-center justify-start w-full text-left text-[#091861CC] hover:text-white font-semibold py-0.5 rounded-md hover:bg-indigo-100 transition-colors">

                            <IoCaretDownSharp className="w-4 h-4 mr-2" />
                            <span className="text-[15px]">Rooms</span>
                        </Menu.Button>
                        {isRoomsOpen && (
                            <Menu.Items static className="mt-2 space-y-1 py-2">
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
                                    <div className="flex items-center">
                                        <AiFillPlusSquare className="w-4 h-4 mr-2 mt-1 text-white"/>
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