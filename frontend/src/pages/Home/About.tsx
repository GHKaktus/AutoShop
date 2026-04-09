const About = () => {
    return (
        <section className="relative text-white bg-home-about bg-home-about--porsche pt-22 pb-25">
            <div className="container relative z-2 flex flex-col items-center gap-y-17">
                <h2 className="
                    text-[1.25rem] sm:text-[1.875rem] md:text-[2.25rem] font-bold leading-normal tracking-normal text-center
                    relative max-w-40 sm:max-w-60 md:max-w-80 w-full uppercase mb-2
                    after:content-['']
                    after:absolute
                    after:top-full
                    after:left-[50%]
                    after:translate-x-[-50%]
                    after:w-full
                    after:h-0.5
                    after:sm:h-1
                    after:bg-red
                ">
                    О компании
                </h2>
                <div className="flex flex-col items-center lg:flex-row lg:items-start gap-6">
                    <div className="max-w-90 w-full h-86.75 lg:shrink-0 [background:url('/src/assets/images/global-components/temp-image.png')_center/100%_no-repeat]">

                    </div>
                    <div className="
                        relative text-[1rem] font-medium leading-normal tracking-normal 
                        max-w-120 lg:max-w-300 w-full lg:h-63.75 border-4 border-red p-8 bg-transparent
                    ">
                        <div className="relative z-2">
                            <p>
                                Машина плохо заводится? Аккумулятор вас подводит? Не проблема! Вам в
                                «PRO Auto»! Мы подберём хороший, надёжный, а главное недорогой аккумулятор
                                именно для вашего авто! С 1997 года сеть магазинов «PRO Auto» занимается
                                продажей автомобильных аккумуляторов, масел, расходных материалов, химией и аксессуаров.
                            </p>
                        </div>
                        <div className="absolute top-0 left-0 z-1 w-full h-full opacity-60 bg-black1"></div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 z-1 w-full h-full opacity-60 bg-black1"></div>
        </section>
    );
};

export default About;