'use client';

import { createContext } from 'react';
import type { AuthTab } from '@/features/auth/constants/auth.constants';

export interface AuthModalContextType {
    isOpen: boolean;
    activeTab: AuthTab;
    onOpen: () => void;
    onOpenWithTab: (tab: AuthTab) => void;
    onClose: () => void;
    setActiveTab: (tab: AuthTab) => void;
}

export const AuthModalContext = createContext<AuthModalContextType |undefined>(undefined);