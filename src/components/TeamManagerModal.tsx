import React, { useState } from 'react';
import { Team, TeamMember } from '../types';
import { Users, Save, X, Plus, Trash2, Shield, UserPlus, Palette, RefreshCw } from 'lucide-react';

interface TeamManagerModalProps {
  teams: Team[];
  onSaveTeams: (updatedTeams: Team[]) => void;
  onClose: () => void;
}

const COLOR_PALETTES = [
  { color: '#38bdf8', bgGlow: 'rgba(56, 189, 248, 0.2)', borderColor: 'border-sky-500', badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  { color: '#fbbf24', bgGlow: 'rgba(251, 191, 36, 0.2)', borderColor: 'border-amber-500', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { color: '#34d399', bgGlow: 'rgba(52, 211, 153, 0.2)', borderColor: 'border-emerald-500', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { color: '#f472b6', bgGlow: 'rgba(244, 114, 182, 0.2)', borderColor: 'border-pink-500', badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  { color: '#a78bfa', bgGlow: 'rgba(167, 139, 250, 0.2)', borderColor: 'border-purple-500', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { color: '#fb923c', bgGlow: 'rgba(251, 146, 60, 0.2)', borderColor: 'border-orange-500', badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { color: '#2dd4bf', bgGlow: 'rgba(45, 212, 191, 0.2)', borderColor: 'border-teal-500', badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { color: '#f87171', bgGlow: 'rgba(248, 113, 113, 0.2)', borderColor: 'border-rose-500', badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
];

export const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  teams,
  onSaveTeams,
  onClose
}) => {
  const [editedTeams, setEditedTeams] = useState<Team[]>(JSON.parse(JSON.stringify(teams)));

  const handleNameChange = (teamId: string, newName: string) => {
    setEditedTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, name: newName } : t))
    );
  };

  const handleMemberChange = (teamId: string, memberIndex: number, newMemberName: string) => {
    setEditedTeams(prev =>
      prev.map(t => {
        if (t.id !== teamId) return t;
        const newMembers = [...t.members];
        if (newMembers[memberIndex]) {
          newMembers[memberIndex] = { ...newMembers[memberIndex], name: newMemberName };
        }
        return { ...t, members: newMembers };
      })
    );
  };

  const handleAddMember = (teamId: string) => {
    setEditedTeams(prev =>
      prev.map(t => {
        if (t.id !== teamId) return t;
        const newMember: TeamMember = {
          id: `${teamId}_m${Date.now()}`,
          name: `Könüllü ${t.members.length + 1}`
        };
        return { ...t, members: [...t.members, newMember] };
      })
    );
  };

  const handleRemoveMember = (teamId: string, memberIndex: number) => {
    setEditedTeams(prev =>
      prev.map(t => {
        if (t.id !== teamId) return t;
        if (t.members.length <= 1) return t; // keep at least 1
        const newMembers = t.members.filter((_, idx) => idx !== memberIndex);
        return { ...t, members: newMembers };
      })
    );
  };

  const handleSelectPalette = (teamId: string, paletteIndex: number) => {
    const palette = COLOR_PALETTES[paletteIndex % COLOR_PALETTES.length];
    setEditedTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? {
              ...t,
              color: palette.color,
              bgGlow: palette.bgGlow,
              borderColor: palette.borderColor,
              badgeBg: palette.badgeBg
            }
          : t
      )
    );
  };

  const handleAddNewTeam = () => {
    const nextNum = editedTeams.length + 1;
    const newId = `team_${Date.now()}`;
    const palette = COLOR_PALETTES[(nextNum - 1) % COLOR_PALETTES.length];

    const newTeam: Team = {
      id: newId,
      name: `Komanda ${nextNum}`,
      color: palette.color,
      bgGlow: palette.bgGlow,
      borderColor: palette.borderColor,
      badgeBg: palette.badgeBg,
      score: 0,
      status: 'active',
      buzzerKey: String(nextNum),
      members: [
        { id: `${newId}_m1`, name: `Könüllü ${nextNum}-1 (Kapitan)`, role: 'Kapitan' },
        { id: `${newId}_m2`, name: `Könüllü ${nextNum}-2` },
        { id: `${newId}_m3`, name: `Könüllü ${nextNum}-3` },
        { id: `${newId}_m4`, name: `Könüllü ${nextNum}-4` },
      ]
    };

    setEditedTeams(prev => [...prev, newTeam]);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (editedTeams.length <= 2) {
      alert('Turnir üçün ən azı 2 komanda qalmalıdır!');
      return;
    }
    if (confirm('Bu komandanı silmək istədiyinizdən əminsiniz?')) {
      setEditedTeams(prev => prev.filter(t => t.id !== teamId));
    }
  };

  const handleSave = () => {
    onSaveTeams(editedTeams);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Komandalar və Könüllülər Tərkibi
              </h2>
              <p className="text-xs text-slate-400">
                Turnir komandalarını idarə edin, yeni komanda əlavə edin və ya tərkibləri redaktə edin.
              </p>
            </div>
          </div>

          <button
            id="admin-add-team-btn"
            type="button"
            onClick={handleAddNewTeam}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-950 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Komanda Əlavə Et</span>
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-[62vh] overflow-y-auto pr-1">
          {editedTeams.map((team, tIdx) => (
            <div
              key={team.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 relative group"
            >
              {/* Header: Name, Color and Delete */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow"
                    style={{ backgroundColor: team.color }}
                  />
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleNameChange(team.id, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    placeholder="Komanda adı..."
                  />
                </div>

                <div className="flex items-center gap-1">
                  {/* Palette selector */}
                  <div className="flex items-center gap-1">
                    {COLOR_PALETTES.slice(0, 4).map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSelectPalette(team.id, pIdx)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          team.color === p.color ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: p.color }}
                        title="Rəngi dəyiş"
                      />
                    ))}
                  </div>

                  {editedTeams.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Komandanı sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Members */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Könüllü Heyəti ({team.members.length} nəfər):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddMember(team.id)}
                    className="text-[10px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Üzv əlavə et</span>
                  </button>
                </div>

                {team.members.map((member, mIdx) => (
                  <div key={member.id || mIdx} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-4">{mIdx + 1}.</span>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(team.id, mIdx, e.target.value)}
                      className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-sky-400 focus:outline-none"
                      placeholder={`İştirakçı ${mIdx + 1} adı...`}
                    />
                    {mIdx === 0 ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                        Kapitan
                      </span>
                    ) : (
                      team.members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(team.id, mIdx)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                          title="Üzvü çıxar"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Info */}
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                <span>Zəng Düyməsi: <strong>{team.buzzerKey || tIdx + 1}</strong></span>
                <span>Cari Xal: <strong>{team.score}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Ümumi <strong>{editedTeams.length}</strong> komanda qeydiyyatdadır.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Ləğv et
            </button>
            <button
              id="save-teams-modal-btn"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Dəyişiklikləri Yadda Saxla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
