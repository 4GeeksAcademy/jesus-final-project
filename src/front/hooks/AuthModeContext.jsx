// Import necessary hooks and functions from React.
import React, { createContext, useState, useContext } from "react";

const AuthModeContext = createContext();

export const AuthModeProvider = ({ children }) => {
    const [mode, setMode] = useState("registro");

    return (
        <AuthModeContext.Provider value={{ mode, setMode }}>
            {children}
        </AuthModeContext.Provider>
    );
};

export const useAuthMode = () => useContext(AuthModeContext);