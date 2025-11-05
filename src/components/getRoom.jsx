import React, {useState, useEffect, useCallback, memo} from 'react';

import {
    Card,
    CardBody, CardFooter, Button,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const GetRoom = ({ rooms }) => {
    const roomIds = rooms.map((room) => room.room_id);
    console.log("roomIds ", roomIds);
    const [unreadCount, setUnreadCount] = useState({});
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const goToRoomMessages = (room_id) => {
     navigate(`/rooms/${room_id}/messages`);
    }

    const fetchUnreadCount = useCallback(async (roomIds) => {
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
    }, [JSON.stringify(roomIds), fetchUnreadCount]);


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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                    </svg>
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