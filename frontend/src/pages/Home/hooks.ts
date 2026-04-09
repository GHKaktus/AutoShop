import { useRef, useState } from "react";
import welcomeImg1 from '@assets/images/home-component/welcome-section/welcome-bg-1.png';

export const useWelcomeDatasets = () => {
    const isDragging = useRef<boolean>(false);
    const intervalId = useRef<number | undefined>(undefined);
    const [currentIndex, setCurrentIndex] = useState<number>(1);
    const welcomeSlides = [
        { id: 1, img: welcomeImg1, title: "Надежные, качественные аккумуляторы", buttonText: "Перейти в каталог" },
        { id: 2, img: welcomeImg1, title: "Надежные, качественные аккумуляторы", buttonText: "Перейти в каталог" },
        { id: 3, img: welcomeImg1, title: "Надежные, качественные аккумуляторы", buttonText: "Перейти в каталог" },
        { id: 4, img: welcomeImg1, title: "Надежные, качественные аккумуляторы", buttonText: "Перейти в каталог" }
    ];

    function handleClickWelcomePaganation(event: React.MouseEvent<HTMLButtonElement>) {
        clearInterval(intervalId.current)
        intervalId.current = setInterval(() => {
            setCurrentIndex(prev => (prev === 4 ? 1 : prev + 1))
        }, 5000)
        setCurrentIndex(Number(event.currentTarget.getAttribute('data-index')))
    }

    function handleMouseDownWelcome(event: MouseEvent) {
        const target = event.target;
        if(target instanceof Element) {
            const welcome = target.closest('[data-welcome]');
            if(welcome) {
                event.preventDefault();
                isDragging.current = true;
            }
        }
    }

    function handleMouseMoveWelcome() {
        if (!isDragging.current) return;
        
    }

    function handleMouseUpWelcome() {
        isDragging.current = false;
    }

    return {
        isDragging,
        intervalId,
        currentIndex,
        setCurrentIndex,
        welcomeSlides,
        handleClickWelcomePaganation,
        handleMouseDownWelcome,
        handleMouseMoveWelcome,
        handleMouseUpWelcome
    }
}