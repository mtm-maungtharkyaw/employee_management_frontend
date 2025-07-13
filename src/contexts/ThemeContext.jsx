import { createContext, useContext, useEffect, useState } from "react";

// Create context
export const ThemeContext = createContext();

// Custom hook to access the context easily
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => {
            const newState = !prev;
            localStorage.setItem('sidebarState', JSON.stringify(newState));
            return newState;
        });
    };

    useEffect(() => {
        const stored = localStorage.getItem('sidebarState');
        if (stored !== null) {
            setIsSidebarOpen(JSON.parse(stored));
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </ThemeContext.Provider>
    );
};
