import {
  Establishment,
  AcademicYear,
  EducationLevel,
  SectionOption,
  ClassRoom,
  Subject,
  Teacher,
  Staff,
  TeacherAssignment,
  TimetableSlot,
  Student,
  Parent,
  Enrollment,
  Evaluation,
  Grade,
  AttendanceSession,
  FeeStructure,
  Payment,
  UserAccount,
  AuditLog,
} from '../types';

export const initialEstablishment: Establishment = {
  id: 'est-1',
  name: 'Complexe Scolaire Bilingue Les Élites du Savoir',
  shortName: 'CSB Élites',
  code: 'CSB-ELITE-01',
  motto: 'Discipline - Travail - Excellence',
  address: '145 Avenue de la République, Quartier Résidentiel',
  city: 'Brazzaville / Kinshasa / Dakar',
  country: 'Afrique Centrale / Ouest',
  phone: '+243 81 234 56 78 / +221 77 654 32 10',
  email: 'contact@elitesdusavoir.org',
  website: 'www.elitesdusavoir.org',
  directorName: 'Dr. Jean-Marc KABORE',
  directorTitle: 'Proviseur & Directeur Général',
  schoolType: 'Polyvalent',
  currency: 'FCFA',
  stampText: 'RÉPUBLIQUE - MINISTÈRE DE L’ÉDUCATION NATIONALE - SCEAU OFFICIEL',
  academicYearId: 'year-2025-2026',
};

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'year-2025-2026',
    label: '2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    isCurrent: true,
    terms: [
      { id: 'term-t1', name: '1er Trimestre', code: 'T1', startDate: '2025-09-01', endDate: '2025-12-15', isClosed: false, weight: 1 },
      { id: 'term-t2', name: '2ème Trimestre', code: 'T2', startDate: '2026-01-05', endDate: '2026-03-31', isClosed: false, weight: 1 },
      { id: 'term-t3', name: '3ème Trimestre', code: 'T3', startDate: '2026-04-01', endDate: '2026-06-30', isClosed: false, weight: 1 },
    ],
  },
  {
    id: 'year-2024-2025',
    label: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    isCurrent: false,
    terms: [
      { id: 'term-prev-t1', name: '1er Trimestre', code: 'T1', startDate: '2024-09-01', endDate: '2024-12-15', isClosed: true, weight: 1 },
      { id: 'term-prev-t2', name: '2ème Trimestre', code: 'T2', startDate: '2025-01-05', endDate: '2025-03-31', isClosed: true, weight: 1 },
      { id: 'term-prev-t3', name: '3ème Trimestre', code: 'T3', startDate: '2025-04-01', endDate: '2025-06-30', isClosed: true, weight: 1 },
    ],
  },
];

export const initialEducationLevels: EducationLevel[] = [
  { id: 'lvl-prim', name: 'Primaire', code: 'PRIM', order: 1, cycle: 'Enseignement Fondamental 1' },
  { id: 'lvl-col', name: 'Collège', code: 'COL', order: 2, cycle: 'Enseignement Secondaire 1er Cycle' },
  { id: 'lvl-lyc', name: 'Lycée', code: 'LYC', order: 3, cycle: 'Enseignement Secondaire 2nd Cycle' },
];

export const initialSections: SectionOption[] = [
  { id: 'sec-gen', name: 'Enseignement Général', code: 'GEN', levelId: 'lvl-col', description: 'Tronc commun du collège' },
  { id: 'sec-s', name: 'Sciences & Technologies (S)', code: 'S', levelId: 'lvl-lyc', description: 'Mathématiques, Physique-Chimie, SVT' },
  { id: 'sec-l', name: 'Lettres & Philosophie (L)', code: 'L', levelId: 'lvl-lyc', description: 'Littérature, Langues vivantes, Philosophie' },
  { id: 'sec-tech', name: 'Technique & Gestion (STG)', code: 'STG', levelId: 'lvl-lyc', description: 'Sciences de gestion et numérique' },
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls-6a', name: '6ème A', code: '6A', levelId: 'lvl-col', sectionId: 'sec-gen', mainTeacherId: 'tch-1', roomNumber: 'Salle 101', capacity: 35, academicYearId: 'year-2025-2026' },
  { id: 'cls-3b', name: '3ème B', code: '3B', levelId: 'lvl-col', sectionId: 'sec-gen', mainTeacherId: 'tch-2', roomNumber: 'Salle 104', capacity: 32, academicYearId: 'year-2025-2026' },
  { id: 'cls-2nde-s', name: 'Seconde S1', code: '2S1', levelId: 'lvl-lyc', sectionId: 'sec-s', mainTeacherId: 'tch-3', roomNumber: 'Salle 202', capacity: 30, academicYearId: 'year-2025-2026' },
  { id: 'cls-tle-s', name: 'Terminale S2', code: 'TS2', levelId: 'lvl-lyc', sectionId: 'sec-s', mainTeacherId: 'tch-1', roomNumber: 'Salle 205', capacity: 28, academicYearId: 'year-2025-2026' },
  { id: 'cls-tle-l', name: 'Terminale L1', code: 'TL1', levelId: 'lvl-lyc', sectionId: 'sec-l', mainTeacherId: 'tch-4', roomNumber: 'Salle 206', capacity: 25, academicYearId: 'year-2025-2026' },
];

