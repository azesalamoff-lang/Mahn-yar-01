import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  X, 
  Edit3, 
  Save, 
  RotateCcw, 
  Check, 
  Eye, 
  Layers
} from 'lucide-react';
import { TournamentRules } from '../types';
import { useConfirm } from './ConfirmDialog';

interface RulesModalProps {
  rules: TournamentRules;
  categories?: string[];
  onSaveRules: (updated: TournamentRules) => void;
  onResetRules: () => void;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ 
  rules, 
  categories,
  onSaveRules, 
  onResetRules, 
  onClose 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TournamentRules>(rules);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    setFormData(rules);
  }, [rules]);

  const handleStageChange = (index: number, field: 'name' | 'rules' | 'points' | 'result', value: string) => {
    setFormData(prev => {
      const nextStages = [...prev.stages];
      nextStages[index] = {
        ...nextStages[index],
        [field]: value
      };
      return {
        ...prev,
        stages: nextStages
      };
    });
  };

  const handleSave = () => {
    onSaveRules(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 400);
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Qaydalar ilkin vəziyyətinə qaytarılsın?',
      message: 'Bütün dəyişikliklər silinəcək və rəsmi ilkin qaydalar bərpa olunacaq.',
      confirmLabel: 'Bəli, bərpa et',
      cancelLabel: 'İmtina'
    });
    if (ok) {
      onResetRules();
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          id="rules-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Row with Edit Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                {isEditing ? 'Qaydaları Redaktə Et' : formData.title}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Turnir məlumatlarını və turların qaydalarını dəyişə bilərsiniz' : formData.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-8 sm:mr-0">
            {!isEditing ? (
              <button
                id="edit-rules-toggle-btn"
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Qaydaları Dəyiş</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData(rules);
                  setIsEditing(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Baxış Rejimi</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* If Editing: Title & Subtitle inputs */}
          {isEditing && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase block">Əsas Başlıqlar</span>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Turnirin Başlığı</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Alt Başlıq / İzah</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info Grid (Tarix, Məkan, İştirakçılar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-teal-400 shrink-0" />
              <div className="w-full">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tarix</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 mt-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-white">{formData.date}</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="w-full">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Məkan</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 mt-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-white truncate block">
                    {formData.location}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="w-full">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">İştirakçılar</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 mt-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-white">{formData.participants}</span>
                )}
              </div>
            </div>
          </div>

          {/* Description / Goal / Principle Section */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Layihənin təsviri</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Layihənin məqsədi</label>
                  <textarea
                    rows={2}
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Əsas prinsip</label>
                  <textarea
                    rows={2}
                    value={formData.principle}
                    onChange={(e) => setFormData(prev => ({ ...prev, principle: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Layihənin təsviri:</strong> {formData.description}
                </p>
                <p>
                  <strong>Layihənin məqsədi:</strong> {formData.goal}
                </p>
                <p>
                  <strong>Əsas prinsip:</strong> {formData.principle}
                </p>
              </>
            )}
          </div>

          {/* 4 Stages Table or Edit Cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Mərhələlər üzrə Təlimat və Qaydalar (4 Tur)
              </h3>
              {categories && categories.length > 0 && !isEditing && (
                <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>1-ci turun kateqoriyaları: {categories.join(' • ')}</span>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                {formData.stages.map((stage, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                        {stage.stageNumber}
                      </span>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => handleStageChange(idx, 'name', e.target.value)}
                        placeholder="Mərhələnin adı..."
                        className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 flex-1"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Oyun qaydası</label>
                      <textarea
                        rows={2}
                        value={stage.rules}
                        onChange={(e) => handleStageChange(idx, 'rules', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Xal sistemi</label>
                        <input
                          type="text"
                          value={stage.points}
                          onChange={(e) => handleStageChange(idx, 'points', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Mərhələ Nəticəsi</label>
                        <input
                          type="text"
                          value={stage.result}
                          onChange={(e) => handleStageChange(idx, 'result', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Tur</th>
                      <th className="py-2.5 px-3">Mərhələnin adı</th>
                      <th className="py-2.5 px-3">Oyun qaydası</th>
                      <th className="py-2.5 px-3">Xal sistemi</th>
                      <th className="py-2.5 px-3">Nəticə</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {formData.stages.map((stage) => (
                      <tr key={stage.stageNumber} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-bold text-amber-400">{stage.stageNumber}</td>
                        <td className="py-3 px-3 font-bold text-white font-display whitespace-nowrap">
                          {stage.name}
                        </td>
                        <td className="py-3 px-3 leading-relaxed min-w-[200px]">
                          {stage.rules}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-400 leading-relaxed min-w-[140px]">
                          {stage.points}
                        </td>
                        <td className="py-3 px-3 text-teal-300 font-semibold min-w-[140px]">
                          {stage.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 mt-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Standart Qaydalara Qayıt</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(rules);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  İmtina
                </button>
                <button
                  type="button"
                  id="save-rules-btn"
                  onClick={handleSave}
                  className={`px-5 py-2 rounded-xl text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                    savedSuccess
                      ? 'bg-emerald-400 shadow-emerald-500/20'
                      : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Qaydalar Saxlanıldı!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Qaydaları Yadda Saxla</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-500">
                Qaydalar həmçinin çap və təqdimat üçün optimallaşdırılmışdır.
              </span>
              <button
                id="rules-close-bottom-btn"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Aydındır, Yarışmaya Qayıt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
