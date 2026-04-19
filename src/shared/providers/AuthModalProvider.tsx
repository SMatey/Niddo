'use client';
import { useState } from 'react';
import { AuthModalContext } from '../context/AuthModalContext';

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const value = {
        isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
}