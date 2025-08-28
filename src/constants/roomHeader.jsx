import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu";


// import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@radix-ui/react-dropdown-menu";

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
import React from "react";
import {DropdownMenuShortcut} from "../components/ui/dropdown-menu";

const RoomHeader = ({ roomName, roomMembers, leaveRoom }) => {
    return (
        <div className="flex flex-col">
            {/* Top Header with Dropdown */}
            <div className="flex items-center gap-2 text-lg">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:outline-none">
                            {roomName}
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" sideOffset={8} className="w-60 mt-2 rounded-lg shadow-lg border border-gray-200 bg-white z-50 py-2">
                        <DropdownMenuGroup>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">View Info</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Notification Preferences</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Mute Room</DropdownMenuItem>
                        <DropdownMenuSeparator className="h-px bg-gray-200 my-1"/>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Add Members</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Manage Members</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Edit Room Header</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Edit Room Purpose</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Rename Room</DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Archive Room</DropdownMenuItem>
                            <DropdownMenuSeparator className="h-px bg-gray-200 my-1"/>
                            <DropdownMenuItem className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer" onClick={leaveRoom}>

                            <DropdownMenuShortcut><ArrowLeftIcon className="h-4 w-4"/></DropdownMenuShortcut>
                            Leave Room</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Sub Header Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-1 hover:text-gray-800">
                            <FaUser /> {roomMembers.length}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                        <h4 className="font-semibold mb-2">Members</h4>
                        <ul className="space-y-1">
                            {roomMembers.length > 0 ? (
                                roomMembers.map((member, idx) => (
                                    <li key={idx} className="text-gray-700 text-sm">
                                        {member}
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
                    Add a channel description
                </span>
            </div>
        </div>
    );
};

export default RoomHeader;