export const initialSubjects: Subject[] = [
  { id: 'sbj-math', code: 'MATH', name: 'Mathématiques', category: 'Scientifique', defaultCoefficient: 4, coefficientByLevel: { 'lvl-col': 4, 'lvl-lyc': 5, 'lvl-prim': 3 }, color: '#2563eb' },
  { id: 'sbj-fr', code: 'FR', name: 'Français & Expression', category: 'Littéraire', defaultCoefficient: 4, coefficientByLevel: { 'lvl-col': 4, 'lvl-lyc': 4, 'lvl-prim': 4 }, color: '#7c3aed' },
  { id: 'sbj-pc', code: 'PC', name: 'Physique - Chimie', category: 'Scientifique', defaultCoefficient: 3, coefficientByLevel: { 'lvl-col': 2, 'lvl-lyc': 4, 'lvl-prim': 1 }, color: '#0891b2' },
  { id: 'sbj-svt', code: 'SVT', name: 'Sciences de la Vie et de la Terre', category: 'Scientifique', defaultCoefficient: 3, coefficientByLevel: { 'lvl-col': 2, 'lvl-lyc': 4, 'lvl-prim': 1 }, color: '#16a34a' },
  { id: 'sbj-hg', code: 'HG', name: 'Histoire - Géographie', category: 'Sciences Humaines', defaultCoefficient: 2, coefficientByLevel: { 'lvl-col': 3, 'lvl-lyc': 3, 'lvl-prim': 2 }, color: '#ea580c' },
  { id: 'sbj-ang', code: 'ANG', name: 'Anglais (LV1)', category: 'Langues', defaultCoefficient: 3, coefficientByLevel: { 'lvl-col': 3, 'lvl-lyc': 3, 'lvl-prim': 2 }, color: '#d97706' },
  { id: 'sbj-philo', code: 'PHILO', name: 'Philosophie', category: 'Littéraire', defaultCoefficient: 2, coefficientByLevel: { 'lvl-col': 1, 'lvl-lyc': 4, 'lvl-prim': 0 }, color: '#9333ea' },
  { id: 'sbj-info', code: 'INFO', name: 'Informatique & Algorithmique', category: 'Technologie', defaultCoefficient: 2, coefficientByLevel: { 'lvl-col': 2, 'lvl-lyc': 3, 'lvl-prim': 1 }, color: '#4f46e5' },
  { id: 'sbj-eps', code: 'EPS', name: 'Éducation Physique & Sportive', category: 'Arts & Sport', defaultCoefficient: 1, coefficientByLevel: { 'lvl-col': 1, 'lvl-lyc': 2, 'lvl-prim': 1 }, color: '#059669' },
];

export const initialTeachers: Teacher[] = [
  { id: 'tch-1', matricule: 'ENS-001', firstName: 'Augustin', lastName: 'MBEMBA', gender: 'M', email: 'a.mbemba@elitesdusavoir.org', phone: '+243 82 111 22 33', mainSubjectIds: ['sbj-math'], qualification: 'Master 2 Mathématiques Appliquées', status: 'Titulaire', hireDate: '2020-09-01' },
  { id: 'tch-2', matricule: 'ENS-002', firstName: 'Marie-Claire', lastName: 'DIOP', gender: 'F', email: 'mc.diop@elitesdusavoir.org', phone: '+243 82 222 33 44', mainSubjectIds: ['sbj-fr'], qualification: 'CAPES Lettres Modernes', status: 'Titulaire', hireDate: '2019-10-15' },
  { id: 'tch-3', matricule: 'ENS-003', firstName: 'Samuel', lastName: 'NGUEMA', gender: 'M', email: 's.nguema@elitesdusavoir.org', phone: '+243 82 333 44 55', mainSubjectIds: ['sbj-pc'], qualification: 'DEA Sciences Physiques', status: 'Titulaire', hireDate: '2021-02-01' },
  { id: 'tch-4', matricule: 'ENS-004', firstName: 'Aïssatou', lastName: 'TRAORE', gender: 'F', email: 'a.traore@elitesdusavoir.org', phone: '+243 82 444 55 66', mainSubjectIds: ['sbj-ang'], qualification: 'Master 2 Anglais de Spécialité', status: 'Contractuel', hireDate: '2022-09-01' },
  { id: 'tch-5', matricule: 'ENS-005', firstName: 'Christian', lastName: 'BOUANGA', gender: 'M', email: 'c.bouanga@elitesdusavoir.org', phone: '+243 82 555 66 77', mainSubjectIds: ['sbj-svt'], qualification: 'Master Biologie Cellulaire', status: 'Vacataire', hireDate: '2023-01-10' },
  { id: 'tch-6', matricule: 'ENS-006', firstName: 'Pauline', lastName: 'KOUAME', gender: 'F', email: 'p.kouame@elitesdusavoir.org', phone: '+243 82 666 77 88', mainSubjectIds: ['sbj-hg'], qualification: 'Licence Enseignement Histoire', status: 'Titulaire', hireDate: '2020-09-01' },
  { id: 'tch-7', matricule: 'ENS-007', firstName: 'David', lastName: 'TSHILUMBA', gender: 'M', email: 'd.tshilumba@elitesdusavoir.org', phone: '+243 82 777 88 99', mainSubjectIds: ['sbj-info'], qualification: 'Ingénieur Génie Logiciel', status: 'Titulaire', hireDate: '2022-10-01' },
];

