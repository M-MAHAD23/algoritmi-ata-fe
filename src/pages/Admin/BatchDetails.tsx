import React, { useEffect, useState } from 'react';
import Loader from '../../common/Loader';
import axios from 'axios';
import profileImage from '../../images/ata/profile.png'
const API_BASE_URL = import.meta.env.VITE_API_URL;

function BatchDetails() {
    const headers = ['Image', 'Name', 'Email', 'Contact', 'About'];
    const headersQuiz = ['Name', 'Topic', 'Description', 'Assigned At', 'Deadline'];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [batch, setBatch] = useState(null);
    const [batchId, setBatchId] = useState(null);

    // Fetch batches inside useEffect
    useEffect(() => {
        // Extract batchId and submitterId from the query string
        const queryParams = new URLSearchParams(location.search);
        const batchId = queryParams.get("batchId");
        setBatchId(batchId);
        const fetchBatch = async () => {
            setLoading(true);
            try {
                let response;
                if (batchId) {
                    response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, { batchId });
                }
                setBatch(response.data.data); // Assuming `response.data.data` contains the batches
                setLoading(false);
            } catch (err) {
                setError('Error fetching batches');
                setLoading(false);
            }
        };

        fetchBatch();
    }, []); // This useEffect will run whenever `batchId` changes


    const renderUsers = (users) => (
        <>
            {loading && <Loader />}
            {users.length === 0 ? (
                <div className="text-center text-lg p-5">No data available.</div>
            ) : (
                users.map((user, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-5 sm:grid-cols-5 ${index === users.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                    >
                        {/* Image */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <img
                                src={user.image || profileImage}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                        {/* Name */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{user.name || '-'}</p>
                        </div>
                        {/* Email */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{user.email || '-'}</p>
                        </div>
                        {/* Contact */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{user.contact?.join(', ') || '-'}</p>
                        </div>
                        {/* About */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{user.about || '-'}</p>
                        </div>
                    </div>
                ))
            )}
        </>
    );

    const renderQuizzes = (quizzes) => (
        <>
            {loading && <Loader />}
            {quizzes.length === 0 ? (
                <div className="text-center text-lg p-5">No data available.</div>
            ) : (
                quizzes.map((quiz, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-5 sm:grid-cols-5 ${index === quizzes.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                    >
                        {/* Name */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{quiz.quizName || '-'}</p>
                        </div>
                        {/* Topic */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{quiz.quizTopic || '-'}</p>
                        </div>
                        {/* Description */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{quiz.quizDescription || '-'}</p>
                        </div>
                        {/* Issue */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{quiz.quizIssued || '-'}</p>
                        </div>
                        {/* Dead */}
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{quiz.quizDead || '-'}</p>
                        </div>
                    </div>
                ))
            )}
        </>
    );

    return (
        <div className="rounded-sm border border-stroke bg-white p-5 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h2 className="text-2xl font-bold mb-5 text-black dark:text-white">
                Batch: {batch?.batchName || 'N/A'}
            </h2>

            {/* Teachers Section */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Teachers</h4>
                <div className="grid grid-cols-5 sm:grid-cols-5 bg-gray-2 dark:bg-meta-4 rounded-sm">
                    {headers.map((header, index) => (
                        <div key={index} className="p-2.5 text-center font-medium uppercase">
                            {header}
                        </div>
                    ))}
                </div>
                {renderUsers(batch?.batchTeacher || [])}
            </div>

            {/* Students Section */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-8">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Students</h4>
                <div className="grid grid-cols-5 sm:grid-cols-5 bg-gray-2 dark:bg-meta-4 rounded-sm">
                    {headers.map((header, index) => (
                        <div key={index} className="p-2.5 text-center font-medium uppercase">
                            {header}
                        </div>
                    ))}
                </div>
                {renderUsers(batch?.batchStudent || [])}
            </div>

            {/* Students Section */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-8">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>
                <div className="grid grid-cols-5 sm:grid-cols-5 bg-gray-2 dark:bg-meta-4 rounded-sm">
                    {headersQuiz.map((headerQuiz, index) => (
                        <div key={index} className="p-2.5 text-center font-medium uppercase">
                            {headerQuiz}
                        </div>
                    ))}
                </div>
                {renderQuizzes(batch?.batchQuiz || [])}
            </div>
        </div>
    );
}

export default BatchDetails;
