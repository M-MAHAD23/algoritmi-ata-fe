import React from 'react';

// Define a generic table component
const DynamicTable = ({ title, headers, data }) => {
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{title}</h4>

            <div className="flex flex-col">
                {/* Dynamic Headers */}
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                    {headers.map((header, index) => (
                        <div key={index} className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                        </div>
                    ))}
                </div>

                {/* Dynamic Rows */}
                {data.map((row, rowIndex) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-5 ${rowIndex === data.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                        key={rowIndex}
                    >
                        {headers.map((header, colIndex) => (
                            <div key={colIndex} className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{row[header] || '-'}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicTable;
