import { Link } from "react-router-dom";

interface ButtonProps {
    type: string;
    linkTo: string;
    children: any;
    paddingInline: string;
    paddingBlock: string;
    addClasses?: string;
}

const Button = ({ type, linkTo, children, paddingInline, paddingBlock, addClasses }: ButtonProps) => {

    const classStyles = `
        text-[0.875rem] sm:text-[1rem] font-bold leading-normal tracking-normal
        uppercase ${paddingInline} ${paddingBlock} ${addClasses ? `${addClasses}` : ''}
        border-4 border-red duration-400 hover:bg-red hover:rounded-md
    `

    return (
        <>
            {
                type === "link"
                    ? 
                    <Link to={linkTo} className={classStyles}>
                        {children}
                    </Link>
                    : 
                    <button className={classStyles} type="button">
                        {children}
                    </button>
            }
        </>
    );
};

export default Button;