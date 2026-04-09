import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Welcome from "@/components/Welcome/Welcome";

const Contacts = () => {

    const welcomeInformation = {
        title: "БомбБомБиниГузини",
        buttonText: "БомбБомБиниГузини"
    }

    return (
        <>
            <Welcome information={welcomeInformation} />
            <BreadCrumbs />
            <section className="w-screen h-screen bg-amber-100 text-black uppercase text-[3rem] flex items-center justify-center">
                Contacts
            </section>
        </>
    );
};

export default Contacts;