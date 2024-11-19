import { useState, useEffect } from 'react';
import { useSubmit } from '../../../hooks/hooks';
import ControlledEditor from '@monaco-editor/react';
import GenericModal from "../../../components/GenericModal";

function SubmitQuizModal({ isOpen, onClose, quiz, submitterId, batchId }) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [uploadError, setUploadError] = useState(''); // For error handling

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.cpp')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target.result);
                setFileName(file.name);
                setUploadError(''); // Clear error if valid file is uploaded
            };
            reader.readAsText(file);
        } else {
            setUploadError('Please upload a valid .cpp file');
        }
    };

    const { isSubmitting, error, success, submitFile } = useSubmit(fileContent, fileName, quiz, submitterId, batchId);

    const handleSubmit = () => {
        if (!fileContent) {
            setUploadError('Please upload a file before submitting.');
            return;
        }
        setUploadError(''); // Clear error before making API call
        submitFile();
    };

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

    // Close modal if submission is successful
    useEffect(() => {
        if (success) {
            setTimeout(() => {
                onClose(); // Close modal after successful submission
            }, 1000); // Delay for success message to appear before closing
        }
    }, [success, onClose]);

    // Modal Content
    const modalContent = (
        <div>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".cpp"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
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
        </div>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            closeModal={onClose}
            title="Submit Your C++ Code"
            content={modalContent}
            onOkClick={handleSubmit}
            cancelButtonText="Cancel"
            okButtonText={isSubmitting ? 'Submitting...' : 'Submit File'}
            hasScroll={false} // Disable scroll for this modal
        />
    );
}

export default SubmitQuizModal;
