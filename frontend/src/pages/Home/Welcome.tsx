import Button from "@/components/ui/Button";
import { useWelcomeDatasets } from './hooks';
import { useEffect } from 'react';

const Welcome = () => {

    const {
        intervalId,
        currentIndex,
        setCurrentIndex,
        welcomeSlides,
        handleClickWelcomePaganation,
        handleMouseDownWelcome,
        handleMouseMoveWelcome,
        handleMouseUpWelcome
    } = useWelcomeDatasets();

    useEffect(() => {

        intervalId.current = setInterval(() => {
            setCurrentIndex(prev => (prev === 4 ? 1 : prev + 1))
        }, 5000);

        window.addEventListener('mousedown', handleMouseDownWelcome);
        window.addEventListener('mousemove', handleMouseMoveWelcome);
        window.addEventListener('mouseup', handleMouseUpWelcome);

        return () => {
            clearInterval(intervalId.current);
            window.removeEventListener('mousedown', handleMouseDownWelcome);
            window.removeEventListener('mousemove', handleMouseMoveWelcome);
            window.removeEventListener('mouseup', handleMouseUpWelcome);
        }
    }, [])

    return (
        <>
            <h1 className="visually-hidden">
                PROAuto - интернет-магазин автотоваров: аккумуляторы, аксессуары, расходники и многое другое. Все города России.
            </h1>
            <section className="relative select-none" data-welcome>
                <ul className="w-full flex items-center">
                    {
                        welcomeSlides.map((element) => (
                            <li key={element.id}
                                className={`
                                    ${currentIndex === 1 ? 'translate-x-[0]' : ''}
                                    ${currentIndex === 2 ? 'translate-x-[-100%]' : ''}
                                    ${currentIndex === 3 ? 'translate-x-[-200%]' : ''}
                                    ${currentIndex === 4 ? 'translate-x-[-300%]' : ''}
                                    ${element.id === 1 ? 'bg-home-welcome--1' : ''}
                                    ${element.id === 2 ? 'bg-home-welcome--2' : ''}
                                    ${element.id === 3 ? 'bg-home-welcome--3' : ''}
                                    ${element.id === 4 ? 'bg-home-welcome--4' : ''}
                                    text-white w-full flex items-center shrink-0 
                                    bg-black bg-home-welcome duration-400
                                `}
                            >
                                <div className="container pt-60 pb-25 sm:pt-63.75 sm:pb-47.5 flex flex-col items-start justify-center gap-y-6 sm:gap-y-13">
                                    <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] font-bold leading-normal tracking-normal uppercase max-w-82 sm:max-w-100 md:max-w-146.5 w-full">
                                        {element.title}
                                    </h2>
                                    <Button type="link" linkTo='/catalog' paddingInline="px-3 sm:px-5" paddingBlock="py-3.5 sm:py-4.5">
                                        {element.buttonText}
                                    </Button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <ul className="absolute top-full left-[50%] translate-x-[-50%] translate-y-[-200%] flex items-center justify-center gap-x-3">
                    {
                        welcomeSlides.map((element) => (
                            <li key={element.id}>
                                <button
                                    className={`
                                        ${currentIndex === element.id ? 'paganation-is-active' : ''}
                                        w-14 md:w-28 h-1 bg-white rounded-md relative
                                        cursor-pointer duration-400 hover:bg-red 
                                        after:content-''
                                        after:absolute
                                        after:top-[50%]
                                        after:left-[50%]
                                        after:translate-[-50%]
                                        after:w-full
                                        after:h-8
                                        after:bg-transparent
                                    `}
                                    onClick={handleClickWelcomePaganation}
                                    aria-label={`Показать слайд ${element.id}`}
                                    data-index={element.id}
                                >

                                </button>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </>
    );
};

export default Welcome;