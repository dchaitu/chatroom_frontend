import {createContext, useContext, useEffect, useState} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || null;
    });

    useEffect(() => {
        console.log("AuthProvider mounted");
    }, []);

    return (
        <AuthContext.Provider value={{ username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};