import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import type { WelcomeInformation } from "@/components/Welcome/types";
import Welcome from "@/components/Welcome/Welcome";
import licenseImg from "@assets/icons/license.svg";
import documentImg from "@assets/images/about-component/about-license-section/document.png";

const About = () => {

    interface license {
        id: number;
        image: string;
        title: string;
    }

    const welcomeInformation: WelcomeInformation = {
        title: "Команда высококлассных специалистов",
        buttonText: "Перейти в каталог",
        imageClass: "bg-page-about-hero"
    }

    const licenses: license[] = [
        {
            id: 1,
            image: licenseImg,
            title: 'Официальный дистрибьютор материалов марки ELF'
        },
        {
            id: 2,
            image: documentImg,
            title: 'Официальный дистрибьютор материалов марки ШЕЛЛ'
        },
        {
            id: 3,
            image: licenseImg,
            title: 'Официальный партнер Castrol'
        },
        {
            id: 4,
            image: licenseImg,
            title: 'Официальный дистрибьютор материалов марки Mobil'
        },
        {
            id: 5,
            image: licenseImg,
            title: 'Официальный дистрибьютор материалов марки LIQUI MOLY'
        },
        {
            id: 6,
            image: licenseImg,
            title: 'Официальный дистрибьютор материалов марки Motul'
        }
    ];

    return (
        <>
            <Welcome information={welcomeInformation} />
            <BreadCrumbs />
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
                        "
                    >
                        О компании
                    </h2>
                    <div className="flex items-center">
                        <div
                            className="
                                relative text-[1rem] font-medium leading-normal tracking-normal 
                                max-w-[936px] w-full p-[32px_32px_52px_32px] bg-transparent border-4 border-red
                            "
                        >
                            <div className="relative z-2">
                                <p className="mb-[16px]">
                                    Мы рады приветствовать вас на нашем сайте.
                                </p>
                                <p className="mb-[16px]">
                                    Компания «PROавто» - это надежные, качественные
                                    аккумуляторы в широком ассортименте, разнообразные
                                    в по форме и характеристикам, а также качественные
                                    масла и автохимия именитых брендов.
                                </p>
                                <p className="mb-[16px]">
                                    Сеть магазинов «PROавто» более 20-и лет занимается
                                    продажей автомобильных аккумуляторов, масел, расходных материалов,
                                    химией и аксессуаров. Мы зарекомендовали себя как надежная компания,
                                    специалисты которой всегда готовы проконсультировать по любому
                                    вопросу: от подбора автощёток, до рекомендаций по подбору аккумулятора
                                    для Вашего автомобиля. Мы дорожим своей репутацией и даём гарантию
                                    на весь ассортимент продукции, представленной на нашем сайте!
                                </p>
                                <p>
                                    Убедитесь в этом сами!
                                </p>
                            </div>
                            <div className="absolute top-0 left-0 z-1 w-full h-full opacity-60 bg-black1"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 z-1 w-full h-full opacity-60 bg-black1"></div>
            </section>
            <section className="py-[88px] bg-[#EDEDED]">
                <div className="container flex flex-col items-center gap-y-[32px]">
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
                        "
                    >
                        Лицензии
                    </h2>
                    <ul className="flex flex-wrap justify-center gap-x-[24px]">
                        {
                            licenses.map(el => (
                                <li key={el.id}>
                                    <div className="w-[360px] h-[466px] px-[24px] py-[38px_44px] flex flex-col items-center gap-y-[30px]">
                                        <div className="w-[168px]">
                                            <img src={el.image} alt="Лицензия" className="w-full h-auto" width={168} height={234} />
                                        </div>
                                        <p className="max-w-[252px] text-center font-medium text-[1.5rem]">
                                            {el.title}
                                        </p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </section>
        </>
    );
};

export default About;