export const initialStaff: Staff[] = [
  { id: 'stf-1', matricule: 'ADM-001', firstName: 'Jean-Marc', lastName: 'KABORE', gender: 'M', role: 'Directeur Général', phone: '+243 81 234 56 01', email: 'directeur@elitesdusavoir.org', department: 'Direction Générale', hireDate: '2018-08-01' },
  { id: 'stf-2', matricule: 'ADM-002', firstName: 'Clarisse', lastName: 'MOUSSA', gender: 'F', role: 'Censeur', phone: '+243 81 234 56 02', email: 'censeur@elitesdusavoir.org', department: 'Études et Pédagogie', hireDate: '2019-09-01' },
  { id: 'stf-3', matricule: 'ADM-003', firstName: 'Roger', lastName: 'ILUNGA', gender: 'M', role: 'Comptable Principal', phone: '+243 81 234 56 03', email: 'comptabilite@elitesdusavoir.org', department: 'Service Financier', hireDate: '2020-01-15' },
  { id: 'stf-4', matricule: 'ADM-004', firstName: 'Béatrice', lastName: 'SOW', gender: 'F', role: 'Secrétaire Général', phone: '+243 81 234 56 04', email: 'secretariat@elitesdusavoir.org', department: 'Secrétariat & Admissions', hireDate: '2021-06-01' },
  { id: 'stf-5', matricule: 'ADM-005', firstName: 'Michel', lastName: 'OKONGO', gender: 'M', role: 'Surveillant Général', phone: '+243 81 234 56 05', email: 'discipline@elitesdusavoir.org', department: 'Vie Scolaire & Discipline', hireDate: '2019-11-01' },
];

export const initialTeacherAssignments: TeacherAssignment[] = [
  { id: 'asg-1', teacherId: 'tch-1', classId: 'cls-tle-s', subjectId: 'sbj-math', weeklyHours: 6, academicYearId: 'year-2025-2026' },
  { id: 'asg-2', teacherId: 'tch-1', classId: 'cls-6a', subjectId: 'sbj-math', weeklyHours: 5, academicYearId: 'year-2025-2026' },
  { id: 'asg-3', teacherId: 'tch-2', classId: 'cls-6a', subjectId: 'sbj-fr', weeklyHours: 5, academicYearId: 'year-2025-2026' },
  { id: 'asg-4', teacherId: 'tch-2', classId: 'cls-3b', subjectId: 'sbj-fr', weeklyHours: 4, academicYearId: 'year-2025-2026' },
  { id: 'asg-5', teacherId: 'tch-3', classId: 'cls-tle-s', subjectId: 'sbj-pc', weeklyHours: 5, academicYearId: 'year-2025-2026' },
  { id: 'asg-6', teacherId: 'tch-4', classId: 'cls-tle-s', subjectId: 'sbj-ang', weeklyHours: 3, academicYearId: 'year-2025-2026' },
  { id: 'asg-7', teacherId: 'tch-5', classId: 'cls-tle-s', subjectId: 'sbj-svt', weeklyHours: 4, academicYearId: 'year-2025-2026' },
  { id: 'asg-8', teacherId: 'tch-6', classId: 'cls-6a', subjectId: 'sbj-hg', weeklyHours: 3, academicYearId: 'year-2025-2026' },
  { id: 'asg-9', teacherId: 'tch-7', classId: 'cls-tle-s', subjectId: 'sbj-info', weeklyHours: 2, academicYearId: 'year-2025-2026' },
];

export const initialTimetable: TimetableSlot[] = [
  { id: 'tt-1', classId: 'cls-tle-s', subjectId: 'sbj-math', teacherId: 'tch-1', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'Salle 205' },
  { id: 'tt-2', classId: 'cls-tle-s', subjectId: 'sbj-pc', teacherId: 'tch-3', dayOfWeek: 1, startTime: '10:15', endTime: '12:15', room: 'Labo Physique' },
  { id: 'tt-3', classId: 'cls-tle-s', subjectId: 'sbj-fr', teacherId: 'tch-2', dayOfWeek: 1, startTime: '13:30', endTime: '15:30', room: 'Salle 205' },
  { id: 'tt-4', classId: 'cls-tle-s', subjectId: 'sbj-svt', teacherId: 'tch-5', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'Labo SVT' },
  { id: 'tt-5', classId: 'cls-tle-s', subjectId: 'sbj-ang', teacherId: 'tch-4', dayOfWeek: 2, startTime: '10:15', endTime: '12:15', room: 'Salle 205' },
  { id: 'tt-6', classId: 'cls-tle-s', subjectId: 'sbj-info', teacherId: 'tch-7', dayOfWeek: 3, startTime: '08:00', endTime: '10:00', room: 'Salle Informatique' },
  { id: 'tt-7', classId: 'cls-tle-s', subjectId: 'sbj-math', teacherId: 'tch-1', dayOfWeek: 3, startTime: '10:15', endTime: '12:15', room: 'Salle 205' },
  { id: 'tt-8', classId: 'cls-tle-s', subjectId: 'sbj-hg', teacherId: 'tch-6', dayOfWeek: 4, startTime: '08:00', endTime: '10:00', room: 'Salle 205' },
  { id: 'tt-9', classId: 'cls-tle-s', subjectId: 'sbj-eps', teacherId: 'tch-1', dayOfWeek: 5, startTime: '08:00', endTime: '10:00', room: 'Terrain Sport' },
  // 6ème A
  { id: 'tt-10', classId: 'cls-6a', subjectId: 'sbj-fr', teacherId: 'tch-2', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'Salle 101' },
  { id: 'tt-11', classId: 'cls-6a', subjectId: 'sbj-math', teacherId: 'tch-1', dayOfWeek: 1, startTime: '10:15', endTime: '12:15', room: 'Salle 101' },
  { id: 'tt-12', classId: 'cls-6a', subjectId: 'sbj-hg', teacherId: 'tch-6', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'Salle 101' },
  { id: 'tt-13', classId: 'cls-6a', subjectId: 'sbj-ang', teacherId: 'tch-4', dayOfWeek: 2, startTime: '10:15', endTime: '12:15', room: 'Salle 101' },
];

