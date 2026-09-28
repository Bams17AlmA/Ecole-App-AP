import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOnlineStatus } from '../../hooks/usePWAInstall';
import {
  Menu,
  GraduationCap,
  Calendar,
  UserCheck,
  Search,
  Wifi,
  WifiOff,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigateToStudent?: (studentId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigateToStudent }) => {
  const {
    establishment,
    academicYears,
    currentAcademicYear,
    setCurrentAcademicYear,
    users,
    currentUser,
    switchUser,
    students,
  } = useSchool();

  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Search matches
  const filteredStudents = searchQuery.trim()
    ? students
        .filter(
          s =>
            s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.matricule.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu de navigation"
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[200px] lg:max-w-xs">
              {establishment.shortName || establishment.name}
            </h1>
            <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
              Système de Gestion Scolaire (ERP)
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Fast Search bar with dropdown */}
      <div className="relative flex-1 max-w-xs md:max-w-md mx-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher élève, matricule..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowSearchResults(false)}
            />
            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 overflow-hidden animate-in fade-in">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Élèves trouvés ({filteredStudents.length})
              </div>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      if (onNavigateToStudent) onNavigateToStudent(student.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {student.matricule}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Voir dossier</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-500 italic">
                  Aucun élève correspondant
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Academic Year, PWA Button, Network, Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year Selector */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={currentAcademicYear.id}
            onChange={e => setCurrentAcademicYear(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
          >
            {academicYears.map(year => (
              <option key={year.id} value={year.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                {year.label} {year.isCurrent ? '(Active)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Network status */}
        <div
          title={isOnline ? 'Connecté (Données locales synchronisées)' : 'Mode hors-ligne'}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            isOnline
              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
              : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 animate-pulse'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">En ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="text-[11px]">Hors-ligne</span>
            </>
          )}
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {currentUser.fullName.split(' ')[0]}
              </div>
              <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 z-30 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    Rôle actif : {currentUser.role}
                  </span>
                </div>

                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Changer de profil (Simulation RBAC)
                </div>

                <div className="space-y-0.5 px-1 max-h-56 overflow-y-auto">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className={`w-3.5 h-3.5 ${u.id === currentUser.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div>
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-slate-400">{u.role}</div>
                        </div>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
