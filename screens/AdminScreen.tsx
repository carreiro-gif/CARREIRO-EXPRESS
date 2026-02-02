
import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';

interface AdminScreenProps {
  onClose: () => void;
}

type Tab = 'IDENTITY' | 'APPEARANCE' | 'HOME' | 'SECURITY';

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { config, updateConfig, resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<Tab>('IDENTITY');
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS'>('IDLE');

  const handleSave = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      setSaveStatus('SUCCESS');
      setTimeout(() => {
        onClose();
      }, 800);
    }, 500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ logoImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'IDENTITY':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Nome da Loja</label>
              <input 
                type="text" 
                value={config.storeName}
                onChange={(e) => updateConfig({ storeName: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Totem Burger"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Slogan / Rodapé</label>
              <input 
                type="text" 
                value={config.slogan}
                onChange={(e) => updateConfig({ slogan: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Powered by Brendi"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Logotipo da Loja</label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative group">
                  {config.logoImage ? (
                    <img src={config.logoImage} className="w-full h-full object-contain" alt="Logo preview" />
                  ) : (
                    <span className="text-4xl text-gray-300">🖼️</span>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <span className="text-white text-xs font-bold uppercase">Trocar</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Formatos aceitos: PNG, JPG ou SVG. Tamanho recomendado: 512x512px.</p>
                  {config.logoImage && (
                    <button onClick={() => updateConfig({ logoImage: null })} className="text-red-500 text-xs font-bold uppercase hover:underline">Remover Logotipo</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'APPEARANCE':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Cor Primária (Botões e Destaques)</label>
              <div className="flex items-center gap-6">
                <input 
                  type="color" 
                  value={config.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="w-20 h-20 rounded-2xl cursor-pointer border-none p-0 overflow-hidden"
                />
                <span className="font-mono text-xl font-bold uppercase">{config.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Cor de Fundo (Tela Inicial)</label>
              <div className="flex items-center gap-6">
                <input 
                  type="color" 
                  value={config.backgroundColor}
                  onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                  className="w-20 h-20 rounded-2xl cursor-pointer border-none p-0 overflow-hidden"
                />
                <span className="font-mono text-xl font-bold uppercase">{config.backgroundColor}</span>
              </div>
            </div>
          </div>
        );
      case 'HOME':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Título de Boas-vindas</label>
              <input 
                type="text" 
                value={config.welcomeTitle}
                onChange={(e) => updateConfig({ welcomeTitle: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subtítulo</label>
              <textarea 
                value={config.welcomeSubtitle}
                onChange={(e) => updateConfig({ welcomeSubtitle: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-100">
              <div className="space-y-4">
                <h4 className="font-black text-gray-800 uppercase tracking-tight">Botão 1 (Comer Aqui)</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Título</label>
                  <input type="text" value={config.dineInButtonTitle} onChange={(e) => updateConfig({ dineInButtonTitle: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Subtítulo</label>
                  <input type="text" value={config.dineInButtonSubtitle} onChange={(e) => updateConfig({ dineInButtonSubtitle: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-gray-800 uppercase tracking-tight">Botão 2 (Para Levar)</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Título</label>
                  <input type="text" value={config.takeOutButtonTitle} onChange={(e) => updateConfig({ takeOutButtonTitle: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Subtítulo</label>
                  <input type="text" value={config.takeOutButtonSubtitle} onChange={(e) => updateConfig({ takeOutButtonSubtitle: e.target.value })} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'SECURITY':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Novo PIN de Acesso (4 dígitos)</label>
              <p className="text-gray-400 text-sm mb-4 italic">Este PIN será exigido na próxima vez que você tentar acessar este painel.</p>
              <input 
                type="password" 
                maxLength={4}
                value={config.adminPin}
                onChange={(e) => updateConfig({ adminPin: e.target.value.replace(/\D/g, '') })}
                className="w-full p-6 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-4xl tracking-[1em] font-mono text-center"
                placeholder="****"
              />
            </div>
            <div className="pt-10 border-t-2 border-gray-100 flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 uppercase">ZONA DE PERIGO</h4>
              <button 
                onClick={() => {
                  if(confirm("Tem certeza que deseja resetar TODAS as configurações?")) {
                    resetConfig();
                  }
                }}
                className="text-red-600 font-bold border-2 border-red-100 px-6 py-4 rounded-xl hover:bg-red-50 transition-colors w-full sm:w-auto"
              >
                Resetar para padrões de fábrica
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-900 p-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tight">Painel Administrativo</h1>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest opacity-60">Configurações Locais</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <nav className="w-72 bg-gray-50 border-r-2 border-gray-100 flex flex-col p-6 gap-2">
            {[
              { id: 'IDENTITY', label: 'Identidade', icon: '🏪' },
              { id: 'APPEARANCE', label: 'Aparência', icon: '🎨' },
              { id: 'HOME', label: 'Tela Inicial', icon: '🏠' },
              { id: 'SECURITY', label: 'Segurança', icon: '🔐' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-4 p-5 rounded-2xl font-black text-lg transition-all ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <main className="flex-1 p-12 overflow-y-auto bg-white">
            {renderTabContent()}
          </main>
        </div>

        {/* Footer */}
        <div className="p-8 border-t-2 border-gray-100 bg-white flex justify-end gap-4 items-center">
          {saveStatus === 'SUCCESS' && (
            <span className="text-green-600 font-bold animate-in fade-in slide-in-from-right-2">✓ Alterações aplicadas!</span>
          )}
          <button 
            onClick={onClose}
            className="px-8 py-4 text-gray-500 font-black text-xl hover:bg-gray-100 rounded-2xl transition-colors"
            disabled={saveStatus === 'SAVING'}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={saveStatus !== 'IDLE'}
            className={`px-12 py-4 text-white font-black text-xl rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-3 ${
              saveStatus === 'IDLE' ? 'bg-gray-900' : 'bg-gray-400'
            }`}
          >
            {saveStatus === 'SAVING' ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            {saveStatus === 'SUCCESS' ? 'SALVO' : 'SALVAR ALTERAÇÕES'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
