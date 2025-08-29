import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const RoomSideBar = ({ connected, currentRoomId }) => {
    const [rooms, setRooms] = useState([]);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username")
    console.log(`username ${username}`)
    const navigate = useNavigate();

    useEffect(() => {
        const getUserRooms = async() => {
            try {
                const userRooms = await fetch(`${REST_API_PATH}/rooms/`, {
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
        <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">{username}'s Rooms</h2>
            <div className="flex-1 overflow-y-auto">
                {rooms.map((room) => (
                    <div 
                        key={room.room_id}
                        onClick={() => handleRoomClick(room.room_id)}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                            currentRoomId === room.room_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                    >
                        <div className="font-medium">{room.room_name}</div>
                        <div className="text-xs text-gray-500">{room.users.length || 0} members</div>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t">
                <p className={`text-sm ${connected ? "text-green-500" : "text-red-500"}`}>
                    Status: {connected ? "Connected" : "Disconnected"}
                </p>
            </div>
        </div>
    );
};

export default RoomSideBar;