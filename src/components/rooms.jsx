import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import GetRoom from "./getRoom";

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
            <h2>{username}'s Rooms</h2>
            {rooms.map((room) => (
                <GetRoom key={room.room_id} room={room} />
            ))}
        </div>
    );
}
export default Rooms;