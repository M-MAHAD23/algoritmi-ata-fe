import React, { useState } from 'react';
import ControlledEditor from '@monaco-editor/react';
import { useSubmit } from '../../hooks/hooks';

function Submit() {
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

    const { isSubmitting, error, success, submitFile } = useSubmit(fileContent, fileName);

    return (
        <div className="min-h-screen bg-[#0E0D15] flex items-center justify-center py-10">
            <div className="max-w-7xl w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Submit Your C++ Code</h2>

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
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Preview: {fileName}</h3>
                        <ControlledEditor
                            height="400px"
                            language="cpp"
                            value={fileContent}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                wordWrap: "on",
                            }}
                        />
                    </div>
                )}

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">File submitted successfully!</p>}

                <div className="text-center">
                    <button
                        onClick={submitFile}
                        disabled={!fileContent || isSubmitting}
                        className={`w-48 py-2 px-4 text-white font-semibold rounded-md focus:outline-none ${fileContent && !isSubmitting ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} mx-auto`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit File'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Submit;
