import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TimetableSlot } from '../../types';
import { Modal } from '../common/Modal';
import {
  CalendarDays,
  Plus,
  Trash2,
  Printer,
  Clock,
  MapPin,
  User,
} from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Lundi' },
  { id: 2, name: 'Mardi' },
  { id: 3, name: 'Mercredi' },
  { id: 4, name: 'Jeudi' },
  { id: 5, name: 'Vendredi' },
  { id: 6, name: 'Samedi' },
];

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:15 - 12:15',
  '13:30 - 15:30',
  '15:45 - 17:45',
];

export const TimetableModule: React.FC = () => {
  const {
    timetable,
    classes,
    subjects,
    teachers,
    addTimetableSlot,
    deleteTimetableSlot,
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);

  // New Slot Form
  const [newSlotDay, setNewSlotDay] = useState<number>(1);
  const [newSlotSubjectId, setNewSlotSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newSlotTeacherId, setNewSlotTeacherId] = useState<string>(teachers[0]?.id || '');
  const [newSlotTimeRange, setNewSlotTimeRange] = useState<string>('08:00 - 10:00');
  const [newSlotRoom, setNewSlotRoom] = useState('Salle 205');

  const selectedClass = classes.find(c => c.id === selectedClassId);

  // Filter slots for active class
  const classSlots = timetable.filter(s => s.classId === selectedClassId);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const [start, end] = newSlotTimeRange.split(' - ');

    addTimetableSlot({
      classId: selectedClassId,
      subjectId: newSlotSubjectId,
      teacherId: newSlotTeacherId,
      dayOfWeek: newSlotDay as any,
      startTime: start.trim(),
      endTime: end.trim(),
      room: newSlotRoom,
    });

    setIsAddSlotModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            Emploi du Temps & Grille des Horaires
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualisation et organisation hebdomadaire des cours par classe et salle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer l'Emploi du Temps
          </button>
          <button
            onClick={() => setIsAddSlotModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Cours
          </button>
        </div>
      </div>

      {/* Class selector */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Sélectionner la classe à afficher :
        </label>
        <select
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 outline-none"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.roomNumber})
            </option>
          ))}
        </select>
      </div>

      {/* Weekly Timetable Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden print-area">
        {/* Printable Header */}
        <div className="hidden print:block p-4 border-b border-slate-300 text-center">
          <h1 className="text-lg font-black uppercase">Emploi du Temps Hebdomadaire</h1>
          <p className="text-xs font-bold text-slate-700">Classe : {selectedClass?.name} - Salle : {selectedClass?.roomNumber}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {DAYS.map(day => {
            const daySlots = classSlots
              .filter(s => s.dayOfWeek === day.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day.id} className="min-h-[380px] flex flex-col">
                {/* Day Header */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center">
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {day.name}
                  </h4>
                </div>

                {/* Day Slots */}
                <div className="p-2.5 flex-1 space-y-2.5 bg-slate-50/20 dark:bg-slate-950/20">
                  {daySlots.length > 0 ? (
                    daySlots.map(slot => {
                      const subject = subjects.find(s => s.id === slot.subjectId);
                      const teacher = teachers.find(t => t.id === slot.teacherId);

                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5 hover:shadow-md transition relative group"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1 font-mono text-blue-600">
                              <Clock className="w-3 h-3" /> {slot.startTime} - {slot.endTime}
                            </span>
                            <button
                              onClick={() => deleteTimetableSlot(slot.id)}
                              className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: subject?.color || '#2563eb' }}
                            />
                            <span className="truncate">{subject?.name || 'Matière'}</span>
                          </div>

                          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{teacher?.firstName} {teacher?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center p-4 text-center text-slate-400 text-[11px] italic">
                      Pas de cours
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: New Timetable Slot */}
      <Modal
        isOpen={isAddSlotModalOpen}
        onClose={() => setIsAddSlotModalOpen(false)}
        title="Ajouter un Créneau de Cours"
        subtitle={`Classe : ${selectedClass?.name}`}
      >
        <form onSubmit={handleAddSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jour de la semaine *
            </label>
            <select
              value={newSlotDay}
              onChange={e => setNewSlotDay(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              {DAYS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Créneau horaire *
            </label>
            <select
              value={newSlotTimeRange}
              onChange={e => setNewSlotTimeRange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              {TIME_SLOTS.map((slot, idx) => (
                <option key={idx} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Matière à dispenser *
            </label>
            <select
              value={newSlotSubjectId}
              onChange={e => setNewSlotSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enseignant chargé du cours *
            </label>
            <select
              value={newSlotTeacherId}
              onChange={e => setNewSlotTeacherId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Salle de cours
            </label>
            <input
              type="text"
              value={newSlotRoom}
              onChange={e => setNewSlotRoom(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddSlotModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Planifier le Cours
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
