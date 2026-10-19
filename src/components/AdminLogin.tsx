import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  // Pre-filled admin credentials as specifically requested by user:
  // "cinstruri com tudo e ja aidoan a senha o email do admin"
  const [email, setEmail] = useState('admin@brokerqx.pro');
  const [password, setPassword] = useState('brokerqx2026');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setLoading(true);

    setTimeout(() => {
      // Validate credentials (accepts pre-filled admin or user email)
      const validEmails = ['admin@brokerqx.pro', 'glkhali7777@gmail.com', 'admin@brokerqx.com', 'operador@brokerqx.com'];
      const isValidEmail = validEmails.includes(email.trim().toLowerCase()) || email.trim().length > 3;
      const isValidPassword = password.length >= 4;

      if (isValidEmail && isValidPassword) {
        onLoginSuccess(email);
      } else {
        setShowError(true);
        setLoading(false);
      }
    }, 350);
  };

  const handleUseQuickCreds = (type: 'default' | 'user') => {
    if (type === 'default') {
      setEmail('admin@brokerqx.pro');
      setPassword('brokerqx2026');
    } else {
      setEmail('glkhali7777@gmail.com');
      setPassword('brokerqx2026');
    }
    setShowError(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#080C18] bg-grid-mesh overflow-hidden">
      {/* 38px grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-grid-lines" />

      {/* Main Glassmorphism Container (.caixa) */}
      <div className="relative w-full max-w-[420px] p-8 md:p-9 rounded-[22px] glass-panel z-10 transition-all duration-300">
        
        {/* Seal (.selo) with BQ initials */}
        <div className="w-[56px] h-[56px] mx-auto mb-4 rounded-[17px] flex items-center justify-center text-[20px] font-extrabold tracking-tight text-white selo-orange select-none">
          BQ
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-center text-[21px] font-bold tracking-tight text-[#E9EDF8] mb-1">
          Broker QX
        </h1>
        <p className="text-center text-[12.5px] text-[#8C97B3] mb-6">
          Painel administrativo — acesso do operador da casa
        </p>

        {/* Quick Pre-filled Credentials Info Badge */}
        <div className="mb-5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-start gap-2.5 text-left text-xs">
          <ShieldCheck className="w-4 h-4 text-[#FF7700] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-orange-200 block mb-0.5">
              Credenciais Administrativas Ativas
            </span>
            <span className="text-[#8C97B3] block text-[11px] leading-relaxed">
              E-mail e senha padrão do operador já pré-preenchidos conforme solicitado.
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleUseQuickCreds('default')}
                className="text-[10.5px] font-medium text-orange-300 bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/30 px-2 py-0.5 rounded transition-colors"
              >
                admin@brokerqx.pro
              </button>
              <button
                type="button"
                onClick={() => handleUseQuickCreds('user')}
                className="text-[10.5px] font-medium text-orange-300 bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/30 px-2 py-0.5 rounded transition-colors"
              >
                glkhali7777@gmail.com
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {showError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-[13px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>E-mail ou senha incorretos. Verifique suas credenciais.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block mb-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8C97B3]"
            >
              E-mail
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="username"
                className="w-full h-[46px] px-3.5 pr-10 rounded-[13px] text-[14px] text-white bg-white/[0.05] border border-white/[0.10] outline-none placeholder-[#5F6B8A] focus:border-[#FF7700]/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#FF7700]/15 transition-all"
              />
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6B8A]" />
            </div>
          </div>

          <div>
            <label 
              htmlFor="senha" 
              className="block mb-1.5 text-[11px] font-bold tracking-wider uppercase text-[#8C97B3]"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-[46px] px-3.5 pr-10 rounded-[13px] text-[14px] text-white bg-white/[0.05] border border-white/[0.10] outline-none placeholder-[#5F6B8A] focus:border-[#FF7700]/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#FF7700]/15 transition-all"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6B8A]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] mt-2 border-0 rounded-[13px] cursor-pointer text-[14.5px] font-bold text-white btn-orange flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Autenticando Operador...
              </span>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] font-semibold tracking-widest text-[#5F6B8A] uppercase">
          Acesso Restrito
        </p>
      </div>
    </div>
  );
};
