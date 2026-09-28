import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserAccount, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  UserPlus,
  Lock,
  Check,
  X,
  UserCheck,
  Trash2,
  Edit,
  Key,
} from 'lucide-react';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'Gestion complète de l\'établissement',
    'Création et suppression des classes & années',
    'Gestion des utilisateurs & rôles',
    'Exportation & restauration des sauvegardes',
    'Accès au journal d\'audit complet',
    'Saisie et modification de notes',
    'Encaissement des frais & gestion financière',
    'Génération de tous les documents & bulletins',
  ],
  DIRECTEUR: [
    'Supervision pédagogique et disciplinaire',
    'Validation des inscriptions & réinscriptions',
    'Consultation des finances & recouvrement',
    'Signature des bulletins & certificats',
    'Accès aux statistiques & bilans annuels',
    'Consultation du journal d\'audit',
  ],
  ENSEIGNANT: [
    'Consultation de l\'emploi du temps',
    'Prise des présences & retards de sa classe',
    'Création de devoirs & évaluations de sa matière',
    'Saisie des notes et appréciations individuelles',
    'Consultation des bulletins de ses élèves',
  ],
  COMPTABLE: [
    'Gestion de la grille tarifaire des frais scolaires',
    'Enregistrement des paiements & acomptes',
    'Émission des reçus officiels de caisse',
    'Suivi des dettes et relances financières',
    'Consultation des états d\'impayés',
  ],
  SECRETAIRE: [
    'Enregistrement des nouvelles inscriptions',
    'Édition des fiches d\'élèves et parents',
    'Impression des certificats de scolarité & cartes',
    'Saisie des justificatifs d\'absence',
  ],
  PARENT: [
    'Consultation des notes et bulletins de ses enfants',
    'Suivi de l\'assiduité (absences et retards)',
    'Consultation du solde financier & quittances',
    'Emploi du temps des cours',
  ],
};

export const UsersModule: React.FC = () => {
  const { users, currentUser, switchUser, addUser, updateUser, deleteUser } = useSchool();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('ENSEIGNANT');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullName.trim()) return;

    addUser({
      username: newUsername.trim().toLowerCase(),
      fullName: newFullName.trim(),
      email: newEmail.trim() || `${newUsername.trim()}@elitesdusavoir.org`,
      role: newRole,
      active: true,
      lastLogin: 'Jamais',
    });

    setIsAddUserModalOpen(false);
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Gestion des Utilisateurs, Rôles & Matrice des Permissions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Contrôle d'accès basé sur les rôles (RBAC) : Administrateur, Directeur, Comptable, Enseignant, Secrétaire et Parents.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Créer un Utilisateur
        </button>
      </div>

      {/* Active Session Simulation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
            Session Actuellement Utilisée
          </span>
          <h3 className="text-base font-extrabold">{currentUser.fullName} ({currentUser.username})</h3>
          <p className="text-xs text-blue-100">
            Rôle effectif : <strong className="text-amber-300">{currentUser.role}</strong> • Email : {currentUser.email}
          </p>
        </div>

        <div className="text-xs bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
          <span className="text-[10px] uppercase font-bold text-blue-200 block">Basculer de rôle instantanément :</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  u.id === currentUser.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {u.role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Comptes Utilisateurs Enregistrés ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">Identifiant</th>
                <th className="py-3 px-4">Rôle Attribué</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Dernière Connexion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {user.fullName}
                    <span className="block text-[10px] text-slate-400 font-normal">{user.email}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    @{user.username}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Actif
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {user.lastLogin || '2026-09-28 08:30'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => switchUser(user.id)}
                        title="Se connecter sous ce profil"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer l'utilisateur ${user.username} ?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Matrice des Droits & Permissions par Rôle
          </h3>
          <p className="text-xs text-slate-500">
            Détail des prérogatives et modules accessibles pour chaque profil du personnel scolaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).map(role => (
            <div
              key={role}
              className={`p-4 rounded-xl border space-y-3 ${
                role === currentUser.role
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Rôle : {role}
                </span>
                {role === currentUser.role && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white">
                    Actuel
                  </span>
                )}
              </div>

              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {ROLE_PERMISSIONS[role].map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New User */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Créer un Compte Utilisateur"
        subtitle="Renseignez le nom, l'identifiant et le rôle RBAC"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Pauline KOUAME"
              value={newFullName}
              onChange={e => setNewFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Identifiant / Login *
              </label>
              <input
                type="text"
                required
                placeholder="ex: p.kouame"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rôle système *
              </label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="DIRECTEUR">DIRECTEUR</option>
                <option value="ENSEIGNANT">ENSEIGNANT</option>
                <option value="COMPTABLE">COMPTABLE</option>
                <option value="SECRETAIRE">SECRETAIRE</option>
                <option value="PARENT">PARENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="email@elitesdusavoir.org"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Créer le Compte
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
