import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input, Typography} from "@material-tailwind/react";
import {PaperAirplaneIcon} from '@heroicons/react/24/solid';

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const roomId = localStorage.getItem("room_id");

    // Fetch user's rooms when component mounts
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/rooms/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        room_id: roomId
                    })
                });
                const data = await response.json();
                setRooms(data);

                // Select the room from URL params if available
                if (roomId) {
                    setSelectedRoom(roomId);
                } else if (data.length > 0) {
                    setSelectedRoom(data[0].id);
                    navigate(`/room/${data[0].id}`);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, [roomId, navigate]);


    const handleCreateRoom = () => {
        const roomName = prompt('Enter room name:');
        if (roomName) {
            // Implement room creation logic here
            console.log('Creating room:', roomName);
        }
    };


    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5" color="blue-gray">Rooms</Typography>
                    <Button onClick={handleCreateRoom} size="sm">New Room</Button>
                </div>
                <div className="relative w-full min-w-[200px]">
                    <select
                        value={selectedRoom}
                        // onChange={handleRoomChange}
                        className="w-full p-2.5 text-sm text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                    >
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-auto">
                    <p className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                    {/*<Typography variant="h6" color="blue-gray">{currentRoom ? currentRoom.name : 'Chat'}</Typography>*/}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === localStorage.getItem('username') ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md p-3 rounded-xl ${message.sender === localStorage.getItem('username') ? 'bg-indigo-500 text-white' : 'bg-white shadow-md'}`}>
                                    <p className="font-semibold text-sm">{message.sender}</p>
                                    <p className="text-md">{message.content}</p>
                                    <p className="text-xs opacity-75 mt-1 text-right">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                    <form className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{className: "min-w-0 flex-1"}}
                        />
                        <Button type="submit" size="md" className="rounded-lg flex items-center justify-center">
                            <PaperAirplaneIcon className="h-5 w-5"/>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetMessagesFromRoom;