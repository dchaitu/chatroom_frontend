import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import GetRoom from "./getRoom";
import {Typography} from "@material-tailwind/react";

// Get messages in the current room
const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const username = localStorage.getItem('username');
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch(`http://localhost:8000/rooms/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Data is :-",data);
                setRooms(data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();

    }, [username]);

    return (
        <div>
            <Typography variant="h1">{username}'s Rooms</Typography>
            <div className="card">
            {rooms.map((room) => (
                <GetRoom key={room.room_id} room={room} />
            ))}
            </div>
        </div>
    );
}
export default Rooms;