'use client';
import { useState } from 'react';
import { AuthModalContext } from '../context/AuthModalContext';
import type { AuthTab } from '@/features/auth/constants/auth.constants';

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTab>('login');

    const onOpenWithTab = (tab: AuthTab) => {
        setActiveTab(tab);
        setIsOpen(true);
    };

    const value = {
        isOpen,
        activeTab,
        onOpen: () => setIsOpen(true),
        onOpenWithTab,
        onClose: () => setIsOpen(false),
        setActiveTab,
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
}