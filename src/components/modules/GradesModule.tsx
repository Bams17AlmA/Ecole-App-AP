import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Evaluation, EvaluationType } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileCheck2,
  Plus,
  Save,
  Trash2,
  Calculator,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const GradesModule: React.FC = () => {
  const {
    classes,
    subjects,
    evaluations,
    grades,
    students,
    currentAcademicYear,
    addEvaluation,
    deleteEvaluation,
    saveGrades,
    getClassRankings,
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTermId, setSelectedTermId] = useState<string>(
    currentAcademicYear.terms[0]?.id || 'term-t1'
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [activeEvaluationId, setActiveEvaluationId] = useState<string>('');

  // Toast
  const [isSavedToast, setIsSavedToast] = useState(false);

  // New Eval Modal
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [newEvalTitle, setNewEvalTitle] = useState('');
  const [newEvalType, setNewEvalType] = useState<EvaluationType>('Devoir Surveillé');
  const [newEvalMaxScore, setNewEvalMaxScore] = useState(20);
  const [newEvalCoeff, setNewEvalCoeff] = useState(2);
  const [newEvalDate, setNewEvalDate] = useState(new Date().toISOString().split('T')[0]);

  // Class students
  const classStudents = students.filter(
    s => s.currentClassId === selectedClassId && s.status === 'Actif'
  );

  // Filter evaluations matching class, term & subject
  const filteredEvals = evaluations.filter(
    e =>
      e.classId === selectedClassId &&
      e.termId === selectedTermId &&
      e.subjectId === selectedSubjectId
  );

  // Default active evaluation
  React.useEffect(() => {
    if (filteredEvals.length > 0) {
      if (!filteredEvals.some(e => e.id === activeEvaluationId)) {
        setActiveEvaluationId(filteredEvals[0].id);
      }
    } else {
      setActiveEvaluationId('');
    }
  }, [selectedClassId, selectedTermId, selectedSubjectId, filteredEvals.length]);

  // Active Evaluation object
  const activeEval = evaluations.find(e => e.id === activeEvaluationId);

  // Local state for score entry
  const [scores, setScores] = useState<Record<string, { score: number; comment?: string }>>({});

  React.useEffect(() => {
    if (!activeEvaluationId) {
      setScores({});
      return;
    }
    const currentGrades = grades.filter(g => g.evaluationId === activeEvaluationId);
    const scoreMap: Record<string, { score: number; comment?: string }> = {};

    classStudents.forEach(st => {
      const g = currentGrades.find(gr => gr.studentId === st.id);
      scoreMap[st.id] = {
        score: g !== undefined ? g.score : 10,
        comment: g?.comment || '',
      };
    });

    setScores(scoreMap);
  }, [activeEvaluationId, classStudents.length]);

  const handleSaveGrades = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvaluationId) return;

    const entries = Object.entries(scores).map(([studentId, val]) => ({
      studentId,
      score: Number(val.score),
      comment: val.comment,
    }));

    saveGrades(activeEvaluationId, entries);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleCreateEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvalTitle.trim()) return;

    const created = addEvaluation({
      title: newEvalTitle.trim(),
      type: newEvalType,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      termId: selectedTermId,
      academicYearId: currentAcademicYear.id,
      maxScore: newEvalMaxScore,
      coefficient: newEvalCoeff,
      date: newEvalDate,
      isPublished: true,
    });

    setIsEvalModalOpen(false);
    setActiveEvaluationId(created.id);
    setNewEvalTitle('');
  };

  // Class rankings
  const rankings = getClassRankings(selectedClassId, selectedTermId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            Gestion des Évaluations, Saisie des Notes & Moyennes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Création des devoirs/examens, saisie instantanée des notes et calcul des moyennes pondérées.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedToast && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Notes enregistrées !
            </span>
          )}
          <button
            onClick={() => setIsEvalModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer une Évaluation
          </button>
        </div>
      </div>

      {/* Selectors Bar: Class, Term, Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
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
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Trimestre / Période
          </label>
          <select
            value={selectedTermId}
            onChange={e => setSelectedTermId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
          >
            {currentAcademicYear.terms.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Matière
          </label>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Evaluations Selector + Grade Entry Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Evaluations List in this subject */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Évaluations ({filteredEvals.length})
            </h3>
          </div>

          <div className="space-y-2">
            {filteredEvals.length > 0 ? (
              filteredEvals.map(ev => {
                const isActive = ev.id === activeEvaluationId;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setActiveEvaluationId(ev.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {ev.title}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm(`Supprimer l'évaluation ${ev.title} ?`)) {
                            deleteEvaluation(ev.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold">
                        Coeff {ev.coefficient}
                      </span>
                      <span>Barème /{ev.maxScore}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 italic">
                Aucune évaluation créée pour cette matière et ce trimestre.
              </div>
            )}
          </div>
        </div>

        {/* Right: Grade Entry Table */}
        <div className="lg:col-span-3">
          {activeEval ? (
            <form onSubmit={handleSaveGrades} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Saisie des Notes : {activeEval.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Type : {activeEval.type} • Barème : sur {activeEval.maxScore} pts • Coeff : {activeEval.coefficient}
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les Notes
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Élève</th>
                      <th className="py-3 px-4">Matricule</th>
                      <th className="py-3 px-4 w-32">Note /{activeEval.maxScore}</th>
                      <th className="py-3 px-4">Note /20 (Calculée)</th>
                      <th className="py-3 px-4">Appréciation de l'enseignant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {classStudents.map(student => {
                      const entry = scores[student.id] || { score: 10, comment: '' };
                      const normalizedScore = Number(
                        ((entry.score / activeEval.maxScore) * 20).toFixed(2)
                      );

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                            {student.matricule}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max={activeEval.maxScore}
                              step="0.25"
                              value={entry.score}
                              onChange={e =>
                                setScores({
                                  ...scores,
                                  [student.id]: {
                                    ...entry,
                                    score: Number(e.target.value),
                                  },
                                })
                              }
                              className={`w-20 px-2.5 py-1.5 rounded-lg border font-bold text-xs text-center outline-none ${
                                normalizedScore >= 14
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : normalizedScore >= 10
                                  ? 'border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                  : 'border-red-300 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                              }`}
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {normalizedScore} / 20
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="ex: Bon travail, rigoureux..."
                              value={entry.comment || ''}
                              onChange={e =>
                                setScores({
                                  ...scores,
                                  [student.id]: {
                                    ...entry,
                                    comment: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              <Calculator className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                Sélectionnez une évaluation à gauche ou créez-en une nouvelle pour saisir les notes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Class Rankings Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Classement Général & Moyennes de la Classe ({currentAcademicYear.terms.find(t => t.id === selectedTermId)?.name})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Calcul automatique instantané pondéré par coefficients
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {rankings.map(item => (
            <div
              key={item.student.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  {item.student.firstName} {item.student.lastName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.student.matricule}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-blue-600 block">
                  {item.average} / 20
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {item.rank === 1 ? '1er' : `${item.rank}ème`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Evaluation */}
      <Modal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        title="Créer une Nouvelle Évaluation"
        subtitle="Définissez l'intitulé, la date et le coefficient"
      >
        <form onSubmit={handleCreateEval} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Intitulé de l'évaluation *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Devoir Surveillé N°2 - Algèbre"
              value={newEvalTitle}
              onChange={e => setNewEvalTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Type d'évaluation
              </label>
              <select
                value={newEvalType}
                onChange={e => setNewEvalType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Devoir Surveillé">Devoir Surveillé</option>
                <option value="Interrogation">Interrogation Écrite</option>
                <option value="Composition / Examen">Composition / Examen</option>
                <option value="Travaux Pratiques">Travaux Pratiques</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Coefficient dans la moyenne
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newEvalCoeff}
                onChange={e => setNewEvalCoeff(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barème maximum (ex: 20)
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={newEvalMaxScore}
                onChange={e => setNewEvalMaxScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date de passation
              </label>
              <input
                type="date"
                value={newEvalDate}
                onChange={e => setNewEvalDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEvalModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Créer l'Évaluation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
