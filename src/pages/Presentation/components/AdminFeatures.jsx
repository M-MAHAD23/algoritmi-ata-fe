// AdminFeatures.js
import React from 'react';

const AdminFeatures = () => {
    const features = [
        { title: 'User Management', description: 'Manage all users, including students and teachers, efficiently.', imageUrl: 'https://example.com/admin-user-management.png' },
        { title: 'Reports & Analytics', description: 'Generate detailed reports and analyze system performance.', imageUrl: 'https://example.com/admin-reports.png' },
        { title: 'System Settings', description: 'Configure and manage system settings and preferences.', imageUrl: 'https://example.com/admin-settings.png' },
    ];

    return (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 bg-black text-center relative text-white">
            <h2 className="text-4xl font-bold mb-10">Admin Functional Features</h2>
            <div className="flex flex-wrap justify-center gap-10">
                {features.map((feature, index) => (
                    <div key={index} className="sm:w-72 md:w-80 lg:w-96 sm:p-6 md:p-8 bg-white text-black shadow-xl rounded-lg hover:scale-105 transform transition duration-300 min-h-[400px]">
                        <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                        <img
                            src={feature.imageUrl}
                            alt={feature.title}
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300"
                        />
                        <p className="text-lg text-gray-700">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdminFeatures;
