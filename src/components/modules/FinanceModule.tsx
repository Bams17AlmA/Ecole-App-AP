import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeStructure, Payment, PaymentMethod } from '../../types';
import { Modal } from '../common/Modal';
import {
  Wallet,
  ReceiptText,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Printer,
  DollarSign,
  CreditCard,
  Building,
  Smartphone,
  Eye,
  Send,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const {
    feeStructures,
    payments,
    students,
    classes,
    establishment,
    currentAcademicYear,
    currentUser,
    addFeeStructure,
    recordPayment,
    getStudentFeeSummary,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'payments' | 'debtors' | 'fees'>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Modals state
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // New Payment Form State
  const [newPaymentStudentId, setNewPaymentStudentId] = useState(students[0]?.id || '');
  const [newPaymentFeeId, setNewPaymentFeeId] = useState(feeStructures[0]?.id || '');
  const [newPaymentAmount, setNewPaymentAmount] = useState(100000);
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('Espèces');
  const [newPaymentRef, setNewPaymentRef] = useState('');
  const [newPaymentNotes, setNewPaymentNotes] = useState('');

  // New Fee Structure Form
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeCategory, setNewFeeCategory] = useState<FeeStructure['category']>('Scolarité');
  const [newFeeAmount, setNewFeeAmount] = useState(500000);
  const [newFeeClassId, setNewFeeClassId] = useState('');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentStudentId || !newPaymentFeeId || newPaymentAmount <= 0) return;

    const recorded = recordPayment({
      studentId: newPaymentStudentId,
      feeStructureId: newPaymentFeeId,
      amount: Number(newPaymentAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: newPaymentMethod,
      reference: newPaymentRef || `REF-${Date.now().toString().slice(-4)}`,
      recordedBy: currentUser.fullName,
      notes: newPaymentNotes,
      academicYearId: currentAcademicYear.id,
    });

    setIsRecordPaymentModalOpen(false);
    setSelectedReceipt(recorded);
    setIsReceiptModalOpen(true);
  };

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeName.trim() || newFeeAmount <= 0) return;

    addFeeStructure({
      name: newFeeName.trim(),
      category: newFeeCategory,
      amount: Number(newFeeAmount),
      classId: newFeeClassId || undefined,
      isMandatory: true,
      dueDate: '2026-03-31',
      academicYearId: currentAcademicYear.id,
    });

    setIsFeeModalOpen(false);
    setNewFeeName('');
  };

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.matricule.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClassFilter === 'ALL' || student?.currentClassId === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  // Debtors List (Students with remaining balance due)
  const debtorsList = students
    .filter(s => s.status === 'Actif')
    .map(student => {
      const summary = getStudentFeeSummary(student.id);
      return {
        student,
        summary,
      };
    })
    .filter(item => item.summary.balanceDue > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            Finances Scolaires, Encaissements, Dettes & Reçus
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestion intégrée des frais scolaires, acomptes/tranches, suivi des impayés et émission de reçus légaux.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFeeModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Configurer un Frais
          </button>
          <button
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <ReceiptText className="w-4 h-4" />
            Encaisser un Paiement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Journal des Paiements ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('debtors')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'debtors'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          État des Dettes & Impayés ({debtorsList.length})
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'fees'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Grille Tarifaire ({feeStructures.length})
        </button>
      </div>

      {/* TAB 1: Payments Journal */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par reçu N°, nom de l'élève ou matricule..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
              />
            </div>

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
          </div>

          {/* Payments Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Reçu N°</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Élève & Matricule</th>
                    <th className="py-3 px-4">Type de Frais</th>
                    <th className="py-3 px-4">Montant Versé</th>
                    <th className="py-3 px-4">Mode / Réf</th>
                    <th className="py-3 px-4">Encaissé par</th>
                    <th className="py-3 px-4 text-right">Reçu Officiel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredPayments.map(payment => {
                    const student = students.find(s => s.id === payment.studentId);
                    const fee = feeStructures.find(f => f.id === payment.feeStructureId);

                    return (
                      <tr key={payment.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">
                          {payment.receiptNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {payment.paymentDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu'}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {student?.matricule}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {fee?.name || 'Frais de scolarité'}
                        </td>
                        <td className="py-3 px-4 font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {payment.amount.toLocaleString()} {establishment.currency}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 block w-max">
                            {payment.paymentMethod}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                            {payment.reference}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {payment.recordedBy}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedReceipt(payment);
                              setIsReceiptModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Voir Reçu
                          </button>
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

      {/* TAB 2: Debtors & Outstanding Balances */}
      {activeTab === 'debtors' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {debtorsList.length} Élève(s) avec solde débiteur / arriérés de paiement
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Envoyez des relances financières et enregistrez les tranches de paiement partiel.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Classe</th>
                  <th className="py-3 px-4">Total Exigible</th>
                  <th className="py-3 px-4">Déjà Réglé</th>
                  <th className="py-3 px-4">Reste à Payer (Dette)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {debtorsList.map(({ student, summary }) => {
                  const studentClass = classes.find(c => c.id === student.currentClassId);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {student.firstName} {student.lastName}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">
                          {student.matricule}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">
                        {studentClass?.name}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {summary.totalDue.toLocaleString()} {establishment.currency}
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">
                        {summary.totalPaid.toLocaleString()} {establishment.currency}
                      </td>
                      <td className="py-3 px-4 font-black text-sm text-red-600">
                        {summary.balanceDue.toLocaleString()} {establishment.currency}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              alert(`Fiche de relance générée pour les parents de ${student.firstName} ${student.lastName}. Solde dû : ${summary.balanceDue.toLocaleString()} ${establishment.currency}.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
                          >
                            Relancer
                          </button>
                          <button
                            onClick={() => {
                              setNewPaymentStudentId(student.id);
                              setNewPaymentAmount(Math.min(summary.balanceDue, 100000));
                              setIsRecordPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                          >
                            Encaisser Acompte
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
      )}

      {/* TAB 3: Fee Structures */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feeStructures.map(fee => (
            <div
              key={fee.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {fee.code}
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {fee.category}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {fee.name}
              </h4>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {fee.amount.toLocaleString()} <span className="text-xs text-slate-500 font-semibold">{establishment.currency}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Échéance limite : {fee.dueDate}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Record Payment */}
      <Modal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        title="Enregistrer un Paiement (Reçu de Caisse)"
        subtitle="Saisie d'un acompte ou d'un solde intégral"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Élève concerné *
            </label>
            <select
              value={newPaymentStudentId}
              onChange={e => setNewPaymentStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 outline-none"
            >
              {students.map(s => {
                const cls = classes.find(c => c.id === s.currentClassId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({cls?.name} - {s.matricule})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ligne de Frais *
              </label>
              <select
                value={newPaymentFeeId}
                onChange={e => setNewPaymentFeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                {feeStructures.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Montant versé ({establishment.currency}) *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={newPaymentAmount}
                onChange={e => setNewPaymentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mode de Paiement
              </label>
              <select
                value={newPaymentMethod}
                onChange={e => setNewPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Espèces">Espèces (Caisse)</option>
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Mobile Money">Mobile Money (Orange/Airtel/M-Pesa)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Référence / N° Chèque ou Transaction
              </label>
              <input
                type="text"
                placeholder="ex: VIR-BNP-0928"
                value={newPaymentRef}
                onChange={e => setNewPaymentRef(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Commentaires / Observations
            </label>
            <input
              type="text"
              placeholder="ex: Acompte 1ère tranche"
              value={newPaymentNotes}
              onChange={e => setNewPaymentNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordPaymentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
            >
              Encaisser & Émettre le Reçu
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Fee Structure */}
      <Modal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        title="Créer une Ligne Tarifaire"
        subtitle="Définissez les frais obligatoires ou optionnels"
      >
        <form onSubmit={handleCreateFee} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Libellé du frais *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Frais de Bibliothèque & Numérique"
              value={newFeeName}
              onChange={e => setNewFeeName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catégorie
              </label>
              <select
                value={newFeeCategory}
                onChange={e => setNewFeeCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Scolarité">Scolarité</option>
                <option value="Inscription">Inscription</option>
                <option value="Services">Services (Cantine, Bus...)</option>
                <option value="Examens">Examens</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Montant ({establishment.currency}) *
              </label>
              <input
                type="number"
                min="1000"
                step="5000"
                required
                value={newFeeAmount}
                onChange={e => setNewFeeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFeeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Enregistrer le Tarif
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Official Payment Receipt (Imprimable) */}
      {selectedReceipt && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title={`Reçu Officiel de Caisse N° ${selectedReceipt.receiptNumber}`}
          printable
          maxWidth="lg"
        >
          {(() => {
            const student = students.find(s => s.id === selectedReceipt.studentId);
            const studentClass = classes.find(c => c.id === student?.currentClassId);
            const fee = feeStructures.find(f => f.id === selectedReceipt.feeStructureId);
            const summary = student ? getStudentFeeSummary(student.id) : null;

            return (
              <div className="space-y-6 text-slate-900 text-xs">
                {/* Receipt Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center">
                  <h3 className="font-black text-base uppercase text-slate-950">
                    {establishment.name}
                  </h3>
                  <p className="text-[10px] text-slate-600">
                    {establishment.address} • Tél : {establishment.phone}
                  </p>
                  <div className="mt-2 inline-block px-3 py-1 rounded bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider">
                    QUITTANCE DE PAIEMENT N° {selectedReceipt.receiptNumber}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Reçu de :</span>
                    <strong className="text-slate-900 text-sm block">
                      {student?.firstName} {student?.lastName}
                    </strong>
                    <span className="font-mono text-[11px] text-slate-500">Matricule : {student?.matricule}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Classe & Année :</span>
                    <strong className="text-slate-900 block">{studentClass?.name}</strong>
                    <span className="text-slate-500">Année Scolaire {currentAcademicYear.label}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Date du versement :</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.paymentDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Mode de règlement :</span>
                    <span className="font-semibold text-slate-800">
                      {selectedReceipt.paymentMethod} (Réf : {selectedReceipt.reference})
                    </span>
                  </div>
                </div>

                {/* Amount Box */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Motif : {fee?.name || 'Scolarité'}
                  </span>
                  <span className="text-3xl font-black text-emerald-950 block my-1">
                    {selectedReceipt.amount.toLocaleString()} {establishment.currency}
                  </span>
                  {summary && (
                    <p className="text-xs font-semibold text-emerald-800 mt-1">
                      Solde restant à devoir pour l'année : <strong>{summary.balanceDue.toLocaleString()} {establishment.currency}</strong>
                    </p>
                  )}
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-center">
                  <div>
                    <p className="font-bold text-[10px] uppercase text-slate-500">Signature de l'Élève / Parent</p>
                    <div className="h-16 flex items-end justify-center">
                      <span className="text-[10px] text-slate-400 italic">Pour acquit</span>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="font-bold text-[10px] uppercase text-slate-500">
                      Le Caissier / Service Comptable
                    </p>
                    <div className="h-16 flex flex-col items-center justify-end">
                      <span className="font-bold text-slate-900 text-xs">{selectedReceipt.recordedBy}</span>
                    </div>
                    {/* Stamp */}
                    <div className="absolute right-2 top-2 w-16 h-16 rounded-full border border-red-500 text-red-600 flex items-center justify-center text-[7px] font-black uppercase text-center rotate-12 opacity-80 pointer-events-none p-1">
                      CAISSE CENTRALE<br />PAYÉ
                    </div>
                  </div>
                </div>

                {/* Print button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer le Reçu
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
