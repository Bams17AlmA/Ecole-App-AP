import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ActiveTab } from '../layout/Sidebar';
import {
  Users,
  GraduationCap,
  DoorOpen,
  ReceiptText,
  CalendarCheck2,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ChevronRight,
  Award,
} from 'lucide-react';

interface DashboardModuleProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigate }) => {
  const {
    students,
    teachers,
    classes,
    payments,
    feeStructures,
    establishment,
    currentAcademicYear,
    attendanceSessions,
    evaluations,
    auditLogs,
    getStudentFeeSummary,
  } = useSchool();

  // Statistics
  const activeStudents = students.filter(s => s.status === 'Actif');
  const maleCount = activeStudents.filter(s => s.gender === 'M').length;
  const femaleCount = activeStudents.filter(s => s.gender === 'F').length;

  // Financial statistics
  let totalExpectedRevenue = 0;
  activeStudents.forEach(st => {
    const summary = getStudentFeeSummary(st.id);
    totalExpectedRevenue += summary.totalDue;
  });

  const totalCollectedRevenue = payments
    .filter(p => p.academicYearId === currentAcademicYear.id)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOutstanding = Math.max(0, totalExpectedRevenue - totalCollectedRevenue);
  const recoveryRate = totalExpectedRevenue > 0
    ? Math.round((totalCollectedRevenue / totalExpectedRevenue) * 100)
    : 100;

  // Attendance rate
  let totalEntriesCount = 0;
  let presentEntriesCount = 0;
  attendanceSessions.forEach(session => {
    session.entries.forEach(entry => {
      totalEntriesCount++;
      if (entry.status === 'Présent') presentEntriesCount++;
    });
  });
  const attendanceRate = totalEntriesCount > 0
    ? Math.round((presentEntriesCount / totalEntriesCount) * 100)
    : 95;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 mb-3">
            <span>Année Scolaire {currentAcademicYear.label}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Session Active</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {establishment.name}
          </h2>
          <p className="mt-2 text-sm text-blue-100 max-w-xl">
            {establishment.motto} • Plateforme ERP complète de gestion scolaire. Tous vos modules pédagogiques, administratifs et financiers sont synchronisés.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-blue-900 text-xs font-bold shadow-md hover:bg-blue-50 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Inscrire un élève
            </button>
            <button
              onClick={() => onNavigate('finances')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              <ReceiptText className="w-4 h-4" />
              Encaisser un paiement
            </button>
            <button
              onClick={() => onNavigate('reportcards')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Générer les Bulletins
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-end pr-10">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Effectif Total
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {activeStudents.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">élèves inscrits</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Garçons : <strong>{maleCount}</strong></span>
            <span>Filles : <strong>{femaleCount}</strong></span>
          </div>
        </div>

        {/* Classes & Staff */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pédagogie
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {classes.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">classes ouvertes</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Enseignants : <strong>{teachers.length}</strong></span>
            <span className="text-purple-600 font-semibold cursor-pointer" onClick={() => onNavigate('structure')}>Détails →</span>
          </div>
        </div>

        {/* Recovery Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recouvrement
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {recoveryRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">des frais perçus</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Encaissé:</span>
            <strong className="text-slate-700 dark:text-slate-300">{totalCollectedRevenue.toLocaleString()} {establishment.currency}</strong>
          </div>
        </div>

        {/* Assiduité */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assiduité Globale
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {attendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">taux de présence</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Appels réalisés :</span>
            <strong className="text-slate-700 dark:text-slate-300">{attendanceSessions.length} sessions</strong>
          </div>
        </div>
      </div>

      {/* Two columns layout for deeper insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Financials & Classes overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Répartition des Classes & Effectifs
                </h3>
                <p className="text-xs text-slate-500">Capacités et taux de remplissage par classe</p>
              </div>
              <button
                onClick={() => onNavigate('structure')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Gérer les classes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {classes.map(cls => {
                const count = students.filter(s => s.currentClassId === cls.id && s.status === 'Actif').length;
                const percent = Math.min(100, Math.round((count / (cls.capacity || 30)) * 100));
                const mainTeacher = teachers.find(t => t.id === cls.mainTeacherId);
                return (
                  <div key={cls.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{cls.name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400">{cls.roomNumber}</span>
                        {mainTeacher && (
                          <span className="hidden sm:inline text-slate-400 text-[11px]">
                            (PP: {mainTeacher.firstName} {mainTeacher.lastName})
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {count} / {cls.capacity} élèves ({percent}%)
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent > 90 ? 'bg-red-500' : percent > 60 ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial summary banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Situation Financière & Reste à Recouvrer
                </h3>
                <p className="text-xs text-slate-500">Suivi des encaissements et dettes scolaires</p>
              </div>
              <button
                onClick={() => onNavigate('finances')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Module Finances <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Total Facturé</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {totalExpectedRevenue.toLocaleString()} {establishment.currency}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Encaissé</span>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">
                  {totalCollectedRevenue.toLocaleString()} {establishment.currency}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Reste / Dettes</span>
                <p className="text-lg font-black text-red-700 dark:text-red-300 mt-1">
                  {totalOutstanding.toLocaleString()} {establishment.currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Traceability & Upcoming Evals */}
        <div className="space-y-6">
          {/* Upcoming Evals */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Évaluations Programmées
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                {evaluations.length} actives
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {evaluations.slice(0, 4).map(ev => {
                const cls = classes.find(c => c.id === ev.classId);
                return (
                  <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ev.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 font-semibold">
                        Coeff {ev.coefficient}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{cls?.name}</span>
                      <span>{ev.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Logs Quick Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Traçabilité en direct
                </h3>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Tout voir
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs space-y-0.5 border-l-2 border-blue-500 pl-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-600 dark:text-slate-300">{log.userName}</span>
                    <span>{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug text-[11px]">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
