import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import SubmitModal from '../../components/Student/SubmitModal'; // Import your SubmitModal component
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function StudentQuiz() {
    const [newQuizzes, setNewQuizzes] = useState([]);
    const [lateQuizzes, setLateQuizzes] = useState([]);
    const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
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

                    setLoading(false);
                })
                .catch(() => {
                    setError('Error fetching quizzes');
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchQuizzes(); // Initial quiz data fetch
    }, [location, userInfo]); // Refetch when location or user info changes

    // Add event listener for visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            console.log('Visibility state:', document.visibilityState); // Check if it's being called
            if (document.visibilityState === 'visible') {
                fetchQuizzes(); // If the page is visible again, refetch the quizzes
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    const renderTable = (title, quizzes, isLate) => (
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
            {/* Table Wrapper */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{title}</h4>

                {quizzes?.length === 0 ? (
                    <div className="text-center text-lg p-5">No quizzes available.</div>
                ) : (
                    <div className="flex flex-col">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
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
                                        <button
                                            onClick={() => handleOpenModal(quiz)}
                                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                        >
                                            Submit
                                        </button>
                                    )}

                                    {/* Late Quizzes */}
                                    {title === "Late Quizzes" && isLate && (
                                        <span className="text-red">Late Submission Not Allowed</span>
                                    )}

                                    {/* Submitted Quizzes */}
                                    {title === "Submitted Quizzes" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    const cooldown = 6000; // 6 seconds
                                                    const lastToastTime = window.lastToastTime || 0; // Default to 0 if not set
                                                    const now = Date.now();

                                                    if (quiz?.analyzed) {
                                                        handleViewResults(quiz?._id);
                                                    } else if (now - lastToastTime > cooldown) {
                                                        toast.error(
                                                            "Please wait for analysis.", {
                                                            position: 'top-right'
                                                        });
                                                        window.lastToastTime = now; // Update the last toast time globally
                                                    }
                                                }}
                                                className={`px-4 py-2 text-white rounded ${quiz?.analyzed ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500"
                                                    }`}
                                            >
                                                {quiz?.analyzed ? "View Results" : "Being Analyzed"}
                                            </button>
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
        <Panel>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>
                <div className="mb-8">{renderTable('New Quizzes', newQuizzes, false)}</div>
                <div className="mb-8">{renderTable('Late Quizzes', lateQuizzes, true)}</div>
                <div className="mb-8">{renderTable('Submitted Quizzes', submittedQuizzes, false)}</div>
            </div>

            {isModalOpen && selectedQuiz && (
                <SubmitModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    quiz={selectedQuiz._id}
                    submitterId={userInfo?._id}
                    batchId={userInfo?.batchId?._id}
                />
            )}
        </Panel>
    );
}

export default StudentQuiz;
