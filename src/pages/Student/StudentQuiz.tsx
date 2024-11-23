import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SubmitQuizModal from './Modal/SubmitQuizModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEye, faHourglassHalf, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function StudentQuiz() {
    const [newQuizzes, setNewQuizzes] = useState([]);
    const [lateQuizzes, setLateQuizzes] = useState([]);
    const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true); // Start with true loading state
    const [error, setError] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (storedUserInfo && storedToken) {
            setToken(storedToken);
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    // Fetch quizzes based on batchId and studentId
    const fetchQuizzes = () => {
        setLoading(true); // Set loading to true when fetching
        const params = new URLSearchParams(location.search);
        const batchId = params.get('batchId') || userInfo?.batchId;
        const studentId = params.get('studentId') || userInfo?._id;

        if (batchId) {
            const endpoint = `${API_BASE_URL}/quiz/getAllQuizzesByBatchIdStudent`;

            axios
                .post(endpoint, { batchId, studentId })
                .then((response) => {
                    const { newQuizzes, lateQuizzes, submittedQuizzes } = response.data.data;
                    setNewQuizzes(newQuizzes);
                    setLateQuizzes(lateQuizzes);
                    setSubmittedQuizzes(submittedQuizzes);

                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(() => {
                    setError('Error fetching quizzes');
                    setLoading(false); // Set loading to false on error
                });
        }
    };

    useEffect(() => {
        fetchQuizzes(); // Initial quiz data fetch
    }, [location, userInfo]); // Refetch when location or user info changes

    // Add event listener for visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // If the page is visible again, refetch the quizzes
                fetchQuizzes();
            }
        };

        // Attach the visibility change event listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [location, userInfo]);

    const handleOpenModal = (quiz) => {
        setSelectedQuiz(quiz);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuiz(null);
        fetchQuizzes(); // Refetch quizzes after closing the modal
    };

    const handleViewResults = (quizId) => {
        navigate(`/student/quiz/results?quizId=${quizId}&submitterId=${userInfo?._id}`);
    };

    if (error) return <div>{error}</div>;

    const renderTable = (title, quizzes, isLate) => (
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
            {/* Table Wrapper */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{title}</h4>

                {quizzes?.length === 0 ? (
                    <div className="text-center text-lg p-5">No quizzes available.</div>
                ) : (
                    <div className="flex flex-col mb-6">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 rounded-sm bg-black text-white dark:bg-meta-4">
                            <div className="p-2.5 text-center xl:p-5">Quiz Name</div>
                            <div className="p-2.5 text-center xl:p-5">Quiz Topic</div>
                            <div className="p-2.5 text-center xl:p-5">Description</div>
                            <div className="p-2.5 text-center xl:p-5">Issued Date</div>
                            <div className="p-2.5 text-center xl:p-5">Deadline</div>
                            <div className="p-2.5 text-center xl:p-5">Actions</div>
                        </div>

                        {/* Table Rows */}
                        {quizzes?.map((quiz, index) => (
                            <div
                                className={`grid grid-cols-6 ${index === quizzes?.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                                key={quiz?._id}
                            >
                                {/* Quiz Name */}
                                <div className="p-2.5 text-center xl:p-5">{quiz?.quizName || '-'}</div>
                                {/* Quiz Topic */}
                                <div className="p-2.5 text-center xl:p-5">{quiz?.quizTopic || '-'}</div>
                                {/* Quiz Description */}
                                <div className="p-2.5 text-center xl:p-5">{quiz?.quizDescription || '-'}</div>
                                {/* Issued Date */}
                                <div className="p-2.5 text-center xl:p-5">{quiz?.quizIssued || '-'}</div>
                                {/* Deadline */}
                                <div className="p-2.5 text-center xl:p-5">{quiz?.quizDead || '-'}</div>
                                {/* Action Buttons */}
                                <div className="p-2.5 text-center xl:p-5">
                                    {/* New Quizzes */}
                                    {title === "New Quizzes" && !isLate && (
                                        <span
                                            onClick={() => handleOpenModal(quiz)}
                                            className="text-black hover:text-gray-550 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} className="text-xl" /> {/* Paper plane icon */}
                                        </span>
                                    )}

                                    {/* Late Quizzes */}
                                    {title === "Late Quizzes" && isLate && (
                                        <span className="flex items-center justify-center cursor-pointer text-red">
                                            <FontAwesomeIcon icon={faClock} className="mr-2" /> {/* Clock icon */}
                                            Late Submission
                                        </span>
                                    )}

                                    {/* Submitted Quizzes */}
                                    {title === "Submitted Quizzes" && (
                                        <>
                                            <span
                                                onClick={() => {
                                                    const cooldown = 6000; // 6 seconds
                                                    const lastToastTime = window.lastToastTime || 0; // Default to 0 if not set
                                                    const now = Date.now();

                                                    if (quiz?.analyzed) {
                                                        handleViewResults(quiz?._id);
                                                    } else if (now - lastToastTime > cooldown) {
                                                        toast.error("Please wait for analysis.");
                                                        window.lastToastTime = now; // Update the last toast time globally
                                                    }
                                                }}
                                                className={`flex items-center justify-center cursor-pointer text-black hover:text-gray-550`}
                                            >
                                                {/* Icon */}
                                                <FontAwesomeIcon
                                                    icon={quiz?.analyzed ? faEye : faHourglassHalf}
                                                    className="mr-2" // Space between icon and text
                                                />
                                                {/* Icon Text */}
                                                {quiz?.analyzed ? "View Results" : "Being Analyzed"}
                                            </span>

                                        </>
                                    )}
                                    <Toaster />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Panel>
                {
                    loading
                        ?
                        <Loader />
                        :
                        (
                            <>
                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                                    {/* Go Back Button */}
                                    <button
                                        onClick={() => navigate(-1)} // Navigate back to the previous page
                                        className="text-black hover:underline mb-4"
                                    >
                                        &larr; Go Back
                                    </button>
                                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>
                                    <div className="mb-8">{renderTable('New Quizzes', newQuizzes, false)}</div>
                                    <div className="mb-8">{renderTable('Late Quizzes', lateQuizzes, true)}</div>
                                    <div className="mb-8">{renderTable('Submitted Quizzes', submittedQuizzes, false)}</div>
                                </div>

                                {isModalOpen && selectedQuiz && (
                                    <SubmitQuizModal
                                        isOpen={isModalOpen}
                                        onClose={handleCloseModal}
                                        quiz={selectedQuiz._id}
                                        submitterId={userInfo?._id}
                                        batchId={userInfo?.batchId?._id}
                                    />
                                )}
                            </>
                        )
                }
            </Panel>
        </>
    );
}

export default StudentQuiz;
