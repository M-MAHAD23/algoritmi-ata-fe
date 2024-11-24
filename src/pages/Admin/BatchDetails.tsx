import React, { useContext, useEffect, useState } from 'react';
import Loader from '../../common/Loader';
import axios from 'axios';
import profileImage from '../../images/ata/profile.png'
import { useNavigate } from 'react-router-dom';
import Panel from '../../layout/Panel';
import LaunchATAContext from '../../context/AppContext';
import getUserProfile from '../../hooks/profile';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function BatchDetails() {
    const { profile, setProfile } = useContext(LaunchATAContext);
    const headers = ['Image', 'Name', 'Email', 'Contact', 'About'];
    const headersQuiz = ['Name', 'Topic', 'Description', 'Assigned At', 'Deadline'];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [batch, setBatch] = useState(null);
    const [batchId, setBatchId] = useState(null);
    const navigate = useNavigate();
    const [teachersPage, setTeachersPage] = useState(1);
    const [studentsPage, setStudentsPage] = useState(1);
    const [quizzesPage, setQuizzesPage] = useState(1);
    const itemsPerPage = 5;

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
                const res = await getUserProfile();
                setProfile(res);
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

        const handleVisibilityChange = () => {
            if (document.hidden === false) {
                fetchBatch();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // This useEffect will run whenever `batchId` changes

    const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
        <div className="flex mb-20 justify-between items-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
            >
                Prev
            </button>
            <div className="text-center">
                Page {currentPage} of {totalPages}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );

    const paginateData = (data, currentPage) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };


    const renderUsers = (users) => {
        return (
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
        )
    };

    const renderQuizzes = (quizzes) => {
        return (
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
        )
    };

    return (
        <>
            <Panel>
                {loading ? <Loader />
                    :
                    (
                        <>
                            <div className="rounded-sm border border-stroke bg-white p-5 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                                {/* Go Back Button */}
                                <button
                                    onClick={() => navigate(-1)} // Navigate back to the previous page
                                    className="text-black hover:underline mb-4"
                                >
                                    &larr; Go Back
                                </button>


                                <h2 className="text-2xl font-bold mb-5 text-black dark:text-white">
                                    Batch: {batch?.batchName || 'N/A'}
                                </h2>

                                {/* Teachers Section */}
                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Teachers</h4>
                                    <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white dark:bg-meta-4 rounded-sm">
                                        {headers.map((header, index) => (
                                            <div key={index} className="p-2.5 text-center font-medium uppercase">
                                                {header}
                                            </div>
                                        ))}
                                    </div>
                                    {renderUsers(paginateData(batch?.batchTeacher || [], teachersPage))}
                                    <PaginationControls
                                        currentPage={teachersPage}
                                        totalPages={Math.ceil((batch?.batchTeacher?.length || 0) / itemsPerPage)}
                                        onPageChange={setTeachersPage}
                                    />
                                </div>

                                {/* Students Section */}
                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-8">
                                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Students</h4>
                                    <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white dark:bg-meta-4 rounded-sm">
                                        {headers.map((header, index) => (
                                            <div key={index} className="p-2.5 text-center font-medium uppercase">
                                                {header}
                                            </div>
                                        ))}
                                    </div>
                                    {renderUsers(paginateData(batch?.batchStudent || [], studentsPage))}
                                    <PaginationControls
                                        currentPage={studentsPage}
                                        totalPages={Math.ceil((batch?.batchStudent?.length || 0) / itemsPerPage)}
                                        onPageChange={setStudentsPage}
                                    />
                                </div>

                                {/* Quizzes Section */}
                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-8">
                                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>
                                    <div className="grid grid-cols-5 sm:grid-cols-5 bg-black text-white dark:bg-meta-4 rounded-sm">
                                        {headersQuiz.map((headerQuiz, index) => (
                                            <div key={index} className="p-2.5 text-center font-medium uppercase">
                                                {headerQuiz}
                                            </div>
                                        ))}
                                    </div>
                                    {renderQuizzes(paginateData(batch?.batchQuiz || [], quizzesPage))}
                                    <PaginationControls
                                        currentPage={quizzesPage}
                                        totalPages={Math.ceil((batch?.batchQuiz?.length || 0) / itemsPerPage)}
                                        onPageChange={setQuizzesPage}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }
            </Panel>
        </>
    );
}

export default BatchDetails;
