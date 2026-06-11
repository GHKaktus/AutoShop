import { Link } from "react-router-dom";
import React from 'react';

interface ButtonProps {
    type: 'submit' | 'button' | 'reset' | 'link';
    linkTo: string;
    children: any;
    paddingInline?: string;
    paddingBlock?: string;
    textClasses?: string;
    addClasses?: string;
    borderWidth?: string;
    isHover?: boolean | null | undefined; // true - custom hover effect described in addClasses, false/null/undefinded - default value
    title?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    linkState?: unknown; // данные, прокидываемые через router state при type === 'link'
}

const Button = ({ type, linkTo, children, paddingInline, paddingBlock, textClasses, addClasses, borderWidth, isHover, title, onClick, linkState }: ButtonProps) => {

    const classStyles = `
        ${textClasses ? `${textClasses}` : 'text-[0.875rem] sm:text-[1rem]'} font-bold leading-normal tracking-normal
        uppercase ${paddingInline} ${paddingBlock} ${addClasses && `${addClasses}`} cursor-pointer
        ${borderWidth ? `${borderWidth}` : 'border-4'} border-red duration-200 ${!isHover && 'hover:bg-red hover:rounded-md'}
    `

    return (
        <>
            {
                type === "link"
                    ? 
                    <Link to={linkTo} state={linkState} className={classStyles} title={title}>
                        {children}
                    </Link>
                    : 
                    <button type={type} className={classStyles} title={title} onClick={onClick}>
                        {children}
                    </button>
            }
        </>
    );
};

export default Button;