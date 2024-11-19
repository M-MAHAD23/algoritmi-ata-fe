import React from 'react';

const RenderCards = ({ data }) => {
    return (
        <div className="space-y-6 p-4">
            {data.map((item, index) => {
                // Dynamically calculate grid columns based on the number of keys
                const gridColumns = `grid-cols-${Object.keys(item).length}`;
                return (
                    <div
                        key={index}
                        className="bg-black text-white p-6 rounded-lg shadow-md transition duration-300 hover:bg-gray-100 hover:text-black"
                    >
                        {/* Row with Keys */}
                        <div className={`grid ${gridColumns} gap-x-6 border-b pb-2 text-center`}>
                            {Object.entries(item).map(([key]) => (
                                <div
                                    key={key}
                                    className="font-semibold text-sm capitalize"
                                >
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </div>
                            ))}
                        </div>
                        {/* Row with Values */}
                        <div className={`grid ${gridColumns} gap-x-6 pt-2 text-center`}>
                            {Object.entries(item).map(([_, value]) => (
                                <div key={value} className="text-sm">
                                    {Array.isArray(value) ? value.length : value || '-'}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RenderCards;
