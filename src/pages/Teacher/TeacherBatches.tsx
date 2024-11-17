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

    return (
        loading ? (
            <Loader />
        ) : (
            <Panel>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batches</h4>

                    <div className="flex flex-col">
                        {/* Dynamic Headers */}
                        <div className="grid grid-cols-5 sm:grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                            {headers.map((header, index) => (
                                <div key={index} className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Rows */}
                        {batches.length === 0 ? (
                            <div className="text-center text-lg p-5">No batches available.</div>
                        ) : (
                            batches.map((batch, rowIndex) => (
                                <div
                                    key={batch._id}
                                    className={`grid grid-cols-5 sm:grid-cols-5 ${rowIndex === batches.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                                >
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{batch.batchNumber || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{batch.batchSession || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{batch.batchName || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{batch.batchStudent?.length || 0}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{batch.batchQuiz?.length || 0}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Panel>
        )
    );
}

export default TeacherBatches;
