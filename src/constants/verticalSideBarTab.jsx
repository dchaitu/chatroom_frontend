import React from "react";

const VerticalSideBarTab = (props) => {
        const { icon, text, func, pic} = props
        // console.log("pic in VerticalSideBarTab", pic);

        return <div className="justify-items-center p-2 cursor-pointer hover:rounded-lg hover:bg-[rgba(240,243,252,0.25)] hover:mx-3" onClick={func}>
            {icon || pic}
            {text}
        </div>

}
export default VerticalSideBarTab
