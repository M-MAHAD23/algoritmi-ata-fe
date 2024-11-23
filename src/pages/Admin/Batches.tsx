import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import CreateUserModal from './Modal/CreateUserModal';
import CreateBatchModal from './Modal/CreateBatchModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArchive,
    faEdit,
    faEye,
    faPlusCircle,
    faTrashAlt,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import toast, { Toaster } from 'react-hot-toast';
import UpdateBatchModal from './Modal/UpdateBatchModal';

function Batches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBatch, setNewBatch] = useState({
        batchNumber: '',
        batchSession: '',
        batchStart: '',
        batchEnd: '',
        batchName: '',
    });
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [batch, setBatch] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        role: '',
        email: '',
        cnic: '',
        social: [],
        contact: [],
        education: [],
        work: [],
        batchId: '',
        image: '',
    });
    const { batchId } = useParams();

    const renderRow = (batch) => [
        <div className="p-2 text-center">{batch?.batchNumber || '-'}</div>,
        <div className="p-2 text-center">{batch?.batchName || '-'}</div>,
        <div className="p-2 text-center">{batch?.batchStart || '-'}</div>,
        <div className="p-2 text-center">{batch?.batchEnd || '-'}</div>,
        <div className="p-2 text-center">{batch?.batchTeacher?.length || 0}</div>,
        <div className="p-2 text-center">{batch?.batchStudent?.length || 0}</div>,
        <div className="p-2 text-center">{batch?.batchQuiz?.length || 0}</div>,
        <div className="p-2 flex justify-center space-x-4">
            {/* View Details Button */}
            {
                batch.isEnable ?
                    <>
                        <FontAwesomeIcon
                            icon={faEye}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => {
                                // Navigate to the BatchDetails screen with the selected batch ID
                                window.location.href = `/batch-details?batchId=${batch._id}`;
                            }}
                            title="View Batch Details"
                        />
                        <FontAwesomeIcon
                            icon={faArchive}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => handleArchiveBatch(batch._id)}
                            title="Archive Batch"
                        />
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => {
                                setBatch(batch);
                                setShowUpdateModal(true);
                            }}
                            title="Update Batch"
                        />
                        <FontAwesomeIcon
                            icon={faUserPlus}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => {
                                setNewUser({ ...newUser, batchId: batch._id });
                                setSelectedBatchId(batch._id);
                                setIsModalOpen(true);
                            }}
                            title="Add User"
                        />
                    </>
                    :
                    <>
                        <FontAwesomeIcon
                            icon={faArchive}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => handleArchiveBatch(batch._id)}
                            title="Archive Batch"
                        />
                        {/* <FontAwesomeIcon
                            icon={faEye}
                            className="text-1xl text-black hover:text-green-500 cursor-pointer"
                            onClick={() => {
                                window.location.href = `/batch-details?batchId=${batch._id}`;
                            }}
                            title="View Batch Details"
                        /> */}
                    </>
            }
        </div>,
    ];

    // Utility function to render tables

    const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
        <div className="mb-8">
            {/* Table Header */}
            <div
                className="grid grid-cols-8 gap-2 bg-gray-200 dark:bg-meta-4 rounded-sm"
            >
                {headers.map((header, index) => (
                    <div
                        key={index}
                        className="p-2.5 text-center font-medium uppercase border-b border-stroke dark:border-strokedark"
                    >
                        {header}
                    </div>
                ))}
            </div>

            {/* Table Body */}
            {rows.length ? (
                rows.map((row) => (
                    <div
                        key={keyExtractor(row)}
                        className="grid grid-cols-8 gap-2 border-b border-stroke dark:border-strokedark"
                    >
                        {renderRow(row).map((cell, cellIndex) => (
                            <div key={cellIndex} className="p-2 text-center">
                                {cell}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div className="text-center p-5">No data available.</div>
            )}
        </div>
    );


    const fetchBatches = async () => {
        setLoading(true);
        try {
            let response;
            if (batchId) {
                response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, {
                    batchId,
                });
            } else {
                response = await axios.post(`${API_BASE_URL}/batch/getAllBatches`);
            }
            setBatches(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching batches');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [batchId]);

    const headers = [
        'Batch Number',
        'Batch Name',
        'Batch Start',
        'Batch End',
        'Batch Teacher',
        'Batch Student',
        'Batch Quiz',
        'Actions',
    ];

    const handleCreateBatch = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/batch/createBatch`,
                newBatch,
            );
            setBatches(response.data.data);
            setShowCreateModal(false);
            setNewBatch({
                batchNumber: '',
                batchSession: '',
                batchStart: '',
                batchEnd: '',
                batchName: '',
            });
        } catch (err) {
            setError('Error creating batch');
        }
    };

    const handleUpdateBatch = async (updatedBatch) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/batch/updateBatch`,
                updatedBatch,
            );
            setBatches(response.data.data);
            setShowUpdateModal(false);
            setBatch({
                batchNumber: '',
                batchSession: '',
                batchStart: '',
                batchEnd: '',
                batchName: '',
            });
            fetchBatches();
        } catch (err) {
            setError('Error creating batch');
        }
    };

    const handleArchiveBatch = async (batchId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/batch/toggleBatchStatus`,
                { batchId },
            );
            setBatches(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error archiving batch');
        }
    };

    const handleCreateUser = async (updatedFormData) => {
        try {
            fetchBatches();
            const response = await axios.post(
                `${API_BASE_URL}/user/createUser`,
                updatedFormData,
            );
            setShowUserModal(false);
            setNewUser({
                name: '',
                role: 'Student',
                email: '',
                cnic: '',
                social: [],
                contact: [],
                education: [],
                work: [],
                batchId: '',
                image: '',
            });
            fetchBatches();
        } catch (err) {
            setError('Error creating user');
        }
    };

    const activeBatches = batches.filter((batch) => batch.isEnable === true);
    const archivedBatches = batches.filter((batch) => batch.isEnable === false);

    return (
        <>
            <Toaster
                toastOptions={{
                    style: {
                        width: '300px',
                        margin: '10px auto',
                        fontSize: '14px',
                    },
                    position: 'top-right',
                }}
            />
            {loading && <Loader />}
            <div className="overflow-x-auto rounded-sm border border-stroke bg-white p-5 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {/* <div className="overflow-x-auto"> */}
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        Active Batches
                    </h4>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 font-bold text-white bg-black hover:bg-gray-500 rounded-md shadow-md mb-4"
                    >
                        Create Batch +
                    </button>
                    {renderTable({
                        headers,
                        rows: activeBatches,
                        keyExtractor: (batch) => batch._id,
                        renderRow,
                    })}
                </div>
                <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                    <h4 className="mb-6 text-xl font-bold text-black dark:text-white">
                        Archived Batches
                    </h4>
                    {renderTable({
                        headers,
                        rows: archivedBatches,
                        keyExtractor: (batch) => batch._id,
                        renderRow,
                    })}
                </div>
            </div>

            {/* Update Batch Modal */}
            {showUpdateModal && (
                <UpdateBatchModal
                    isOpen={showUpdateModal}
                    closeModal={() => setShowUpdateModal(false)}
                    handleUpdateBatch={handleUpdateBatch}
                    batch={batch}
                    setBatch={setBatch}
                />
            )}

            {/* Modals for Create User and Create Batch */}
            {isModalOpen && (
                <CreateUserModal
                    setIsModalOpen={setIsModalOpen}
                    onSubmit={handleCreateUser}
                    batchId={selectedBatchId}
                />
            )}

            {/* Create Batch Modal */}
            {showCreateModal && (
                <CreateBatchModal
                    isOpen={showCreateModal}
                    closeModal={() => setShowCreateModal(false)}
                    handleCreateBatch={handleCreateBatch}
                    newBatch={newBatch}
                    setNewBatch={setNewBatch}
                />
            )}
        </>
    );
}

export default Batches;
