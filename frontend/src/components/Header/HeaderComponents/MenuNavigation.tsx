import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHeaderDatasets } from "../hooks";
import ArrowRightIcon from '@assets/icons/arrow-right.svg?react';

interface MenuNavigationProps {
    display: 'header' | 'burger',
    isHidden: boolean;
}

const MenuNavigation = ({ display, isHidden }: MenuNavigationProps) => {

    const {
        menuNavigation,
        currentOption,
        hoverOption,
        isDesktop,
        setIsDesktop,
        handleClick,
        handleMouseEnter,
        handleMouseLeave
    } = useHeaderDatasets();

    useEffect(()=> {
        const changeHover = window.matchMedia('(hover: hover) and (pointer: fine)');
        const handler = (matches: boolean) => setIsDesktop(matches);
        handler(changeHover.matches);
        changeHover.addEventListener('change', (e: MediaQueryListEvent) => handler(e.matches));
    }, []);

    return (
        <nav className="">
            <ul
                className={`
                    ${isHidden && 'hidden'}
                    ${display === 'header'
                        ? 'relative top-4.5 flex items-center justify-around gap-x-3 h-14.5'
                        : 'flex flex-col items-center gap-y-[20px]'
                    }
                `}
            >
                {
                    menuNavigation.map(element => (
                        <li key={element.id} onClick={(e) => handleClick(e, element.id)} onMouseEnter={isDesktop ? (e) => handleMouseEnter(e, element.id) : undefined} onMouseLeave={isDesktop ? handleMouseLeave : undefined}
                            className={`
                                        cursor-pointer
                                        ${display === 'header'
                                    ? 'relative h-full'
                                    : 'h-10'
                                }
                                    `}
                        >
                            <Link to={element.path}
                                className={`
                                            relative flex h-full
                                            ${display === 'header'
                                        ? ''
                                        : 'items-center'
                                    }
                                            after:content-['']
                                            after:absolute
                                            after:top-full
                                            after:left-[50%]
                                            after:translate-x-[-50%]
                                            after:translate-y-[-100%]
                                            ${currentOption === element.id ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                                            after:h-1
                                            after:duration-200
                                            after:bg-red  

                                            before:content-['']
                                            before:absolute
                                            before:top-[-18px]
                                            before:left-0
                                            before:w-full
                                            before:h-4.5
                                            before:bg-transparent

                                            before:hidden
                                            lg:before:block
                                        `}
                            >
                                <div className="text-[1rem] font-medium leading-normal tracking-normal uppercase">
                                    {element.title}
                                </div>
                            </Link>
                            {
                                display === 'header'
                                &&
                                element.subtitles
                                &&
                                <ul
                                    className={`
                                                absolute top-full left-0 w-57 duration-200 overflow-hidden 
                                                ${hoverOption === element.id ? 'h-41 z-2' : 'h-0 z-1'}
                                                flex flex-col items-start bg-transparent 
                                            `}
                                >
                                    {
                                        element.subtitles.map(subtitle => (
                                            <li key={subtitle.id} className="relative z-2 w-full h-10.25 border-b border-black2 text-[1rem] font-medium uppercase leading-normal tracking-normal header-link--option">
                                                <Link to={element.path + `/${subtitle.slug}`} className="h-full flex items-center justify-between gap-x-3 p-2 hover:opacity-70">
                                                    <div className="text-[0.75rem] font-normal leading-normal tracking-normal">
                                                        {subtitle.name}
                                                    </div>
                                                    <div className="header-arrow">
                                                        <ArrowRightIcon />
                                                    </div>
                                                </Link>
                                            </li>
                                        ))
                                    }
                                    <div className="absolute z-1 top-0 left-0 w-full h-full bg-black opacity-90">

                                    </div>
                                </ul>
                            }
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
};

export default MenuNavigation;