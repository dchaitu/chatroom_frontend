import React from "react";
import {HelpCircle, SearchIcon} from "lucide-react";
import VerticalSideBar from "../constants/verticalSideBar";
import VerticalSideBarTab from "../constants/verticalSideBarTab";

const RoomsSearchBar = () => {
    return (
        <div className="top-0 z-10 flex items-center justify-between h-[50px] bg-indigo-800">
            <div className="flex-1 max-w-2xl mx-auto px-5 my-1">
                <div className="relative my-1">
                    <input
                        placeholder="Search rooms..."
                        className="w-full px-3 py-2 pr-10 text-sm text-white bg-[#F0F3FC40] rounded-md border-none outline-none placeholder-white focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-[#F0F3FC40]" />
                </div>
            </div>
            <div className="ml-4">
                <HelpCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                {/*<VerticalSideBarTab icon={<HelpCircle className="h-5 w-5 text-gray-400 hover:text-white hover:mx-0 cursor-pointer" />} />*/}
            </div>
        </div>
    );
}

export default RoomsSearchBar;