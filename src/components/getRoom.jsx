import {
    Card,
    CardHeader,
    CardBody,
} from "@material-tailwind/react";

const GetRoom = ({ room }) => {
    const { room_id, room_name } = room;

    return (
        <div>
            <Card className="mt-6 w-96">
                <CardHeader title={room_id} />
                <CardBody>
                    {room_name}
                </CardBody>
            </Card>
        </div>
    );
}


export default GetRoom;