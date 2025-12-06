import { useState, useEffect } from "react";
import {REST_API_PATH} from "../constants/constants";

export const useRoomMetadata = (roomId, token) => {
    const [room, setRoom] = useState(null);
    const [admins, setAdmins] = useState([]);
    console.log("room Metadata", room);

    useEffect(() => {
        if (!roomId) return;

        const fetchRoom = async () => {
            const resp = await fetch(`${REST_API_PATH}/room/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            console.log("useRoom data", data);
            if (resp.ok) setRoom(data);
        };

        const fetchAdmins = async () => {
            const resp = await fetch(`${REST_API_PATH}/room/${roomId}/admins`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const responseAdmins =  await resp.json();
            console.log("useRoom admins", responseAdmins);  // Use the already parsed data
            if (resp.ok) {
                setAdmins(responseAdmins);
            }
        };

        fetchRoom();
        fetchAdmins();
    }, [roomId, token]);

    return { room, admins };
};
