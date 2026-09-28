import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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

import {
  initialEstablishment,
  initialAcademicYears,
  initialEducationLevels,
  initialSections,
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialStaff,
  initialTeacherAssignments,
  initialTimetable,
  initialStudents,
  initialParents,
  initialEnrollments,
  initialEvaluations,
  initialGrades,
  initialAttendanceSessions,
  initialFeeStructures,
  initialPayments,
  initialUsers,
  initialAuditLogs,
} from '../data/initialData';

const STORAGE_KEY = 'edumaster_pro_database_v1';

export interface StudentFeeSummary {
  totalDue: number;
  totalPaid: number;
  balanceDue: number;
  isFullyPaid: boolean;
  hasOverdue: boolean;
  payments: Payment[];
  applicableFees: FeeStructure[];
}

export interface StudentTermReport {
  student: Student;
  classRoom: ClassRoom;
  termAverage: number;
  rank: number;
  totalPoints: number;
  totalCoefficients: number;
  classSize: number;
  classAverage: number;
  classMin: number;
  classMax: number;
  subjectReports: Array<{
    subject: Subject;
    coefficient: number;
    average: number;
    points: number;
    grades: Grade[];
    rankInSubject: number;
    teacherName?: string;
    appreciation: string;
  }>;
  attendance: {
    totalAbsences: number;
    unjustifiedAbsences: number;
    lates: number;
  };
  mention: string;
  councilDecision: string;
}

interface SchoolContextType {
  // Data
  establishment: Establishment;
  academicYears: AcademicYear[];
  currentAcademicYear: AcademicYear;
  educationLevels: EducationLevel[];
  sections: SectionOption[];
  classes: ClassRoom[];
  subjects: Subject[];
  teachers: Teacher[];
  staff: Staff[];
  teacherAssignments: TeacherAssignment[];
  timetable: TimetableSlot[];
  students: Student[];
  parents: Parent[];
  enrollments: Enrollment[];
  evaluations: Evaluation[];
  grades: Grade[];
  attendanceSessions: AttendanceSession[];
  feeStructures: FeeStructure[];
  payments: Payment[];
  users: UserAccount[];
  currentUser: UserAccount;
  auditLogs: AuditLog[];

  // Mutators
  updateEstablishment: (data: Partial<Establishment>) => void;
  addAcademicYear: (data: Omit<AcademicYear, 'id'>) => void;
  setCurrentAcademicYear: (id: string) => void;
  
  // Students & Parents & Inscriptions
  addStudent: (student: Omit<Student, 'id' | 'matricule'>, parentData?: Omit<Parent, 'id' | 'studentIds'>, initialPaymentAmount?: number) => Student;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addParent: (parent: Omit<Parent, 'id'>) => Parent;
  updateParent: (parent: Parent) => void;
  deleteParent: (id: string) => void;
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => void;
  reEnrollStudent: (studentId: string, targetClassId: string, notes?: string, initialPayment?: number) => void;

  // Structure
  addClass: (cls: Omit<ClassRoom, 'id' | 'code'>) => void;
  updateClass: (cls: ClassRoom) => void;
  deleteClass: (id: string) => void;
  addEducationLevel: (lvl: Omit<EducationLevel, 'id' | 'code'>) => void;
  updateEducationLevel: (lvl: EducationLevel) => void;
  addSection: (sec: Omit<SectionOption, 'id' | 'code'>) => void;
  updateSection: (sec: SectionOption) => void;
  addSubject: (sbj: Omit<Subject, 'id' | 'code'>) => void;
  updateSubject: (sbj: Subject) => void;

