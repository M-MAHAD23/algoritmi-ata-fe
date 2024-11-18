import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function TeacherBatches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userProfile = JSON.parse(localStorage.getItem("userInfo"));

    const fetchBatches = async () => {
        if (!userProfile?._id) return; // Ensure userProfile and userId are available
        setLoading(true);
        const payload = { userId: userProfile._id };
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/getAllBatches`, payload);
            setBatches(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching batches');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    // Updated headers to include Total Students and Total Quizzes
    const headers = ['Batch Number', 'Batch Session', 'Batch Name', 'Total Students', 'Total Quizzes'];
    const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
            {/* Table Wrapper */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                {/* Table Header */}
                <div className={`grid grid-cols-${headers.length} sm:grid-cols-${headers.length} rounded-sm bg-gray-2 dark:bg-meta-4`}>
                    {headers.map((header, index) => (
                        <div key={index} className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                        </div>
                    ))}
                </div>

                {/* Table Rows */}
                {rows.length === 0 ? (
                    <div className="text-center text-lg p-5">No data available.</div>
                ) : (
                    rows.map((row, rowIndex) => (
                        <div
                            key={keyExtractor(row)}
                            className={`grid grid-cols-${headers.length} sm:grid-cols-${headers.length} ${rowIndex === rows.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                        >
                            {renderRow(row, rowIndex)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        loading ? (
            <Loader />
        ) : (
            <Panel>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batches</h4>
                    {/* // Usage example for rendering the batches table: */}
                    {renderTable({
                        headers: ['Batch Number', 'Session', 'Name', 'Students', 'Quizzes'],
                        rows: batches,
                        keyExtractor: (batch) => batch._id,
                        renderRow: (batch) => [
                            // Batch Number
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{batch.batchNumber || '-'}</p>
                            </div>,
                            // Session
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{batch.batchSession || '-'}</p>
                            </div>,
                            // Name
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{batch.batchName || '-'}</p>
                            </div>,
                            // Students
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{batch.batchStudent?.length || 0}</p>
                            </div>,
                            // Quizzes
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{batch.batchQuiz?.length || 0}</p>
                            </div>,
                        ],
                    })}

                </div>
            </Panel>
        )
    );
}

export default TeacherBatches;
