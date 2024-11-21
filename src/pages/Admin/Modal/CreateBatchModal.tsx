import React, { useState } from 'react';
import GenericModal from '../../../components/GenericModal';

const CreateBatchModal = ({ isOpen, closeModal, handleCreateBatch, newBatch, setNewBatch }) => {
    const [errors, setErrors] = useState({});

    // Validate fields before submission
    const validateFields = () => {
        const newErrors = {};
        if (!newBatch.batchNumber) {
            newErrors.batchNumber = 'Batch number is required.';
        } else if (isNaN(newBatch.batchNumber)) {
            newErrors.batchNumber = 'Batch number must be a valid number.';
        }
        if (!newBatch.batchStart) newErrors.batchStart = 'Batch start date is required.';
        if (!newBatch.batchEnd) newErrors.batchEnd = 'Batch end date is required.';
        if (!newBatch.batchName) newErrors.batchName = 'Batch name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle create batch
    const onCreateBatch = () => {
        if (validateFields()) {
            handleCreateBatch(); // Call the parent function only if validation passes
        }
    };

    const content = (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Batch Number"
                    value={newBatch.batchNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                    className={`border p-2 w-full ${errors.batchNumber ? 'border-red-500' : ''}`}
                />
                {errors.batchNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="date"
                    placeholder="Batch Start"
                    value={newBatch.batchStart}
                    onChange={(e) => setNewBatch({ ...newBatch, batchStart: e.target.value })}
                    className={`border p-2 w-full ${errors.batchStart ? 'border-red-500' : ''}`}
                />
                {errors.batchStart && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchStart}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="date"
                    placeholder="Batch End"
                    value={newBatch.batchEnd}
                    onChange={(e) => setNewBatch({ ...newBatch, batchEnd: e.target.value })}
                    className={`border p-2 w-full ${errors.batchEnd ? 'border-red-500' : ''}`}
                />
                {errors.batchEnd && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchEnd}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Batch Name"
                    value={newBatch.batchName}
                    onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                    className={`border p-2 w-full ${errors.batchName ? 'border-red-500' : ''}`}
                />
                {errors.batchName && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchName}</p>
                )}
            </div>
        </div>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            closeModal={closeModal}
            title="Create Batch"
            content={content}
            onOkClick={onCreateBatch}
            cancelButtonText="Cancel"
            okButtonText="Create"
        />
    );
};

export default CreateBatchModal;
