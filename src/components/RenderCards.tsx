import React from 'react';

const RenderCards = ({ data, onCardClick, selectedCardId }) => {
    return (
        <div className="space-y-6 p-4">
            {data.map((item) => {
                const { _id, ...displayData } = item;  // Destructure to exclude _id
                const isSelected = selectedCardId === _id;  // Check if the card is selected
                const gridColumns = `grid grid-cols-${Object.keys(displayData).length} gap-x-6`;

                return (
                    <div
                        key={_id}
                        onClick={() => onCardClick(_id)}  // Handle card click
                        className={`cursor-pointer p-6 rounded-lg shadow-md transition duration-300 
                            ${isSelected ? 'bg-gray-200 text-black' : 'bg-black text-white'}
                            hover:bg-gray-100 hover:text-black`}
                    >
                        {/* Row with Keys */}
                        <div className={`border-b pb-2 ${gridColumns} text-center`}>
                            {Object.entries(displayData).map(([key]) => (
                                <div key={key} className="font-semibold text-sm capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}  {/* Format keys */}
                                </div>
                            ))}
                        </div>
                        {/* Row with Values */}
                        <div className={`pt-2 ${gridColumns} text-center`}>
                            {Object.entries(displayData).map(([key, value]) => (
                                <div key={key} className="text-sm">
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
