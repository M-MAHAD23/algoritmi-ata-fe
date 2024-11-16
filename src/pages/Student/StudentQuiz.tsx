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

    useEffect(() => {
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
    }, [location, userInfo]);

    const handleOpenModal = (quiz) => {
        setSelectedQuiz(quiz);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuiz(null);
    };


    const handleViewResults = (quizId) => {
        navigate(`/student/quiz/results?quizId=${quizId}&submitterId=${userInfo?._id}`);
    };

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    const renderTable = (title, quizzes, isLate) => (
        <div className="mb-8">
            <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">{title}</h5>
            {quizzes?.length === 0 ? (
                <div className="text-center text-lg p-5">No quizzes available.</div>
            ) : (
                <div className="flex flex-col">
                    <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
                        <div className="p-2.5 text-center xl:p-5">Quiz Name</div>
                        <div className="p-2.5 text-center xl:p-5">Quiz Topic</div>
                        <div className="p-2.5 text-center xl:p-5">Description</div>
                        <div className="p-2.5 text-center xl:p-5">Issued Date</div>
                        <div className="p-2.5 text-center xl:p-5">Deadline</div>
                        <div className="p-2.5 text-center xl:p-5">Actions</div>
                    </div>
                    {quizzes?.map((quiz, index) => (
                        <div
                            className={`grid grid-cols-6 ${index === quizzes?.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                            key={quiz?._id}
                        >
                            <div className="p-2.5 text-center xl:p-5">{quiz?.quizName || '-'}</div>
                            <div className="p-2.5 text-center xl:p-5">{quiz?.quizTopic || '-'}</div>
                            <div className="p-2.5 text-center xl:p-5">{quiz?.quizDescription || '-'}</div>
                            <div className="p-2.5 text-center xl:p-5">{quiz?.quizIssued || '-'}</div>
                            <div className="p-2.5 text-center xl:p-5">{quiz?.quizDead || '-'}</div>
                            <div className="p-2.5 text-center xl:p-5">
                                {title === "New Quizzes" && !isLate && (
                                    <button
                                        onClick={() => handleOpenModal(quiz)}
                                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                        Submit
                                    </button>
                                )}
                                {title === "Late Quizzes" && isLate && (
                                    <span className="text-red">Late Submission Not Allowed</span>
                                )}
                                {title === "Submitted Quizzes" && (
                                    <button
                                        onClick={() => {
                                            const cooldown = 6000; // 6 seconds
                                            const lastToastTime = window.lastToastTime || 0; // Default to 0 if not set
                                            const now = Date.now();

                                            if (quiz?.analyzed) {
                                                handleViewResults(quiz?._id);
                                            } else if (now - lastToastTime > cooldown) {
                                                toast.error(
                                                    "Please wait for analysis.",
                                                );
                                                window.lastToastTime = now; // Update the last toast time globally
                                            }
                                        }}
                                        className={`px-4 py-2 text-white rounded ${quiz?.analyzed ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500"
                                            }`}
                                    >
                                        {quiz?.analyzed ? "View Results" : "Being Analyzed"}
                                    </button>
                                )}
                                <Toaster />
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
                    batchId={userInfo?.batchId}
                />
            )}
        </Panel>
    );
}

export default StudentQuiz;
