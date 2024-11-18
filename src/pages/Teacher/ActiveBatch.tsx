import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ActiveBatch() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userProfile = JSON.parse(localStorage.getItem("userInfo"));

    const fetchBatchDetails = async () => {
        if (!userProfile?.batchId) return; // Ensure batchId is available
        setLoading(true);
        const payload = { batchId: userProfile.batchId._id };
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, payload);
            setBatch(response.data.data[0]);
            setLoading(false);
        } catch (err) {
            setError('Error fetching batch details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatchDetails();
    }, []);

    useEffect(() => {
        fetchBatchDetails();

        // Re-fetch batch details when the page becomes visible again
        const handleVisibilityChange = () => {
            if (document.hidden === false) {
                fetchBatchDetails();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to handle quiz click
    const handleQuizClick = (quizId) => {
        navigate(`/quizSubmission?quizId=${quizId}`);
    };

    // Utility function to render a table
    const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
        <div className="mb-8">
            <div className={`grid grid-cols-${headers.length} bg-gray-2 dark:bg-meta-4 rounded-sm`}>
                {headers.map((header, index) => (
                    <div key={index} className="p-2.5 text-center font-medium uppercase">
                        {header}
                    </div>
                ))}
            </div>
            {rows.length ? (
                rows.map((row) => (
                    <div
                        key={keyExtractor(row)}
                        className={`grid grid-cols-${headers.length} items-center border-b border-stroke dark:border-strokedark`}
                    >
                        {renderRow(row)}
                    </div>
                ))
            ) : (
                <div className="text-center p-5">No data available.</div>
            )}
        </div>
    );

    return (

        <Panel>
            {loading && <Loader />}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {error && <p className="text-red-500">{error}</p>}
                {batch ? (
                    <>
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                            {/* Go Back Button */}
                            <button
                                onClick={() => navigate(-1)} // Navigate back to the previous page
                                className="text-blue-500 dark:text-blue-400 hover:underline mb-4"
                            >
                                &larr; Go Back
                            </button>

                            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batch Details</h4>

                            {/* Batch Number */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Number:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{batch.batchNumber || '-'}</span>
                                </div>
                            </div>

                            {/* Batch Session */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Session:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{batch.batchSession || '-'}</span>
                                </div>
                            </div>

                            {/* Batch Name */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Name:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{batch.batchName || '-'}</span>
                                </div>
                            </div>

                            {/* Total Students */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Total Students:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{batch.batchStudent?.length || 0}</span>
                                </div>
                            </div>

                            {/* Total Quizzes */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Total Quizzes:</span>
                                    <span className="text-gray-600 dark:text-gray-400">{batch.batchQuiz?.length || 0}</span>
                                </div>
                            </div>

                            {/* Status Indicators with Colors */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Ethics Evaluation:</span>
                                    <span className={`text-lg ${batch.ethics === "Passed" ? 'text-green-500' : 'text-red-500'} dark:text-green-400 ml-2`}>
                                        {batch.ethics ? batch.ethics : "Unknown"}
                                    </span>
                                </div>
                            </div>

                            {/* View Button */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">View Batch Details:</span>
                                    <a
                                        href="#"
                                        target="_blank"
                                        className="inline-flex items-center bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        View Details
                                        <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-eye ml-2">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
                            {/* Students Table */}
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Students</h4>

                                {renderTable({
                                    headers: ["Image", "Roll ID", "Name", "Email", "Contact"],
                                    rows: batch.batchStudent || [],
                                    keyExtractor: (student) => student._id,
                                    renderRow: (student) => [
                                        // Student Image
                                        <div className="p-2.5 text-center">
                                            {student.image ? (
                                                <img
                                                    src={student.image}
                                                    alt={student.name}
                                                    className="w-10 h-10 rounded-full mx-auto"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto"></div>
                                            )}
                                        </div>,
                                        // Student Roll ID
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {student.rollId || '-'}
                                        </div>,
                                        // Student Name
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {student.name || '-'}
                                        </div>,
                                        // Student Email
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {student.email || '-'}
                                        </div>,
                                        // Student Contact
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {student.contact?.[0] || '-'}
                                        </div>,
                                    ],
                                })}
                            </div>

                            {/* Quizzes Table */}
                            <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>

                                {renderTable({
                                    headers: [
                                        "Topic",
                                        "Quiz Name",
                                        "Description",
                                        "Issued Date",
                                        "Deadline",
                                        "Submissions",
                                        "Actions",
                                    ],
                                    rows: batch.batchQuiz || [],
                                    keyExtractor: (quiz) => quiz._id,
                                    renderRow: (quiz) => [
                                        // Quiz Topic
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizTopic || '-'}
                                        </div>,
                                        // Quiz Name
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizName || '-'}
                                        </div>,
                                        // Quiz Description
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizDescription || '-'}
                                        </div>,
                                        // Quiz Issued Date
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizIssued || '-'}
                                        </div>,
                                        // Quiz Deadline
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizDead || '-'}
                                        </div>,
                                        // Quiz Submissions
                                        <div className="p-2.5 text-center text-black dark:text-white">
                                            {quiz.quizSubmitters?.length || 0}
                                        </div>,
                                        // Action Button
                                        <div className="p-2.5 text-center">
                                            <button
                                                onClick={() => handleQuizClick(quiz._id)}
                                                className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600"
                                            >
                                                View Results
                                            </button>
                                        </div>,
                                    ],
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-5">No batch details available.</div>
                )}
            </div>
        </Panel>
    );
}

export default ActiveBatch;
