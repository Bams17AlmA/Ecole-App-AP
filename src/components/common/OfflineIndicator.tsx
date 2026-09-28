import React from 'react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <div>
        <p className="font-bold">Mode Hors-Ligne Actif</p>
        <p className="text-[11px] text-amber-100 font-normal">Vos données locales sont conservées et disponibles.</p>
      </div>
    </div>
  );
};

export const UpdateNotification: React.FC<{
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}> = ({ show, onUpdate, onDismiss }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-top">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold">Nouvelle mise à jour disponible !</h4>
          <p className="text-xs text-slate-300 mt-1">Une nouvelle version de l'application est prête à être installée.</p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={onUpdate}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition"
            >
              Mettre à jour
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
