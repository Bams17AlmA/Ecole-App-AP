/**
 * EduMaster Pro - Types & Data Models
 * Système Intégré de Gestion Scolaire (ERP)
 */

export type SchoolType = 'Général' | 'Technique' | 'Professionnel' | 'Polyvalent';

export interface Establishment {
  id: string;
  name: string;
  shortName: string;
  code: string;
  motto: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  directorName: string;
  directorTitle: string; // e.g. "Proviseur" | "Directeur Général"
  schoolType: SchoolType;
  currency: string;
  stampText: string;
  academicYearId: string;
}

export interface Term {
  id: string;
  name: string; // "1er Trimestre", "2ème Trimestre", "3ème Trimestre"
  code: string; // "T1", "T2", "T3"
  startDate: string;
  endDate: string;
  isClosed: boolean;
  weight: number;
}

export interface AcademicYear {
  id: string;
  label: string; // "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: Term[];
}

export interface EducationLevel {
  id: string;
  name: string; // "Collège", "Lycée", "Primaire", "Maternelle"
  code: string; // "COL", "LYC", "PRIM", "MAT"
  order: number;
  cycle: string; // "Cycle d'orientation", "Second cycle", etc.
}

export interface SectionOption {
  id: string;
  name: string; // "Enseignement Général", "Sciences Exactes (S)", "Littéraire (L)", "Technique & Tertiaire"
  code: string; // "GEN", "S", "L", "TECH"
  levelId: string;
  description?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // "6ème A", "3ème B", "Terminale S1", "Seconde C"
  code: string;
  levelId: string;
  sectionId?: string;
  mainTeacherId?: string;
  roomNumber: string;
  capacity: number;
  academicYearId: string;
}

export type SubjectCategory = 'Scientifique' | 'Littéraire' | 'Langues' | 'Sciences Humaines' | 'Arts & Sport' | 'Technologie';

export interface Subject {
  id: string;
  code: string; // "MATH", "FR", "PC", "SVT", "ANG", "HG", "PHILO", "EPS", "INFO"
  name: string;
  category: SubjectCategory;
  defaultCoefficient: number;
  coefficientByLevel: Record<string, number>; // levelId -> coefficient
  color: string;
}

export type StudentStatus = 'Actif' | 'Transféré' | 'Exclu' | 'Diplômé' | 'Abandon';

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  nationality: string;
  address: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  currentClassId: string;
  status: StudentStatus;
  enrollmentDate: string;
  bloodGroup?: string;
  medicalNotes?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  parentIds: string[];
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  relation: 'Père' | 'Mère' | 'Tuteur légal' | 'Autre';
  profession: string;
  phone1: string;
  phone2?: string;
  email?: string;
  address: string;
  studentIds: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  type: 'Nouvelle Inscription' | 'Réinscription';
  date: string;
  previousClass?: string;
  decisionCouncil?: 'Admis' | 'Redouble' | 'Exclu' | 'Nouveau';
  documentsSubmitted: string[];
  status: 'Validé' | 'En attente' | 'Rejeté';
  feesPaidInitial: number;
  notes?: string;
}

export interface Teacher {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  mainSubjectIds: string[];
  qualification: string; // "Master 2", "CAPES", "Doctorat", "Licence"
  status: 'Titulaire' | 'Vacataire' | 'Contractuel';
  hireDate: string;
  hourlyRate?: number;
  avatarUrl?: string;
}

export interface Staff {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  role: 'Directeur Général' | 'Proviseur' | 'Censeur' | 'Comptable Principal' | 'Secrétaire Général' | 'Surveillant Général' | 'Intendant';
  phone: string;
  email: string;
  department: string;
  hireDate: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  weeklyHours: number;
  academicYearId: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  teacherId: string;
  subjectId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6; // 1 = Lundi, 6 = Samedi
  startTime: string; // "08:00"
  endTime: string;   // "10:00"
  room: string;
}

export type AttendanceStatus = 'Présent' | 'Absent' | 'Retard' | 'Excusé';

export interface AttendanceStudentEntry {
  studentId: string;
  status: AttendanceStatus;
  minutesLate?: number;
  reason?: string;
  justified?: boolean;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  timeSlot: string; // "08:00 - 10:00"
  subjectId?: string;
  teacherId?: string;
  academicYearId: string;
  entries: AttendanceStudentEntry[];
  recordedBy: string;
}

export type EvaluationType = 'Devoir Surveillé' | 'Interrogation' | 'Travaux Pratiques' | 'Composition / Examen';

export interface Evaluation {
  id: string;
  title: string;
  type: EvaluationType;
  classId: string;
  subjectId: string;
  termId: string;
  academicYearId: string;
  maxScore: number; // default 20
  coefficient: number;
  date: string;
  isPublished: boolean;
}

export interface Grade {
  id: string;
  evaluationId: string;
  studentId: string;
  score: number; // between 0 and maxScore
  comment?: string;
}

export interface FeeStructure {
  id: string;
  name: string; // "Frais de Scolarité Annuelle", "Inscription / Dossier", "Tenue & Écusson", "Cantine T1"
  code: string;
  category: 'Scolarité' | 'Inscription' | 'Services' | 'Examens' | 'Autre';
  amount: number;
  levelId?: string;
  classId?: string;
  isMandatory: boolean;
  dueDate: string;
  academicYearId: string;
}

export type PaymentMethod = 'Espèces' | 'Virement bancaire' | 'Chèque' | 'Mobile Money';

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "REC-2025-0012"
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  recordedBy: string;
  notes?: string;
  academicYearId: string;
}

export type UserRole = 'ADMIN' | 'DIRECTEUR' | 'ENSEIGNANT' | 'COMPTABLE' | 'SECRETAIRE' | 'PARENT';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  active: boolean;
  linkedTeacherId?: string;
  linkedParentId?: string;
  lastLogin?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  actionType: 'CRÉATION' | 'MODIFICATION' | 'SUPPRESSION' | 'CONNEXION' | 'EXPORT' | 'IMPRESSION' | 'RESTAURATION';
  module: string;
  description: string;
}
