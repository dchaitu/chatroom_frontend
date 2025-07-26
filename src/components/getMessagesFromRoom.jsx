import React, {useState, useEffect, useRef} from 'react';
import {Button, Input, Typography} from "@material-tailwind/react";
import {PaperAirplaneIcon, ArrowLeftIcon} from '@heroicons/react/24/solid';
import {useNavigate} from 'react-router-dom';

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const roomId = localStorage.getItem("room_id");
    const token = localStorage.getItem('token');

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch messages when component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
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
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [roomId, token]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:8000/send_message/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    room_id: roomId,
                    content: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                // Fetch messages again to update the list
                const updatedMessages = await fetch('http://localhost:8000/rooms/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({ room_id: roomId })
                });
                const data = await updatedMessages.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle leaving the room
    const handleLeaveRoom = () => {
        localStorage.removeItem('room_id');
        navigate('/rooms');
    };





    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
                <Button 
                    onClick={handleLeaveRoom} 
                    color="red" 
                    variant="outlined" 
                    className="flex items-center gap-2 mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Leave Room
                </Button>
                <div className="mt-auto">
                    <p className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.username === localStorage.getItem('username') ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md p-3 rounded-xl ${message.sender === localStorage.getItem('username') ? 'bg-indigo-500 text-white' : 'bg-white shadow-md'}`}>
                                    <p className="font-semibold text-sm">{message.username}</p>
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
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                            placeholder="Type your message..."
                            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{className: "min-w-0 flex-1"}}
                        />
                        <Button
                            type="submit"
                            size="md"
                            className="rounded-lg flex items-center justify-center"
                            disabled={!newMessage.trim()}
                        >
                            <PaperAirplaneIcon className="h-5 w-5"/>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetMessagesFromRoom;