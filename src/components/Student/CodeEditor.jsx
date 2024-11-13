import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the backend WebSocket server
function CodeEditor() {

    return (
        <div className="h-screen w-full">
            <h2 className="text-center text-xl mb-4">Embedded IDE</h2>
            <iframe
                src="https://replit.com/@MuhammadMahad9/EvilFaroffRevisioncontrol?embed=true"
                className="w-full h-full border-none"
                title="Embedded Repl"
            />
        </div>
    );
}
export default CodeEditor;
