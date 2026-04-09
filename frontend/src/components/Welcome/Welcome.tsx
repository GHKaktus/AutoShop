import Button from "../ui/Button";
import type { ComponentProps } from "./types";

const Welcome = ({ information }: ComponentProps) => {
    return (
        <section>
            <div
                className={`
                    text-white w-full flex items-center shrink-0 
                    bg-black bg-home-welcome bg-home-welcome--1 duration-400
                `}
            >
                <div className="container pt-60 pb-25 sm:pt-63.75 sm:pb-47.5 flex flex-col items-start justify-center gap-y-6 sm:gap-y-13">
                    <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] font-bold leading-normal tracking-normal uppercase max-w-82 sm:max-w-100 md:max-w-146.5 w-full">
                        {information.title}
                    </h2>
                    <Button type="link" linkTo='/catalog' paddingInline="px-3 sm:px-5" paddingBlock="py-3.5 sm:py-4.5">
                        {information.buttonText}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Welcome;