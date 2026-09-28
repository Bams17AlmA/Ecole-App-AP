import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus, AttendanceStudentEntry } from '../../types';
import { Modal } from '../common/Modal';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Save,
  Users,
  Search,
  Filter,
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const {
    classes,
    students,
    attendanceSessions,
    recordAttendance,
    currentAcademicYear,
    currentUser,
    subjects,
    teachers,
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('08:00 - 10:00');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Active class students
  const classStudents = students.filter(
    s => s.currentClassId === selectedClassId && s.status === 'Actif'
  );

  // Entries for the attendance session
  const [entries, setEntries] = useState<Record<string, AttendanceStudentEntry>>({});

  // Initialize entries when class changes
  React.useEffect(() => {
    const init: Record<string, AttendanceStudentEntry> = {};
    classStudents.forEach(st => {
      init[st.id] = {
        studentId: st.id,
        status: 'Présent',
        minutesLate: 0,
        reason: '',
        justified: false,
      };
    });
    setEntries(init);
  }, [selectedClassId, classStudents.length]);

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setEntries(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        minutesLate: status === 'Retard' ? (prev[studentId]?.minutesLate || 15) : 0,
      },
    }));
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const entryList = Object.values(entries);

    recordAttendance({
      date: selectedDate,
      classId: selectedClassId,
      timeSlot: selectedTimeSlot,
      subjectId: selectedSubjectId,
      academicYearId: currentAcademicYear.id,
      entries: entryList,
      recordedBy: currentUser.fullName,
    });

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Recent attendance sessions for summary
  const recentSessions = attendanceSessions.filter(
    s => s.classId === selectedClassId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Vie Scolaire : Appel, Présences, Absences & Retards
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fiche d'appel numérique, justificatifs d'absence et comptabilisation des minutes de retard.
          </p>
        </div>

        {isSavedToast && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" /> Appel enregistré avec succès !
          </span>
        )}
      </div>

      {/* Control Bar: Class, Date, Slot */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Classe
          </label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.roomNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Date de la séance
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Créneau horaire
          </label>
          <select
            value={selectedTimeSlot}
            onChange={e => setSelectedTimeSlot(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="08:00 - 10:00">08:00 - 10:00</option>
            <option value="10:15 - 12:15">10:15 - 12:15</option>
            <option value="13:30 - 15:30">13:30 - 15:30</option>
            <option value="15:45 - 17:45">15:45 - 17:45</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Matière
          </label>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Form Sheet */}
      <form onSubmit={handleSaveAttendance} className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Feuille d'Appel Numérique ({classStudents.length} élèves)
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allPresent: Record<string, AttendanceStudentEntry> = {};
                  classStudents.forEach(st => {
                    allPresent[st.id] = {
                      studentId: st.id,
                      status: 'Présent',
                      minutesLate: 0,
                      reason: '',
                      justified: false,
                    };
                  });
                  setEntries(allPresent);
                }}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Tout marquer "Présent"
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {classStudents.map(student => {
              const currentEntry = entries[student.id] || {
                studentId: student.id,
                status: 'Présent',
                minutesLate: 0,
              };

              return (
                <div
                  key={student.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center text-xs">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {student.matricule}
                      </span>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'Présent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentEntry.status === 'Présent'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Présent
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'Absent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentEntry.status === 'Absent'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Absent
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'Retard')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentEntry.status === 'Retard'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Retard
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatus(student.id, 'Excusé')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentEntry.status === 'Excusé'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Excusé
                    </button>
                  </div>

                  {/* Details if Late or Absent */}
                  {(currentEntry.status === 'Absent' || currentEntry.status === 'Retard' || currentEntry.status === 'Excusé') && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {currentEntry.status === 'Retard' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="5"
                            max="120"
                            step="5"
                            placeholder="Min"
                            value={currentEntry.minutesLate || 15}
                            onChange={e =>
                              setEntries(prev => ({
                                ...prev,
                                [student.id]: {
                                  ...prev[student.id],
                                  minutesLate: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                          />
                          <span className="text-slate-500 text-[11px]">min</span>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Motif / Justification..."
                        value={currentEntry.reason || ''}
                        onChange={e =>
                          setEntries(prev => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              reason: e.target.value,
                            },
                          }))
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-44"
                      />

                      <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentEntry.justified || false}
                          onChange={e =>
                            setEntries(prev => ({
                              ...prev,
                              [student.id]: {
                                ...prev[student.id],
                                justified: e.target.checked,
                              },
                            }))
                          }
                          className="rounded text-blue-600"
                        />
                        Justifié
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Valider et Enregistrer l'Appel
            </button>
          </div>
        </div>
      </form>

      {/* Historical Sessions Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
          Historique Récent des Appels pour cette Classe
        </h3>

        <div className="space-y-2">
          {recentSessions.map(session => {
            const absentCount = session.entries.filter(e => e.status === 'Absent').length;
            const lateCount = session.entries.filter(e => e.status === 'Retard').length;

            return (
              <div
                key={session.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{session.date}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-600 dark:text-slate-400">{session.timeSlot}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-500">Par {session.recordedBy}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-red-600 font-bold">{absentCount} absent(s)</span>
                  <span className="text-amber-600 font-bold">{lateCount} retard(s)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
