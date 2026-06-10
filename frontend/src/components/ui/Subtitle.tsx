interface SubtitleProps {
    children: any;
    color?: string;
    width?: string;
}

const Subtitle = ({ color, width, children }: SubtitleProps) => {
    return (
        <div className={`text-center text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] font-medium ${color} ${width} mb-[36px]`}>
            <p>
                {children}
            </p>
        </div>
    );
};

export default Subtitle;