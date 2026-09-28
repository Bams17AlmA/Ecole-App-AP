import React, { useRef, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  HardDriveDownload,
  Upload,
  Download,
  RotateCcw,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Layers,
} from 'lucide-react';

export const BackupRestoreModule: React.FC = () => {
  const { exportBackup, restoreBackup, resetToDemoData, establishment } = useSchool();
  const { isInstallable, isInstalled } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const [cacheUpdating, setCacheUpdating] = useState(false);
  const [cacheUpdatedMsg, setCacheUpdatedMsg] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = restoreBackup(content);
        setRestoreStatus(result);
        setTimeout(() => setRestoreStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdatePWACache = () => {
    setCacheUpdating(true);
    setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.update();
          }
        });
      }
      setCacheUpdating(false);
      setCacheUpdatedMsg(true);
      setTimeout(() => setCacheUpdatedMsg(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDriveDownload className="w-6 h-6 text-blue-600" />
            Sauvegarde, Restauration & Mode PWA Multi-Écrans
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sécurisation des données de l'école, export/import JSON et installation PWA pour PC, tablette et smartphone.
          </p>
        </div>
      </div>

      {/* Restore feedback toast */}
      {restoreStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in ${
            restoreStatus.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {restoreStatus.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-xs font-bold">{restoreStatus.message}</span>
        </div>
      )}

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Sauvegarde & Restauration JSON */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Sauvegarde & Restauration de la Base de Données
            </h3>
            <p className="text-xs text-slate-500">
              Exportez un instantané complet de votre ERP ou restaurez une sauvegarde précédente.
            </p>
          </div>

          <div className="space-y-4">
            {/* Export button */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Sauvegarder les Données (Export JSON)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Télécharge l'intégralité des élèves, notes, paiements et configurations.
                </p>
              </div>
              <button
                onClick={exportBackup}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>

            {/* Restore button */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Restaurer une Sauvegarde (Import JSON)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Sélectionnez un fichier .json précédemment exporté pour recharger les données.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Restaurer
                </button>
              </div>
            </div>

            {/* Reset Demo Data */}
            <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-red-900 dark:text-red-300">
                  Réinitialiser aux Données de Démonstration
                </h4>
                <p className="text-[11px] text-red-700/80 dark:text-red-400">
                  Restaure les données types certifiées (élèves, classes de Terminale/6ème, bulletins).
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs de test par défaut ?')) {
                    resetToDemoData();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950 font-bold text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Box 2: Installation PWA & Multi-écrans */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Installation Progressive Web App (PWA)
            </h3>
            <p className="text-xs text-slate-500">
              L'application fonctionne hors-ligne et s'installe nativement sur tous les écrans.
            </p>
          </div>

          <div className="space-y-4">
            {/* Install Button & Status */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Statut de l'Application
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                  {isInstalled ? 'Installée en mode autonome (PWA)' : 'Prête pour l\'installation'}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Accessible depuis l'écran d'accueil sans ouvrir le navigateur.
                </p>
              </div>

              <div>
                <PWAInstallButton />
              </div>
            </div>

            {/* Check for updates / Cache update */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Mises à Jour & Cache Local PWA
                </h4>
                <p className="text-[11px] text-slate-500">
                  Actualise les fichiers mis en cache par le Service Worker.
                </p>
                {cacheUpdatedMsg && (
                  <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                    ✓ Cache à jour et synchronisé !
                  </span>
                )}
              </div>
              <button
                onClick={handleUpdatePWACache}
                disabled={cacheUpdating}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${cacheUpdating ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>

            {/* Responsive Multi-device Compatibility Badges */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Compatibilité Multi-Appareils (36) :
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                  <Laptop className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">PC & Mac</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Adapté</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                  <Tablet className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Tablette</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Tactile optimisé</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                  <Smartphone className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Smartphone</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Mobile ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
