import React, { Children, useState } from "react";
import LaunchATAContext from "./AppContext";

const LaunchPadProvider = ({ children }) => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [teacherSelectedBatch, setTeacherSelectedBatch] = useState(null);

    return (
        <LaunchATAContext.Provider
            value={{
                profile, setProfile, loading, setLoading, teacherSelectedBatch, setTeacherSelectedBatch,
            }}
        >
            {children}
        </LaunchATAContext.Provider>
    );
};

export default LaunchPadProvider;