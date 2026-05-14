'use client';

import { useState } from 'react';
import { useAuthModal } from '@/shared/hooks/useAuthModal';
import { Home } from 'lucide-react';
import { MODAL_LABELS } from '@/shared/constants/modal.constants';
import { UI_LABELS } from '@/shared/constants/ui.constants';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';
import { AUTH } from '@/features/auth/constants/auth.constants';

export const AuthModal = () => {
  const { isOpen, onClose, activeTab, setActiveTab } = useAuthModal();
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setVerificationEmail(null);
    onClose();
  };

  const handleRegisterSuccess = (email: string) => {
    setVerificationEmail(email);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-4xl shadow-2xl w-full max-w-110 p-10 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
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
          {verificationEmail ? (
            <div className="space-y-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-center">
              <h3 className="text-lg font-semibold text-text-primary">{AUTH.UI.VERIFY_EMAIL_TITLE}</h3>
              <p className="text-sm text-text-secondary">{AUTH.UI.VERIFY_EMAIL_SUBTITLE}</p>
              <p className="text-xs text-text-muted">{verificationEmail}</p>
              <button
                type="button"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                onClick={() => {
                  setVerificationEmail(null);
                  setActiveTab('login');
                }}
              >
                {AUTH.UI.BACK_TO_LOGIN}
              </button>
            </div>
          ) : (
            activeTab === 'login' ? (
              <LoginForm
                onSuccess={handleClose}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};