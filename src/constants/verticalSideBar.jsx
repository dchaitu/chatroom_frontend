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
import {useNavigate} from "react-router-dom";
import "./verticalSideBar.css";
import VerticalSideBarTab from "./verticalSideBarTab";
import {useTheme} from "../context/ThemeContext";


const VerticalSideBar = () => {

    const username = localStorage.getItem("username");

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const goHome = () => {
        navigate('/room/user/');
    }


    return(
        // TODO:
        <div id="v-side-bar" className={` w-[70px]`}>

        <div className="flex flex-col text-gray-300 text-xs font-semibold text-center h-full">

            <div className="flex flex-1 flex-col text-[11px] pt-[8px]">

                <VerticalSideBarTab  icon={<RiHome7Fill size={25} />} text="Home" func={goHome}/>
                <VerticalSideBarTab icon={<TbMessages size={25} />} text="DMs" func={goHome}/>
                <VerticalSideBarTab icon={<BsBell size={25} />} text="Activity" func={goHome}/>
                <VerticalSideBarTab icon={<MdOutlineStickyNote2 size={25} />} text="Files" func={goHome}/>
                <VerticalSideBarTab icon={<MdBookmarkBorder size={25} />} text="Later" func={goHome}/>
                <VerticalSideBarTab icon={<TbDots size={25} />} text="More" func={goHome}/>
            </div>
                <div className="p-2">
                    <ToolTipComponent displayText={username}>
                        <div onClick={toggleProfile}>
                        <AvatarWithInitials imgClass="w-12 h-12" username={username} />
                        </div>
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
    )
}

export default VerticalSideBar;