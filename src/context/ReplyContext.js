import { createContext, useContext, useState } from 'react';

const ReplyContext = createContext();

export const ReplyProvider = ({ children }) => {
    const [showReply, setShowReply] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);

    const toggleReply = (message = null) => {
        setShowReply(prev => !prev);
        if (message) {
            setCurrentMessage(message);
            console.log('Reply message', message);
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
