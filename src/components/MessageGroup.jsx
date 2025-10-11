import React from 'react';
import './MessageGroup.css';

const MessageGroup = ({ messages }) => {
    if (!messages || messages.length === 0) {
        return null;
    }
    console.log("messageGroup", messages);
    const { username, timestamp } = messages[0];
    const senderName = username;
    const avatarUrl = 'default-avatar.png'; // Use a default avatar if none is provided

    // Format the timestamp to be more readable
    const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="message-group">
            <div className="avatar-container">
                <img src={avatarUrl} alt={`${senderName}'s avatar`} className="avatar" />
            </div>
            <div className="message-content-container">
                <div className="message-sender">
                    <strong>{senderName}</strong>
                    <span className="message-timestamp">{formattedTimestamp}</span>
                </div>
                <div className="messages-list">
                    {messages.map((message, index) => (
                        <div key={index} className="message">
                            {message.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MessageGroup;
