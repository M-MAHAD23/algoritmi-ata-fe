// TeamSection.js
import React from 'react';

const TeamSection = () => {
    const teamMembers = [
        { name: 'Muhammad Ahad', role: 'UI / UX Designer', s3Url: 'https://s3.example.com/ahad.jpg' },
        { name: 'Muhammad Mahad', role: 'Team Lead Full Stack Developer', s3Url: 'https://s3.example.com/mahad.jpg' },
        { name: 'Muhammad Ahmad', role: 'Tester', s3Url: 'https://s3.example.com/ahmad.jpg' },
    ];

    return (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 bg-black text-center relative text-white">
            <h2 className="text-4xl font-bold mb-10">Our Team</h2>
            <div className="flex flex-wrap justify-center gap-10">
                {teamMembers.map((member, index) => (
                    <div key={index} className="sm:w-72 md:w-80 lg:w-96 sm:p-6 md:p-8 bg-white text-black shadow-xl rounded-lg hover:scale-105 transform transition duration-300 min-h-[400px]">
                        <img
                            src={member.s3Url}
                            alt={member.name}
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300"
                        />
                        <h3 className="text-2xl font-semibold mb-3">{member.name}</h3>
                        <p className="text-lg text-gray-700">{member.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
