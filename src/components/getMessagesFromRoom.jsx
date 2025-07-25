import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

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

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Rooms</h2>
                    <button
                        onClick={handleCreateRoom}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        New Room
                    </button>
                </div>
                <select
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    className="w-full p-2 border rounded mb-4"
                >
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </select>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${message.sender === localStorage.getItem('username') ? 'text-right' : ''}`}
                        >
                            <div className={`inline-block p-3 rounded-lg ${message.sender === localStorage.getItem('username') ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                                <p className="font-semibold">{message.sender}</p>
                                <p>{message.content}</p>
                                <p className="text-xs opacity-75">
                                    {new Date(message.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GetMessagesFromRoom;