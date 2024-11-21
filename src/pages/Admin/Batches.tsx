import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import CreateUserModal from './Modal/CreateUserModal';
import CreateBatchModal from './Modal/CreateBatchModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faEdit, faEye, faPlusCircle, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import toast, { Toaster } from 'react-hot-toast';

function Batches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBatch, setNewBatch] = useState({ batchNumber: '', batchSession: '', batchStart: '', batchEnd: '', batchName: '' });
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        role: 'Student',
        email: '',
        cnic: '',
        contact: [],
        education: [],
        batchId: '',
        image: '',
    });
    const { batchId } = useParams();

    // Utility function to render tables
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

    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true);
            try {
                let response;
                if (batchId) {
                    response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, { batchId });
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

        fetchBatches();
    }, [batchId]);

    const headers = ['Batch Number', 'Batch Start', 'Batch End', 'Batch Name', 'Actions'];

    const handleCreateBatch = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/createBatch`, newBatch);
            setBatches(response.data.data);
            setShowCreateModal(false);
            setNewBatch({ batchNumber: '', batchSession: '', batchStart: '', batchEnd: '', batchName: '' });
        } catch (err) {
            setError('Error creating batch');
        }
    };

    const handleArchiveBatch = async (batchId) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/batch/archiveBatch/${batchId}`);
            setBatches(batches.map(batch =>
                batch._id === batchId ? { ...batch, archived: true } : batch
            ));
        } catch (err) {
            setError('Error archiving batch');
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/createUser`, newUser);
            setShowUserModal(false);
            setNewUser({
                name: '',
                role: 'Student',
                email: '',
                cnic: '',
                contact: [],
                education: [],
                batchId: '',
                image: '',
            });
        } catch (err) {
            setError('Error creating user');
        }
    };

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
            {loading && <Loader />}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batches</h4>

                    {/* Create Batch Button */}
                    <div className="mt-4 mb-6">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 font-bold text-white bg-black hover:bg-gray-500 rounded-md shadow-md"
                        >
                            Create Batch +
                        </button>
                    </div>

                    {/* Render Batches Table */}
                    {renderTable({
                        headers,
                        rows: batches,
                        keyExtractor: (batch) => batch._id,
                        renderRow: (batch) => [
                            <div className="p-2.5 text-center">{batch?.batchNumber || '-'}</div>,
                            <div className="p-2.5 text-center">{batch?.batchStart || '-'}</div>,
                            <div className="p-2.5 text-center">{batch?.batchEnd || '-'}</div>,
                            <div className="p-2.5 text-center">{batch?.batchName || '-'}</div>,
                            <div className="p-2.5 flex justify-center space-x-4">
                                {/* Archive Icon */}
                                <FontAwesomeIcon
                                    icon={faArchive} // Use archive icon for archiving
                                    className="text-2xl text-black hover:text-green-500 cursor-pointer"
                                    onClick={() => {
                                        handleArchiveBatch(batch._id);
                                    }}
                                    title="Archive Batch"
                                />

                                {/* Update Icon */}
                                <FontAwesomeIcon
                                    icon={faEdit} // Use edit icon for updating
                                    className="text-2xl text-black hover:text-green-500 cursor-pointer"
                                    onClick={() => {
                                        handleUpdateBatch(batch._id);
                                    }}
                                    title="Update Batch"
                                />

                                {/* Add User Icon */}
                                <FontAwesomeIcon
                                    icon={faUserPlus} // Use user-plus icon for adding a user
                                    className="text-2xl text-black hover:text-green-500 cursor-pointer"
                                    onClick={() => {
                                        setNewUser({ ...newUser, batchId: batch._id });
                                        setIsModalOpen(true);
                                    }}
                                    title="Add User"
                                />
                            </div>,
                        ],
                    })}

                </div>
            </div>

            {/* Modals for Create User and Create Batch */}
            {isModalOpen && (
                <CreateUserModal
                    setIsModalOpen={setIsModalOpen}
                    onSubmit={handleCreateUser}
                />
            )}
            <CreateBatchModal
                isOpen={showCreateModal}
                closeModal={() => setShowCreateModal(false)}
                handleCreateBatch={handleCreateBatch}
                newBatch={newBatch}
                setNewBatch={setNewBatch}
            />
        </>
    );
}

export default Batches;
