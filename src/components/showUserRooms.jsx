import React, {useEffect, useState} from 'react';
import GetRoom from "./getRoom";
import {Input, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import NavbarDefault from "./navBarDefault";
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import {LOCAL_API_PATH, REST_API_PATH} from "../constants/constants";

// Get messages in the current room
const ShowUserRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: '', roomId: '' });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");



    const handleOpen = () => setOpen(!open);

    useEffect(()=> {
        const getUserName = async () => {
            if (access_token) {
                const response = await fetch(`${REST_API_PATH}/user`,{
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    },
                });
                if(response.ok) {
                    const data = await response.json();
                    console.log("user data", data);
                    setUsername(data.username);
                }
            }
        }
        getUserName();

    },[access_token]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${LOCAL_API_PATH}/rooms/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    },

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

    }, [navigate]);

    const handleCreateRoom = async () => {
        if (!newRoom.name.trim()) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${LOCAL_API_PATH}/create_room/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    room_name: newRoom.name,
                    room_id: newRoom.roomId
                })
            });
            const data = await response.json();
            console.log("Create Room Data is :-",data);

            if (response.ok) {

                // Refresh rooms list
                const roomsResponse = await fetch(`${REST_API_PATH}/rooms/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                const updatedRooms = await roomsResponse.json();
                console.log("Updated Room Data:", updatedRooms);
                setRooms(updatedRooms);
                setNewRoom({ name: '', roomId: '' });
                handleOpen();
            }
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        if (!roomId.trim()) return;

        try {
            const response = await fetch(`${REST_API_PATH}/join_room/?room_id=${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            // localStorage.setItem('room_id', roomId);
            const data = await response.json();
            console.log('Join response:', data);
            navigate(`/rooms/`);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarDefault username={username} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Typography variant="h1" className="text-2xl font-bold text-gray-900">Hi {username} !</Typography>
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="h2" className="text-xl font-bold text-gray-900">Your Chat Rooms</Typography>
                    <Button 
                        onClick={handleOpen}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create Room
                    </Button>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Typography variant="h4" color="gray" className="mb-4">No rooms yet</Typography>
                        <Typography color="gray" className="mb-6">Create your first room to start chatting!</Typography>
                        <Button 
                            onClick={handleOpen}
                            color="indigo" 
                            className="flex items-center gap-2 mx-auto"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Create Room
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <GetRoom key={room.room_id} room={room} username={username} />
                        ))}
                    </div>
                )}

                <div className="mt-12 bg-white p-6 rounded-lg shadow">
                    <Typography>Not present above?</Typography>
                    <Typography variant="h4" className="mb-4">Join a Room</Typography>
                    <form onSubmit={handleJoinRoom} className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                type="text"
                                label="Enter Room ID"
                                size="sm"
                                className="pl-10"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            color="indigo"
                            className="flex items-center gap-2"
                            disabled={!roomId.trim()}
                        >
                            Join <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Create New Room</DialogHeader>
                <DialogBody>
                    <div className="mb-4">
                        <Input
                            label="Room Name"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                            autoFocus
                            className="mb-4"
                        />
                        <Input
                            label="Room ID"
                            value={newRoom.roomId}
                            onChange={(e) => setNewRoom({...newRoom, roomId: e.target.value})}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="gradient" 
                        color="indigo" 
                        onClick={handleCreateRoom}
                        disabled={!newRoom.name.trim() || loading}
                    >
                        {loading ? 'Creating...' : 'Create Room'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
export default ShowUserRooms;