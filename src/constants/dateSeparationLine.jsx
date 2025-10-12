import React from "react";

const DateSeparationLine = (props) => {
    const {item, date} = props

    return (
        <div className="flex items-center my-4">
            {/* Left line */}
            <div className="flex-grow border-t border-blue-gray-300"></div>

            {/* line for datewise separation */}
            <span className="mx-2 text-xs text-muted-foreground whitespace-nowrap">
        {date}
        </span>

            {/* Right line */}
            <div className="flex-grow border-t border-blue-gray-300"></div>
        </div>

    )
}

export default DateSeparationLine