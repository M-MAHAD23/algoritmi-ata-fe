import { useState, useEffect } from 'react';

const CodeAnimation = () => {
    const [displayedCode, setDisplayedCode] = useState("");
    const [compiling, setCompiling] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const codeSnippet = `function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));`;

    const result = `Hello, World!`;

    // Escape special characters like <, >, & for HTML rendering
    const escapeHtml = (unsafe) => {
        return unsafe.replace(/[&<>"']/g, (char) => {
            switch (char) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return char;
            }
        });
    };

    // Display code with applied styling
    const highlightSyntax = (code) => {
        return code.split("\n").map((line, lineIndex) => (
            <div key={lineIndex} className="code-line">
                <span className="text-green-400">{escapeHtml(line)}</span> {/* Escape HTML special characters */}
            </div>
        ));
    };

    useEffect(() => {
        let charIndex = 0;
        const typeCode = () => {
            const typingInterval = setInterval(() => {
                setDisplayedCode((prev) => prev + codeSnippet[charIndex]);
                charIndex++;
                if (charIndex === codeSnippet.length) {
                    clearInterval(typingInterval);
                    setTimeout(() => setCompiling(true), 500); // Start compiling
                }
            }, 50);
        };

        typeCode();
    }, []);

    useEffect(() => {
        if (compiling) {
            const compileTimeout = setTimeout(() => {
                setCompiling(false);
                setShowResult(true); // Show result after compiling
                setTimeout(() => resetAnimation(), 3000); // Reset the animation
            }, 1500); // Simulate compile time
            return () => clearTimeout(compileTimeout);
        }
    }, [compiling]);

    const resetAnimation = () => {
        setDisplayedCode("");
        setCompiling(false);
        setShowResult(false);
        setTimeout(() => {
            let charIndex = 0;
            const typingInterval = setInterval(() => {
                setDisplayedCode((prev) => prev + codeSnippet[charIndex]);
                charIndex++;
                if (charIndex === codeSnippet.length) {
                    clearInterval(typingInterval);
                    setTimeout(() => setCompiling(true), 500); // Start compiling
                }
            }, 50);
        }, 500);
    };

    return (
        <div
            className="bg-gray-900 text-white rounded-lg shadow-lg w-full md:w-4/5 mx-auto border border-gray-700"
            style={{ height: "500px", overflow: "hidden" }} // Increased the height to 500px
        >
            {/* VS Code Top Bar */}
            <div className="bg-gray-800 text-gray-400 py-2 px-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-sm">index.js - Visual Studio Code</p>
                <div></div>
            </div>

            {/* VS Code Layout */}
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="bg-gray-800 text-gray-400 w-1/5 p-3">
                    <p className="text-sm text-gray-300 mb-2 text-left">Explorer</p>
                    <ul className="text-sm text-left mr-10">
                        <li className="text-blue-400">index.js</li>
                        <li>app.css</li>
                        <li>package.json</li>
                        <li>node_modules</li>
                    </ul>
                </div>

                {/* Code Editor */}
                <div className="w-4/5 bg-gray-900 p-4 relative overflow-auto text-left font-mono">
                    <pre className="text-sm whitespace-pre-wrap">
                        {highlightSyntax(displayedCode)}
                    </pre>
                    {compiling && (
                        <p className="absolute bottom-24 right-4 text-green-400 mt-4"> {/* Right-aligned with margin top */}
                            Compiling...
                        </p>
                    )}
                    {showResult && (
                        <div className="absolute bottom-24 right-4 bg-gray-800 p-2 rounded-lg mt-4"> {/* Right-aligned with margin top */}
                            <p className="text-blue-300">// Output:</p>
                            <p className="text-yellow-400">{result}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CodeAnimation;
