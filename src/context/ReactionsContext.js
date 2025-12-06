import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {REST_API_PATH} from "../constants/constants";

const ReactionsContext = createContext({
    reactions: [],
    addReaction: () => console.warn('addReaction called outside of a ReactionsProvider'),
    removeReaction: () => console.warn('removeReaction called outside of a ReactionsProvider'),
    fetchReactions: async () => console.warn('fetchReactions called outside of a ReactionsProvider'),
});

export const useReactions = () => useContext(ReactionsContext);

export const ReactionsProvider = ({ children, roomId }) => {
    const [reactions, setReactions] = useState([]);
    const access_token = localStorage.getItem("access_token");

    const fetchReactions = useCallback(async () => {
        if (!roomId) return;
        try {
            const response = await fetch(`${REST_API_PATH}/reaction/${roomId}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setReactions(data);
            } else if (typeof data === 'object' && data !== null) {
                const arrayProperty = Object.values(data).find(value => Array.isArray(value));
                setReactions(arrayProperty || []);
            } else {
                setReactions([]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [roomId, access_token]);

    useEffect(() => {
        fetchReactions();
    }, [fetchReactions]);

    const addReaction = (newReaction) => {
        setReactions(prevReactions => [...prevReactions, newReaction]);
    };

    const removeReaction = (reactionToRemove) => {
        setReactions(prevReactions => prevReactions.filter(r => 
            !(r.username === reactionToRemove.username && r.reaction_type === reactionToRemove.reaction_type && r.message_id === reactionToRemove.message_id)
        ));
    };

    const value = {
        reactions,
        addReaction,
        removeReaction,
        fetchReactions,
    };

    return (
        <ReactionsContext.Provider value={value}>
            {children}
        </ReactionsContext.Provider>
    );
};
