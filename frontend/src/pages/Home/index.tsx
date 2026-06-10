import Welcome from "./Welcome";
import Advantages from "./Advantages";
import About from "./About";
import Catalog from "./Catalog";

const index = () => {
    return (
        <>
            <h1 className="visually-hidden">
                PROAuto - интернет-магазин автотоваров: аккумуляторы, аксессуары, расходники и многое другое. Все города России.
            </h1>
            <Welcome />
            <Advantages />
            <Catalog />
            <About />
        </>
    );
};

export default index;