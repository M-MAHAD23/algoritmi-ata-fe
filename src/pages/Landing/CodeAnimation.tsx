import { useState, useEffect, useRef } from "react";

const CodeAnimation = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const codeSnippet = ` function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));`;

  const result = `Hello, World!`;

  const typingIntervalRef = useRef(null);

  const highlightSyntax = (code) => {
    return code.split("\n").map((line, lineIndex) => (
      <div key={lineIndex} className="code-line">
        <span className="text-green-400">{line}</span>
      </div>
    ));
  };

  const startTypingAnimation = () => {
    let charIndex = 0;
    setDisplayedCode(""); // Reset code display
    setCompiling(false);
    setShowResult(false);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current); // Clear any previous interval
    }

    typingIntervalRef.current = setInterval(() => {
      // Ensure the character is not undefined before appending
      if (charIndex < codeSnippet.length) {
        setDisplayedCode((prev) => prev + (codeSnippet[charIndex] || ""));
        charIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        setTimeout(() => setCompiling(true), 500); // Trigger compiling phase
      }
    }, 50);
  };

  useEffect(() => {
    startTypingAnimation();  // Start animation on mount

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);  // Cleanup on unmount
      }
    };
  }, []);

  useEffect(() => {
    if (compiling) {
      const compileTimeout = setTimeout(() => {
        setCompiling(false);
        setShowResult(true);
        setTimeout(() => startTypingAnimation(), 3000);  // Restart animation
      }, 1500);  // Simulate compile time

      return () => clearTimeout(compileTimeout);
    }
  }, [compiling]);

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full md:w-10/12 mx-auto border border-gray-700 mt-[-120px]" style={{ height: "350px", overflow: "hidden" }}>
      {/* VS Code Top Bar */}
      <div className="bg-gray-800 text-gray-400 px-4 flex justify-between items-center">
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
          <ul className="text-xs text-left mr-10">
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
            <p className="absolute bottom-24 right-4 text-green-400 mt-4">
              Compiling...
            </p>
          )}
          {showResult && (
            <div className="absolute bottom-24 right-4 bg-gray-800 p-2 rounded-lg mt-4">
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
