import { createContext, useContext, useState } from 'react';

const ReplyContext = createContext();

export const ReplyProvider = ({ children }) => {
    const [showReply, setShowReply] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);

    const toggleReply = (message = null) => {
        if (message) {
            if (showReply && currentMessage && currentMessage.message_id === message.message_id) {
                setShowReply(false);
                setCurrentMessage(null);
            } else {
                setShowReply(true);
                setCurrentMessage(message);
            }
        } else {
            setShowReply(prev => !prev);
        }
    };
    const clearReply = () => {
        setShowReply(false);
        setCurrentMessage(null);

    }

    return (
        <ReplyContext.Provider value={{ showReply, toggleReply, currentMessage, clearReply }}>
            {children}
        </ReplyContext.Provider>
    );
};

export const useReply = () => {
    const context = useContext(ReplyContext);
    if (!context) {
        throw new Error('useReply must be used within a ReplyProvider');
    }
    return context;
};
