import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher, Staff, TeacherAssignment } from '../../types';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Briefcase,
  UserPlus,
  Phone,
  Mail,
  Award,
  Clock,
  Trash2,
  Edit,
  Link2,
} from 'lucide-react';

export const StaffModule: React.FC = () => {
  const {
    teachers,
    staff,
    teacherAssignments,
    classes,
    subjects,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addStaff,
    updateStaff,
    deleteStaff,
    addAssignment,
    deleteAssignment,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'teachers' | 'staff' | 'assignments'>('teachers');

  // Modals state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // New Teacher State
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    email: '',
    phone: '',
    mainSubjectIds: [subjects[0]?.id || ''],
    qualification: 'Master 2',
    status: 'Titulaire' as 'Titulaire' | 'Vacataire' | 'Contractuel',
    hireDate: new Date().toISOString().split('T')[0],
  });

  // New Staff State
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    role: 'Surveillant Général' as Staff['role'],
    phone: '',
    email: '',
    department: 'Vie Scolaire',
    hireDate: new Date().toISOString().split('T')[0],
  });

  // New Assignment State
  const [newAssignment, setNewAssignment] = useState({
    teacherId: teachers[0]?.id || '',
    classId: classes[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    weeklyHours: 4,
    academicYearId: 'year-2025-2026',
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.firstName || !newTeacher.lastName) return;

    addTeacher(newTeacher);
    setIsTeacherModalOpen(false);
    setNewTeacher({
      firstName: '',
      lastName: '',
      gender: 'M',
      email: '',
      phone: '',
      mainSubjectIds: [subjects[0]?.id || ''],
      qualification: 'Master 2',
      status: 'Titulaire',
      hireDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.firstName || !newStaff.lastName) return;

    addStaff(newStaff);
    setIsStaffModalOpen(false);
    setNewStaff({
      firstName: '',
      lastName: '',
      gender: 'M',
      role: 'Surveillant Général',
      phone: '',
      email: '',
      department: 'Vie Scolaire',
      hireDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.teacherId || !newAssignment.classId || !newAssignment.subjectId) return;

    addAssignment(newAssignment);
    setIsAssignmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Corps Enseignant, Personnel Administratif & Affectations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez le corps professoral, les fonctions administratives et les attributions de cours par classe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'teachers' && (
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Recruter un Enseignant
            </button>
          )}
          {activeTab === 'staff' && (
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter Personnel Admin
            </button>
          )}
          {activeTab === 'assignments' && (
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              Nouvelle Affectation
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Enseignants ({teachers.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Personnel Administratif ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Affectations de Cours ({teacherAssignments.length})
        </button>
      </div>

      {/* TAB 1: Teachers Grid */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map(teacher => {
            const mainSubjects = subjects.filter(s => teacher.mainSubjectIds.includes(s.id));
            const assignmentsCount = teacherAssignments.filter(a => a.teacherId === teacher.id).length;
            const totalWeeklyHours = teacherAssignments
              .filter(a => a.teacherId === teacher.id)
              .reduce((sum, a) => sum + a.weeklyHours, 0);

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold flex items-center justify-center text-sm shadow-xs">
                      {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">
                        {teacher.matricule}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    teacher.status === 'Titulaire'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                  }`}>
                    {teacher.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Matière(s) principale(s) :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mainSubjects.map(s => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-xs"
                        style={{ backgroundColor: s.color || '#2563eb' }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assignments & Hours */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Volume horaire :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {totalWeeklyHours} h / semaine ({assignmentsCount} classes)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Staff Grid */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map(person => (
            <div
              key={person.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {person.role}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">
                    {person.firstName} {person.lastName}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    {person.matricule}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p>Département : <strong>{person.department}</strong></p>
                <p>Téléphone : <strong>{person.phone}</strong></p>
                <p>Email : <strong className="truncate">{person.email}</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Assignments Table */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Enseignant</th>
                <th className="py-3 px-4">Classe</th>
                <th className="py-3 px-4">Matière Enseignée</th>
                <th className="py-3 px-4">Heures / Semaine</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {teacherAssignments.map(asg => {
                const teacher = teachers.find(t => t.id === asg.teacherId);
                const classRoom = classes.find(c => c.id === asg.classId);
                const subject = subjects.find(s => s.id === asg.subjectId);

                return (
                  <tr key={asg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Enseignant inconnu'}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {teacher?.matricule}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {classRoom?.name || 'Classe inconnue'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-xs"
                        style={{ backgroundColor: subject?.color || '#2563eb' }}
                      >
                        {subject?.name || 'Matière'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {asg.weeklyHours} heures
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette affectation de cours ?')) {
                            deleteAssignment(asg.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New Teacher */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="Recruter un Nouvel Enseignant"
        subtitle="Renseignez les compétences académiques et coordonnées"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={newTeacher.lastName}
                onChange={e => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={newTeacher.firstName}
                onChange={e => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Matière principale
              </label>
              <select
                value={newTeacher.mainSubjectIds[0]}
                onChange={e => setNewTeacher({ ...newTeacher, mainSubjectIds: [e.target.value] })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Statut
              </label>
              <select
                value={newTeacher.status}
                onChange={e => setNewTeacher({ ...newTeacher, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Titulaire">Titulaire</option>
                <option value="Vacataire">Vacataire</option>
                <option value="Contractuel">Contractuel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Diplôme / Qualification
              </label>
              <input
                type="text"
                placeholder="Master 2, CAPES..."
                value={newTeacher.qualification}
                onChange={e => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={newTeacher.phone}
                onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Assignment */}
      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title="Affecter un Enseignant à une Classe"
        subtitle="Définit qui enseigne quelle matière et pour quel volume horaire"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enseignant *
            </label>
            <select
              value={newAssignment.teacherId}
              onChange={e => setNewAssignment({ ...newAssignment, teacherId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.matricule})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Classe réceptrice *
              </label>
              <select
                value={newAssignment.classId}
                onChange={e => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-blue-600"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Matière à dispenser *
              </label>
              <select
                value={newAssignment.subjectId}
                onChange={e => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nombre d'heures hebdomadaires
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={newAssignment.weeklyHours}
              onChange={e => setNewAssignment({ ...newAssignment, weeklyHours: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAssignmentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Créer l'Affectation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
