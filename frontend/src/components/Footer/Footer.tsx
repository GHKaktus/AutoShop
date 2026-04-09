import { BASE_ROUTE, CATALOG_ROUTE } from "@/utils/consts";
import { Link } from "react-router-dom";
import type { ElementLinks } from "./types";
import Button from "@components/ui/Button";
import { type Category } from "@/store/categories";
import { useFooterDatasets } from "./hooks";

const Footer = () => {

    const { listLinks } = useFooterDatasets();

    return (
        <footer
            className="
                relative
                bg-black1 text-white pt-13.5 pb-17 
                after:content-[''] 
                after:absolute 
                after:top-0 
                after:left-0 
                after:w-full 
                after:h-full 
                after:z-1 
                after:[background:url('/src/assets/images/global-components/footer-bg.png')_center/cover_no-repeat]
            "
        >
            <h2 className="visually-hidden">Дополнительная информация и контакты компании</h2>
            <div className="container relative z-2 grid grid-cols-1 grid-rows-auto md:grid-cols-2 md:grid-rows-2 lg:grid-cols-[210px_auto_240px] lg:grid-rows-1 gap-x-2 gap-y-10 bg-transparent">
                <div className="flex flex-col items-center md:items-start gap-y-12 md:col-start-1 md:row-start-2 lg:row-start-1">
                    <Link to={BASE_ROUTE}>
                        <img src="/src/assets/icons/logo.svg" alt="Логотип компании" className="duration-200 hover:opacity-80" />
                    </Link>
                    <div className="text-[1rem] opacity-[0.5] font-medium leading-normal tracking-normal">
                        <p>
                            © 2026 PRO Auto.
                        </p>
                        <p>
                            Все права защищены.
                        </p>
                    </div>
                </div>
                <ul className="flex flex-col items-center md:items-start md:flex-row gap-9.5 md:justify-around md:col-start-1 md:col-end-3 md:row-start-1 lg:col-start-2 lg:row-start-1">
                    {
                        listLinks.map((element: ElementLinks) => (
                            <li key={element.id}>
                                <h3 className="text-[1rem] uppercase font-medium leading-normal tracking-normal mb-5">
                                    {element.title}
                                </h3>
                                <ul className="flex flex-col items-start gap-y-4">
                                    {
                                        element.links.map((link: Category) => (
                                            <li key={link.id}>
                                                <Link to={CATALOG_ROUTE} className="text-[0.75rem] opacity-[0.5] uppercase font-medium leading-normal tracking-normal duration-200 hover:opacity-100">
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                        ))
                    }
                </ul>
                <div className="flex flex-col items-center md:items-end lg:items-end gap-y-5 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1">
                    <div className="mr-4">
                        <a href="tel:+79785757356"
                            className="
                                text-[1rem] font-medium leading-normal tracking-normal
                                flex items-center gap-x-2 mb-3 duration-200 hover:opacity-80
                                before:content-['']
                                before:block
                                before:w-5
                                before:aspect-square
                                before:[background:url('/src/assets/icons/tel-icon.svg')_center/100%_no-repeat]
                            "
                        >
                            +7 {'('}978{')'} 575 73 56
                        </a>
                        <a href="mailto:avantix5@gmail.com"
                            className="
                                text-[1rem] font-medium leading-normal tracking-normal
                                flex items-center gap-x-2 duration-200 hover:opacity-80
                                before:content-['']
                                before:block
                                before:w-5
                                before:aspect-square
                                before:[background:url('/src/assets/icons/email-icon.svg')_center/100%_no-repeat]
                            "
                        >
                            avantix5@gmail.com
                        </a>
                    </div>
                    <Button type="link" linkTo={CATALOG_ROUTE} paddingInline="px-3 md:px-5" paddingBlock="py-3">
                        Заказать звонок
                    </Button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;