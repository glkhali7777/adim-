import React, { useState } from 'react';
import { BrokerBrandConfig } from '../types/broker';
import { Settings, Save, Smartphone, Shield, Sparkles, Check, Globe } from 'lucide-react';

interface BrokerSettingsProps {
  config: BrokerBrandConfig;
  onUpdateConfig: (updates: Partial<BrokerBrandConfig>) => void;
}

export const BrokerSettings: React.FC<BrokerSettingsProps> = ({
  config,
  onUpdateConfig
}) => {
  const [formState, setFormState] = useState<BrokerBrandConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formState);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl glass-panel-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FF7700]" />
            <span>Configurações Globais da Marca & Motor Broker QX</span>
          </h2>
          <p className="text-xs text-[#8C97B3] mt-1">
            Parâmetros do motor do traderoom, branding, PWA e políticas da plataforma.
          </p>
        </div>

        {saved && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Configurações salvas</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Identity */}
        <div className="p-6 rounded-2xl glass-panel-subtle space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <span>Identidade Visual & Branding do Traderoom</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#8C97B3] mb-1">
                Nome Oficial da Corretora
              </label>
              <input
                type="text"
                value={formState.brandName}
                onChange={(e) => setFormState({ ...formState, brandName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#FF7700]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8C97B3] mb-1">
                Aviso Geral do Sistema aos Clientes
              </label>
              <input
                type="text"
                value={formState.systemNotification}
                onChange={(e) => setFormState({ ...formState, systemNotification: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#FF7700]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8C97B3] mb-1">
                URL da Logo Principal (Traderoom)
              </label>
              <input
                type="text"
                value={formState.logoUrl}
                onChange={(e) => setFormState({ ...formState, logoUrl: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-[#FF7700]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8C97B3] mb-1">
                Preloader Animado (GIF)
              </label>
              <input
                type="text"
                value={formState.preloaderGifUrl}
                onChange={(e) => setFormState({ ...formState, preloaderGifUrl: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono focus:outline-none focus:border-[#FF7700]"
              />
            </div>
          </div>
        </div>

        {/* Engine Features & PWA */}
        <div className="p-6 rounded-2xl glass-panel-subtle space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-orange-400" />
            <span>Recursos do Motor & Aplicativo Mobile PWA</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">PWA Liberado para Mobile</span>
                <span className="text-[11px] text-[#8C97B3] block">
                  Permite instalação como aplicativo nativo e rota dedicada em /pwa/traderoom
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.pwaLiberado}
                onChange={(e) => setFormState({ ...formState, pwaLiberado: e.target.checked })}
                className="w-4 h-4 accent-[#FF7700] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Campanha de Bônus de Depósito</span>
                <span className="text-[11px] text-[#8C97B3] block">
                  Exibe modal interativo "Adicionar fundos com bônus" para o cliente
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.depositBonusEnabled}
                onChange={(e) => setFormState({ ...formState, depositBonusEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#FF7700] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Modo de Manutenção</span>
                <span className="text-[11px] text-[#8C97B3] block">
                  Pausa ordens de compra e venda temporariamente para manutenção no servidor
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.maintenanceMode}
                onChange={(e) => setFormState({ ...formState, maintenanceMode: e.target.checked })}
                className="w-4 h-4 accent-[#FF7700] rounded"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white btn-orange"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações Globais</span>
          </button>
        </div>
      </form>
    </div>
  );
};
