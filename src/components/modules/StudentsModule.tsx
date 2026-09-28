import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, Parent, StudentStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  HeartPulse,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const StudentsModule: React.FC = () => {
  const {
    students,
    classes,
    parents,
    addStudent,
    updateStudent,
    deleteStudent,
    reEnrollStudent,
    addParent,
    updateParent,
    getStudentFeeSummary,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'students' | 'parents' | 'enrollments'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isReEnrollModalOpen, setIsReEnrollModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);

  // Selected student for detail/re-enroll/edit
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Re-enrollment form
  const [reEnrollClassId, setReEnrollClassId] = useState('');
  const [reEnrollPayment, setReEnrollPayment] = useState(150000);
  const [reEnrollNotes, setReEnrollNotes] = useState('');

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    birthDate: '2010-01-01',
    birthPlace: 'Kinshasa / Brazzaville',
    nationality: 'Congolaise',
    address: 'Avenue de la Paix',
    phone: '',
    email: '',
    photoUrl: '',
    currentClassId: classes[0]?.id || '',
    status: 'Actif' as StudentStatus,
    enrollmentDate: new Date().toISOString().split('T')[0],
    bloodGroup: 'O+',
    medicalNotes: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: 'Père',
    },
    parentIds: [] as string[],
  });

  const [parentData, setParentData] = useState({
    firstName: '',
    lastName: '',
    relation: 'Père' as 'Père' | 'Mère' | 'Tuteur légal',
    profession: '',
    phone1: '',
    email: '',
    address: '',
  });

  const [initialPayment, setInitialPayment] = useState<number>(50000);

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClassFilter === 'ALL' || student.currentClassId === selectedClassFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' || student.status === selectedStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.currentClassId) return;

    addStudent(
      newStudent,
      parentData.firstName ? parentData : undefined,
      initialPayment
    );

    setIsAddStudentModalOpen(false);
    // Reset form
    setNewStudent({
      firstName: '',
      lastName: '',
      gender: 'M',
      birthDate: '2010-01-01',
      birthPlace: 'Kinshasa / Brazzaville',
      nationality: 'Congolaise',
      address: 'Avenue de la Paix',
      phone: '',
      email: '',
      photoUrl: '',
      currentClassId: classes[0]?.id || '',
      status: 'Actif',
      enrollmentDate: new Date().toISOString().split('T')[0],
      bloodGroup: 'O+',
      medicalNotes: '',
      emergencyContact: { name: '', phone: '', relation: 'Père' },
      parentIds: [],
    });
  };

  const handleReEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent || !reEnrollClassId) return;
    reEnrollStudent(activeStudent.id, reEnrollClassId, reEnrollNotes, reEnrollPayment);
    setIsReEnrollModalOpen(false);
    setActiveStudent(null);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;
    updateStudent(activeStudent);
    setIsEditStudentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Gestion des Élèves, Inscriptions & Parents
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fichiers scolaires, admissions, réinscriptions annuelles et suivi des familles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Nouvelle Inscription
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Tous les Élèves ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('parents')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'parents'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Parents & Tuteurs ({parents.length})
        </button>
      </div>

      {activeSubTab === 'students' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-600 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClassFilter}
                onChange={e => setSelectedClassFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold outline-none"
              >
                <option value="ALL">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="Actif">Actifs</option>
                <option value="Transféré">Transférés</option>
                <option value="Exclu">Exclus</option>
                <option value="Diplômé">Diplômés</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Élève</th>
                    <th className="py-3 px-4">Matricule</th>
                    <th className="py-3 px-4">Classe</th>
                    <th className="py-3 px-4">Âge / Naissance</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Scolarité</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredStudents.map(student => {
                    const studentClass = classes.find(c => c.id === student.currentClassId);
                    const feeSummary = getStudentFeeSummary(student.id);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        {/* Student Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt={student.firstName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center text-xs">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {student.firstName} {student.lastName}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Sexe : {student.gender === 'M' ? 'Masculin' : 'Féminin'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Matricule */}
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300">
                            {student.matricule}
                          </span>
                        </td>

                        {/* Class */}
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {studentClass?.name || 'Non assigné'}
                        </td>

                        {/* Birth & Age */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          <div>{student.birthDate}</div>
                          <span className="text-[10px] text-slate-400">{student.birthPlace}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            student.status === 'Actif'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                          }`}>
                            {student.status}
                          </span>
                        </td>

                        {/* Fee Status */}
                        <td className="py-3 px-4">
                          {feeSummary.balanceDue === 0 ? (
                            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5" /> Soldé
                            </span>
                          ) : (
                            <span className="text-red-600 font-bold text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Reste : {feeSummary.balanceDue.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setActiveStudent(student);
                                setIsDetailModalOpen(true);
                              }}
                              title="Voir fiche complète"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveStudent(student);
                                setReEnrollClassId(student.currentClassId);
                                setIsReEnrollModalOpen(true);
                              }}
                              title="Réinscrire pour la nouvelle année"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveStudent(student);
                                setIsEditStudentModalOpen(true);
                              }}
                              title="Modifier dossier"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Confirmez-vous la suppression de ${student.firstName} ${student.lastName} ?`)) {
                                  deleteStudent(student.id);
                                }
                              }}
                              title="Supprimer élève"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Parents Tab */}
      {activeSubTab === 'parents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents.map(parent => {
            const linkedChildren = students.filter(s => parent.studentIds.includes(s.id));
            return (
              <div
                key={parent.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {parent.firstName} {parent.lastName}
                    </h4>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      {parent.relation} • {parent.profession}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600">
                    {linkedChildren.length} enfant(s)
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parent.phone1} {parent.phone2 ? `/ ${parent.phone2}` : ''}</span>
                  </div>
                  {parent.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{parent.email}</span>
                    </div>
                  )}
                </div>

                {/* Linked Children badges */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Élèves rattachés :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedChildren.map(c => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      >
                        {c.firstName} {c.lastName} ({c.matricule})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Student Registration */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title="Dossier d'Inscription d'un Élève"
        subtitle="Renseignez les données personnelles, familiales et le paiement initial"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-6">
          {/* Section 1: Informations Élève */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              1. Informations de l'Élève
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: KOUASSI"
                  value={newStudent.lastName}
                  onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prénom(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean-Luc"
                  value={newStudent.firstName}
                  onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sexe *
                </label>
                <select
                  value={newStudent.gender}
                  onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as 'M' | 'F' })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classe d'admission *
                </label>
                <select
                  required
                  value={newStudent.currentClassId}
                  onChange={e => setNewStudent({ ...newStudent, currentClassId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-blue-600"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={newStudent.birthDate}
                  onChange={e => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  placeholder="Ville / Pays"
                  value={newStudent.birthPlace}
                  onChange={e => setNewStudent({ ...newStudent, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Groupe Sanguin
                </label>
                <select
                  value={newStudent.bloodGroup}
                  onChange={e => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Photo (Optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newStudent.photoUrl}
                  onChange={e => setNewStudent({ ...newStudent, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Tuteur Légal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              2. Informations du Parent ou Tuteur
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Parent
                </label>
                <input
                  type="text"
                  placeholder="Nom de famille"
                  value={parentData.lastName}
                  onChange={e => setParentData({ ...parentData, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prénom du Parent
                </label>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={parentData.firstName}
                  onChange={e => setParentData({ ...parentData, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lien de parenté
                </label>
                <select
                  value={parentData.relation}
                  onChange={e => setParentData({ ...parentData, relation: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone joignable *
                </label>
                <input
                  type="tel"
                  placeholder="+243 / +221..."
                  value={parentData.phone1}
                  onChange={e => setParentData({ ...parentData, phone1: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Frais initiaux d'inscription */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">
              3. Paiement initial des Frais d'Inscription
            </h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mb-2">
              Un reçu officiel de caisse sera automatiquement émis et consigné dans le journal des finances.
            </p>
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Montant versé à l'inscription
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={initialPayment}
                onChange={e => setInitialPayment(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
            >
              Enregistrer l'Inscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Re-Enrollment (Réinscription) */}
      <Modal
        isOpen={isReEnrollModalOpen}
        onClose={() => setIsReEnrollModalOpen(false)}
        title="Réinscription & Passage en Classe Supérieure"
        subtitle={`Réinscription de l'élève ${activeStudent?.firstName} ${activeStudent?.lastName} (${activeStudent?.matricule})`}
      >
        <form onSubmit={handleReEnroll} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Classe d'affectation pour la nouvelle année *
            </label>
            <select
              value={reEnrollClassId}
              onChange={e => setReEnrollClassId(e.target.value)}
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Acompte / Frais versés pour la réinscription
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={reEnrollPayment}
              onChange={e => setReEnrollPayment(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Observations / Décision du Conseil
            </label>
            <textarea
              rows={2}
              placeholder="ex: Passage régulier avec avis favorable"
              value={reEnrollNotes}
              onChange={e => setReEnrollNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReEnrollModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
            >
              Confirmer la Réinscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Student Detail View */}
      {activeStudent && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Dossier Scolaire : ${activeStudent.firstName} ${activeStudent.lastName}`}
          subtitle={`Matricule : ${activeStudent.matricule}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              {activeStudent.photoUrl ? (
                <img
                  src={activeStudent.photoUrl}
                  alt={activeStudent.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                  {activeStudent.firstName.charAt(0)}{activeStudent.lastName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeStudent.firstName} {activeStudent.lastName}
                </h3>
                <p className="text-slate-500">
                  Né(e) le {activeStudent.birthDate} à {activeStudent.birthPlace} ({activeStudent.nationality})
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                    {classes.find(c => c.id === activeStudent.currentClassId)?.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                    Groupe {activeStudent.bloodGroup || 'O+'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Adresse :</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeStudent.address}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date d'inscription :</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeStudent.enrollmentDate}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Dossier Médical :</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {activeStudent.medicalNotes || 'Aucun antécédent médical signalé.'}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
              <span className="text-[10px] uppercase font-bold block mb-1">Contact en cas d'urgence :</span>
              <p className="font-semibold">
                {activeStudent.emergencyContact?.name} ({activeStudent.emergencyContact?.relation}) - {activeStudent.emergencyContact?.phone}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Edit Student */}
      {activeStudent && (
        <Modal
          isOpen={isEditStudentModalOpen}
          onClose={() => setIsEditStudentModalOpen(false)}
          title="Modifier le Dossier de l'Élève"
          subtitle={`Matricule : ${activeStudent.matricule}`}
        >
          <form onSubmit={handleUpdateStudent} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={activeStudent.lastName}
                  onChange={e => setActiveStudent({ ...activeStudent, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={activeStudent.firstName}
                  onChange={e => setActiveStudent({ ...activeStudent, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classe
                </label>
                <select
                  value={activeStudent.currentClassId}
                  onChange={e => setActiveStudent({ ...activeStudent, currentClassId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Statut
                </label>
                <select
                  value={activeStudent.status}
                  onChange={e => setActiveStudent({ ...activeStudent, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Actif">Actif</option>
                  <option value="Transféré">Transféré</option>
                  <option value="Exclu">Exclu</option>
                  <option value="Diplômé">Diplômé</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={activeStudent.address}
                  onChange={e => setActiveStudent({ ...activeStudent, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditStudentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
