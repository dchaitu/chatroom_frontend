import React from "react";

const DateSeparationLine = (props) => {
    const {item} = props

    return (
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
                {/* line for datewise separation */}
                <span className="bg-background px-2 text-muted-foreground">
                   {item.date}
                </span>
            </div>
        </div>

    )
}

export default DateSeparationLine