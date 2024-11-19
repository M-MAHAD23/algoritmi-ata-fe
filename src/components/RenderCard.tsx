import React from 'react';

const RenderCard = ({ data }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data).map(([key, value], index) => (
                <div
                    key={index}
                    className="bg-black text-white p-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
                >
                    <h5 className="font-semibold text-lg mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')} {/* Format camelCase to readable text */}
                    </h5>
                    <p>{Array.isArray(value) ? value.length : value || '-'}</p>
                </div>
            ))}
        </div>
    );
};

export default RenderCard;
