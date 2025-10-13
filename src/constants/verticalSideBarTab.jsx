import React from "react";

const VerticalSideBarTab = (props) => {
        const { icon, text, func, pic} = props
        // console.log("pic in VerticalSideBarTab", pic);

        return (
            <div className="pb-2 text-gray-300 my-2">
            <div className="justify-items-center p-2 cursor-pointer  hover:rounded-lg hover:bg-[rgba(240,243,252,0.25)] hover:mx-3" onClick={func}>
            {icon || pic}
            </div>
            {text}
            </div>
                    );

}
export default VerticalSideBarTab
