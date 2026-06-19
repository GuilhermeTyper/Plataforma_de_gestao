import React, { useState } from "react";
import axios from "axios";
import { CalendarDays, Plus, User, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Event, Collaborator } from "../types.js";

interface EventsViewProps {
  events: Event[];
  collaborators: Collaborator[];
  activeEventId: string | null;
  setActiveEventId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  onEventCreated: () => void;
}

export default function EventsView({
  events,
  collaborators,
  activeEventId,
  setActiveEventId,
  setActiveTab,
  onEventCreated
}: EventsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizerId, setOrganizerId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !organizerId) {
      alert("Por favor, preencha todos os campos do evento.");
      return;
    }
    try {
      await axios.post("/api/events", {
        title,
        startDate,
        endDate,
        organizerId
      });
      // Reset
      setTitle("");
      setStartDate("");
      setEndDate("");
      setOrganizerId("");
      setShowCreateModal(false);
      onEventCreated();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o evento.");
    }
  };

  return (
    <div className="p-6 flex-1 bg-slate-50 overflow-y-auto" id="events-view-container">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left" id="events-header">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Seus Eventos Ativos</h2>
          <p className="text-xs text-slate-500 font-medium">Selecione ou crie eventos colaborativos para gerenciar os sentimentos e tarefas da equipe.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      {/* Events Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left" id="events-cards-grid">
        {events.map((event) => {
          const isSelected = activeEventId === event.id;
          const organizer = collaborators.find(c => c.id === event.organizerId);
          return (
            <div
              key={event.id}
              onClick={() => {
                setActiveEventId(event.id);
                setActiveTab("minhas_tarefas");
              }}
              className={`bg-white rounded-3xl p-5 border shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-48 relative overflow-hidden group ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Visualizando
                </div>
              )}

              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3.5 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>

                <h3 className="font-display font-bold text-slate-800 text-base tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                
                {/* Organiser */}
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Organizador: <strong className="text-slate-650 font-semibold">{organizer ? organizer.name.replace(/ \(Você\)/, "") : "Equipe"}</strong>
                </span>
              </div>

              {/* Date footer summary */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-semibold text-slate-500 mt-2">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(event.startDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{new Date(event.endDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
                </div>

                <span className="text-[10px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Ver Kanban →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-create-event">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 p-1 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Criar Novo Evento Colaborativo
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome do Evento</label>
                <input
                  type="text"
                  placeholder="Ex: Hackathon Presencial SP"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Início do Evento</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Encerramento</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Atribuir Organizador Geral</label>
                <select
                  value={organizerId}
                  onChange={(e) => setOrganizerId(e.target.value)}
                  className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                >
                  <option value="">Selecione...</option>
                  {collaborators.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                >
                  Salvar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Close helper to avoid typescript imports for X which we didn't specify above
function X(props: any) {
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
