import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Welcome from "@/components/Welcome/Welcome";
import type { WelcomeInformation } from "@/components/Welcome/types";
import ContactSection from "./ContactsSections/ContactSection";
import QuestionSection from "./ContactsSections/QuestionSection";

const Contacts = () => {

    const welcomeInformation: WelcomeInformation = {
        title: "Будьте на связи с командой PROAuto",
        buttonText: "Перейти в каталог",
        image: "[background:url('/src/assets/images/contacts/welcome-section/car-women.png')_center/cover_no-repeat]"
    }

    return (
        <>
            <Welcome information={welcomeInformation} />
            <BreadCrumbs />
            <ContactSection />
            <QuestionSection />
        </>
    );
};

export default Contacts;