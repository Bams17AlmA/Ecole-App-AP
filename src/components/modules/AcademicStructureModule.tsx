import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ClassRoom, EducationLevel, SectionOption, Subject } from '../../types';
import { Modal } from '../common/Modal';
import {
  Layers,
  Plus,
  DoorOpen,
  BookOpen,
  GraduationCap,
  Sparkles,
  Trash2,
  Edit,
  Tag,
} from 'lucide-react';

export const AcademicStructureModule: React.FC = () => {
  const {
    classes,
    educationLevels,
    sections,
    subjects,
    teachers,
    students,
    addClass,
    updateClass,
    deleteClass,
    addEducationLevel,
    addSection,
    addSubject,
    updateSubject,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'classes' | 'levels' | 'sections' | 'subjects'>('classes');

  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // New Class Form
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevelId, setNewClassLevelId] = useState(educationLevels[0]?.id || '');
  const [newClassSectionId, setNewClassSectionId] = useState(sections[0]?.id || '');
  const [newClassMainTeacherId, setNewClassMainTeacherId] = useState(teachers[0]?.id || '');
  const [newClassRoom, setNewClassRoom] = useState('Salle 101');
  const [newClassCapacity, setNewClassCapacity] = useState(35);

  // New Level Form
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelCycle, setNewLevelCycle] = useState('Second Cycle');

  // New Section Form
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionLevelId, setNewSectionLevelId] = useState(educationLevels[0]?.id || '');
  const [newSectionDesc, setNewSectionDesc] = useState('');

  // New Subject Form
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<Subject['category']>('Scientifique');
  const [newSubjectCoeff, setNewSubjectCoeff] = useState(3);
  const [newSubjectColor, setNewSubjectColor] = useState('#2563eb');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    addClass({
      name: newClassName.trim(),
      levelId: newClassLevelId,
      sectionId: newClassSectionId || undefined,
      mainTeacherId: newClassMainTeacherId || undefined,
      roomNumber: newClassRoom,
      capacity: newClassCapacity,
      academicYearId: 'year-2025-2026',
    });

    setIsClassModalOpen(false);
    setNewClassName('');
  };

  const handleCreateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelName.trim()) return;

    addEducationLevel({
      name: newLevelName.trim(),
      order: educationLevels.length + 1,
      cycle: newLevelCycle,
    });

    setIsLevelModalOpen(false);
    setNewLevelName('');
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    addSection({
      name: newSectionName.trim(),
      levelId: newSectionLevelId,
      description: newSectionDesc,
    });

    setIsSectionModalOpen(false);
    setNewSectionName('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const coeffMap: Record<string, number> = {};
    educationLevels.forEach(lvl => {
      coeffMap[lvl.id] = newSubjectCoeff;
    });

    addSubject({
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      defaultCoefficient: newSubjectCoeff,
      coefficientByLevel: coeffMap,
      color: newSubjectColor,
    });

    setIsSubjectModalOpen(false);
    setNewSubjectName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Structure Académique, Classes & Matières
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configuration des divisions de classes, cycles d'études, filières et coefficients officiels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'classes' && (
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Classe
            </button>
          )}
          {activeTab === 'levels' && (
            <button
              onClick={() => setIsLevelModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter un Niveau
            </button>
          )}
          {activeTab === 'sections' && (
            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Option/Section
            </button>
          )}
          {activeTab === 'subjects' && (
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Matière
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'levels'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Niveaux d'Étude ({educationLevels.length})
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Sections & Options ({sections.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'subjects'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Matières & Coefficients ({subjects.length})
        </button>
      </div>

      {/* TAB 1: Classes Grid */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(cls => {
            const level = educationLevels.find(l => l.id === cls.levelId);
            const section = sections.find(s => s.id === cls.sectionId);
            const mainTeacher = teachers.find(t => t.id === cls.mainTeacherId);
            const studentCount = students.filter(s => s.currentClassId === cls.id && s.status === 'Actif').length;
            const percentFilled = Math.min(100, Math.round((studentCount / (cls.capacity || 30)) * 100));

            return (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {level?.name} {section ? `• ${section.name}` : ''}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {cls.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer la classe ${cls.name} ?`)) deleteClass(cls.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Salle assignée :</span>
                    <strong className="text-slate-800 dark:text-slate-200">{cls.roomNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Professeur Principal :</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {mainTeacher ? `${mainTeacher.firstName} ${mainTeacher.lastName}` : 'Non désigné'}
                    </strong>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-500">Effectif actuel</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {studentCount} / {cls.capacity} élèves
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentFilled > 90 ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Education Levels */}
      {activeTab === 'levels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {educationLevels.map(lvl => {
            const levelClasses = classes.filter(c => c.levelId === lvl.id);
            return (
              <div
                key={lvl.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {lvl.code}
                  </span>
                  <span className="text-xs text-slate-400">Ordre : {lvl.order}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {lvl.name}
                </h3>
                <p className="text-xs text-slate-500">{lvl.cycle}</p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span>Classes rattachées : <strong>{levelClasses.length}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Sections & Options */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map(sec => {
            const lvl = educationLevels.find(l => l.id === sec.levelId);
            return (
              <div
                key={sec.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {sec.code}
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">{lvl?.name}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {sec.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {sec.description || 'Option pédagogique générale'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Subjects & Coefficients */}
      {activeTab === 'subjects' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Matière</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Coeff Standard</th>
                {educationLevels.map(lvl => (
                  <th key={lvl.id} className="py-3 px-4 text-center">Coeff {lvl.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {subjects.map(sbj => (
                <tr key={sbj.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-xs"
                      style={{ backgroundColor: sbj.color || '#2563eb' }}
                    >
                      {sbj.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {sbj.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sbj.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {sbj.defaultCoefficient}
                  </td>
                  {educationLevels.map(lvl => (
                    <td key={lvl.id} className="py-3 px-4 text-center font-bold text-blue-600">
                      {sbj.coefficientByLevel[lvl.id] ?? sbj.defaultCoefficient}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New Class */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Créer une Nouvelle Classe"
        subtitle="Définissez l'intitulé, la salle et le professeur principal"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nom de la classe (ex: 5ème A, Terminale S3) *
            </label>
            <input
              type="text"
              required
              placeholder="ex: 5ème B"
              value={newClassName}
              onChange={e => setNewClassName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Niveau d'études *
              </label>
              <select
                value={newClassLevelId}
                onChange={e => setNewClassLevelId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                {educationLevels.map(lvl => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Filière / Section
              </label>
              <select
                value={newClassSectionId}
                onChange={e => setNewClassSectionId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="">Aucune (Générale)</option>
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Salle de classe
              </label>
              <input
                type="text"
                placeholder="Salle 102"
                value={newClassRoom}
                onChange={e => setNewClassRoom(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Capacité d'accueil
              </label>
              <input
                type="number"
                min="10"
                max="60"
                value={newClassCapacity}
                onChange={e => setNewClassCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Professeur Principal
            </label>
            <select
              value={newClassMainTeacherId}
              onChange={e => setNewClassMainTeacherId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="">Non désigné</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.matricule})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsClassModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Créer la Classe
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Subject */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Ajouter une Matière"
        subtitle="Définissez le nom, coefficient et couleur d'affichage"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Intitulé de la matière *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Espagnol LV2"
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catégorie
              </label>
              <select
                value={newSubjectCategory}
                onChange={e => setNewSubjectCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Scientifique">Scientifique</option>
                <option value="Littéraire">Littéraire</option>
                <option value="Langues">Langues</option>
                <option value="Sciences Humaines">Sciences Humaines</option>
                <option value="Arts & Sport">Arts & Sport</option>
                <option value="Technologie">Technologie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Coefficient de base
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newSubjectCoeff}
                onChange={e => setNewSubjectCoeff(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Couleur d'identification
            </label>
            <input
              type="color"
              value={newSubjectColor}
              onChange={e => setNewSubjectColor(e.target.value)}
              className="w-16 h-8 rounded-lg cursor-pointer border border-slate-200"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Ajouter la Matière
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
