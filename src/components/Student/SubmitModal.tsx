import React, { useState } from 'react';
import ControlledEditor from '@monaco-editor/react';
import { useSubmit } from '../../hooks/hooks';

function SubmitModal({ isOpen, onClose, quiz, submitterId, batchId }) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.cpp')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target.result);
                setFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .cpp file');
        }
    };

    const { isSubmitting, error, success, submitFile } = useSubmit(fileContent, fileName, quiz, submitterId, batchId);

    if (!isOpen) return null; // Modal is not visible

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('custom-vs-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#1E1E1E',
            },
        });
    };

    const handleEditorDidMount = (editor, monaco) => {
        monaco.editor.setTheme('custom-vs-dark');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center overflow-auto">
            <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white shadow-lg rounded-lg p-6 relative mx-4 overflow-y-auto max-h-[90vh]">
                {/* Enlarged Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white bg-red-300 hover:bg-red-500 rounded-full p-3 transition duration-200 ease-in-out"
                    aria-label="Close Modal"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Submit Your C++ Code
                </h2>

                <div className="mb-4">
                    <input
                        type="file"
                        accept=".cpp"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {fileContent && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">
                            Preview: {fileName}
                        </h3>
                        <ControlledEditor
                            height="300px"
                            language="cpp"
                            value={fileContent}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                            }}
                        />
                    </div>
                )}

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">File submitted successfully!</p>}

                <div className="flex justify-center items-center mt-6 w-full space-x-4">
                    {/* Button Wrapper with equal width */}
                    <div className="w-full flex space-x-4">
                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                        >
                            Cancel
                        </button>
                        {/* Submit Button */}
                        <button
                            onClick={submitFile}
                            disabled={!fileContent || isSubmitting}
                            className={`w-full px-4 py-2 text-white font-semibold rounded-md focus:outline-none ${fileContent && !isSubmitting
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit File'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SubmitModal;
