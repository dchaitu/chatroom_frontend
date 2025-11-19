import React from "react";
import { useTheme } from "../context/ThemeContext";

const VerticalSideBarTab = (props) => {
    const { icon, text, func, pic } = props;
    const { theme } = useTheme();

    // Get the text color from the current theme
    const textColor = {
        color: theme === 'gradient' ? 'black' : 'white'
    };

    return (
        <div className="pb-2 my-2" style={textColor}>
            <div 
                className="justify-items-center p-2 cursor-pointer hover:rounded-lg hover:bg-[rgba(240,243,252,0.25)] hover:mx-3" 
                onClick={func}
            >
                {icon || pic}
            </div>
            {text}
        </div>
    );
};

export default VerticalSideBarTab;
