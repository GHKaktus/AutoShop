import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Welcome from "@/components/Welcome/Welcome";
import type { WelcomeInformation } from "@/components/Welcome/types";
import ContactSection from "./ContactsSections/ContactSection";

const Contacts = () => {

    const welcomeInformation: WelcomeInformation = {
        title: "Будьте на связи с командой PROAuto",
        buttonText: "Перейти в каталог",
        imageClass: "bg-page-contacts-hero"
    }

    return (
        <>
            <Welcome information={welcomeInformation} />
            <BreadCrumbs />
            <ContactSection />
            {/* <QuestionSection /> */}
        </>
    );
};

export default Contacts;