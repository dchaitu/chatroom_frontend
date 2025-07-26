import {
    Card,
    CardBody, Typography, CardFooter, Button,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";

const GetRoom = ({ room, username }) => {
    const { room_id, room_name } = room;
    const navigate = useNavigate();
    const goToRoomMessages = () => {
     localStorage.setItem("room_id", room_id);
     navigate(`/rooms/messages`);   
    }

    return (
            <Card className="mt-6 w-96">
                <CardBody>

                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Room id: {room_id}
                    </Typography>
                    <Typography>
                        {room_name}
                    </Typography>

                </CardBody>
                <CardFooter className="pt-0">
                        <Button size="sm" onClick={goToRoomMessages} variant="text" className="flex items-center gap-2">
                            Learn More
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