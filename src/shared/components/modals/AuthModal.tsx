'use client';

import { useState } from 'react';
import { useAuthModal } from '@/shared/hooks/useAuthModal';
import { Home } from 'lucide-react';
import { MODAL_LABELS } from '@/shared/constants/modal.constants';
import { UI_LABELS } from '@/shared/constants/ui.constants';

export const AuthModal = () => {
  const { isOpen, onClose } = useAuthModal();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-4xl shadow-2xl w-full max-w-110 p-10 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="text-2xl font-medium leading-none">{UI_LABELS.CLOSE}</span>
        </button>

        <div className="text-center mb-9">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-6 shadow-md">
             <Home className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-[28px] font-bold text-gray-950 leading-tight">
            {MODAL_LABELS.WELCOME_MESSAGE}
          </h2>
          <p className="mt-2.5 text-base text-gray-600">
            {MODAL_LABELS.SLOGAN}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 mb-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'login'
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {MODAL_LABELS.LOGIN_TAB}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {MODAL_LABELS.REGISTER_TAB}
          </button>
        </div>

        
        <div className="animate-fadeIn">
          {activeTab === 'login' ? (
            // TODO: Replace with LoginForm component when ready
            <div className="text-center py-8">
              <p className="text-gray-600">Login Form Component</p>
              <p className="text-sm text-gray-400 mt-2">Implementar LoginForm aquí</p>
            </div>
          ) : (
            // TODO: Replace with RegisterForm component when ready
            <div className="text-center py-8">
              <p className="text-gray-600">Register Form Component</p>
              <p className="text-sm text-gray-400 mt-2">Implementar RegisterForm aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};