import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserSession } from '../types';
import { playCyberSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  onLogin: (provider: 'google' | 'github') => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  session,
  onLogin,
  onLogout,
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProviderLogin = (provider: 'google' | 'github') => {
    setConnecting(provider);
    playCyberSound('CLICK');

    setTimeout(() => {
      onLogin(provider);
      setConnecting(null);
      playCyberSound('PROFIT');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-[#0e1320] border border-[#232d42] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#151b29] border border-[#232c40]"
        >
          <X className="w-4 h-4" />
        </button>

        {session.isAuthenticated ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] mx-auto p-0.5 flex items-center justify-center shadow-lg">
              <img
                src={session.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{session.user?.name}</h3>
              <p className="text-slate-400 text-xs">{session.user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#14F195] text-[11px] font-bold mt-2 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cloud Synced & Multi-Device Enabled
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Provider: {session.user?.provider.toUpperCase()}</span>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-[#9945FF] mx-auto flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                AUTHENTICATE APEX QUANTUM
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sync bot strategies, multi-wallet keys, and custom backtests securely across all devices.
              </p>
            </div>

            <div className="space-y-3">
              {/* Google Button */}
              <button
                disabled={connecting !== null}
                onClick={() => handleProviderLogin('google')}
                className="w-full p-3 rounded-xl bg-[#172032] hover:bg-[#202c46] border border-[#2b3954] text-white text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {connecting === 'google' ? 'CONNECTING GOOGLE ID...' : 'Sign in with Google'}
              </button>

              {/* GitHub Button */}
              <button
                disabled={connecting !== null}
                onClick={() => handleProviderLogin('github')}
                className="w-full p-3 rounded-xl bg-[#172032] hover:bg-[#202c46] border border-[#2b3954] text-white text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer shadow"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {connecting === 'github' ? 'CONNECTING GITHUB...' : 'Sign in with GitHub'}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#080b11] border border-[#1e2638] flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#14F195] shrink-0" />
              <span>
                Zero custody: Your private keys never leave browser memory. Only encrypted preferences and strategy weights are synchronized.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
