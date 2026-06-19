import React, { useState } from "react";
import axios from "axios";
import { Users, UserPlus, Trash2, Shield, HeartHandshake, Eye, Sparkles } from "lucide-react";
import { Collaborator } from "../types.js";

interface TeamViewProps {
  collaborators: Collaborator[];
  onTeamChange: () => void;
}

export default function TeamView({ collaborators, onTeamChange }: TeamViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<'editor' | 'visualizador' | 'organizador'>("editor");

  const handleCreateColab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await axios.post("/api/collaborators", {
        name,
        role
      });
      setName("");
      setRole("editor");
      setShowAddForm(false);
      onTeamChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar colaborador.");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "organizador":
        return "text-red-700 bg-red-55 border-red-200";
      case "editor":
        return "text-blue-700 bg-blue-55 border-blue-200";
      default:
        return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="p-6 flex-1 bg-slate-50 overflow-y-auto" id="team-view-container">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left" id="team-header">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Equipe Projeto</h2>
          <p className="text-xs text-slate-500 font-medium">Controle os colaboradores participantes da organização e suas respectivas permissões administrativas.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? "Fechar Formulário" : "Convidar Membro"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 max-w-xl text-left shadow-2xs" id="team-add-member-form">
          <h3 className="font-display font-semibold text-slate-800 text-sm mb-3">Preencha os Dados do Novo Membro</h3>
          <form onSubmit={handleCreateColab} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Carlos Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Permissão</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
              >
                <option value="editor">Editor</option>
                <option value="visualizador">Visualizador</option>
                <option value="organizador">Organizador</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
              >
                Confirmar Convite
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directory Table Grid layout */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs" id="team-table-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-150 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4">Função Ativa</th>
                <th className="px-6 py-4">Status de Atividade</th>
                <th className="px-6 py-4 text-right">Acesso no Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-650 font-medium">
              {collaborators.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* member column */}
                  <td className="px-6 py-4.5 flex items-center gap-3">
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {c.id}</div>
                    </div>
                  </td>

                  {/* role column */}
                  <td className="px-6 py-4.5">
                    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${getRoleBadge(c.role)}`}>
                      {c.role === "organizador" ? (
                        <Shield className="w-3 h-3 text-red-500" />
                      ) : c.role === "editor" ? (
                        <HeartHandshake className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Eye className="w-3 h-3 text-slate-500" />
                      )}
                      {c.role}
                    </span>
                  </td>

                  {/* status placeholder */}
                  <td className="px-6 py-4.5">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Ativo no Time
                    </span>
                  </td>

                  {/* Workspace indicators */}
                  <td className="px-6 py-4.5 text-right font-mono text-[10px] text-slate-400">
                    {c.id === "colab-me" ? (
                      <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">Proprietário</span>
                    ) : (
                      <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">Permissão Concedida</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