  // Staff & Teachers
  addTeacher: (teacher: Omit<Teacher, 'id' | 'matricule'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  addStaff: (staff: Omit<Staff, 'id' | 'matricule'>) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
  addAssignment: (asg: Omit<TeacherAssignment, 'id'>) => void;
  deleteAssignment: (id: string) => void;

  // Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Attendance
  recordAttendance: (session: Omit<AttendanceSession, 'id'>) => void;

  // Grades & Evals
  addEvaluation: (evalData: Omit<Evaluation, 'id'>) => Evaluation;
  updateEvaluation: (evalData: Evaluation) => void;
  deleteEvaluation: (id: string) => void;
  saveGrades: (evaluationId: string, gradeEntries: Array<{ studentId: string; score: number; comment?: string }>) => void;

  // Finance
  addFeeStructure: (fee: Omit<FeeStructure, 'id' | 'code'>) => void;
  updateFeeStructure: (fee: FeeStructure) => void;
  deleteFeeStructure: (id: string) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;

  // Users & Permissions
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUser: (user: UserAccount) => void;
  deleteUser: (id: string) => void;
  switchUser: (userId: string) => void;

  // Audit Log
  logAction: (actionType: AuditLog['actionType'], module: string, description: string) => void;

  // Backup & Restore
  exportBackup: () => void;
  restoreBackup: (jsonContent: string) => { success: boolean; message: string };
  resetToDemoData: () => void;

  // Calculation Helpers
  getStudentFeeSummary: (studentId: string) => StudentFeeSummary;
  getStudentReportCard: (studentId: string, termId: string) => StudentTermReport | null;
  getClassRankings: (classId: string, termId: string) => Array<{ student: Student; average: number; rank: number }>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage or fallback to preloaded demo data
  const [establishment, setEstablishment] = useState<Establishment>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_est`);
      return stored ? JSON.parse(stored) : initialEstablishment;
    } catch {
      return initialEstablishment;
    }
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_academicYears`);
      return stored ? JSON.parse(stored) : initialAcademicYears;
    } catch {
      return initialAcademicYears;
    }
  });

  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_levels`);
      return stored ? JSON.parse(stored) : initialEducationLevels;
    } catch {
      return initialEducationLevels;
    }
  });

  const [sections, setSections] = useState<SectionOption[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_sections`);
      return stored ? JSON.parse(stored) : initialSections;
    } catch {
      return initialSections;
    }
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_classes`);
      return stored ? JSON.parse(stored) : initialClasses;
    } catch {
      return initialClasses;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_subjects`);
      return stored ? JSON.parse(stored) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_teachers`);
      return stored ? JSON.parse(stored) : initialTeachers;
    } catch {
      return initialTeachers;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_staff`);
      return stored ? JSON.parse(stored) : initialStaff;
    } catch {
      return initialStaff;
    }
  });

  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_assignments`);
      return stored ? JSON.parse(stored) : initialTeacherAssignments;
    } catch {
      return initialTeacherAssignments;
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_timetable`);
      return stored ? JSON.parse(stored) : initialTimetable;
    } catch {
      return initialTimetable;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_students`);
      return stored ? JSON.parse(stored) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [parents, setParents] = useState<Parent[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_parents`);
      return stored ? JSON.parse(stored) : initialParents;
    } catch {
      return initialParents;
    }
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_enrollments`);
      return stored ? JSON.parse(stored) : initialEnrollments;
    } catch {
      return initialEnrollments;
    }
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_evaluations`);
      return stored ? JSON.parse(stored) : initialEvaluations;
    } catch {
      return initialEvaluations;
    }
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_grades`);
      return stored ? JSON.parse(stored) : initialGrades;
    } catch {
      return initialGrades;
    }
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_attendance`);
      return stored ? JSON.parse(stored) : initialAttendanceSessions;
    } catch {
      return initialAttendanceSessions;
    }
  });

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_fees`);
      return stored ? JSON.parse(stored) : initialFeeStructures;
    } catch {
      return initialFeeStructures;
    }
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_payments`);
      return stored ? JSON.parse(stored) : initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_users`);
      return stored ? JSON.parse(stored) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_current_user`);
      return stored ? JSON.parse(stored) : initialUsers[0];
    } catch {
      return initialUsers[0];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return stored ? JSON.parse(stored) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  // Current Academic Year
  const currentAcademicYear = useMemo(() => {
    return academicYears.find(y => y.isCurrent) || academicYears[0];
  }, [academicYears]);

  // Persist state changes automatically to localStorage for PWA offline operation
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_est`, JSON.stringify(establishment));
      localStorage.setItem(`${STORAGE_KEY}_academicYears`, JSON.stringify(academicYears));
      localStorage.setItem(`${STORAGE_KEY}_levels`, JSON.stringify(educationLevels));
      localStorage.setItem(`${STORAGE_KEY}_sections`, JSON.stringify(sections));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(teacherAssignments));
      localStorage.setItem(`${STORAGE_KEY}_timetable`, JSON.stringify(timetable));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(parents));
      localStorage.setItem(`${STORAGE_KEY}_enrollments`, JSON.stringify(enrollments));
      localStorage.setItem(`${STORAGE_KEY}_evaluations`, JSON.stringify(evaluations));
      localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceSessions));
      localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(feeStructures));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage quota or error', e);
    }
  }, [
    establishment, academicYears, educationLevels, sections, classes, subjects,
    teachers, staff, teacherAssignments, timetable, students, parents,
    enrollments, evaluations, grades, attendanceSessions, feeStructures,
    payments, users, currentUser, auditLogs
  ]);

  // Audit Logging Helper
  const logAction = (actionType: AuditLog['actionType'], module: string, description: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      userId: currentUser.id,
      userName: currentUser.fullName,
      role: currentUser.role,
      actionType,
      module,
      description,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Establishment & Academic Year
  const updateEstablishment = (data: Partial<Establishment>) => {
    setEstablishment(prev => {
      const updated = { ...prev, ...data };
      logAction('MODIFICATION', 'Établissement', `Mise à jour des coordonnées de l'établissement: ${updated.name}`);
      return updated;
    });
  };

  const addAcademicYear = (data: Omit<AcademicYear, 'id'>) => {
    const id = `year-${Date.now()}`;
    const newYear: AcademicYear = { ...data, id };
    setAcademicYears(prev => {
      let updated = [...prev];
      if (newYear.isCurrent) {
        updated = updated.map(y => ({ ...y, isCurrent: false }));
      }
      return [newYear, ...updated];
    });
    logAction('CRÉATION', 'Années Scolaires', `Création de l'année scolaire ${newYear.label}`);
  };

  const setCurrentAcademicYear = (id: string) => {
    setAcademicYears(prev =>
      prev.map(y => ({ ...y, isCurrent: y.id === id }))
    );
    const yr = academicYears.find(y => y.id === id);
    logAction('MODIFICATION', 'Années Scolaires', `Activation de l'année scolaire ${yr?.label}`);
  };

  // Students & Parents & Inscriptions
  const addStudent = (
    studentData: Omit<Student, 'id' | 'matricule'>,
    parentData?: Omit<Parent, 'id' | 'studentIds'>,
    initialPaymentAmount?: number
  ): Student => {
    const count = students.length + 1;
    const yearPrefix = currentAcademicYear.label.split('-')[0] || '2025';
    const matricule = `MAT-${yearPrefix}-${String(count).padStart(3, '0')}`;
    const studentId = `stu-${Date.now()}`;

    let parentIdList: string[] = studentData.parentIds || [];

    if (parentData) {
      const newParentId = `par-${Date.now()}`;
      const newParent: Parent = {
        ...parentData,
        id: newParentId,
        studentIds: [studentId],
      };
      setParents(prev => [...prev, newParent]);
      parentIdList = [newParentId];
      logAction('CRÉATION', 'Parents', `Ajout du parent/tuteur ${newParent.firstName} ${newParent.lastName}`);
    }

    const newStudent: Student = {
      ...studentData,
      id: studentId,
      matricule,
      parentIds: parentIdList,
    };

    setStudents(prev => [newStudent, ...prev]);

    // Create Enrollment Record
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      studentId: newStudent.id,
      classId: newStudent.currentClassId,
      academicYearId: currentAcademicYear.id,
      type: 'Nouvelle Inscription',
      date: new Date().toISOString().split('T')[0],
      documentsSubmitted: ['Fiche d\'inscription', 'Certificat de naissance'],
      status: 'Validé',
      feesPaidInitial: initialPaymentAmount || 0,
    };
    setEnrollments(prev => [newEnrollment, ...prev]);

    // If initial payment provided, record it
    if (initialPaymentAmount && initialPaymentAmount > 0) {
      const fee = feeStructures.find(f => f.category === 'Inscription') || feeStructures[0];
      const receiptNumber = `REC-${yearPrefix}-${String(payments.length + 1).padStart(4, '0')}`;
      const payment: Payment = {
        id: `pay-${Date.now()}`,
        receiptNumber,
        studentId: newStudent.id,
        feeStructureId: fee ? fee.id : 'fee-gen',
        amount: initialPaymentAmount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Espèces',
        reference: `INSCR-${matricule}`,
        recordedBy: currentUser.fullName,
        notes: 'Paiement initial lors de l\'inscription',
        academicYearId: currentAcademicYear.id,
      };
      setPayments(prev => [payment, ...prev]);
    }

    logAction('CRÉATION', 'Élèves', `Inscription du nouvel élève ${newStudent.firstName} ${newStudent.lastName} (${matricule})`);
    return newStudent;
  };

  const updateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => (s.id === student.id ? student : s)));
    logAction('MODIFICATION', 'Élèves', `Modification du dossier de l'élève ${student.firstName} ${student.lastName} (${student.matricule})`);
  };

  const deleteStudent = (id: string) => {
    const st = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    logAction('SUPPRESSION', 'Élèves', `Suppression de l'élève ${st?.firstName} ${st?.lastName}`);
  };

  const addParent = (parentData: Omit<Parent, 'id'>): Parent => {
    const newParent: Parent = {
      ...parentData,
      id: `par-${Date.now()}`,
    };
    setParents(prev => [...prev, newParent]);
    logAction('CRÉATION', 'Parents', `Ajout du parent ${newParent.firstName} ${newParent.lastName}`);
    return newParent;
  };

  const updateParent = (parent: Parent) => {
    setParents(prev => prev.map(p => (p.id === parent.id ? parent : p)));
    logAction('MODIFICATION', 'Parents', `Mise à jour du profil parent ${parent.firstName} ${parent.lastName}`);
  };

  const deleteParent = (id: string) => {
    setParents(prev => prev.filter(p => p.id !== id));
    logAction('SUPPRESSION', 'Parents', `Suppression d'un profil parent`);
  };

  const addEnrollment = (enrollmentData: Omit<Enrollment, 'id'>) => {
    const newEnr: Enrollment = {
      ...enrollmentData,
      id: `enr-${Date.now()}`,
    };
    setEnrollments(prev => [newEnr, ...prev]);
    logAction('CRÉATION', 'Inscriptions', `Enregistrement du dossier d'inscription N° ${newEnr.id}`);
  };

  const reEnrollStudent = (studentId: string, targetClassId: string, notes?: string, initialPayment?: number) => {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    // Update current student class
    const prevClassId = st.currentClassId;
    const prevClass = classes.find(c => c.id === prevClassId);
    const nextClass = classes.find(c => c.id === targetClassId);

    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, currentClassId: targetClassId, status: 'Actif' } : s));

    const newEnr: Enrollment = {
      id: `enr-${Date.now()}`,
      studentId,
      classId: targetClassId,
      academicYearId: currentAcademicYear.id,
      type: 'Réinscription',
      date: new Date().toISOString().split('T')[0],
      previousClass: prevClass?.name || 'Classe précédente',
      decisionCouncil: 'Admis',
      documentsSubmitted: ['Fiche de réinscription signée', 'Dernier bulletin'],
      status: 'Validé',
      feesPaidInitial: initialPayment || 0,
      notes,
    };
    setEnrollments(prev => [newEnr, ...prev]);

    if (initialPayment && initialPayment > 0) {
      const yearPrefix = currentAcademicYear.label.split('-')[0] || '2025';
      const receiptNumber = `REC-${yearPrefix}-${String(payments.length + 1).padStart(4, '0')}`;
      const fee = feeStructures.find(f => f.category === 'Inscription') || feeStructures[0];
      const pmt: Payment = {
        id: `pay-${Date.now()}`,
        receiptNumber,
        studentId,
        feeStructureId: fee ? fee.id : 'fee-gen',
        amount: initialPayment,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Espèces',
        reference: `REINSCR-${st.matricule}`,
        recordedBy: currentUser.fullName,
        notes: 'Acompte versé lors de la réinscription',
        academicYearId: currentAcademicYear.id,
      };
      setPayments(prev => [pmt, ...prev]);
    }

    logAction('CRÉATION', 'Réinscriptions', `Réinscription de ${st.firstName} ${st.lastName} de ${prevClass?.name} vers ${nextClass?.name}`);
  };

  // Classes & Structure
  const addClass = (clsData: Omit<ClassRoom, 'id' | 'code'>) => {
    const id = `cls-${Date.now()}`;
    const code = clsData.name.replace(/\s+/g, '').toUpperCase();
    const newClass: ClassRoom = { ...clsData, id, code };
    setClasses(prev => [...prev, newClass]);
    logAction('CRÉATION', 'Classes', `Création de la classe ${newClass.name}`);
  };

  const updateClass = (cls: ClassRoom) => {
    setClasses(prev => prev.map(c => (c.id === cls.id ? cls : c)));
    logAction('MODIFICATION', 'Classes', `Modification de la classe ${cls.name}`);
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    logAction('SUPPRESSION', 'Classes', `Suppression de la classe ${cls?.name}`);
  };

  const addEducationLevel = (lvlData: Omit<EducationLevel, 'id' | 'code'>) => {
    const id = `lvl-${Date.now()}`;
    const code = lvlData.name.substring(0, 4).toUpperCase();
    const newLvl: EducationLevel = { ...lvlData, id, code };
    setEducationLevels(prev => [...prev, newLvl]);
    logAction('CRÉATION', 'Niveaux', `Ajout du niveau ${newLvl.name}`);
  };

  const updateEducationLevel = (lvl: EducationLevel) => {
    setEducationLevels(prev => prev.map(l => (l.id === lvl.id ? lvl : l)));
    logAction('MODIFICATION', 'Niveaux', `Mise à jour du niveau ${lvl.name}`);
  };

  const addSection = (secData: Omit<SectionOption, 'id' | 'code'>) => {
    const id = `sec-${Date.now()}`;
    const code = secData.name.substring(0, 3).toUpperCase();
    const newSec: SectionOption = { ...secData, id, code };
    setSections(prev => [...prev, newSec]);
    logAction('CRÉATION', 'Sections', `Création de la filière/section ${newSec.name}`);
  };

  const updateSection = (sec: SectionOption) => {
    setSections(prev => prev.map(s => (s.id === sec.id ? sec : s)));
    logAction('MODIFICATION', 'Sections', `Modification de la filière ${sec.name}`);
  };

  const addSubject = (sbjData: Omit<Subject, 'id' | 'code'>) => {
    const id = `sbj-${Date.now()}`;
    const code = sbjData.name.substring(0, 4).toUpperCase();
    const newSbj: Subject = { ...sbjData, id, code };
    setSubjects(prev => [...prev, newSbj]);
    logAction('CRÉATION', 'Matières', `Ajout de la matière ${newSbj.name}`);
  };

  const updateSubject = (sbj: Subject) => {
    setSubjects(prev => prev.map(s => (s.id === sbj.id ? sbj : s)));
    logAction('MODIFICATION', 'Matières', `Mise à jour de la matière ${sbj.name}`);
  };

  // Staff & Teachers
  const addTeacher = (data: Omit<Teacher, 'id' | 'matricule'>) => {
    const count = teachers.length + 1;
    const matricule = `ENS-${String(count).padStart(3, '0')}`;
    const newT: Teacher = { ...data, id: `tch-${Date.now()}`, matricule };
    setTeachers(prev => [...prev, newT]);
    logAction('CRÉATION', 'Enseignants', `Recrutement/Ajout de l'enseignant ${newT.firstName} ${newT.lastName} (${matricule})`);
  };

  const updateTeacher = (teacher: Teacher) => {
    setTeachers(prev => prev.map(t => (t.id === teacher.id ? teacher : t)));
    logAction('MODIFICATION', 'Enseignants', `Modification de la fiche de ${teacher.firstName} ${teacher.lastName}`);
  };

  const deleteTeacher = (id: string) => {
    const t = teachers.find(tch => tch.id === id);
    setTeachers(prev => prev.filter(tch => tch.id !== id));
    logAction('SUPPRESSION', 'Enseignants', `Suppression de l'enseignant ${t?.firstName} ${t?.lastName}`);
  };

  const addStaff = (data: Omit<Staff, 'id' | 'matricule'>) => {
    const count = staff.length + 1;
    const matricule = `ADM-${String(count).padStart(3, '0')}`;
    const newS: Staff = { ...data, id: `stf-${Date.now()}`, matricule };
    setStaff(prev => [...prev, newS]);
    logAction('CRÉATION', 'Personnel', `Ajout du membre administratif ${newS.firstName} ${newS.lastName} (${newS.role})`);
  };

  const updateStaff = (stf: Staff) => {
    setStaff(prev => prev.map(s => (s.id === stf.id ? stf : s)));
    logAction('MODIFICATION', 'Personnel', `Mise à jour de la fiche de ${stf.firstName} ${stf.lastName}`);
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    logAction('SUPPRESSION', 'Personnel', `Suppression d'un membre administratif`);
  };

  const addAssignment = (data: Omit<TeacherAssignment, 'id'>) => {
    const newAsg: TeacherAssignment = { ...data, id: `asg-${Date.now()}` };
    setTeacherAssignments(prev => [...prev, newAsg]);
    const t = teachers.find(tch => tch.id === data.teacherId);
    const c = classes.find(cls => cls.id === data.classId);
    const s = subjects.find(sbj => sbj.id === data.subjectId);
    logAction('CRÉATION', 'Affectations', `Affectation de ${t?.lastName} en ${c?.name} pour ${s?.name} (${data.weeklyHours}h/semaine)`);
  };

  const deleteAssignment = (id: string) => {
    setTeacherAssignments(prev => prev.filter(a => a.id !== id));
    logAction('SUPPRESSION', 'Affectations', `Suppression d'une affectation d'enseignement`);
  };

  // Timetable
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = { ...slotData, id: `tt-${Date.now()}` };
    setTimetable(prev => [...prev, newSlot]);
    logAction('CRÉATION', 'Emploi du Temps', `Ajout d'un créneau dans l'emploi du temps`);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable(prev => prev.filter(s => s.id !== id));
    logAction('SUPPRESSION', 'Emploi du Temps', `Suppression d'un créneau d'horaire`);
  };

  // Attendance
  const recordAttendance = (sessionData: Omit<AttendanceSession, 'id'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: `att-${Date.now()}`,
    };
    setAttendanceSessions(prev => [newSession, ...prev]);
    const cls = classes.find(c => c.id === sessionData.classId);
    logAction('CRÉATION', 'Présences', `Appel enregistré pour la classe ${cls?.name} le ${sessionData.date} (${sessionData.timeSlot})`);
  };

  // Evaluations & Grades
  const addEvaluation = (evalData: Omit<Evaluation, 'id'>): Evaluation => {
    const newEval: Evaluation = {
      ...evalData,
      id: `eval-${Date.now()}`,
    };
    setEvaluations(prev => [newEval, ...prev]);
    logAction('CRÉATION', 'Évaluations', `Création de l'évaluation "${newEval.title}" (Coeff: ${newEval.coefficient})`);
    return newEval;
  };

  const updateEvaluation = (evalData: Evaluation) => {
    setEvaluations(prev => prev.map(e => (e.id === evalData.id ? evalData : e)));
    logAction('MODIFICATION', 'Évaluations', `Mise à jour de l'évaluation "${evalData.title}"`);
  };

  const deleteEvaluation = (id: string) => {
    const ev = evaluations.find(e => e.id === id);
    setEvaluations(prev => prev.filter(e => e.id !== id));
    setGrades(prev => prev.filter(g => g.evaluationId !== id));
    logAction('SUPPRESSION', 'Évaluations', `Suppression de l'évaluation "${ev?.title}"`);
  };

  const saveGrades = (
    evaluationId: string,
    gradeEntries: Array<{ studentId: string; score: number; comment?: string }>
  ) => {
    setGrades(prev => {
      const remaining = prev.filter(g => g.evaluationId !== evaluationId);
      const newGrades: Grade[] = gradeEntries.map((entry, index) => ({
        id: `grd-${Date.now()}-${index}`,
        evaluationId,
        studentId: entry.studentId,
        score: entry.score,
        comment: entry.comment,
      }));
      return [...remaining, ...newGrades];
    });

    const ev = evaluations.find(e => e.id === evaluationId);
    logAction('MODIFICATION', 'Notes', `Enregistrement des notes pour "${ev?.title}" (${gradeEntries.length} élèves notés)`);
  };

  // Fees & Payments
  const addFeeStructure = (feeData: Omit<FeeStructure, 'id' | 'code'>) => {
    const id = `fee-${Date.now()}`;
    const code = feeData.name.replace(/\s+/g, '-').toUpperCase().slice(0, 8);
    const newFee: FeeStructure = { ...feeData, id, code };
    setFeeStructures(prev => [...prev, newFee]);
    logAction('CRÉATION', 'Frais Scolaires', `Ajout de la ligne tarifaire "${newFee.name}" (${newFee.amount} ${establishment.currency})`);
  };

  const updateFeeStructure = (fee: FeeStructure) => {
    setFeeStructures(prev => prev.map(f => (f.id === fee.id ? fee : f)));
    logAction('MODIFICATION', 'Frais Scolaires', `Mise à jour du tarif "${fee.name}"`);
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures(prev => prev.filter(f => f.id !== id));
    logAction('SUPPRESSION', 'Frais Scolaires', `Suppression d'une ligne de frais`);
  };

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber'>): Payment => {
    const yearPrefix = currentAcademicYear.label.split('-')[0] || '2025';
    const receiptNumber = `REC-${yearPrefix}-${String(payments.length + 1).padStart(4, '0')}`;
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber,
    };
    setPayments(prev => [newPayment, ...prev]);

    const st = students.find(s => s.id === paymentData.studentId);
    logAction('CRÉATION', 'Paiements', `Enregistrement du reçu ${receiptNumber} (${paymentData.amount.toLocaleString()} ${establishment.currency}) pour ${st?.firstName} ${st?.lastName}`);
    return newPayment;
  };

  // Users & Permissions
  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = { ...userData, id: `usr-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    logAction('CRÉATION', 'Utilisateurs', `Création du compte utilisateur "${newUser.username}" (${newUser.role})`);
  };

  const updateUser = (user: UserAccount) => {
    setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
    logAction('MODIFICATION', 'Utilisateurs', `Modification de l'utilisateur "${user.username}"`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    logAction('SUPPRESSION', 'Utilisateurs', `Suppression d'un compte utilisateur`);
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logAction('CONNEXION', 'Authentification', `Changement de session vers l'utilisateur "${user.username}" (${user.role})`);
    }
  };

  // Backup & Restore
  const exportBackup = () => {
    const fullState = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'EduMaster Pro ERP',
      data: {
        establishment,
        academicYears,
        educationLevels,
        sections,
        classes,
        subjects,
        teachers,
        staff,
        teacherAssignments,
        timetable,
        students,
        parents,
        enrollments,
        evaluations,
        grades,
        attendanceSessions,
        feeStructures,
        payments,
        users,
        auditLogs,
      },
    };

    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edumaster_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    logAction('EXPORT', 'Sauvegarde', `Exportation complète de la base de données`);
  };

  const restoreBackup = (jsonContent: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.data || !parsed.data.establishment || !parsed.data.students) {
        return { success: false, message: 'Format de fichier de sauvegarde invalide.' };
      }

      const d = parsed.data;
      setEstablishment(d.establishment);
      if (d.academicYears) setAcademicYears(d.academicYears);
      if (d.educationLevels) setEducationLevels(d.educationLevels);
      if (d.sections) setSections(d.sections);
      if (d.classes) setClasses(d.classes);
      if (d.subjects) setSubjects(d.subjects);
      if (d.teachers) setTeachers(d.teachers);
      if (d.staff) setStaff(d.staff);
      if (d.teacherAssignments) setTeacherAssignments(d.teacherAssignments);
      if (d.timetable) setTimetable(d.timetable);
      if (d.students) setStudents(d.students);
      if (d.parents) setParents(d.parents);
      if (d.enrollments) setEnrollments(d.enrollments);
      if (d.evaluations) setEvaluations(d.evaluations);
      if (d.grades) setGrades(d.grades);
      if (d.attendanceSessions) setAttendanceSessions(d.attendanceSessions);
      if (d.feeStructures) setFeeStructures(d.feeStructures);
      if (d.payments) setPayments(d.payments);
      if (d.users) setUsers(d.users);
      if (d.auditLogs) setAuditLogs(d.auditLogs);

      logAction('RESTAURATION', 'Sauvegarde', `Restauration complète de la base de données effectuée avec succès`);
      return { success: true, message: 'Base de données restaurée avec succès !' };
    } catch (err) {
      return { success: false, message: `Erreur d'analyse du fichier : ${(err as Error).message}` };
    }
  };

  const resetToDemoData = () => {
    setEstablishment(initialEstablishment);
    setAcademicYears(initialAcademicYears);
    setEducationLevels(initialEducationLevels);
    setSections(initialSections);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setTeachers(initialTeachers);
    setStaff(initialStaff);
    setTeacherAssignments(initialTeacherAssignments);
    setTimetable(initialTimetable);
    setStudents(initialStudents);
    setParents(initialParents);
    setEnrollments(initialEnrollments);
    setEvaluations(initialEvaluations);
    setGrades(initialGrades);
    setAttendanceSessions(initialAttendanceSessions);
    setFeeStructures(initialFeeStructures);
    setPayments(initialPayments);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setAuditLogs(initialAuditLogs);

    logAction('RESTAURATION', 'Système', `Réinitialisation intégrale aux données de démonstration officielles`);
  };

  // Calculation: Fee Summary per student
  const getStudentFeeSummary = (studentId: string): StudentFeeSummary => {
    const student = students.find(s => s.id === studentId);
    const studentClass = classes.find(c => c.id === student?.currentClassId);

    // Applicable fees: general or matching student's level or specific class
    const applicable = feeStructures.filter(f => {
      if (f.academicYearId !== currentAcademicYear.id) return false;
      if (f.classId && f.classId === student?.currentClassId) return true;
      if (f.levelId && f.levelId === studentClass?.levelId) return true;
      if (!f.levelId && !f.classId) return true;
      return false;
    });

    const totalDue = applicable.reduce((acc, f) => acc + f.amount, 0);

    const studentPayments = payments.filter(
      p => p.studentId === studentId && p.academicYearId === currentAcademicYear.id
    );
    const totalPaid = studentPayments.reduce((acc, p) => acc + p.amount, 0);
    const balanceDue = Math.max(0, totalDue - totalPaid);

    return {
      totalDue,
      totalPaid,
      balanceDue,
      isFullyPaid: balanceDue === 0 && totalDue > 0,
      hasOverdue: balanceDue > 0,
      payments: studentPayments,
      applicableFees: applicable,
    };
  };

  // Calculation: Official Report Card & Grades
  const getStudentReportCard = (studentId: string, termId: string): StudentTermReport | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const classRoom = classes.find(c => c.id === student.currentClassId);
    if (!classRoom) return null;

    // All evaluations for this class and this term
    const classEvals = evaluations.filter(
      e => e.classId === classRoom.id && e.termId === termId
    );

    // Group evaluations by subject
    const subjectReports = subjects.map(subject => {
      // Find assignment to get teacher name
      const assignment = teacherAssignments.find(
        a => a.classId === classRoom.id && a.subjectId === subject.id
      );
      const teacher = teachers.find(t => t.id === assignment?.teacherId);

      // Coefficient
      const coeff = subject.coefficientByLevel[classRoom.levelId] ?? subject.defaultCoefficient;

      // Evals for this subject
      const subjectEvals = classEvals.filter(e => e.subjectId === subject.id);
      const studentGrades = grades.filter(
        g => g.studentId === studentId && subjectEvals.some(e => e.id === g.evaluationId)
      );

      let subjectAvg = 0;
      if (subjectEvals.length > 0 && studentGrades.length > 0) {
        let totalWeighted = 0;
        let totalWeights = 0;
        studentGrades.forEach(g => {
          const ev = subjectEvals.find(e => e.id === g.evaluationId);
          if (ev) {
            const weight = ev.coefficient;
            const normalizedScore = (g.score / ev.maxScore) * 20;
            totalWeighted += normalizedScore * weight;
            totalWeights += weight;
          }
        });
        subjectAvg = totalWeights > 0 ? Number((totalWeighted / totalWeights).toFixed(2)) : 0;
      }

      // Teacher appreciation
      let appreciation = 'Non évalué';
      if (studentGrades.length > 0) {
        if (subjectAvg >= 16) appreciation = 'Excellent trimestre. Travail remarquable.';
        else if (subjectAvg >= 14) appreciation = 'Très bon travail. Régulier et participatif.';
        else if (subjectAvg >= 12) appreciation = 'Bon travail d\'ensemble. Continuez ainsi.';
        else if (subjectAvg >= 10) appreciation = 'Résultats passables. Des efforts à fournir.';
        else if (subjectAvg >= 8) appreciation = 'Insuffisant. Il faut intensifier le travail personnel.';
        else appreciation = 'Très insuffisant. Réaction urgente attendue.';
      }

      return {
        subject,
        coefficient: coeff,
        average: subjectAvg,
        points: Number((subjectAvg * coeff).toFixed(2)),
        grades: studentGrades,
        rankInSubject: 1, // calculated if needed
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : undefined,
        appreciation,
      };
    }).filter(sr => sr.coefficient > 0);

    // Total points & coefficients
    const totalPoints = subjectReports.reduce((acc, sr) => acc + sr.points, 0);
    const totalCoefficients = subjectReports.reduce((acc, sr) => acc + sr.coefficient, 0);
    const termAverage = totalCoefficients > 0 ? Number((totalPoints / totalCoefficients).toFixed(2)) : 0;

    // Calculate class rankings for this class & term
    const rankings = getClassRankings(classRoom.id, termId);
    const studentRankEntry = rankings.find(r => r.student.id === studentId);
    const rank = studentRankEntry ? studentRankEntry.rank : 1;

    const allAverages = rankings.map(r => r.average).filter(avg => avg > 0);
    const classAverage = allAverages.length > 0
      ? Number((allAverages.reduce((a, b) => a + b, 0) / allAverages.length).toFixed(2))
      : 0;
    const classMin = allAverages.length > 0 ? Math.min(...allAverages) : 0;
    const classMax = allAverages.length > 0 ? Math.max(...allAverages) : 0;

    // Attendance stats
    const classSessions = attendanceSessions.filter(
      s => s.classId === classRoom.id && s.academicYearId === currentAcademicYear.id
    );
    let totalAbsences = 0;
    let unjustifiedAbsences = 0;
    let lates = 0;

    classSessions.forEach(session => {
      const entry = session.entries.find(e => e.studentId === studentId);
      if (entry) {
        if (entry.status === 'Absent') {
          totalAbsences += 2; // assume 2 hours per session
          if (!entry.justified) unjustifiedAbsences += 2;
        } else if (entry.status === 'Retard') {
          lates += 1;
        }
      }
    });

    // Mention
    let mention = 'Passable';
    let councilDecision = 'Passe en classe supérieure';
    if (termAverage >= 16) {
      mention = 'Très Bien (Félicitations du Conseil)';
      councilDecision = 'Tableau d\'Honneur avec Félicitations';
    } else if (termAverage >= 14) {
      mention = 'Bien (Encouragements)';
      councilDecision = 'Tableau d\'Honneur avec Encouragements';
    } else if (termAverage >= 12) {
      mention = 'Assez Bien';
      councilDecision = 'Tableau d\'Honneur';
    } else if (termAverage >= 10) {
      mention = 'Passable';
      councilDecision = 'Peut mieux faire';
    } else if (termAverage >= 8) {
      mention = 'Insuffisant (Avertissement)';
      councilDecision = 'Avertissement travail';
    } else {
      mention = 'Médiocre (Blâme)';
      councilDecision = 'Blâme & Convocation des parents';
    }

    return {
      student,
      classRoom,
      termAverage,
      rank,
      totalPoints: Number(totalPoints.toFixed(2)),
      totalCoefficients,
      classSize: rankings.length,
      classAverage,
      classMin,
      classMax,
      subjectReports,
      attendance: {
        totalAbsences,
        unjustifiedAbsences,
        lates,
      },
      mention,
      councilDecision,
    };
  };

  // Helper: Rankings of all students in a class
  const getClassRankings = (classId: string, termId: string): Array<{ student: Student; average: number; rank: number }> => {
    const classStudents = students.filter(s => s.currentClassId === classId && s.status === 'Actif');
    const classRoom = classes.find(c => c.id === classId);
    if (!classRoom) return [];

    const classEvals = evaluations.filter(e => e.classId === classId && e.termId === termId);

    const studentAverages = classStudents.map(student => {
      let totalPts = 0;
      let totalCoeffs = 0;

      subjects.forEach(subject => {
        const coeff = subject.coefficientByLevel[classRoom.levelId] ?? subject.defaultCoefficient;
        if (coeff <= 0) return;

        const subjectEvals = classEvals.filter(e => e.subjectId === subject.id);
        const studentGrades = grades.filter(
          g => g.studentId === student.id && subjectEvals.some(e => e.id === g.evaluationId)
        );

        if (subjectEvals.length > 0 && studentGrades.length > 0) {
          let sWeighted = 0;
          let sWeights = 0;
          studentGrades.forEach(g => {
            const ev = subjectEvals.find(e => e.id === g.evaluationId);
            if (ev) {
              const weight = ev.coefficient;
              sWeighted += (g.score / ev.maxScore) * 20 * weight;
              sWeights += weight;
            }
          });
          const subjAvg = sWeights > 0 ? sWeighted / sWeights : 0;
          totalPts += subjAvg * coeff;
          totalCoeffs += coeff;
        }
      });

      const avg = totalCoeffs > 0 ? Number((totalPts / totalCoeffs).toFixed(2)) : 0;
      return { student, average: avg };
    });

    // Sort descending by average
    studentAverages.sort((a, b) => b.average - a.average);

    return studentAverages.map((item, idx) => ({
      student: item.student,
      average: item.average,
      rank: idx + 1,
    }));
  };

  return (
    <SchoolContext.Provider
      value={{
        establishment,
        academicYears,
        currentAcademicYear,
        educationLevels,
        sections,
        classes,
        subjects,
        teachers,
        staff,
        teacherAssignments,
        timetable,
        students,
        parents,
        enrollments,
        evaluations,
        grades,
        attendanceSessions,
        feeStructures,
        payments,
        users,
        currentUser,
        auditLogs,

        updateEstablishment,
        addAcademicYear,
        setCurrentAcademicYear,

        addStudent,
        updateStudent,
        deleteStudent,
        addParent,
        updateParent,
        deleteParent,
        addEnrollment,
        reEnrollStudent,

        addClass,
        updateClass,
        deleteClass,
        addEducationLevel,
        updateEducationLevel,
        addSection,
        updateSection,
        addSubject,
        updateSubject,

        addTeacher,
        updateTeacher,
        deleteTeacher,
        addStaff,
        updateStaff,
        deleteStaff,
        addAssignment,
        deleteAssignment,

        addTimetableSlot,
        deleteTimetableSlot,

        recordAttendance,

        addEvaluation,
        updateEvaluation,
        deleteEvaluation,
        saveGrades,

        addFeeStructure,
        updateFeeStructure,
        deleteFeeStructure,
        recordPayment,

        addUser,
        updateUser,
        deleteUser,
        switchUser,

        logAction,

        exportBackup,
        restoreBackup,
        resetToDemoData,

        getStudentFeeSummary,
        getStudentReportCard,
        getClassRankings,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
