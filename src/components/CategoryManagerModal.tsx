import React, { useState, useEffect } from 'react';
import { X, Layers, Save, RotateCcw, Check, Disc3, AlertCircle } from 'lucide-react';
import { SongItem } from '../types';
import { useConfirm } from './ConfirmDialog';

export const DEFAULT_STAGE_1_CATEGORIES = [
  'Retro mahnılar',
  '90-cı illər',
  'Kino musiqiləri',
  'Xalq mahnıları'
];

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: string[];
  songs: SongItem[];
  initialActiveIndex?: number;
  onSave: (newCategories: string[], renameMap: Record<string, string>) => void;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  categories,
  songs,
  initialActiveIndex = 0,
  onSave,
  onClose
}) => {
  const [editedCategories, setEditedCategories] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    if (isOpen) {
      // Ensure we have at least 4 categories
      const list = [...categories];
      while (list.length < 4) {
        list.push(DEFAULT_STAGE_1_CATEGORIES[list.length] || `Kateqoriya ${list.length + 1}`);
      }
      setEditedCategories(list.slice(0, 4));
      setErrorMsg(null);
      setSaveSuccess(false);
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleCategoryChange = (index: number, value: string) => {
    setEditedCategories(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setErrorMsg(null);
  };

  const handleSave = () => {
    // Validation: none can be empty
    const trimmed = editedCategories.map(c => c.trim());
    if (trimmed.some(c => !c)) {
      setErrorMsg('Bütün 4 kateqoriyanın adı qeyd olunmalıdır.');
      return;
    }

    // Check duplicates
    const set = new Set(trimmed.map(c => c.toLowerCase()));
    if (set.size !== trimmed.length) {
      setErrorMsg('Kateqoriya adları bir-birindən fərqli olmalıdır.');
      return;
    }

    // Build renameMap
    const renameMap: Record<string, string> = {};
    categories.forEach((oldCat, idx) => {
      const newCat = trimmed[idx];
      if (newCat && newCat !== oldCat) {
        renameMap[oldCat] = newCat;
      }
    });

    onSave(trimmed, renameMap);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 400);
  };

  const handleResetDefaults = async () => {
    const ok = await confirm({
      title: 'Standart kateqoriya adları bərpa edilsin?',
      message: '4 kateqoriyanın adı ilkin variantına qaytarılacaq ("Retro mahnılar", "90-cı illər", "Kino musiqiləri", "Xalq mahnıları").',
      confirmLabel: 'Bəli, bərpa et',
      cancelLabel: 'İmtina'
    });

    if (ok) {
      const renameMap: Record<string, string> = {};
      categories.forEach((oldCat, idx) => {
        const newCat = DEFAULT_STAGE_1_CATEGORIES[idx];
        if (newCat && newCat !== oldCat) {
          renameMap[oldCat] = newCat;
        }
      });
      setEditedCategories([...DEFAULT_STAGE_1_CATEGORIES]);
      onSave([...DEFAULT_STAGE_1_CATEGORIES], renameMap);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl relative my-8">
        <button
          id="category-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display">
              1-ci Tur Kateqoriyalarını Redaktə Et
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              &ldquo;Musiqi Şifrəsi&rdquo; turundakı 4 kateqoriyanın adını istəyinizə uyğun dəyişin
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 4 Category Inputs */}
        <div className="space-y-4 mb-6">
          {editedCategories.map((catName, idx) => {
            const originalName = categories[idx] || DEFAULT_STAGE_1_CATEGORIES[idx];
            // Count matching songs
            const songCount = songs.filter(s => {
              if (s.category === originalName) return true;
              if (originalName === 'Retro mahnılar' && s.category === '80-ci illər') return true;
              return false;
            }).length;

            return (
              <div 
                key={idx} 
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 focus-within:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label 
                    htmlFor={`cat-input-${idx}`}
                    className="text-xs font-bold text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-[11px] font-black">
                      {idx + 1}
                    </span>
                    <span>Kateqoriya {idx + 1}</span>
                  </label>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Disc3 className="w-3 h-3 text-amber-400/80" />
                    <span>{songCount} mahnı bağlıdır</span>
                  </span>
                </div>

                <div className="relative">
                  <input
                    id={`cat-input-${idx}`}
                    type="text"
                    value={catName}
                    autoFocus={idx === initialActiveIndex}
                    onChange={(e) => handleCategoryChange(idx, e.target.value)}
                    placeholder={`Kateqoriya ${idx + 1} adı...`}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Standart Adlara Qayıt</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              İmtina
            </button>
            <button
              type="button"
              id="save-categories-btn"
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-400 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Yadda Saxlanıldı!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Yadda Saxla</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
