'use client';

import { createContext } from 'react';

export interface AuthModalContextType {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType |undefined>(undefined);