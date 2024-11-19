// GenericModal.tsx
import React from 'react';

const GenericModal = ({
    isOpen,
    closeModal,
    title,
    content,
    onOkClick,
    cancelButtonText = 'Cancel',
    okButtonText = 'OK',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-lg mx-4 sm:mx-6 lg:max-w-3xl">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-white bg-black hover:bg-gray-500 rounded-full p-3 transition duration-200 ease-in-out"
                    aria-label="Close Modal"
                >
                    ✕
                </button>

                <h3 className="mb-4 text-lg font-bold text-center">{title}</h3>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[250px] space-y-4">
                    {content}
                </div>

                {/* Buttons */}
                <div className="w-full flex space-x-4 mt-4">
                    <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 text-white bg-gray-300 hover:bg-gray-500 rounded-md"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onOkClick}
                        className="w-full px-4 py-2 text-white bg-black hover:bg-gray-500 rounded-md"
                    >
                        {okButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericModal;
