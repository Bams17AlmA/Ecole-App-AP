import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import {
  FileText,
  Printer,
  Award,
  IdCard,
  FileCheck,
  CheckCircle,
  QrCode,
  Users,
  Download,
} from 'lucide-react';

export const DocumentsModule: React.FC = () => {
  const {
    students,
    classes,
    establishment,
    currentAcademicYear,
    evaluations,
    payments,
    teachers,
  } = useSchool();

  const [documentType, setDocumentType] = useState<
    'certificate' | 'studentCard' | 'classRoll' | 'statsReport'
  >('certificate');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');

  const student = students.find(s => s.id === selectedStudentId);
  const studentClass = classes.find(c => c.id === student?.currentClassId);
  const targetClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.currentClassId === selectedClassId && s.status === 'Actif');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Édition des Documents PDF & Statistiques Officielles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Certificats de scolarité, cartes scolaires plastifiées, fiches d'émargement et rapports statistiques.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Imprimer le Document / PDF
        </button>
      </div>

      {/* Document Type Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 print:hidden">
        <button
          onClick={() => setDocumentType('certificate')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            documentType === 'certificate'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-5 h-5 text-blue-600 mb-1.5" />
          <h4 className="font-extrabold text-xs">Certificat de Scolarité</h4>
          <p className="text-[10px] text-slate-500">Document légal officiel avec QR code</p>
        </button>

        <button
          onClick={() => setDocumentType('studentCard')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            documentType === 'studentCard'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
          }`}
        >
          <IdCard className="w-5 h-5 text-indigo-600 mb-1.5" />
          <h4 className="font-extrabold text-xs">Carte d'Identité Scolaire</h4>
          <p className="text-[10px] text-slate-500">Format badge avec photo et QR</p>
        </button>

        <button
          onClick={() => setDocumentType('classRoll')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            documentType === 'classRoll'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5 text-emerald-600 mb-1.5" />
          <h4 className="font-extrabold text-xs">Feuille d'Émargement</h4>
          <p className="text-[10px] text-slate-500">Liste officielle de classe pour examens</p>
        </button>

        <button
          onClick={() => setDocumentType('statsReport')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            documentType === 'statsReport'
              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-xs'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-5 h-5 text-purple-600 mb-1.5" />
          <h4 className="font-extrabold text-xs">Bilan Statistique Global</h4>
          <p className="text-[10px] text-slate-500">Rapport démographique et financier</p>
        </button>
      </div>

      {/* Selectors */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4 print:hidden">
        {(documentType === 'certificate' || documentType === 'studentCard') && (
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sélectionner l'Élève :
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 outline-none"
            >
              {students.map(s => {
                const c = classes.find(cls => cls.id === s.currentClassId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({c?.name} - {s.matricule})
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {documentType === 'classRoll' && (
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sélectionner la Classe :
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
        )}
      </div>

      {/* DOCUMENT 1: Certificat de Scolarité Officiel */}
      {documentType === 'certificate' && student && (
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-10 max-w-3xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print-area">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center">
            <p className="font-extrabold text-xs uppercase tracking-widest text-slate-700">
              RÉPUBLIQUE • MINISTÈRE DE L'ÉDUCATION NATIONALE
            </p>
            <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight mt-1">
              {establishment.name}
            </h1>
            <p className="text-xs font-semibold text-blue-800 italic">« {establishment.motto} »</p>
            <p className="text-[10px] text-slate-500 mt-1">
              {establishment.address} • Contact : {establishment.phone} • Email : {establishment.email}
            </p>
          </div>

          <div className="text-center my-8">
            <span className="inline-block border-2 border-slate-900 px-6 py-2 rounded-xl text-base font-black uppercase tracking-wider bg-slate-50">
              CERTIFICAT DE SCOLARITÉ
            </span>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Réf : CERT-{currentAcademicYear.label.slice(0, 4)}-{student.matricule.slice(-3)}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="text-sm leading-relaxed text-slate-800 space-y-4 px-4">
            <p>
              Le Chef d'Établissement soussigné, <strong>{establishment.directorName}</strong>, {establishment.directorTitle} de l'établissement <strong>{establishment.name}</strong>, certifie par la présente que :
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p>L'élève : <strong className="text-sm uppercase text-slate-900">{student.lastName} {student.firstName}</strong></p>
              <p>Sexe : <strong>{student.gender === 'M' ? 'Masculin' : 'Féminin'}</strong> • Nationalité : <strong>{student.nationality}</strong></p>
              <p>Né(e) le : <strong>{student.birthDate}</strong> à <strong>{student.birthPlace}</strong></p>
              <p>Numéro Matricule : <strong className="font-mono text-blue-800">{student.matricule}</strong></p>
            </div>

            <p>
              Est régulièrement inscrit(e) et poursuit assidûment ses études au sein de notre établissement pour l'année scolaire <strong>{currentAcademicYear.label}</strong>, en classe de :
            </p>

            <div className="text-center my-4">
              <span className="text-lg font-black text-blue-900 bg-blue-50 px-6 py-2 rounded-lg border border-blue-200 inline-block uppercase">
                {studentClass?.name || 'Classe Régulière'}
              </span>
            </div>

            <p className="text-xs text-slate-600 italic">
              En foi de quoi, le présent certificat lui est délivré pour servir et valoir ce que de droit auprès de toutes administrations ou organismes compétents.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between px-4">
            {/* QR verification */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-slate-300 p-1.5 flex items-center justify-center bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500">
                <span className="font-bold text-slate-800 block">Vérification QR</span>
                <span>Authenticité certifiée</span>
              </div>
            </div>

            {/* Signature & Director Stamp */}
            <div className="text-right relative">
              <p className="text-xs text-slate-600">
                Fait à {establishment.city}, le {new Date().toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">Le Chef d'Établissement</p>
              <div className="h-16 flex flex-col justify-end">
                <span className="font-black text-xs text-slate-900">{establishment.directorName}</span>
                <span className="text-[10px] text-slate-500">{establishment.directorTitle}</span>
              </div>

              {/* Official Seal Stamp */}
              <div className="absolute -left-12 top-4 w-20 h-20 rounded-full border-2 border-blue-700 text-blue-800 flex items-center justify-center text-[7px] font-black uppercase text-center rotate-12 opacity-80 pointer-events-none p-1 leading-tight">
                {establishment.shortName}<br />MINISTÈRE ÉDUCATION<br />SCEAU OFFICIEL
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT 2: Carte Scolaire Plastifiée */}
      {documentType === 'studentCard' && student && (
        <div className="max-w-md mx-auto print-area">
          <div className="rounded-3xl bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 text-white p-6 shadow-2xl border-2 border-white/20 relative overflow-hidden">
            {/* Top School Branding */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
                  CARTE D'IDENTITÉ SCOLAIRE
                </span>
                <h3 className="font-black text-sm leading-tight">{establishment.name}</h3>
                <p className="text-[10px] text-blue-200">Année {currentAcademicYear.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white text-blue-900 font-black flex items-center justify-center text-xs shadow-md">
                ED
              </div>
            </div>

            {/* Student ID content */}
            <div className="flex gap-4 mt-4 items-center">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.firstName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 text-white font-black text-2xl flex items-center justify-center border-2 border-white/30 shrink-0">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
              )}

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-blue-200 block">Nom & Prénom</span>
                  <strong className="text-sm font-extrabold uppercase block text-white">
                    {student.lastName}
                  </strong>
                  <span className="font-semibold text-blue-100">{student.firstName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-[8px] uppercase text-blue-300 block">Classe</span>
                    <strong className="text-amber-400 font-bold">{studentClass?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-blue-300 block">Groupe</span>
                    <strong className="text-white font-bold">{student.bloodGroup || 'O+'}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] uppercase text-blue-300 block">Matricule</span>
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    {student.matricule}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode & QR */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-blue-200">
              <div>
                <p>Né(e) le : {student.birthDate}</p>
                <p>Urgence : {student.emergencyContact.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT 3: Feuille d'Émargement / Liste Officielle */}
      {documentType === 'classRoll' && targetClass && (
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print-area">
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black uppercase text-slate-950">{establishment.name}</h2>
              <p className="text-xs text-slate-600 font-bold">
                Liste Officielle d'Émargement • Classe : {targetClass.name} (Salle {targetClass.roomNumber})
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900">Année : {currentAcademicYear.label}</span>
              <p className="text-slate-500 font-semibold">{classStudents.length} élèves inscrits</p>
            </div>
          </div>

          <table className="w-full text-left text-xs mt-4 border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">N°</th>
                <th className="py-2.5 px-3">Matricule</th>
                <th className="py-2.5 px-3">Nom & Prénom(s)</th>
                <th className="py-2.5 px-2 text-center w-14">Sexe</th>
                <th className="py-2.5 px-3">Date de Naissance</th>
                <th className="py-2.5 px-4 w-36 text-center">Signature / Émargement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStudents.map((st, idx) => (
                <tr key={st.id} className="h-10">
                  <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-700">{st.matricule}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{st.lastName} {st.firstName}</td>
                  <td className="py-2 px-2 text-center font-bold">{st.gender}</td>
                  <td className="py-2 px-3 text-slate-600">{st.birthDate}</td>
                  <td className="py-2 px-4 border-l border-slate-200"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DOCUMENT 4: Bilan Statistique Global */}
      {documentType === 'statsReport' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Bilan Statistique Pédagogique & Financier ({currentAcademicYear.label})
            </h3>
            <p className="text-xs text-slate-500">Rapport de synthèse pour la direction et l'inspection académique</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
              <span className="text-[10px] font-bold uppercase text-blue-600">Effectif Global</span>
              <p className="text-2xl font-black text-blue-950 dark:text-white mt-1">{students.length} élèves</p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                {students.filter(s => s.gender === 'F').length} filles ({Math.round((students.filter(s => s.gender === 'F').length / students.length) * 100)}%)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
              <span className="text-[10px] font-bold uppercase text-purple-600">Enseignants & Ratios</span>
              <p className="text-2xl font-black text-purple-950 dark:text-white mt-1">{teachers.length} profs</p>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">
                Ratio : {Math.round(students.length / (teachers.length || 1))} élèves / prof
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold uppercase text-emerald-600">Paiements Enregistrés</span>
              <p className="text-2xl font-black text-emerald-950 dark:text-white mt-1">{payments.length} reçus</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                Total : {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} {establishment.currency}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] font-bold uppercase text-amber-600">Évaluations Réalisées</span>
              <p className="text-2xl font-black text-amber-950 dark:text-white mt-1">{evaluations.length} devoirs</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                Sur {classes.length} classes actives
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
