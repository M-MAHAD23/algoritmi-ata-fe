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
        loading ? (
            <Loader />
        ) : (
            <Panel>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    {error && <p className="text-red-500">{error}</p>}
                    {batch ? (
                        <>
                            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4'>
                                {/* Go Back Button */}
                                <button
                                    onClick={() => navigate(-1)} // Navigate back to the previous page
                                    className="text-blue-500 dark:text-blue-400 hover:underline mb-4"
                                >
                                    &larr; Go Back
                                </button>

                                {/* Batch Details */}
                                <div className="mb-6">
                                    <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Batch Details</h4>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Number:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{batch.batchNumber || '-'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Session:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{batch.batchSession || '-'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Batch Name:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{batch.batchName || '-'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Total Students:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{batch.batchStudent?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Total Quizzes:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{batch.batchQuiz?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Students Table */}
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

                            {/* Quizzes Table */}
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

                        </>
                    ) : (
                        <div className="text-center p-5">No batch details available.</div>
                    )}
                </div>
            </Panel>
        )
    );
}

export default ActiveBatch;