export const initialParents: Parent[] = [
  { id: 'par-1', firstName: 'Dieudonné', lastName: 'KAYEMBE', relation: 'Père', profession: 'Cadre Bancaire', phone1: '+243 81 999 11 01', email: 'd.kayembe@gmail.com', address: '12 Rue des Lauriers, Quartier Belle-Vue', studentIds: ['stu-1', 'stu-4'] },
  { id: 'par-2', firstName: 'Solange', lastName: 'KAYEMBE', relation: 'Mère', profession: 'Médecin Pédiatre', phone1: '+243 81 999 11 02', email: 'solange.k@hopital.org', address: '12 Rue des Lauriers, Quartier Belle-Vue', studentIds: ['stu-1', 'stu-4'] },
  { id: 'par-3', firstName: 'François', lastName: 'LUMUMBA', relation: 'Père', profession: 'Architecte Urbaniste', phone1: '+243 81 999 22 01', email: 'flumumba@archidesign.com', address: '48 Avenue de la Paix', studentIds: ['stu-2'] },
  { id: 'par-4', firstName: 'Mariam', lastName: 'CISSE', relation: 'Mère', profession: 'Magistrate', phone1: '+243 81 999 33 01', email: 'm.cisse@justice.gov', address: '8 Rue des Palmiers', studentIds: ['stu-3'] },
  { id: 'par-5', firstName: 'Patrice', lastName: 'MUKENDI', relation: 'Tuteur légal', profession: 'Chef d\'Entreprise', phone1: '+243 81 999 44 01', email: 'p.mukendi@logistic-group.com', address: '25 Boulevard Lumumba', studentIds: ['stu-5'] },
];

export const initialStudents: Student[] = [
  {
    id: 'stu-1',
    matricule: 'MAT-2025-001',
    firstName: 'Yannick',
    lastName: 'KAYEMBE',
    gender: 'M',
    birthDate: '2008-05-14',
    birthPlace: 'Kinshasa',
    nationality: 'Congolaise',
    address: '12 Rue des Lauriers, Belle-Vue',
    phone: '+243 81 555 01 01',
    email: 'yannick.k@etudiant.org',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-tle-s',
    status: 'Actif',
    enrollmentDate: '2025-09-02',
    bloodGroup: 'O+',
    medicalNotes: 'Asthme léger, traitement d\'appoint disponible à l\'infirmerie.',
    emergencyContact: { name: 'Dieudonné KAYEMBE', phone: '+243 81 999 11 01', relation: 'Père' },
    parentIds: ['par-1', 'par-2'],
  },
  {
    id: 'stu-2',
    matricule: 'MAT-2025-002',
    firstName: 'Grace',
    lastName: 'LUMUMBA',
    gender: 'F',
    birthDate: '2008-11-20',
    birthPlace: 'Brazzaville',
    nationality: 'Congolaise',
    address: '48 Avenue de la Paix',
    phone: '+243 81 555 02 02',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-tle-s',
    status: 'Actif',
    enrollmentDate: '2025-09-02',
    bloodGroup: 'A+',
    medicalNotes: 'Aucune allergie connue.',
    emergencyContact: { name: 'François LUMUMBA', phone: '+243 81 999 22 01', relation: 'Père' },
    parentIds: ['par-3'],
  },
  {
    id: 'stu-3',
    matricule: 'MAT-2025-003',
    firstName: 'Amina',
    lastName: 'CISSE',
    gender: 'F',
    birthDate: '2008-02-18',
    birthPlace: 'Dakar',
    nationality: 'Sénégalaise',
    address: '8 Rue des Palmiers',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-tle-s',
    status: 'Actif',
    enrollmentDate: '2025-09-03',
    bloodGroup: 'B+',
    emergencyContact: { name: 'Mariam CISSE', phone: '+243 81 999 33 01', relation: 'Mère' },
    parentIds: ['par-4'],
  },
  {
    id: 'stu-4',
    matricule: 'MAT-2025-004',
    firstName: 'Junior',
    lastName: 'KAYEMBE',
    gender: 'M',
    birthDate: '2013-09-09',
    birthPlace: 'Kinshasa',
    nationality: 'Congolaise',
    address: '12 Rue des Lauriers, Belle-Vue',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-6a',
    status: 'Actif',
    enrollmentDate: '2025-09-02',
    bloodGroup: 'O+',
    emergencyContact: { name: 'Dieudonné KAYEMBE', phone: '+243 81 999 11 01', relation: 'Père' },
    parentIds: ['par-1', 'par-2'],
  },
  {
    id: 'stu-5',
    matricule: 'MAT-2025-005',
    firstName: 'Elie',
    lastName: 'MUKENDI',
    gender: 'M',
    birthDate: '2010-07-25',
    birthPlace: 'Lubumbashi',
    nationality: 'Congolaise',
    address: '25 Boulevard Lumumba',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-3b',
    status: 'Actif',
    enrollmentDate: '2025-09-04',
    bloodGroup: 'AB+',
    emergencyContact: { name: 'Patrice MUKENDI', phone: '+243 81 999 44 01', relation: 'Tuteur légal' },
    parentIds: ['par-5'],
  },
  {
    id: 'stu-6',
    matricule: 'MAT-2025-006',
    firstName: 'Fanta',
    lastName: 'DIABATE',
    gender: 'F',
    birthDate: '2008-04-12',
    birthPlace: 'Abidjan',
    nationality: 'Ivoirienne',
    address: '17 Rue de la Corniche',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    currentClassId: 'cls-tle-s',
    status: 'Actif',
    enrollmentDate: '2025-09-05',
    bloodGroup: 'O-',
    emergencyContact: { name: 'Ibrahim DIABATE', phone: '+243 81 999 55 01', relation: 'Père' },
    parentIds: [],
  },
];

