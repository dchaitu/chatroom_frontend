import React, {useContext, useState, useEffect} from 'react';

import {
    Card,
    CardBody, CardFooter, Button,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const GetRoom = ({ room }) => {
    const { room_id, room_name } = room;
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const access_token = localStorage.getItem("access_token");
    const goToRoomMessages = () => {
     navigate(`/rooms/${room_id}/messages`);
    }

    const fetchUnreadCount = async (roomId) => {
        const response = await fetch(`${REST_API_PATH}/room/${roomId}/unread-count`, {
            headers: { "Authorization": `Bearer ${access_token}` }
        });
        const data = await response.json();
        console.log(`Messages count for ${roomId}`,data);
        return data.count;
    };

    useEffect(() => {
        const getUnreadCount = async () => {
            try{
                const count = await fetchUnreadCount(room_id);
                setUnreadCount(count)
            }catch(error){
                console.error("Error fetching unread messages ", error);
            }
        };
        if(room_id)
            getUnreadCount();
    }, [room_id]);


    return (
            <Card className="mt-6 w-96">
                <CardBody>

                    <h4  color="blue-gray" className="mb-2">
                        Room id: {room_id}
                    </h4>
                    <h3>
                        {room_name}
                    </h3>
                    <p>{unreadCount} unread messages</p>

                </CardBody>
                <CardFooter className="pt-0">
                        <Button size="sm" onClick={goToRoomMessages} variant="text" className="flex items-center gap-2">
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
    );
}


export default GetRoom;