import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button, Input, Typography } from "@material-tailwind/react";
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { roomId } = useParams();
    const navigate = useNavigate();

    // Fetch user's rooms when component mounts
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/rooms/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
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

    // Connect to WebSocket and handle messages
    useEffect(() => {
        if (!selectedRoom) return;

        // Disconnect existing socket if any
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // Connect to WebSocket
        socketRef.current = io('http://localhost:8000', {
            auth: {
                token: localStorage.getItem('token')
            },
            query: { room_id: selectedRoom }
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        });

        // Listen for new messages
        socketRef.current.on('new_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Fetch previous messages
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/rooms/${selectedRoom}/messages/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Clean up on unmount or room change
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [selectedRoom]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Emit message through WebSocket
        socketRef.current.emit('send_message', {
            room_id: selectedRoom,
            content: newMessage
        });

        setNewMessage('');
    };

    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setSelectedRoom(roomId);
        navigate(`/room/${roomId}`);
    };

    const handleCreateRoom = () => {
        const roomName = prompt('Enter room name:');
        if (roomName) {
            // Implement room creation logic here
            console.log('Creating room:', roomName);
        }
    };

    const currentRoom = rooms.find(room => room.id === parseInt(selectedRoom));

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
                        onChange={handleRoomChange}
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
                    <Typography variant="h6" color="blue-gray">{currentRoom ? currentRoom.name : 'Chat'}</Typography>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === localStorage.getItem('username') ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-xl ${message.sender === localStorage.getItem('username') ? 'bg-indigo-500 text-white' : 'bg-white shadow-md'}`}>
                                    <p className="font-semibold text-sm">{message.sender}</p>
                                    <p className="text-md">{message.content}</p>
                                    <p className="text-xs opacity-75 mt-1 text-right">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{ className: "min-w-0 flex-1" }}
                        />
                        <Button type="submit" size="md" className="rounded-lg flex items-center justify-center">
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetMessagesFromRoom;