// Presentation.js
import React, { useEffect } from 'react';
import Slider from 'react-slick';
import HeroSection from './components/HeroSection';
import TeamSection from './components/TeamSection';
import ProblemStatement from './components/ProblemStatement';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProjectOverview from './components/ProjectOverview';
import AdminFeatures from './components/AdminFeatures';
import TeacherFeatures from './components/TeacherFeatures';
import StudentFeatures from './components/StudentFeatures';
import SystemFeatures from './components/SystemFeatures';

function NextArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-50"
            onClick={onClick}
        >
            <FaArrowRight size={30} className="text-indigo-600" />
        </div>
    );
}

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="absolute left-5 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-50"
            onClick={onClick}
        >
            <FaArrowLeft size={30} className="text-indigo-600" />
        </div>
    );
}

function Presentation() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    useEffect(() => {
        // Prevent page scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            // Re-enable scrolling when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="h-screen">
            {/* Fixed buttons at the top-right corner */}
            <div className="fixed top-5 right-5 flex gap-4 z-50">
                <button className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 transition-all duration-200 ease-in-out">Sign Up</button>
                <button className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 transition-all duration-200 ease-in-out">Sign In</button>
            </div>

            {/* Carousel with Full-Screen Slides and Hover-Triggered Arrows */}
            <div className="relative group h-screen">
                <Slider {...settings} className="h-full">
                    <div className="h-screen">
                        <HeroSection />
                    </div>
                    <div className="h-screen">
                        <TeamSection />
                    </div>
                    <div className="h-screen">
                        <ProblemStatement />
                    </div>
                    <div className="h-screen">
                        <ProjectOverview />
                    </div>
                    <div className="h-screen">
                        <AdminFeatures />
                    </div>
                    <div className="h-screen">
                        <TeacherFeatures />
                    </div>
                    <div className="h-screen">
                        <StudentFeatures />
                    </div>
                    <div className="h-screen">
                        <SystemFeatures />
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default Presentation;
