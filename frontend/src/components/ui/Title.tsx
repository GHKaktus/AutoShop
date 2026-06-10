interface TitleProps {
    children: any;
}

const Title = ({ children }: TitleProps) => {
    return (
        <h2 className={`
                text-[1.25rem] sm:text-[1.875rem] md:text-[2.25rem] font-bold leading-normal tracking-normal text-center
                relative max-w-40 sm:max-w-60 md:max-w-80 w-full uppercase mb-[32px]
                after:content-['']
                after:absolute
                after:top-full
                after:left-[50%]
                after:translate-x-[-50%]
                after:w-full
                after:h-0.5
                after:sm:h-1
                after:bg-red
            `}
        >
            {children}
        </h2>
    );
};

export default Title;