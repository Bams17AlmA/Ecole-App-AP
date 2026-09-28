import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { AcademicYear, Establishment, Term } from '../../types';
import {
  Building2,
  Calendar,
  Save,
  Plus,
  CheckCircle2,
  Lock,
  Unlock,
  Shield,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
} from 'lucide-react';

export const EstablishmentModule: React.FC = () => {
  const {
    establishment,
    updateEstablishment,
    academicYears,
    currentAcademicYear,
    addAcademicYear,
    setCurrentAcademicYear,
  } = useSchool();

  // Local state for establishment edit form
  const [formData, setFormData] = useState<Establishment>(establishment);
  const [isSaved, setIsSaved] = useState(false);

  // New Academic Year Modal
  const [isNewYearModalOpen, setIsNewYearModalOpen] = useState(false);
  const [newYearLabel, setNewYearLabel] = useState('');
  const [newYearStart, setNewYearStart] = useState('2026-09-01');
  const [newYearEnd, setNewYearEnd] = useState('2027-06-30');
  const [setAsCurrent, setSetAsCurrent] = useState(true);

  const handleSaveEstablishment = (e: React.FormEvent) => {
    e.preventDefault();
    updateEstablishment(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearLabel.trim()) return;

    const defaultTerms: Term[] = [
      { id: `term-t1-${Date.now()}`, name: '1er Trimestre', code: 'T1', startDate: newYearStart, endDate: '2026-12-15', isClosed: false, weight: 1 },
      { id: `term-t2-${Date.now()}`, name: '2ème Trimestre', code: 'T2', startDate: '2027-01-05', endDate: '2027-03-31', isClosed: false, weight: 1 },
      { id: `term-t3-${Date.now()}`, name: '3ème Trimestre', code: 'T3', startDate: '2027-04-01', endDate: newYearEnd, isClosed: false, weight: 1 },
    ];

    addAcademicYear({
      label: newYearLabel.trim(),
      startDate: newYearStart,
      endDate: newYearEnd,
      isCurrent: setAsCurrent,
      terms: defaultTerms,
    });

    setIsNewYearModalOpen(false);
    setNewYearLabel('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Paramètres de l'Établissement & Années Scolaires
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les informations légales, l'en-tête officiel des bulletins et le calendrier des années scolaires.
          </p>
        </div>

        <button
          onClick={() => setIsNewYearModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Année Scolaire
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fiche Signalétique de l'Établissement
            </h3>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Enregistré avec succès !
              </span>
            )}
          </div>

          <form onSubmit={handleSaveEstablishment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom officiel complet de l'établissement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sigle / Nom court
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Code Établissement / Agrément
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Devise de l'école (apparaît sur les bulletins et certificats)
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={e => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Chef d'Établissement (Directeur/Proviseur)
                </label>
                <input
                  type="text"
                  value={formData.directorName}
                  onChange={e => setFormData({ ...formData, directorName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du responsable
                </label>
                <input
                  type="text"
                  value={formData.directorTitle}
                  onChange={e => setFormData({ ...formData, directorTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone(s)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email officiel
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse géographique
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Devise monétaire (ex: FCFA, EUR, USD)
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texte du Cachet / Tampon Officiel
                </label>
                <input
                  type="text"
                  value={formData.stampText}
                  onChange={e => setFormData({ ...formData, stampText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Academic Years List & Terms */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              Années Scolaires
            </h3>

            <div className="space-y-3">
              {academicYears.map(year => (
                <div
                  key={year.id}
                  className={`p-3.5 rounded-xl border transition ${
                    year.isCurrent
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {year.label}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Du {year.startDate} au {year.endDate}
                      </p>
                    </div>

                    {year.isCurrent ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                        En cours
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentAcademicYear(year.id)}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Activer
                      </button>
                    )}
                  </div>

                  {/* Trimestres */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Périodes d'évaluation ({year.terms.length} trimestres) :
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {year.terms.map(t => (
                        <div
                          key={t.id}
                          className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center text-[10px]"
                        >
                          <div className="font-bold text-slate-700 dark:text-slate-300">{t.code}</div>
                          <div className="text-[9px] text-slate-400 truncate">{t.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Academic Year */}
      <Modal
        isOpen={isNewYearModalOpen}
        onClose={() => setIsNewYearModalOpen(false)}
        title="Créer une Année Scolaire"
        subtitle="Définissez les dates de rentrée et de fin d'année"
      >
        <form onSubmit={handleCreateYear} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Libellé de l'année scolaire (ex: 2026-2027) *
            </label>
            <input
              type="text"
              required
              placeholder="ex: 2026-2027"
              value={newYearLabel}
              onChange={e => setNewYearLabel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date de début
              </label>
              <input
                type="date"
                required
                value={newYearStart}
                onChange={e => setNewYearStart(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                required
                value={newYearEnd}
                onChange={e => setNewYearEnd(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="setAsCurrentCheckbox"
              checked={setAsCurrent}
              onChange={e => setSetAsCurrent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="setAsCurrentCheckbox" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Définir immédiatement comme l'année scolaire active
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewYearModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Créer l'Année
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
