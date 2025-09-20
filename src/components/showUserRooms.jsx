import React, {useEffect, useState} from 'react';
import GetRoom from "./getRoom";
import {Input, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import NavbarDefault from "./navBarDefault";
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import {JOIN_REQUEST, LOCAL_API_PATH, REST_API_PATH} from "../constants/constants";
import AdminInvites from "./adminInvites";

// Get messages in the current room
const ShowUserRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: '', roomId: '', description: '' });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [sentRequests, setSentRequests] = useState(new Set());



    const handleOpen = () => setOpen(!open);

    // Add this function to fetch rooms the user isn't in
    const fetchAvailableRooms = async () => {
        setLoadingRooms(true);
        try {
            const response = await fetch(`${REST_API_PATH}/room/available-rooms/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            if (response.ok) {
                const rooms = await response.json();
                console.log("Available rooms",rooms);
                setAvailableRooms(rooms || []);
                const pendingJoinRequest = await fetch(JOIN_REQUEST, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                if (pendingJoinRequest.ok) {
                    const pendingJoinData = await pendingJoinRequest.json();
                    console.log("pendingJoinData:- ", pendingJoinData);
                    setSentRequests(new Set(pendingJoinData));
                }

            } else {
                throw new Error('Failed to fetch available rooms');
            }
        } catch (error) {
            console.error('Error fetching available rooms:', error);
            alert('Failed to load available rooms');
        } finally {
            setLoadingRooms(false);
        }
    };

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
                const response = await fetch(`${LOCAL_API_PATH}/room/user/`, {
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

    }, [access_token]);

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
                    room_id: newRoom.roomId,
                    description: newRoom.description,
                })
            });
            const data = await response.json();
            console.log("Create Room Data is :-",data);

            if (response.ok) {

                // Refresh rooms list
                const roomsResponse = await fetch(`${REST_API_PATH}/room/user/`, {
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

    const handleJoinRoom = async (roomId) => {
        // e.preventDefault();
        console.log(`${username} requested to join room:- ${roomId}`);
        if (!roomId.trim()) return;

        try {
            const response = await fetch(`${REST_API_PATH}/room/${roomId}/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    username: username // The user requesting to join
                })
            });
            const data = await response.json();
            console.log("Joined Room Data:", data);
            if (response.ok) {
                alert('Your request to join the room has been sent to the admin for approval.');
                // fetchAvailableRooms();
                setSentRequests(prev => new Set([...prev, roomId]));

            } else {
                throw new Error(data.detail || 'Failed to send join request');
            }
            navigate(`/room/user/`);
        } catch (error) {
            console.error('Error joining room:', error);
            alert(error.message || 'Error sending join request');
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
                No of rooms:- {rooms.length}
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
                            <GetRoom rooms={rooms} />
                    </div>
                )}
                <AdminInvites/>

                <div className="mt-12 bg-white p-6 rounded-lg shadow">
                    <Typography>Not present above?</Typography>
                    <Typography variant="h4" className="mb-4">Join a Room</Typography>

                    <Dialog open={joinDialogOpen} handler={() => setJoinDialogOpen(!joinDialogOpen)}>
                        <DialogHeader>Available Rooms</DialogHeader>

                        <DialogBody>

                            {loadingRooms ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading rooms...</p>
                                </div>
                            ) : availableRooms.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No rooms available to join</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {availableRooms.map((room) => (
                                        <div key={room.room_id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <Typography variant="h6" className="text-gray-900">{room.room_name}</Typography>
                                                {room.description && (
                                                    <Typography variant="small" className="text-gray-600">
                                                        {room.description} - {room.room_id}
                                                    </Typography>
                                                )}
                                                <Typography variant="small" className="text-gray-500">
                                                    Admin: {room.admins.map((member, idx) => (
                                                    <span key={idx} className="text-gray-700 text-sm">
                                                        {member}{idx < room.admins.length - 1 && ', '}
                                                    </span>
                                                ))}

                                                </Typography>
                                            </div>
                                            <Button
                                                color="indigo"
                                                size="sm"
                                                onClick={() => handleJoinRoom(room.room_id)}
                                                disabled={sentRequests.has(room.room_id)}
                                            >
                                                {sentRequests.has(room.room_id) ? 'Already Sent' : 'Send Request'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => setJoinDialogOpen(false)}
                                className="mr-1"
                            >
                                <span>Close</span>
                            </Button>
                        </DialogFooter>
                    </Dialog>
                    <Button
                            type="submit"
                            color="indigo"
                            className="flex items-center gap-2"
                            onClick={() => {
                        setJoinDialogOpen(true);
                        fetchAvailableRooms();
                    }}

                        >
                            Join a New Room<ArrowRightIcon className="h-4 w-4" />
                        </Button>

                    {/*<form onSubmit={handleJoinRoom} className="flex gap-2">*/}
                    {/*    <div className="flex-1">*/}
                    {/*        <Input*/}
                    {/*            type="text"*/}
                    {/*            label="Enter Room ID"*/}
                    {/*            size="sm"*/}
                    {/*            className="pl-10"*/}
                    {/*            value={roomId}*/}
                    {/*            onChange={(e) => setRoomId(e.target.value)}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*    <Button */}
                    {/*        type="submit" */}
                    {/*        color="indigo"*/}
                    {/*        className="flex items-center gap-2"*/}
                    {/*        disabled={!roomId.trim()}*/}
                    {/*    >*/}
                    {/*        Join <ArrowRightIcon className="h-4 w-4" />*/}
                    {/*    </Button>*/}
                    {/*</form>*/}
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
                        <Input
                            label="Room Description"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
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