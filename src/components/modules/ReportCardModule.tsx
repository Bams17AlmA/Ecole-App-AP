import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, Download, Award, GraduationCap, ChevronRight, User, ShieldCheck } from 'lucide-react';

export const ReportCardModule: React.FC = () => {
  const {
    classes,
    students,
    establishment,
    currentAcademicYear,
    getStudentReportCard,
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedTermId, setSelectedTermId] = useState<string>(
    currentAcademicYear.terms[0]?.id || 'term-t1'
  );

  const classStudents = students.filter(
    s => s.currentClassId === selectedClassId && s.status === 'Actif'
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    classStudents[0]?.id || ''
  );

  React.useEffect(() => {
    if (classStudents.length > 0 && !classStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(classStudents[0].id);
    }
  }, [selectedClassId, classStudents.length]);

  const report = selectedStudentId ? getStudentReportCard(selectedStudentId, selectedTermId) : null;
  const currentTerm = currentAcademicYear.terms.find(t => t.id === selectedTermId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Générateur de Bulletins Scolaires Officiels
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Génération automatique des relevés officiels trimestriels, calcul des mentions et mise en page imprimable / PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer / Exporter en PDF
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
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
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
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
            Élève à éditer
          </label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-blue-600"
          >
            {classStudents.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.matricule})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Printable Report Card View */}
      {report ? (
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print-area">
          {/* Header République & Établissement */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Ministry / State */}
              <div className="text-center text-[10px] font-semibold text-slate-700 uppercase tracking-wider max-w-[200px]">
                <p className="font-extrabold text-[11px] text-slate-900">RÉPUBLIQUE DÉMOCRATIQUE</p>
                <p>MINISTÈRE DE L'ÉDUCATION NATIONALE</p>
                <p className="italic text-[9px] mt-0.5 font-normal">Paix - Justice - Travail</p>
              </div>

              {/* Center: School Name & Logo */}
              <div className="text-center flex-1">
                <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                  {establishment.name}
                </h1>
                <p className="text-xs font-bold text-blue-800 italic mt-0.5">
                  « {establishment.motto} »
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {establishment.address} • Tél : {establishment.phone}
                </p>
              </div>

              {/* Right: Year & Term */}
              <div className="text-right text-xs">
                <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  BULLETIN SCOLAIRE
                </span>
                <p className="font-bold text-slate-800 mt-1.5 text-[11px]">
                  Année : {currentAcademicYear.label}
                </p>
                <p className="font-extrabold text-blue-900 text-[11px]">
                  {currentTerm?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Nom & Prénom(s)</span>
              <strong className="text-slate-900 font-extrabold text-sm">
                {report.student.lastName} {report.student.firstName}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Matricule & Sexe</span>
              <span className="font-mono font-bold text-slate-800">{report.student.matricule}</span>
              <span className="text-slate-500 ml-1">({report.student.gender})</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Classe & Effectif</span>
              <strong className="text-blue-900 font-bold">{report.classRoom.name}</strong>
              <span className="text-slate-500 ml-1">({report.classSize} élèves)</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Né(e) le / à</span>
              <span className="text-slate-800">{report.student.birthDate}</span>
              <span className="text-slate-500 block text-[10px] truncate">{report.student.birthPlace}</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-extrabold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Matières Enseignées</th>
                  <th className="py-2.5 px-2 text-center w-14">Coeff</th>
                  <th className="py-2.5 px-2 text-center w-20">Moy. /20</th>
                  <th className="py-2.5 px-2 text-center w-20">Total Pts</th>
                  <th className="py-2.5 px-3">Professeur & Appréciations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {report.subjectReports.map(sr => (
                  <tr key={sr.subject.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {sr.subject.name}
                      <span className="text-[10px] text-slate-400 font-normal ml-1.5">
                        ({sr.subject.code})
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                      {sr.coefficient}
                    </td>
                    <td className="py-2.5 px-2 text-center font-black text-xs text-blue-900">
                      {sr.average}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                      {sr.points}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {sr.teacherName || 'Professeur'} :
                      </span>{' '}
                      <span className="italic">{sr.appreciation}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Footer Totals */}
              <tfoot className="bg-slate-100/80 font-black border-t-2 border-slate-400 text-xs">
                <tr>
                  <td className="py-2 px-3 uppercase">Total Général</td>
                  <td className="py-2 px-2 text-center">{report.totalCoefficients}</td>
                  <td className="py-2 px-2 text-center text-blue-900">-</td>
                  <td className="py-2 px-2 text-center text-slate-950 font-black">{report.totalPoints}</td>
                  <td className="py-2 px-3 text-[11px] text-slate-600 font-semibold">
                    Moyenne de la classe : {report.classAverage} / 20 (Min: {report.classMin} • Max: {report.classMax})
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Results Summary & Discipline Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
            {/* Moyenne & Rang */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">
                Moyenne du Trimestre
              </span>
              <span className="text-3xl font-black text-blue-950 block my-1">
                {report.termAverage} <span className="text-base font-bold text-blue-700">/ 20</span>
              </span>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900 text-white font-extrabold text-xs">
                Rang : {report.rank === 1 ? '1er' : `${report.rank}ème`} sur {report.classSize}
              </div>
            </div>

            {/* Mention & Distinctions */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Mention & Tableau d'Honneur
              </span>
              <strong className="text-base font-black text-amber-950 block mt-2">
                {report.mention}
              </strong>
              <p className="text-xs text-amber-800 italic mt-1">
                {report.councilDecision}
              </p>
            </div>

            {/* Assiduité / Discipline */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Discipline & Assiduité
              </span>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Absences totales :</span>
                  <strong>{report.attendance.totalAbsences} heures</strong>
                </div>
                <div className="flex justify-between">
                  <span>Absences non-justifiées :</span>
                  <strong className="text-red-600">{report.attendance.unjustifiedAbsences} h</strong>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de retards :</span>
                  <strong>{report.attendance.lates} retard(s)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Stamps */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t-2 border-slate-900 text-center text-xs">
            <div>
              <p className="font-bold uppercase text-[10px] text-slate-600">Visa des Parents</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">Signature</span>
              </div>
            </div>

            <div>
              <p className="font-bold uppercase text-[10px] text-slate-600">Le Professeur Principal</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[10px] text-slate-400 italic">Signature & Date</span>
              </div>
            </div>

            <div className="relative">
              <p className="font-bold uppercase text-[10px] text-slate-600">
                Le Chef d'Établissement
              </p>
              <div className="h-16 flex flex-col items-center justify-end">
                <span className="font-bold text-slate-900 text-[11px]">
                  {establishment.directorName}
                </span>
                <span className="text-[9px] text-slate-500">{establishment.directorTitle}</span>
              </div>
              {/* Seal Stamp */}
              <div className="absolute right-0 top-3 w-16 h-16 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center text-[7px] font-black uppercase text-center rotate-12 opacity-80 pointer-events-none p-1 leading-tight">
                {establishment.shortName}<br />SCEAU OFFICIEL
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
          <p className="font-bold text-sm">Veuillez sélectionner une classe et un élève pour afficher le bulletin.</p>
        </div>
      )}
    </div>
  );
};
