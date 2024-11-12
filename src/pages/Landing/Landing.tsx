import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";

const Landing: React.FC = () => {
    return (
        <>
            <div className="bg-[#0E0D15] pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden flex flex-col items-center">
                <Header />
                <div className="w-full max-w-6xl px-4">
                    <Hero />
                    <Benefits />
                    <Collaboration />
                    <Services />
                    {/* <Pricing /> */}
                    <Roadmap />
                    <Footer />
                </div>
            </div>

            <ButtonGradient />
        </>
    );
};

export default Landing;

