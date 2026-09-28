import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AuditLog } from '../../types';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const AuditLogModule: React.FC = () => {
  const { auditLogs } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState('ALL');

  // Filtered Logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction =
      selectedActionType === 'ALL' || log.actionType === selectedActionType;

    const matchesModule =
      selectedModule === 'ALL' || log.module === selectedModule;

    return matchesSearch && matchesAction && matchesModule;
  });

  const handleExportCSV = () => {
    const header = ['ID', 'Horodatage', 'Utilisateur', 'Rôle', 'Action', 'Module', 'Description'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      l.role,
      l.actionType,
      `"${l.module}"`,
      `"${l.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allModules = Array.from(new Set(auditLogs.map(l => l.module)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Traçabilité des Opérations & Journal d'Audit
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enregistrement immuable et horodaté de toutes les modifications (notes, paiements, inscriptions, suppressions).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exporter Journal (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé, utilisateur ou détail d'opération..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedActionType}
            onChange={e => setSelectedActionType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold outline-none"
          >
            <option value="ALL">Tous les types d'actions</option>
            <option value="CRÉATION">CRÉATION</option>
            <option value="MODIFICATION">MODIFICATION</option>
            <option value="SUPPRESSION">SUPPRESSION</option>
            <option value="CONNEXION">CONNEXION</option>
            <option value="EXPORT">EXPORT</option>
            <option value="RESTAURATION">RESTAURATION</option>
          </select>

          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold outline-none"
          >
            <option value="ALL">Tous les modules</option>
            {allModules.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Auteur</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Description de l'Opération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredLogs.map(log => {
                const actionBadgeColors = {
                  CRÉATION: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
                  MODIFICATION: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
                  SUPPRESSION: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400',
                  CONNEXION: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400',
                  EXPORT: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
                  IMPRESSION: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
                  RESTAURATION: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400',
                }[log.actionType] || 'bg-slate-100 text-slate-700';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${actionBadgeColors}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                      {log.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
