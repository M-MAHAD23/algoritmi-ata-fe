import React, { Children, useState } from "react";
import LaunchATAContext from "./AppContext";

const LaunchPadProvider = ({ children }) => {
    const [profile, setProfile] = useState({});

    return (
        <LaunchATAContext.Provider
            value={{
                profile, setProfile
            }}
        >
            {children}
        </LaunchATAContext.Provider>
    );
};

export default LaunchPadProvider;