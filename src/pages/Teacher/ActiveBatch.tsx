import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import toast, { Toaster } from 'react-hot-toast';
import HintModal from './Modal/HintModal';
import QuizModal from './Modal/QuizModal';
import RenderCard from '../../components/RenderCard';
import profileImage from '../../images/ata/profile.png'
import LaunchATAContext from '../../context/AppContext';

function ActiveBatch() {
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizForm, setQuizForm] = useState({
        quizTopic: '',
        quizName: '',
        quizDescription: '',
        quizIssued: '',
        quizDead: '',
    });
    const [quizErrors, setQuizErrors] = useState({});
    const [quizHints, setQuizHints] = useState([]);
    const [hintForm, setHintForm] = useState({
        description: '',
        hintType: 'Input',
        image: null,
    });
    const [hintErrors, setHintErrors] = useState({});
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [currentQuizId, setCurrentQuizId] = useState(null);
    const userProfile = JSON.parse(localStorage.getItem("userInfo"));
    const { teacherSelectedBatch } = useContext(LaunchATAContext);

    const handleAddHint = () => {
        const errors = {};

        // Validate description only if it has been touched or is non-empty
        if (!hintForm.description.trim()) {
            errors.description = 'Description is required.';
        }

        // Validate image
        // if (!hintForm.image) {
        //     errors.image = 'Image is required.';
        // }

        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            setHintErrors(errors);
            return;
        }

        // Reset errors if all fields are valid
        setHintErrors({});

        // Add hint to the array
        setQuizHints((prev) => [...prev, hintForm]);

        // Reset the form
        setHintForm({ description: '', hintType: 'Input', image: null });
    };
    const handleHintChange = (e) => {
        const { name, value, files } = e.target;
        setHintForm({ ...hintForm, [name]: files ? files[0] : value });
        if (hintErrors[name]) setHintErrors({ ...hintErrors, [name]: '' });
    };

    const fetchBatchDetails = async () => {
        if (!userProfile?.batchId) return; // Ensure batchId is available
        setLoading(true);
        const payload = { batchId: teacherSelectedBatch ? teacherSelectedBatch : userProfile?.batchId?._id };
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, payload);
            setBatch(response?.data?.data);
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
        navigate(`/quiz-submission?quizId=${quizId}`);
    };

    // Function to handle quiz delete
    const handleQuizDeleteClick = async (quizId) => {
        setLoading(true);
        try {
            // Show a confirmation dialog before deletion
            const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
            if (!confirmDelete) return;

            // Send a POST request to delete the quiz
            const response = await axios.post(`${API_BASE_URL}/quiz/deleteQuiz`, {
                id: quizId,
            });

            if (response.status === 200) {
                alert("Quiz deleted successfully!");
                fetchBatchDetails();
                setLoading(false);
            } else {
                alert(response.data.message || "Failed to delete quiz.");
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
            alert("An error occurred while deleting the quiz.");
        }
    };

    const resetQuizForm = () => {
        setQuizForm({
            quizTopic: '',
            quizName: '',
            quizDescription: '',
            quizIssued: '',
            quizDead: '',
        });
    };

    const resetQuizHintForm = () => {
        setQuizForm({
            description: '',
            hintType: 'Input',
            image: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuizForm({ ...quizForm, [name]: value });
        if (quizErrors[name]) setQuizErrors({ ...quizErrors, [name]: '' });
    };


    const validateQuizForm = () => {
        const errors = {};
        if (!quizForm.quizTopic.trim()) errors.quizTopic = 'Quiz topic is required.';
        if (!quizForm.quizName.trim()) errors.quizName = 'Quiz name is required.';
        if (!quizForm.quizDescription.trim()) errors.quizDescription = 'Quiz description is required.';
        if (!quizForm.quizIssued) errors.quizIssued = 'Quiz issued date is required.';
        if (!quizForm.quizDead) errors.quizDead = 'Quiz deadline is required.';
        return errors;
    };

    const createQuiz = async () => {
        const errors = validateQuizForm();
        if (Object.keys(errors).length > 0) {
            setQuizErrors(errors);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/quiz/createQuiz`, { batchId: userProfile?.batchId?._id, quizzerId: userProfile?._id, ...quizForm });
            setCurrentQuizId(response.data.quizId);
            resetQuizForm();
            setLoading(false)
            setShowQuizModal(false)
            setShowHintModal(true);
            fetchBatchDetails();
        } catch (err) {
            console.error('Error creating quiz:', err);
        }
    };

    const addHint = async (currentQuizId, quizHints) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('quizId', currentQuizId);  // Append quiz ID

            // Loop through hints to append each hint as a JSON string and image file
            quizHints.forEach((hint, index) => {
                // Remove the file from hint object before appending
                const { image, ...hintData } = hint;

                // Append the hint data as JSON
                formData.append(`quizHints`, JSON.stringify(hintData));

                // Append the image if it exists
                if (image) {
                    formData.append(`files`, image);  // 'images' array for all files
                }
            });

            try {
                const response = await axios.post(`${API_BASE_URL}/quiz/createQuizHint`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Reset form state
                setHintForm({ description: '', hintType: 'Input', image: null });

                // Close the modal only after the API call is successful
                setShowHintModal(false); // Now this will only happen after the hint is successfully added

                // Set loading false
                setLoading(false);
                // Handle success response
            } catch (error) {
                console.error('Error uploading quiz hints:', error);
            }

        } catch (err) {
            console.error('Error adding hint:', err);
        }
    };

    // Utility function to render a table
    const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
        <div className="mb-8">
            <div className={`grid grid-cols-${headers.length} bg-black text-white dark:bg-meta-4 rounded-sm`}>
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

        <>
            <Toaster
                toastOptions={{
                    style: {
                        width: '300px', // Set a fixed width for all toasts
                        margin: '10px auto', // Optional: To center the toasts
                        fontSize: '14px', // Optional: Adjust font size
                    },
                    position: 'top-right', // Position the toasts on the top-right
                }}
            />
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
                                    className="text-black hover:underline mb-4"
                                >
                                    &larr; Go Back
                                </button>

                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batch Details</h4>

                                {/* Card Grid */}
                                <RenderCard
                                    data={{
                                        batchNumber: batch.batchNumber,
                                        batchSession: batch.batchSession,
                                        batchName: batch.batchName,
                                        batchStudent: batch.batchStudent,
                                        batchQuiz: batch.batchQuiz,
                                    }}
                                />

                            </div>
                            <div className="mt-6 mb-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
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
                                                        src={student.image || profileImage}
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
                                    <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
                                        Quizzes
                                    </h4>
                                    {/* Create Quiz Button Below Heading */}
                                    <div className="mt-4 mb-6">
                                        <button
                                            onClick={() => setShowQuizModal(true)}
                                            className="px-6 py-3 font-bold text-white bg-black hover:bg-gray-500 rounded-md shadow-md"
                                        >
                                            Create Quiz +
                                        </button>
                                    </div>

                                    {renderTable({
                                        headers: [
                                            'Topic',
                                            'Quiz Name',
                                            'Description',
                                            'Issued Date',
                                            'Deadline',
                                            'Submissions',
                                            'Actions',
                                        ],
                                        rows: batch.batchQuiz || [],
                                        keyExtractor: (quiz) => quiz._id,
                                        renderRow: (quiz) => [
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizTopic || '-'}
                                            </div>,
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizName || '-'}
                                            </div>,
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizDescription || '-'}
                                            </div>,
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizIssued || '-'}
                                            </div>,
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizDead || '-'}
                                            </div>,
                                            <div className="p-2.5 text-center text-black dark:text-white">
                                                {quiz.quizSubmitters?.length || 0}
                                            </div>,
                                            <div className="p-2.5 flex justify-center space-x-4">
                                                {/* Add Hint Icon */}
                                                <FontAwesomeIcon
                                                    icon={faPlusCircle}
                                                    className={`text-2xl ${new Date().toISOString().split('T')[0] === quiz.quizDead
                                                        ? 'text-gray-500 cursor-not-allowed'
                                                        : 'text-black hover:text-green-500 cursor-pointer'
                                                        }`}
                                                    onClick={() => {
                                                        if (new Date().toISOString().split('T')[0] !== quiz.quizDead) {
                                                            setShowHintModal(true);
                                                            setCurrentQuizId(quiz._id); // Store quiz._id to use in the modal
                                                        } else {
                                                            toast.error("Deadline passed, Can't add hint :)");
                                                        }
                                                    }}
                                                    title="Add Hint"
                                                />

                                                {/* View Results Icon */}
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className={`text-2xl ${new Date().toISOString().split('T')[0] >= quiz.quizDead
                                                        ? 'text-black cursor-pointer'
                                                        : 'text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    onClick={() => {
                                                        if (new Date().toISOString().split('T')[0] >= quiz.quizDead) {
                                                            handleQuizClick(quiz._id); // Use quiz._id to view results
                                                        } else {
                                                            toast.error("Please wait for the deadline to analyze the results :)");
                                                        }
                                                    }}
                                                    title="View Results"
                                                />

                                                {/* Delete Icon */}
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    className={`text-2xl ${new Date().toISOString().split('T')[0] === quiz.quizDead
                                                        ? 'text-gray-500 cursor-not-allowed'
                                                        : 'text-black hover:text-red-500 cursor-pointer'
                                                        }`}
                                                    onClick={() => {
                                                        if (new Date().toISOString().split('T')[0] !== quiz.quizDead) {
                                                            handleQuizDeleteClick(quiz._id); // Use quiz._id to delete quiz
                                                        } else {
                                                            toast.error("Deadline passed, Can't delete Quiz :)");
                                                        }
                                                    }}
                                                    title="Delete"
                                                />
                                            </div>
                                        ],
                                    })}


                                    <QuizModal
                                        isOpen={showQuizModal}
                                        closeModal={() => {
                                            setShowQuizModal(false);
                                            setQuizErrors({});
                                            resetQuizForm();
                                        }}
                                        quizForm={quizForm}
                                        setQuizForm={setQuizForm}
                                        quizErrors={quizErrors}
                                        handleInputChange={handleInputChange}
                                        createQuiz={createQuiz}
                                    />

                                    <HintModal
                                        isOpen={showHintModal}
                                        closeModal={() => {
                                            setShowHintModal(false);
                                            setHintErrors({});
                                            resetQuizHintForm();
                                        }}
                                        hintForm={hintForm}
                                        setHintForm={setHintForm}
                                        hintErrors={hintErrors}
                                        handleHintChange={handleHintChange}
                                        handleAddHint={handleAddHint}
                                        quizHints={quizHints}
                                        setQuizHints={setQuizHints}
                                        addHint={addHint}
                                        currentQuizId={currentQuizId}
                                        setHintErrors={setHintErrors}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-5">No batch details available.</div>
                    )}
                </div>
            </Panel>
        </>
    );
}

export default ActiveBatch;
