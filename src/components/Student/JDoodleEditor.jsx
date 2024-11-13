import React, { useEffect } from 'react';

function JDoodleEditor() {
    useEffect(() => {
        // Check if the JDoodle script is already present in the document
        const existingScript = document.querySelector('script[src="https://www.jdoodle.com/assets/jdoodle-pym.min.js"]');
        if (!existingScript) {
            // Dynamically load the JDoodle script if it is not already loaded
            const script = document.createElement('script');
            script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
            script.async = true;
            document.body.appendChild(script);
        }

        // Cleanup the script when component unmounts (optional in this case)
        return () => {
            const scriptToRemove = document.querySelector('script[src="https://www.jdoodle.com/assets/jdoodle-pym.min.js"]');
            if (scriptToRemove) {
                document.body.removeChild(scriptToRemove);
            }
        };
    }, []);

    return (
        <div>
            <div data-pym-src="https://www.jdoodle.com/embed/v1/31413a3def37690b"></div>
        </div>
    );
}

export default JDoodleEditor;
