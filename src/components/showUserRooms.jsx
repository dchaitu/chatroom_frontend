import React, {useEffect, useState} from 'react';
import GetRoom from "./getRoom";
import {Input, Typography} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import NavbarDefault from "./navBarDefault";

// Get messages in the current room
const ShowUserRooms = () => {
    const [rooms, setRooms] = useState([]);
    const username = localStorage.getItem('username');
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }
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

    }, [username, navigate]);

    const changeRoomToNewRoom = (e) => {
        e.preventDefault();
        navigate('')
    }

    return (
        <div>
            <NavbarDefault user={username} />
            <Typography variant="h1">{username}'s Rooms</Typography>
            <div className="card">
            {rooms.map((room) => (
                <GetRoom key={room.room_id} room={room} username={username} />
            ))}
            </div>
            <Typography variant="h2">Want to join a new room?</Typography>
            <form onSubmit={e => e.preventDefault()}>
            <Typography variant="paragraph" color="textSecondary">Enter Room Id <span className="relative">
                <Input
                    type="text"
                    label="Room Id"
                    size="lg"
                    className="pl-10"
                    value={roomId}
                    onChange={(e) => {
                        setRoomId(e.target.value)
                        localStorage.setItem('roomId', e.target.value)

                    }}
                />
                <Input type="submit" value="Join" />


            </span>
            </Typography>
            </form>

        </div>
    );
}
export default ShowUserRooms;