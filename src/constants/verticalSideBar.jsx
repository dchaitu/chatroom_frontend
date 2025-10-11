import {RiHome7Fill} from "react-icons/ri";
import {TbDots, TbMessages} from "react-icons/tb";
import {MdBookmarkBorder, MdOutlineStickyNote2} from "react-icons/md";
import {BsBell} from "react-icons/bs";
import React, {useState} from "react";
import ToolTipComponent from "./toolTipComponent";
import {Button} from "../components/ui/button";
import AvatarWithInitials from "./AvatarWithInitials";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "../components/ui/sheet";
import UserProfile from "../components/userProfile";
import {Input} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";


const VerticalSideBar = () => {

    const username = localStorage.getItem("username");

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const goHome = () => {
        navigate('/');
    }


    return(
        // TODO:
        <div>

        <div id="v-side-bar" className="bg-gray-800 w-20">

        <div className="flex flex-col h-screen text-gray-300 text-xs font-semibold text-center">

            <div className="flex-1 flex-col">


                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700" onClick={goHome}>
                    <RiHome7Fill size={25} />
                    Home
                </div>
                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700">
                    <TbMessages size={25} />
                    DMs
                </div>
                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700">
                    <BsBell size={25}/>
                    Activity
                </div>
                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700">
                    <MdBookmarkBorder size={25}/>
                    Later
                </div>
                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700">
                    <MdOutlineStickyNote2 size={25} />
                    Canvases
                </div>
                <div className="justify-items-center p-2 cursor-pointer hover:bg-gray-700">
                    <TbDots size={25} />
                    More
                </div>
            </div>

            <div className="mt-auto p-2 flex justify-center">
                <ToolTipComponent displayText={username}>
                    <Button
                        variant="ghost"
                        className="h-auto p-2 rounded-full hover:bg-gray-700 self-start border-0 m-2"
                        onClick={toggleProfile}
                    >
                        <AvatarWithInitials username={username} className="w-8 h-8" />
                    </Button>
                </ToolTipComponent>
                <Sheet  open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <SheetContent className=" bg-white !max-w-none !w-[30%] sm:w-[20%]" side="right">
                        <SheetHeader className="border-b">
                            <div className="flex justify-between items-center">
                                <SheetTitle>Profile</SheetTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleProfile}
                                    className="h-8 w-8 p-0"
                                >
                                </Button>
                            </div>
                        </SheetHeader>
                        <div className="p-4 overflow-y-auto">
                            <UserProfile />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

        </div>


        </div>
        </div>
    )
}

export default VerticalSideBar;