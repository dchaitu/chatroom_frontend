import React, {useEffect, useState} from "react";
import {REST_API_PATH} from "../constants/constants";
const access_token = localStorage.getItem("access_token");

const RoomSideBar = (props) => {
const [rooms, setRooms] = useState([]);
const username = localStorage.getItem("username")

    useEffect(() => {
        const getUserRooms = async() => {
            const userRooms = await fetch(`${REST_API_PATH}/rooms/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const rooms = await userRooms.json();
            setRooms(rooms);
            console.log(`rooms of ${username}`, rooms);

        };
        getUserRooms();
    },[username]);



    return <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">

        {rooms.map((room) => (
            <div key={room.room_id}>{room.room_name}</div>
        ))}
        <div className="mt-auto">
            <p className={`text-sm ${props.connected ? "text-green-500" : "text-red-500"}`}>
                Status: {props.connected ? "Connected" : "Disconnected"}
            </p>
        </div>
    </div>;
}

export default RoomSideBar;