import React, {useEffect, useState} from "react";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/outline";
import { FaUser } from "react-icons/fa";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import {REST_API_PATH} from "./constants";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Textarea,
    Typography
} from "@material-tailwind/react";

const RoomHeader = ({ room, leaveRoom,roomAdmins}) => {
    const {
        room_id = "",
        room_name = "",
        description = "",
        users = [],
        admins = []
    } = room;
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState(new Set());
    const [viewInfoDialogOpen, setViewInfoDialogOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [updatedRoomName, setUpdatedRoomName] = useState(null);
    const [updatedDescription, setUpdatedDescription] = useState(null);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    useEffect(() => {
        console.log(`${admins} admins`);
        if(roomAdmins.includes(username)) {
            setIsUserAdmin(true);
            console.log(`${username} is admin`);
        }
        else {
            console.log(`${username} is not admin`);
        }
    },[admins, username]);


    const fetchAvailableUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch(`${REST_API_PATH}/user-details/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                const allUsers = data.map((user) => user.username);
                console.log("data ", data);
                console.log("Available users ",allUsers);
                console.log("Room Members " ,users);

                const filtered = allUsers.filter((u) => !users.includes(u));
                console.log("filtered", filtered);
                setAvailableUsers(filtered);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleInvite = async (username) => {
        try {
        console.log("Invite user:", username, "roomId ", room_id);
        const response = await fetch(`${REST_API_PATH}/room/invite/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`

            },
            body: JSON.stringify({
                room_id: room_id,
                added_user: username,

            }), // adjust if room_id is separate
        });
        if (response.ok) {
            alert(`Invite sent to ${username}`);
            setInvitedUsers((prev) => new Set([...prev, username]));
        } else {
            alert("Failed to send invite");
        }
    } catch (err) {
        console.error("Invite error:", err);
        }
    };

    const handleUpdateRoom = async () => {
        await updateRoom(updatedRoomName, updatedDescription);
        setRoomDialogOpen(false); // Close dialog after update
        setUpdatedRoomName(null);
        setUpdatedDescription(null);
    };

    const checkAdmin = (username) => {
        if(roomAdmins.includes(username)) {
            return (
                <span className="ml-2 border bg-green-500 text-light-green-100 text-xs px-2 py-0.5 rounded">
                Group Admin
                </span>
            )
        }
        return null
    }
    const updateRoom = async (updatedRoomName,updatedDescription) => {
        try{
            let updatedBody;
            if(updatedRoomName !== null && updatedDescription !== null ) {
                updatedBody = JSON.stringify({
                    room_id: room_id,
                    description: updatedDescription,
                    room_name: updatedRoomName,
                })
            }
            else if(updatedRoomName === null && updatedDescription !== null ) {
                updatedBody = JSON.stringify({
                    room_id: room_id,
                    description: updatedDescription,
                })
            }
            else if(updatedRoomName !== null && updatedDescription === null ) {
                updatedBody = JSON.stringify({
                    room_id: room_id,
                    room_name: updatedRoomName,
                })
            }

            // if room name passed or description passed
            const response = await fetch(`${REST_API_PATH}/room/create`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: updatedBody
            })
        } catch (e) {
            console.error("Error updating room:", e)
        }
    }



    return (
        <div className="flex flex-col">
            {/* Top Header with Dropdown */}
            <div className="flex items-center gap-2 text-lg">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={!isUserAdmin}>
                        <button className="flex items-center gap-1 text-black font-semibold focus:outline-none text-[15px]">
                            {room_name}
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" sideOffset={8} className="w-60 mt-2 rounded-lg shadow-lg border border-gray-200 bg-white z-50 py-2">
                        <DropdownMenuGroup>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer" onClick={()=> {
                            setViewInfoDialogOpen(true);
                        }}>View Info</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Notification Preferences</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Mute Room</DropdownMenuItem>
                        <DropdownMenuSeparator className="h-px bg-gray-200 my-1"/>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                          onClick={() => {
                                              fetchAvailableUsers();
                                              setInviteDialogOpen(true);
                                          }}>Add Members</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Manage Members</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => {
                            updateRoom()
                            setRoomDialogOpen(true);
                        }}>Edit Room Header</DropdownMenuItem>
                        {/*<DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Edit Room Purpose</DropdownMenuItem>*/}
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer" onClick={()=> {
                            updateRoom()
                            setRoomDialogOpen(true);
                        }}>Rename Room</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Archive Room</DropdownMenuItem>
                            <DropdownMenuSeparator className="h-px bg-gray-200 my-1"/>
                            <DropdownMenuItem className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer flex items-center gap-2" onClick={leaveRoom}>
                                <ArrowLeftIcon className="h-4 w-4"/>
                                <span>Leave Room</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/*Edit Room Info*/}
            <Dialog open={roomDialogOpen} handler={setRoomDialogOpen}>
                <DialogHeader>Edit Room Details</DialogHeader>
                <DialogBody className="space-y-3">
                    <Input
                        label="Room Name"
                        defaultValue={room.room_name}
                        onChange={(e) => setUpdatedRoomName(e.target.value || null)}
                    />
                    <Textarea
                        label="Room Description"
                        defaultValue={room.description}
                        onChange={(e) => setUpdatedDescription(e.target.value || null)}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setRoomDialogOpen(false)}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="indigo"
                        onClick={handleUpdateRoom}
                        disabled={!updatedRoomName && !updatedDescription}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* View Room Info*/}
            <Dialog open={viewInfoDialogOpen} handler={setViewInfoDialogOpen}>
                <DialogHeader>About Room</DialogHeader>
                <DialogBody className="space-y-3">
                        <div key={room_id}>
                            <Typography variant="h2">{room_name}</Typography>
                            <Typography variant="h5">{description}</Typography>
                            <Typography variant="h6" className="mt-2">Users: {users.map((user)=> <span key={user}>{user} </span>)}</Typography>
                            <Typography variant="h6" className="mt-2">Admin: {admins.map((user)=> <span key={user}>{user} </span>)}</Typography>
                        </div>

                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setViewInfoDialogOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Invite Members Dialog */}
            <Dialog open={inviteDialogOpen} handler={setInviteDialogOpen}>
                <DialogHeader>Invite Members</DialogHeader>
                <DialogBody className="space-y-2">
                    {loadingUsers ? (
                        <p>Loading users...</p>
                    ) : availableUsers.length === 0 ? (
                        <p className="text-gray-500">No users available to invite</p>
                    ) : (
                        availableUsers.map((user) => (
                            <div
                                key={user}
                                className="flex justify-between items-center p-2 border rounded"
                            >
                                <Typography>{user}</Typography>
                                <Button
                                    size="sm"
                                    onClick={() => handleInvite(user)}
                                    color={invitedUsers.has(user) ? "gray" : "indigo"}
                                    disabled={invitedUsers.has(user)}
                                >
                                    {invitedUsers.has(user) ? "Invite Sent" : "Invite"}
                                </Button>
                            </div>
                        ))
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setInviteDialogOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Sub Header Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-1 hover:text-gray-800">
                            <FaUser /> {users.length}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 bg-gray-50 shadow-lg border rounded">
                        <h4 className="font-semibold mb-2">Members</h4>
                        <ul className="space-y-1">
                            {users.length > 0 ? (
                                users.map((member, idx) => (
                                    <li key={`${idx}-${member}`} className="text-gray-700 text-sm">
                                        {member} {checkAdmin(member)}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">No users present</li>
                            )}
                        </ul>
                    </PopoverContent>
                </Popover>

                <span className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-gray-400" /> 2
                </span>
                <span className="cursor-pointer text-gray-500 hover:text-gray-700">
                    {description}
                </span>
            </div>
        </div>
    );
};

export default RoomHeader;

