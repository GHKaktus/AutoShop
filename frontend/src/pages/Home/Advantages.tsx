import MoneyIcon from '@assets/images/home-component/advantages-section/money.svg?react';
import HumanIcon from '@assets/images/home-component/advantages-section/human.svg?react';
import QualityIcon from '@assets/images/home-component/advantages-section/quality-mark.svg?react';
import MessageIcon from '@assets/images/home-component/advantages-section/message.svg?react';
import ArrowIcon from '@assets/images/home-component/advantages-section/arrow-right.svg?react';
import { Link } from 'react-router-dom';

const Advantages = () => {
    return (
        <section className='bg-black1'>
            <div className="container px-0">
                <ul className="text-white overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <li
                        className="
                        relative

                        before:content-['']
                        before:absolute
                        before:top-[-54px]
                        before:left-[-54px]
                        before:z-2
                        before:w-27
                        before:aspect-square
                        before:rotate-45
                        before:bg-black1

                        after:content-['']
                        after:absolute
                        after:top-[calc(100%+54px)]
                        after:left-[calc(100%+54px)]
                        after:translate-[-100%]
                        after:z-2
                        after:w-27
                        md:after:w-0
                        lg:after:w-27
                        after:aspect-square
                        after:rotate-45
                        after:bg-black1
                    "
                    >
                        <div className="relative z-3 h-68 flex flex-col items-center justify-center gap-y-6 px-7">
                            <MoneyIcon className='mb-1' />
                            <div className='text-center'>
                                <p>
                                    Наличный и безналичный расчет
                                </p>
                            </div>
                        </div>
                        <div className='absolute top-[50%] left-[50%] translate-[-50%] z-1 w-full h-full bg-red'></div>
                    </li>
                    <li
                        className="
                        relative

                        before:content-['']
                        before:absolute
                        before:top-[-54px]
                        before:left-[-54px]
                        before:z-2
                        before:w-0
                        2xl:before:w-27
                        before:aspect-square
                        before:rotate-45
                        before:bg-black1

                        after:content-['']
                        after:absolute
                        after:top-[calc(100%+54px)]
                        after:left-[calc(100%+54px)]
                        after:translate-[-100%]
                        after:z-2
                        after:w-0
                        2xl:after:w-27
                        after:aspect-square
                        after:rotate-45
                        after:bg-black1
                    "
                    >
                        <div className="relative z-3 h-68 flex flex-col items-center justify-center gap-y-6 px-7">
                            <HumanIcon className='mb-1' />
                            <div className='text-center'>
                                <p>
                                    Техническая помощь и консультация
                                </p>
                            </div>
                        </div>
                        <div className='absolute top-[50%] left-[50%] translate-[-50%] z-1 w-0 2xl:w-full h-full bg-red'></div>
                    </li>
                    <li
                        className="
                        relative

                        before:content-['']
                        before:absolute
                        before:top-[-54px]
                        before:left-[-54px]
                        before:z-2
                        before:w-27
                        md:before:w-0
                        lg:before:w-27
                        before:aspect-square
                        before:rotate-45
                        before:bg-black1

                        after:content-['']
                        after:absolute
                        after:top-[calc(100%+54px)]
                        after:left-[calc(100%+54px)]
                        after:translate-[-100%]
                        after:z-2
                        after:w-27
                        md:after:w-0
                        lg:after:w-27
                        after:aspect-square
                        after:rotate-45
                        after:bg-black1
                    "
                    >
                        <div className="relative z-3 h-68 flex flex-col items-center justify-center gap-y-6 px-7">
                            <QualityIcon className='mb-1' />
                            <div className='text-center'>
                                <p>
                                    Только качественная и проверенная продукция
                                </p>
                            </div>
                            <Link to="/catalog" className='duration-200 hover:opacity-80'>
                                <ArrowIcon />
                            </Link>
                        </div>
                        <div className='absolute top-[50%] left-[50%] translate-[-50%] z-1 w-full md:w-0 lg:w-full h-full bg-red'></div>
                    </li>
                    <li
                        className="
                        relative

                        before:content-['']
                        before:absolute
                        before:top-[-54px]
                        before:left-[-54px]
                        before:z-2
                        before:w-0
                        md:before:w-27
                        lg:before:w-0
                        before:aspect-square
                        before:rotate-45
                        before:bg-black1

                        after:content-['']
                        after:absolute
                        after:top-[calc(100%+54px)]
                        after:left-[calc(100%+54px)]
                        after:translate-[-100%]
                        after:z-2
                        after:w-0
                        md:after:w-27
                        lg:after:w-0
                        after:aspect-square
                        after:rotate-45
                        after:bg-black1
                    "
                    >
                        <div className="relative z-3 h-68 flex flex-col items-center justify-center gap-y-6 px-7">
                            <MessageIcon className='mb-1' />
                            <div className='text-center'>
                                <p>
                                    Мы всегда на связи с 9:00 до 18:00!
                                </p>
                            </div>
                            <Link to="/catalog" className='duration-200 hover:opacity-80'>
                                <ArrowIcon />
                            </Link>
                        </div>
                        <div className='absolute top-[50%] left-[50%] translate-[-50%] z-1 w-0 md:w-full lg:w-0 h-full bg-red'></div>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Advantages;