import React from "react";
import {FaChevronDown} from "react-icons/fa";

const DateSeparationLine = (props) => {
    const {item, date} = props

    return (
        <div className="flex items-center my-4">
            {/* Left line */}
            <div className="flex-grow border-t border-gray-300"></div>

            {/* line for datewise separation */}
            <span className=" text-xs text-muted-foreground whitespace-nowrap">
                <button className="flex items-center border border-gray-300 rounded-xl px-4 py-0.5">{date}<FaChevronDown size={8} className="ml-2"/></button>
        </span>

            {/* Right line */}
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

    )
}

export default DateSeparationLine