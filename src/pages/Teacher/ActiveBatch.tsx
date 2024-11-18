import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    const [showQuizHnitModal, setShowQuizHnitModal] = useState(false);
    const [currentQuizId, setCurrentQuizId] = useState(null);

    const userProfile = JSON.parse(localStorage.getItem("userInfo"));

    const fetchBatchDetails = async () => {
        if (!userProfile?.batchId) return; // Ensure batchId is available
        setLoading(true);
        const payload = { batchId: userProfile?.batchId?._id };
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

    const resetQuizForm = () => {
        setQuizForm({
            quizTopic: '',
            quizName: '',
            quizDescription: '',
            quizIssued: '',
            quizDead: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuizForm({ ...quizForm, [name]: value });
        if (quizErrors[name]) setQuizErrors({ ...quizErrors, [name]: '' });
    };

    const handleHintChange = (e) => {
        const { name, value, files } = e.target;
        setHintForm({ ...hintForm, [name]: files ? files[0] : value });
        if (hintErrors[name]) setHintErrors({ ...hintErrors, [name]: '' });
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
            setShowQuizHnitModal(true);
        } catch (err) {
            console.error('Error creating quiz:', err);
        }
    };

    const validateHintForm = () => {
        const errors = {};
        if (!hintForm.description.trim()) errors.description = 'Hint description is required.';
        if (!hintForm.hintType.trim()) errors.hintType = 'Hint type is required.';
        return errors;
    };

    const addHint = async () => {
        const errors = validateHintForm();
        if (Object.keys(errors).length > 0) {
            setHintErrors(errors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('quizId', currentQuizId);
            formData.append('description', hintForm.description);
            formData.append('hintType', hintForm.hintType);
            if (hintForm.image) {
                formData.append('image', hintForm.image);
            }

            const response = await axios.post(`${API_BASE_URL}/hint/create`, formData);
            setQuizHints([...quizHints, response.data.hint]);
            setHintForm({ description: '', hintType: 'Input', image: null });
        } catch (err) {
            console.error('Error adding hint:', err);
        }
    };

    const deleteHint = async (hintId) => {
        try {
            await axios.delete(`${API_BASE_URL}/hint/delete/${hintId}`);
            setQuizHints(quizHints.filter((hint) => hint._id !== hintId));
        } catch (err) {
            console.error('Error deleting hint:', err);
        }
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
                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                                    Quizzes
                                    <button
                                        onClick={() => setShowQuizModal(true)}
                                        className="ml-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                        Create Quiz
                                    </button>
                                </h4>

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
                                        <div className="p-2.5 flex text-center">
                                            <button
                                                onClick={() => handleQuizClick(quiz._id)}
                                                className={`px-4 py-2 rounded text-white ${new Date().toISOString().split('T')[0] === quiz.quizDead
                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                    : 'bg-gray-300 cursor-not-allowed'
                                                    }`}
                                                disabled={new Date().toISOString().split('T')[0] !== quiz.quizDead}
                                            >
                                                View Results
                                            </button>
                                            <button
                                                onClick={() => deleteQuiz(quiz._id)}
                                                className={`ml-2 px-4 py-2 rounded text-white ${new Date().toISOString().split('T')[0] === quiz.quizDead
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-red-400 hover:bg-red-500'
                                                    }`}
                                                disabled={new Date().toISOString().split('T')[0] === quiz.quizDead}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ],
                                })}

                                {/* Quiz Modal */}
                                {showQuizModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white p-6 rounded shadow-lg">
                                            {loading && <Spinner />}
                                            <h3 className="mb-4 text-lg font-bold">Create Quiz</h3>
                                            {/* Quiz Fields */}
                                            {Object.keys(quizForm).map((key) => (
                                                <div className="mb-4" key={key}>
                                                    <label className="block text-sm font-medium">
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </label>
                                                    <input
                                                        type={key === 'quizIssued' || key === 'quizDead' ? 'date' : 'text'} // Explicitly show calendar input for specific keys
                                                        name={key}
                                                        value={quizForm[key]}
                                                        onChange={handleInputChange}
                                                        className={`w-full rounded border p-2 ${quizErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                                                    />
                                                    {quizErrors[key] && <p className="mt-1 text-sm text-red-500">{quizErrors[key]}</p>}
                                                </div>
                                            ))}

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        setShowQuizModal(false)
                                                        resetQuizForm()
                                                    }
                                                    }
                                                    className="mr-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={createQuiz}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Create Quiz
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Hint Section */}
                                {showQuizHnitModal && (
                                    <>
                                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                            <div className="bg-white p-6 rounded shadow-lg">
                                                <h4 className="mb-2 font-semibold">Quiz Hints</h4>
                                                {Object.keys(hintForm).map((key) => (
                                                    <div className="mb-4" key={key}>
                                                        <label className="block text-sm font-medium">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </label>
                                                        <input
                                                            type={key === 'image' ? 'file' : 'text'}
                                                            name={key}
                                                            value={hintForm[key]}
                                                            onChange={handleHintChange}
                                                            className={`w-full rounded border p-2 ${hintErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {hintErrors[key] && <p className="mt-1 text-sm text-red-500">{hintErrors[key]}</p>}
                                                    </div>
                                                ))}
                                                <button onClick={addHint} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                    Add Hint
                                                </button>
                                                <ul className="mt-4">
                                                    {quizHints.map((hint) => (
                                                        <li key={hint._id}>
                                                            {hint.description} ({hint.hintType})
                                                            <button
                                                                onClick={() => deleteHint(hint._id)}
                                                                className="ml-2 px-2 py-1 text-red-500"
                                                            >
                                                                Delete
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}
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
