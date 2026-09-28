import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Layers,
  GraduationCap,
  CalendarDays,
  Clock,
  FileCheck2,
  Award,
  Wallet,
  FileText,
  ShieldCheck,
  History,
  HardDriveDownload,
  X,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'establishment'
  | 'students'
  | 'structure'
  | 'staff'
  | 'timetable'
  | 'attendance'
  | 'grades'
  | 'reportcards'
  | 'finances'
  | 'documents'
  | 'users'
  | 'audit'
  | 'backup';

interface MenuItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const menuGroups: MenuGroup[] = [
    {
      group: 'Pilotage Principal',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Tableau de Bord', icon: LayoutDashboard, badge: 'Live' },
        { id: 'establishment' as ActiveTab, label: 'Établissement & Années', icon: Building2 },
      ],
    },
    {
      group: 'Scolarité & Pédagogie',
      items: [
        { id: 'students' as ActiveTab, label: 'Élèves & Inscriptions', icon: Users2 },
        { id: 'structure' as ActiveTab, label: 'Classes & Matières', icon: Layers },
        { id: 'staff' as ActiveTab, label: 'Enseignants & Staff', icon: GraduationCap },
        { id: 'timetable' as ActiveTab, label: 'Emploi du Temps', icon: CalendarDays },
      ],
    },
    {
      group: 'Vie Scolaire & Évaluations',
      items: [
        { id: 'attendance' as ActiveTab, label: 'Présences & Absences', icon: Clock },
        { id: 'grades' as ActiveTab, label: 'Notes & Moyennes', icon: FileCheck2 },
        { id: 'reportcards' as ActiveTab, label: 'Bulletins Scolaires', icon: Award, highlight: true },
      ],
    },
    {
      group: 'Finances & Reçus',
      items: [
        { id: 'finances' as ActiveTab, label: 'Frais & Paiements', icon: Wallet },
        { id: 'documents' as ActiveTab, label: 'Documents & Cartes', icon: FileText },
      ],
    },
    {
      group: 'Administration & Système',
      items: [
        { id: 'users' as ActiveTab, label: 'Utilisateurs & Droits', icon: ShieldCheck },
        { id: 'audit' as ActiveTab, label: 'Traçabilité & Audit', icon: History },
        { id: 'backup' as ActiveTab, label: 'Sauvegarde & PWA', icon: HardDriveDownload },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 md:w-60 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header Inside Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              ED
            </div>
            <span className="font-bold text-slate-800 dark:text-white">EduMaster Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Version 2.4 PWA</span>
            <span className="text-emerald-600 font-semibold">Prêt hors-ligne</span>
          </div>
        </div>
      </aside>
    </>
  );
};
