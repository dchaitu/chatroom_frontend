import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REST_API_PATH } from "../constants/constants";
import { Menu } from "@headlessui/react";
import {IoCaretDownSharp} from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import {FaPlus} from "react-icons/fa6";

const RoomSideBar = ({ connected, currentRoomId }) => {
    const [rooms, setRooms] = useState([]);
    const [isRoomsOpen, setIsRoomsOpen] = useState(true);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const { theme, setTheme } = useTheme();

    const navigate = useNavigate();

    const bgClass = theme ==="gradient"? "bg-gradient-to-r from-blue-200 to-red-200":"bg-background";

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
        <div className="w-[275px] h-full rounded-bl-lg  rounded-tl-lg  bg-white flex flex-col">
            {/* Header */}
            <div className="p-4">
                <h1 className="text-lg font-bold text-text-on-options">{username}</h1>
            </div>


            {/* Channels Section */}
            <div className="p-4 flex-1 rounded-bl-2xl">
                <div className="flex items-center justify-between mb-2 ">
                    <Menu as="div" className="relative flex-1">
                        <Menu.Button onClick={toggleRooms} className="flex items-center justify-start w-full text-left text-text-on-bg-options hover:text-white font-semibold py-0.5 rounded-md hover:bg-text-on-bg-options transition-colors">

                            <IoCaretDownSharp className="w-4 h-4 mr-2" />
                            <span className="text-[15px]">Rooms</span>
                        </Menu.Button>
                        {isRoomsOpen && (
                            <Menu.Items static className="mt-2 space-y-1 py-2 text-text-on-options">
                                {rooms.map((room) => (
                                    <Menu.Item key={room.room_id}>
                                        {({ focus }) => (
                                            <div
                                                onClick={() => handleRoomClick(room.room_id)}
                                                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                                                    currentRoomId === room.room_id
                                                        ? 'bg-text-on-bg-options text-[#F1F3FC]'
                                                        : focus
                                                            ? 'bg-gray-100 text-white'
                                                            : ''
                                                }`}
                                            >
                                                <span className="text-sm"># {room.room_name}</span>
                                                {/*<span className="text-xs text-white">{room.users?.length || 0}</span>*/}
                                            </div>
                                        )}
                                    </Menu.Item>
                                )

                                )}
                                <Menu.Item className="mt-2 space-y-1">
                                    {/*TODO : Move create room to the bar*/}
                                    <div className="flex items-center">
                                        <FaPlus className="w-4 h-4 mr-2 mt-1 text-black"/>
                                        <span className="text-sm ">Add Rooms</span>
                                    </div>
                                </Menu.Item>
                            </Menu.Items>
                        )}
                    </Menu>
                    <button className="text-gray-500 hover:text-gray-700">

                    </button>
                </div>
            </div>
            <div className="p-4 mt-auto border-t border-border">
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center justify-between w-full text-left text-text-on-content hover:text-white font-semibold py-2 px-4 rounded-md hover:bg-hover-on-background transition-colors">
                        <span>Change Theme</span>
                        <IoCaretDownSharp className="w-4 h-4" />
                    </Menu.Button>
                    <Menu.Items className="absolute bottom-full mb-2 w-full bg-content rounded-md shadow-lg">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => setTheme('blue')}
                                    className={`${ active ? 'bg-hover-on-background text-text-on-background' : 'text-text-on-content' } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                    Blue
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => setTheme('red')}
                                    className={`${ active ? 'bg-hover-on-background text-text-on-background' : 'text-text-on-content' } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                    Red
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => setTheme('green')}
                                    className={`${ active ? 'bg-hover-on-background text-text-on-background' : 'text-text-on-content' } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                    Green
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => setTheme('gradient')}
                                    className={`${ active ? `bg-hover-on-background ${bgClass} text-text-on-background` : 'text-text-on-content' } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                    Gradient
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
        </div>
    );
};

export default RoomSideBar;