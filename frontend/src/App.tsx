import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const App = () => {
    return (
        <BrowserRouter>
            <div className="font-family-base overflow-x-hidden">
                <Header />
                <main className="">
                    <AppRouter />
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;