export const initialEnrollments: Enrollment[] = [
  { id: 'enr-1', studentId: 'stu-1', classId: 'cls-tle-s', academicYearId: 'year-2025-2026', type: 'Réinscription', date: '2025-09-02', previousClass: '1ère S', decisionCouncil: 'Admis', documentsSubmitted: ['Bulletin Annuel N-1', 'Certificat Médical', 'Photos d\'identité'], status: 'Validé', feesPaidInitial: 150000, notes: 'Passage avec mention Bien en 1ère S.' },
  { id: 'enr-2', studentId: 'stu-2', classId: 'cls-tle-s', academicYearId: 'year-2025-2026', type: 'Réinscription', date: '2025-09-02', previousClass: '1ère S', decisionCouncil: 'Admis', documentsSubmitted: ['Bulletin Annuel N-1', 'Certificat Médical'], status: 'Validé', feesPaidInitial: 200000 },
  { id: 'enr-3', studentId: 'stu-3', classId: 'cls-tle-s', academicYearId: 'year-2025-2026', type: 'Nouvelle Inscription', date: '2025-09-03', previousClass: '1ère S - Lycée Français Dakar', decisionCouncil: 'Nouveau', documentsSubmitted: ['Acte de Naissance', 'Certificat de Radiation', 'Bulletins de 1ère S'], status: 'Validé', feesPaidInitial: 250000, notes: 'Dossier complet, test d\'entrée validé avec 16.5/20.' },
  { id: 'enr-4', studentId: 'stu-4', classId: 'cls-6a', academicYearId: 'year-2025-2026', type: 'Nouvelle Inscription', date: '2025-09-02', previousClass: 'CM2 Primaire', decisionCouncil: 'Admis', documentsSubmitted: ['Certificat d\'études primaires', 'Acte de naissance'], status: 'Validé', feesPaidInitial: 120000 },
  { id: 'enr-5', studentId: 'stu-5', classId: 'cls-3b', academicYearId: 'year-2025-2026', type: 'Réinscription', date: '2025-09-04', previousClass: '4ème B', decisionCouncil: 'Admis', documentsSubmitted: ['Fiche d\'engagement signée'], status: 'Validé', feesPaidInitial: 180000 },
  { id: 'enr-6', studentId: 'stu-6', classId: 'cls-tle-s', academicYearId: 'year-2025-2026', type: 'Nouvelle Inscription', date: '2025-09-05', previousClass: '1ère C', decisionCouncil: 'Nouveau', documentsSubmitted: ['Dossier scolaire complet'], status: 'Validé', feesPaidInitial: 220000 },
];

