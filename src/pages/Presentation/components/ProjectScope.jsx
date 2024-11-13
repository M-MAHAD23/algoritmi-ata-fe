// ProjectScope.js
import React from 'react';

const ProjectScope = () => {
    const challenges = [
        "Managing assessment tasks and responding to student queries",
        "Providing personalized attention to each student",
        "Ensuring assignment quality and academic integrity is difficult",
        "Maintaining an engaging learning environment",
        "Addressing diverse learning styles and needs effectively",
        "Keeping up with evolving educational technology and tools",
        "Encouraging active participation from all students in virtual environments",
        "Balancing administrative duties with academic responsibilities",
    ];

    return (
        <section className="min-h-screen flex flex-col items-start justify-center py-16 px-8 bg-white text-left relative">
            <h2 className="text-3xl font-bold mb-6">Problem Statement</h2>
            <ul className="list-inside list-disc text-lg text-gray-700 space-y-4">
                {challenges.map((challenge, index) => (
                    <li
                        key={index}
                        className=""
                        style={{ animationDelay: `${index * 200}ms`, animationName: 'fadeIn' }}
                    >
                        {challenge}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ProjectScope;
