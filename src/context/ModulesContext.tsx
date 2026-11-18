import { createContext, ReactNode, useContext, useState } from 'react';

export type Module = {
    id: string;
    code: string;
    name: string;
    attended: number;
    held: number;
}

type ContextValue = {
    modules: Module[];
    markAttendance: (id: string, present: boolean) => void;
    addModule: (code: string, name: string) => void;
};

const INITIAL: Module[] = [
    { id: '1', code: 'BECS 32272', name: 'Mobile Application Dev', attended: 22, held: 24 },    // 92% Good
    { id: '2', code: 'BECS 32453', name: 'Digital Signal Processing', attended: 14, held: 24 }, // 58% Warning
    { id: '3', code: 'COSC 34122', name: 'Cyber Security', attended: 10, held: 24 },            // 42% Low
    { id: '4', code: 'BECS 32263', name: 'Full-Stack Software Dev', attended: 19, held: 24 },   // 79% Good
];

const ModulesContext = createContext<ContextValue | null>(null);

export function ModulesProvider({ children }: { children: ReactNode }) {
    const [modules, setModules ] = useState(INITIAL);

    const markAttendance = (id: string, present: boolean) => {
        setModules((prev) =>
            prev.map ((m) =>
                m.id === id ? { ...m, held: m.held + 1, attended: m.attended + (present ? 1 : 0)}: m
            )
        );
    };

    const addModule = (code: string, name: string) => {
        const newModule: Module = {
            id: Date.now().toString(), // unique id based on the current time
            code,
            name,
            attended: 0,
            held: 0,
        };
        setModules((prev) => [...prev, newModule]);
    };

    return (
        <ModulesContext.Provider value={{ modules, markAttendance, addModule}}>
            {children}
        </ModulesContext.Provider>
    );
}



export function useModules() {
    const ctx = useContext(ModulesContext);
    if (!ctx) throw new Error('useModules must be used inside ModulesProvider');
    return ctx;
}