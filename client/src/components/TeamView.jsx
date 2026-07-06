import React, { useState } from "react";
import axios from "axios";
import { Users, Shield, Plus, Mail, Trash2, ShieldAlert } from "lucide-react";

export default function TeamView({ collaborators, onTeamChange }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteName.trim()) {
      alert("Preencha o nome do colaborador!");
      return;
    }
    try {
      await axios.post("/api/collaborators", {
        name: inviteName,
        role: inviteRole
      });
      setInviteName("");
      setInviteRole("editor");
      setShowInviteModal(false);
      onTeamChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao convidar colaborador.");
    }
  };

  const handleRemoveCollaborator = async (colabId) => {
    if (colabId === "colab-me") {
      alert("Você não pode remover a si mesmo!");
      return;
    }
    if (!confirm("Tem certeza que deseja remover este colaborador?")) return;
    try {
      await axios.delete(`/api/collaborators/${colabId}`);
      onTeamChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover colaborador.");
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "organizador":
        return "bg-purple-50 text-purple-700 border-purple-100 font-bold";
      case "editor":
        return "bg-blue-50 text-blue-700 border-blue-100 font-bold";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100 font-medium";
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 p-4 md:p-6" id="team-view-container">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" id="team-header">
        <div className="text-left">
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Equipe do Projeto</h2>
          <p className="text-slate-500 text-xs mt-1">Gerencie membros, papéis de permissão e atribuições do time ativo.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          id="btn-add-member"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Convidar Membro
        </button>
      </div>

      {/* Grid of team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="team-cards-grid">
        {collaborators.map((colab) => (
          <div
            key={colab.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all text-left"
          >
            <div>
              <div className="flex items-start justify-between">
                <img
                  src={colab.avatarUrl}
                  alt={colab.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${getRoleBadgeClass(colab.role)}`}>
                  {colab.role}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-4 font-display">
                {colab.name}
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                ID: active-colab-{colab.id}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1 text-slate-500 font-semibold">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>{colab.role === "organizador" ? "Admin" : "Editor"}</span>
              </div>
              {colab.id !== "colab-me" && (
                <button
                  onClick={() => handleRemoveCollaborator(colab.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                  title="Remover Colaborador"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- INVITE MODAL --- */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-team-invite">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Convidar Membro para o Time
            </h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome do Colaborador</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ex: Gabriela Duarte"
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cargo / Papel de Permissão</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                >
                  <option value="editor">Editor (Gerenciar Tarefas)</option>
                  <option value="visualizador">Visualizador (Apenas Leitura)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex gap-2 text-slate-500 text-[11px]">
                <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p>
                  Os cargos definem o nível de acesso que o usuário terá às listas de tarefas do quadro Kanban e relatórios.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                >
                  Convidar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Close helper
function X(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
