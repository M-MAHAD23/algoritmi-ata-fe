// HeroSection.js
import React from 'react';
import Typical from 'react-typical';

const HeroSection = () => {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center p-6 space-y-6 md:space-y-0">
            {/* Left Section with Logo, Title, and Description */}
            <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
                {/* College Logo */}
                <img
                    src="https://path-to-college-logo.png" // Replace with the actual URL
                    alt="College Logo"
                    className="w-24 h-24 mb-4"
                />

                {/* Title with Typewriter Effect */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <Typical
                        steps={['Artificial Teaching Assistant', 3000, 'Enhancing Education with AI', 3000]}
                        loop={Infinity}
                        wrapper="span"
                    />
                </h1>

                {/* Project Details */}
                <p className="text-lg mb-6">Government Graduate College Township</p>
                <p className="text-lg">Team: Algoritmi</p>
                <p className="text-lg">Supervisor: Dr. Nabeel Sabir Khan</p>
            </div>

            {/* Right Section with Supervisor Image */}
            <div className="flex justify-center mt-6 md:mt-0">
                <img
                    src="https://path-to-supervisor-image.png" // Replace with the actual URL
                    alt="Supervisor Dr. Nabeel Sabir Khan"
                    className="w-60 h-60 rounded-full border-4 border-white shadow-lg"
                />
            </div>
        </section>
    );
};

export default HeroSection;
