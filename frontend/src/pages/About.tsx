import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Welcome from "@/components/Welcome/Welcome";

const About = () => {

    const welcomeInformation = {
        title: "ЛирилиЛариЛа",
        buttonText: "ЛирилиЛариЛа"
    }

    return (
        <>
            <Welcome information={welcomeInformation} />
            <BreadCrumbs />
            <section className="w-screen h-screen bg-amber-100 text-black uppercase text-[3rem] flex items-center justify-center">
                About
            </section>
        </>
    );
};

export default About;