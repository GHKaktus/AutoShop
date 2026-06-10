import React from "react";

interface BurgerButtonProps {
    isOpen: boolean;
    isHidden: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const BurgerButton = ( { isHidden, isOpen, onClick }: BurgerButtonProps) => {
    return (
        <button 
            id="burger-button" 
            className={`
                relative z-2 aspect-square h-[46px] md:h-[56px]
                p-[5px] md:p-[10px] flex flex-col items-center 
                justify-center gap-y-[15px] md:gap-y-[13px] 
                ${isHidden && 'hidden'}
            `} 
            onClick={onClick}
        >
            <span className={`w-full h-[2px] ${isOpen ? '-rotate-315 translate-y-[17px] md:translate-y-[15px]' : 'translate-y-0'} bg-white rounded-md duration-400 ${isOpen && '-rotate-45'}`}></span>
            <span className={`${isOpen ? 'w-0' : 'w-full'} h-[2px] relative top-0 left-full -translate-x-full bg-white rounded-md duration-400`}></span>
            <span className={`w-full h-[2px] ${isOpen ? 'rotate-315 -translate-y-[17px] md:-translate-y-[15px]' : 'translate-y-0'} bg-white rounded-md duration-400`}></span>
        </button>
    );
};

export default BurgerButton;