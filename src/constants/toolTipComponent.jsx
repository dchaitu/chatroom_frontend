import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../components/ui/tooltip";


const ToolTipComponent = (props) => {
    const {displayText} = props
    return(
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="inline-block self-start">
                {props.children}
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="z-50  bg-black text-white border-0">
                <p className="px-2 py-1 text-sm">{displayText}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ToolTipComponent