export const initialEvaluations: Evaluation[] = [
  // Terminale S - Trimestre 1
  { id: 'eval-1', title: 'Devoir Surveillé N°1 - Analyse & Suites', type: 'Devoir Surveillé', classId: 'cls-tle-s', subjectId: 'sbj-math', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-10-15', isPublished: true },
  { id: 'eval-2', title: 'Interrogation Écrite - Trigonométrie', type: 'Interrogation', classId: 'cls-tle-s', subjectId: 'sbj-math', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 1, date: '2025-10-28', isPublished: true },
  { id: 'eval-3', title: 'Composition Trimestrielle Mathématiques', type: 'Composition / Examen', classId: 'cls-tle-s', subjectId: 'sbj-math', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 3, date: '2025-11-25', isPublished: true },
  
  { id: 'eval-4', title: 'Dissertation Littéraire - L\'Engagement Poétique', type: 'Devoir Surveillé', classId: 'cls-tle-s', subjectId: 'sbj-fr', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-10-20', isPublished: true },
  { id: 'eval-5', title: 'Composition Trimestrielle Français', type: 'Composition / Examen', classId: 'cls-tle-s', subjectId: 'sbj-fr', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 3, date: '2025-11-26', isPublished: true },

  { id: 'eval-6', title: 'DS 1 - Cinématique & Lois de Newton', type: 'Devoir Surveillé', classId: 'cls-tle-s', subjectId: 'sbj-pc', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-10-22', isPublished: true },
  { id: 'eval-7', title: 'Composition Trimestrielle Physique-Chimie', type: 'Composition / Examen', classId: 'cls-tle-s', subjectId: 'sbj-pc', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 3, date: '2025-11-27', isPublished: true },

  { id: 'eval-8', title: 'Évaluation SVT - Génétique Moléculaire', type: 'Devoir Surveillé', classId: 'cls-tle-s', subjectId: 'sbj-svt', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-11-05', isPublished: true },
  { id: 'eval-9', title: 'Reading Comprehension & Essay', type: 'Devoir Surveillé', classId: 'cls-tle-s', subjectId: 'sbj-ang', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-11-10', isPublished: true },
  { id: 'eval-10', title: 'TP Programmation Python & BD', type: 'Travaux Pratiques', classId: 'cls-tle-s', subjectId: 'sbj-info', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-11-18', isPublished: true },

  // 6ème A
  { id: 'eval-11', title: 'Contrôle Nombres Entiers & Décimaux', type: 'Devoir Surveillé', classId: 'cls-6a', subjectId: 'sbj-math', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-10-18', isPublished: true },
  { id: 'eval-12', title: 'Dictée & Questions de Compréhension', type: 'Devoir Surveillé', classId: 'cls-6a', subjectId: 'sbj-fr', termId: 'term-t1', academicYearId: 'year-2025-2026', maxScore: 20, coefficient: 2, date: '2025-10-25', isPublished: true },
];

export const initialGrades: Grade[] = [
  // Yannick KAYEMBE (stu-1) - Excellent élève scientifique
  { id: 'grd-1', evaluationId: 'eval-1', studentId: 'stu-1', score: 17.5, comment: 'Très bonne rigueur mathématique.' },
  { id: 'grd-2', evaluationId: 'eval-2', studentId: 'stu-1', score: 18.0, comment: 'Excellente maîtrise.' },
  { id: 'grd-3', evaluationId: 'eval-3', studentId: 'stu-1', score: 16.5, comment: 'Résultats remarquables.' },
  { id: 'grd-4', evaluationId: 'eval-4', studentId: 'stu-1', score: 14.0, comment: 'Bonne argumentation littéraire.' },
  { id: 'grd-5', evaluationId: 'eval-5', studentId: 'stu-1', score: 13.5, comment: 'Bon travail d\'ensemble.' },
  { id: 'grd-6', evaluationId: 'eval-6', studentId: 'stu-1', score: 16.0, comment: 'Résolution méthodique.' },
  { id: 'grd-7', evaluationId: 'eval-7', studentId: 'stu-1', score: 17.0, comment: 'Très bien préparé.' },
  { id: 'grd-8', evaluationId: 'eval-8', studentId: 'stu-1', score: 15.5, comment: 'Bonnes explications biologiques.' },
  { id: 'grd-9', evaluationId: 'eval-9', studentId: 'stu-1', score: 16.0, comment: 'Fluent and accurate expression.' },
  { id: 'grd-10', evaluationId: 'eval-10', studentId: 'stu-1', score: 19.0, comment: 'Code propre et optimisé.' },

  // Grace LUMUMBA (stu-2) - Très bonne élève polyvalente
  { id: 'grd-11', evaluationId: 'eval-1', studentId: 'stu-2', score: 15.0, comment: 'Bon raisonnement.' },
  { id: 'grd-12', evaluationId: 'eval-2', studentId: 'stu-2', score: 16.0, comment: 'Très bien assimilé.' },
  { id: 'grd-13', evaluationId: 'eval-3', studentId: 'stu-2', score: 15.5, comment: 'Régulière et appliquée.' },
  { id: 'grd-14', evaluationId: 'eval-4', studentId: 'stu-2', score: 17.0, comment: 'Style d\'écriture remarquable !' },
  { id: 'grd-15', evaluationId: 'eval-5', studentId: 'stu-2', score: 16.5, comment: 'Excellente dissertation.' },
  { id: 'grd-16', evaluationId: 'eval-6', studentId: 'stu-2', score: 14.5, comment: 'Bon travail.' },
  { id: 'grd-17', evaluationId: 'eval-7', studentId: 'stu-2', score: 15.0, comment: 'Bonne maîtrise des formules.' },
  { id: 'grd-18', evaluationId: 'eval-8', studentId: 'stu-2', score: 16.0, comment: 'Excellents schémas.' },
  { id: 'grd-19', evaluationId: 'eval-9', studentId: 'stu-2', score: 18.0, comment: 'Outstanding writing skills.' },
  { id: 'grd-20', evaluationId: 'eval-10', studentId: 'stu-2', score: 17.0, comment: 'Projet complet.' },

  // Amina CISSE (stu-3)
  { id: 'grd-21', evaluationId: 'eval-1', studentId: 'stu-3', score: 13.0, comment: 'Assez bon travail, attention au temps.' },
  { id: 'grd-22', evaluationId: 'eval-2', studentId: 'stu-3', score: 14.0, comment: 'En progrès.' },
  { id: 'grd-23', evaluationId: 'eval-3', studentId: 'stu-3', score: 12.5, comment: 'Passable, consolider les bases.' },
  { id: 'grd-24', evaluationId: 'eval-4', studentId: 'stu-3', score: 15.0, comment: 'Idées riches et bien structurées.' },
  { id: 'grd-25', evaluationId: 'eval-5', studentId: 'stu-3', score: 14.0, comment: 'Bonne copie.' },
  { id: 'grd-26', evaluationId: 'eval-6', studentId: 'stu-3', score: 13.5, comment: 'Calculs corrects.' },
  { id: 'grd-27', evaluationId: 'eval-7', studentId: 'stu-3', score: 13.0, comment: 'Ensemble satisfaisant.' },
  { id: 'grd-28', evaluationId: 'eval-8', studentId: 'stu-3', score: 14.5, comment: 'Bonne participation.' },
  { id: 'grd-29', evaluationId: 'eval-9', studentId: 'stu-3', score: 15.5, comment: 'Good comprehension.' },
  { id: 'grd-30', evaluationId: 'eval-10', studentId: 'stu-3', score: 15.0, comment: 'Bien exécuté.' },

  // Fanta DIABATE (stu-6)
  { id: 'grd-31', evaluationId: 'eval-1', studentId: 'stu-6', score: 11.5, comment: 'Efforts constants, persévérer.' },
  { id: 'grd-32', evaluationId: 'eval-2', studentId: 'stu-6', score: 12.0, comment: 'Correct.' },
  { id: 'grd-33', evaluationId: 'eval-3', studentId: 'stu-6', score: 10.5, comment: 'Juste la moyenne, réviser davantage.' },
  { id: 'grd-34', evaluationId: 'eval-4', studentId: 'stu-6', score: 12.5, comment: 'Bonne volonté.' },
  { id: 'grd-35', evaluationId: 'eval-5', studentId: 'stu-6', score: 11.0, comment: 'Peut mieux faire.' },
  { id: 'grd-36', evaluationId: 'eval-6', studentId: 'stu-6', score: 11.0, comment: 'Régulier.' },
  { id: 'grd-37', evaluationId: 'eval-7', studentId: 'stu-6', score: 10.0, comment: 'Moyen.' },
  { id: 'grd-38', evaluationId: 'eval-8', studentId: 'stu-6', score: 12.0, comment: 'Assez bien.' },
  { id: 'grd-39', evaluationId: 'eval-9', studentId: 'stu-6', score: 13.0, comment: 'Active en classe.' },
  { id: 'grd-40', evaluationId: 'eval-10', studentId: 'stu-6', score: 14.0, comment: 'Bonne implication.' },

  // Junior KAYEMBE (stu-4) - 6ème A
  { id: 'grd-41', evaluationId: 'eval-11', studentId: 'stu-4', score: 18.5, comment: 'Très brillant en calcul mental.' },
  { id: 'grd-42', evaluationId: 'eval-12', studentId: 'stu-4', score: 16.0, comment: 'Excellente orthographe.' },
];

export const initialAttendanceSessions: AttendanceSession[] = [
  {
    id: 'att-1',
    date: '2025-10-15',
    classId: 'cls-tle-s',
    timeSlot: '08:00 - 10:00',
    subjectId: 'sbj-math',
    teacherId: 'tch-1',
    academicYearId: 'year-2025-2026',
    recordedBy: 'Augustin MBEMBA',
    entries: [
      { studentId: 'stu-1', status: 'Présent' },
      { studentId: 'stu-2', status: 'Présent' },
      { studentId: 'stu-3', status: 'Retard', minutesLate: 15, reason: 'Embouteillage Pont de Gaulle', justified: true },
      { studentId: 'stu-6', status: 'Présent' },
    ],
  },
  {
    id: 'att-2',
    date: '2025-10-22',
    classId: 'cls-tle-s',
    timeSlot: '10:15 - 12:15',
    subjectId: 'sbj-pc',
    teacherId: 'tch-3',
    academicYearId: 'year-2025-2026',
    recordedBy: 'Samuel NGUEMA',
    entries: [
      { studentId: 'stu-1', status: 'Présent' },
      { studentId: 'stu-2', status: 'Présent' },
      { studentId: 'stu-3', status: 'Présent' },
      { studentId: 'stu-6', status: 'Absent', reason: 'Raison médicale (Certificat fourni)', justified: true },
    ],
  },
  {
    id: 'att-3',
    date: '2025-11-05',
    classId: 'cls-tle-s',
    timeSlot: '08:00 - 10:00',
    subjectId: 'sbj-svt',
    teacherId: 'tch-5',
    academicYearId: 'year-2025-2026',
    recordedBy: 'Christian BOUANGA',
    entries: [
      { studentId: 'stu-1', status: 'Retard', minutesLate: 10, reason: 'Visite médicale matinale', justified: true },
      { studentId: 'stu-2', status: 'Présent' },
      { studentId: 'stu-3', status: 'Présent' },
      { studentId: 'stu-6', status: 'Présent' },
    ],
  },
  {
    id: 'att-4',
    date: '2025-11-12',
    classId: 'cls-6a',
    timeSlot: '08:00 - 10:00',
    subjectId: 'sbj-fr',
    teacherId: 'tch-2',
    academicYearId: 'year-2025-2026',
    recordedBy: 'Marie-Claire DIOP',
    entries: [
      { studentId: 'stu-4', status: 'Présent' },
    ],
  },
];

export const initialFeeStructures: FeeStructure[] = [
  { id: 'fee-1', name: 'Frais de Scolarité Annuelle (Lycée)', code: 'SCOL-LYC', category: 'Scolarité', amount: 650000, levelId: 'lvl-lyc', isMandatory: true, dueDate: '2026-03-31', academicYearId: 'year-2025-2026' },
  { id: 'fee-2', name: 'Frais de Scolarité Annuelle (Collège)', code: 'SCOL-COL', category: 'Scolarité', amount: 500000, levelId: 'lvl-col', isMandatory: true, dueDate: '2026-03-31', academicYearId: 'year-2025-2026' },
  { id: 'fee-3', name: 'Frais d\'Inscription & Dossier', code: 'INS-GEN', category: 'Inscription', amount: 50000, isMandatory: true, dueDate: '2025-09-30', academicYearId: 'year-2025-2026' },
  { id: 'fee-4', name: 'Pack Uniforme Scolaire & Blason', code: 'UNIF-ALL', category: 'Services', amount: 35000, isMandatory: true, dueDate: '2025-09-15', academicYearId: 'year-2025-2026' },
  { id: 'fee-5', name: 'Frais d\'Examen Blanc & Travaux Pratiques', code: 'EXAM-TER', category: 'Examens', amount: 45000, classId: 'cls-tle-s', isMandatory: true, dueDate: '2026-02-15', academicYearId: 'year-2025-2026' },
  { id: 'fee-6', name: 'Service Restauration / Cantine Trimestre 1', code: 'CANT-T1', category: 'Services', amount: 90000, isMandatory: false, dueDate: '2025-10-01', academicYearId: 'year-2025-2026' },
];

export const initialPayments: Payment[] = [
  { id: 'pay-1', receiptNumber: 'REC-2025-0001', studentId: 'stu-1', feeStructureId: 'fee-3', amount: 50000, paymentDate: '2025-09-02', paymentMethod: 'Espèces', reference: 'ESP-9921', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026', notes: 'Règlement complet frais inscription' },
  { id: 'pay-2', receiptNumber: 'REC-2025-0002', studentId: 'stu-1', feeStructureId: 'fee-4', amount: 35000, paymentDate: '2025-09-02', paymentMethod: 'Espèces', reference: 'ESP-9922', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026', notes: 'Pack uniforme livré' },
  { id: 'pay-3', receiptNumber: 'REC-2025-0003', studentId: 'stu-1', feeStructureId: 'fee-1', amount: 300000, paymentDate: '2025-09-15', paymentMethod: 'Virement bancaire', reference: 'VIR-BNP-8819', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026', notes: '1ère Tranche Scolarité' },
  
  { id: 'pay-4', receiptNumber: 'REC-2025-0004', studentId: 'stu-2', feeStructureId: 'fee-3', amount: 50000, paymentDate: '2025-09-02', paymentMethod: 'Mobile Money', reference: 'MM-ORANGE-4412', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026' },
  { id: 'pay-5', receiptNumber: 'REC-2025-0005', studentId: 'stu-2', feeStructureId: 'fee-4', amount: 35000, paymentDate: '2025-09-02', paymentMethod: 'Mobile Money', reference: 'MM-ORANGE-4413', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026' },
  { id: 'pay-6', receiptNumber: 'REC-2025-0006', studentId: 'stu-2', feeStructureId: 'fee-1', amount: 650000, paymentDate: '2025-09-10', paymentMethod: 'Chèque', reference: 'CHQ-ECOBANK-00918', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026', notes: 'Scolarité soldée en totalité (Paiement intégral)' },

  { id: 'pay-7', receiptNumber: 'REC-2025-0007', studentId: 'stu-3', feeStructureId: 'fee-3', amount: 50000, paymentDate: '2025-09-03', paymentMethod: 'Virement bancaire', reference: 'VIR-UBA-2231', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026' },
  { id: 'pay-8', receiptNumber: 'REC-2025-0008', studentId: 'stu-3', feeStructureId: 'fee-1', amount: 250000, paymentDate: '2025-09-20', paymentMethod: 'Virement bancaire', reference: 'VIR-UBA-3392', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026', notes: 'Paiement partiel tranche 1' },

  { id: 'pay-9', receiptNumber: 'REC-2025-0009', studentId: 'stu-4', feeStructureId: 'fee-3', amount: 50000, paymentDate: '2025-09-02', paymentMethod: 'Espèces', reference: 'ESP-9944', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026' },
  { id: 'pay-10', receiptNumber: 'REC-2025-0010', studentId: 'stu-4', feeStructureId: 'fee-2', amount: 250000, paymentDate: '2025-09-15', paymentMethod: 'Virement bancaire', reference: 'VIR-BNP-8820', recordedBy: 'Roger ILUNGA', academicYearId: 'year-2025-2026' },
];

export const initialUsers: UserAccount[] = [
  { id: 'usr-admin', username: 'admin', fullName: 'Dr. Jean-Marc KABORE', role: 'ADMIN', email: 'directeur@elitesdusavoir.org', active: true, lastLogin: '2026-09-28 08:30' },
  { id: 'usr-proviseur', username: 'proviseur', fullName: 'Clarisse MOUSSA', role: 'DIRECTEUR', email: 'censeur@elitesdusavoir.org', active: true, lastLogin: '2026-09-27 16:15' },
  { id: 'usr-comptable', username: 'comptable', fullName: 'Roger ILUNGA', role: 'COMPTABLE', email: 'comptabilite@elitesdusavoir.org', active: true, lastLogin: '2026-09-28 09:12' },
  { id: 'usr-secretaire', username: 'secretaire', fullName: 'Béatrice SOW', role: 'SECRETAIRE', email: 'secretariat@elitesdusavoir.org', active: true, lastLogin: '2026-09-28 08:00' },
  { id: 'usr-prof-math', username: 'a.mbemba', fullName: 'Augustin MBEMBA', role: 'ENSEIGNANT', email: 'a.mbemba@elitesdusavoir.org', active: true, linkedTeacherId: 'tch-1', lastLogin: '2026-09-26 14:20' },
  { id: 'usr-parent-kayembe', username: 'p.kayembe', fullName: 'Dieudonné KAYEMBE', role: 'PARENT', email: 'd.kayembe@gmail.com', active: true, linkedParentId: 'par-1', lastLogin: '2026-09-25 19:45' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-09-28 08:30:12', userId: 'usr-admin', userName: 'Dr. Jean-Marc KABORE', role: 'ADMIN', actionType: 'CONNEXION', module: 'Authentification', description: 'Connexion réussie au tableau de bord d\'administration.' },
  { id: 'log-2', timestamp: '2026-09-27 16:12:45', userId: 'usr-comptable', userName: 'Roger ILUNGA', role: 'COMPTABLE', actionType: 'CRÉATION', module: 'Finances', description: 'Enregistrement du paiement REC-2025-0010 de 250 000 FCFA pour Junior KAYEMBE.' },
  { id: 'log-3', timestamp: '2026-09-26 14:15:20', userId: 'usr-prof-math', userName: 'Augustin MBEMBA', role: 'ENSEIGNANT', actionType: 'CRÉATION', module: 'Évaluations', description: 'Saisie des notes pour la Composition Trimestrielle de Mathématiques (Terminale S2).' },
  { id: 'log-4', timestamp: '2026-09-25 11:22:04', userId: 'usr-secretaire', userName: 'Béatrice SOW', role: 'SECRETAIRE', actionType: 'CRÉATION', module: 'Inscriptions', description: 'Validation de l\'inscription de l\'élève Amina CISSE en Terminale S2.' },
  { id: 'log-5', timestamp: '2026-09-24 15:40:00', userId: 'usr-admin', userName: 'Dr. Jean-Marc KABORE', role: 'ADMIN', actionType: 'MODIFICATION', module: 'Années Scolaires', description: 'Configuration des dates de clôture du 1er Trimestre 2025-2026.' },
];
