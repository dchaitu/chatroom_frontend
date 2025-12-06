import React, {useState, useEffect, useCallback, memo, useMemo} from 'react';

import {
    Card,
    CardBody, CardFooter, Button,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";
import {FaArrowRightToBracket} from "react-icons/fa6";

const GetRoom = ({ rooms }) => {
    const roomIds = useMemo(() => rooms.map(r => r.room_id), [rooms]);
    console.log("roomIds ", roomIds);
    const [unreadCount, setUnreadCount] = useState({});
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const goToRoomMessages = (roomId) => {
        console.log("Going to room ", roomId);
     navigate(`/rooms/${roomId}/messages`);
    }



    const fetchUnreadCount = useCallback(async (roomIds) => {
        if (!roomIds || roomIds.length === 0) return;
        const response = await fetch(`${REST_API_PATH}/room/unread-count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(roomIds)
        });
        const data = await response.json();
        console.log(`Messages count for ${roomIds}`,data);
        const countsMap = data.reduce((acc, item) => {
            acc[item.room_id] = item.count;
            return acc;
        }, {});
        setUnreadCount(countsMap);
    },[access_token]);

    useEffect(() => {
        if(roomIds.length>0) {
            fetchUnreadCount(roomIds)
        }
    }, [roomIds.join(","), fetchUnreadCount]);


    const showRoomDetails = (room) => (
        <Card className="mt-6 w-96" key={room.room_id}>
            <CardBody>

                <h4  color="blue-gray" className="mb-2">
                    Room id: {room.room_id}
                </h4>
                <h3>
                    {room.room_name}
                </h3>
                <p>{unreadCount[room.room_id]} unread messages</p>
                <p className="text-sm text-gray-600">
                    Admins: {room.admins && room.admins.map(admin => (typeof admin === 'string' ? admin : admin.username)).join(', ')}
                </p>

            </CardBody>
            <CardFooter className="pt-0">
                <Button size="sm" onClick={()=>goToRoomMessages(room.room_id)} variant="text" className="flex items-center gap-2">
                    Go to Room
                    <FaArrowRightToBracket/>
                </Button>
            </CardFooter>
        </Card>
    )


    return (<div id="user-rooms">
        {rooms.map((room) => (
            showRoomDetails(room)
        ))}
    </div>);
}


export default memo(GetRoom);