import React from "react";
import {HelpCircle, SearchIcon} from "lucide-react";

const RoomsSearchBar = () => {
    return (
        <div className="top-0 z-10 flex items-center justify-between p-2 h-[40px] bg-indigo-800">
            <div className="flex-1 max-w-2xl mx-auto px-5">
                <div className="relative">
                    <input
                        placeholder="Search room"
                        className="w-full px-3 py-2 pl-10 pr-4 text-sm text-white bg-[#F0F3FC40] rounded-md border-none outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
            </div>
            <div className="ml-4">
                <HelpCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
        </div>
    );
}

export default RoomsSearchBar;