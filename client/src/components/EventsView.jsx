import React, { useState } from "react";
import axios from "axios";
import { Calendar, Plus, Users, MapPin, Sparkles } from "lucide-react";

export default function EventsView({ 
  events, 
  collaborators, 
  activeEventId, 
  setActiveEventId, 
  setActiveTab, 
  onEventCreated 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    try {
      await axios.post("/api/events", {
        title,
        startDate,
        endDate,
        description: description || "Sem descrição adicional.",
        organizerId: "colab-me" // Default organizer (current logged user)
      });
      // Clear values
      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setShowCreateModal(false);
      onEventCreated();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar o evento.");
    }
  };

  const getCollaboratorCount = (eventId) => {
    // In our simplified logic, all current collaborators share the workspace
    return collaborators.length;
  };

  return (
    <div className="flex-1 bg-slate-50/50 p-4 md:p-6" id="events-view-container">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" id="events-header">
        <div className="text-left">
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Seus Eventos</h2>
          <p className="text-slate-500 text-xs mt-1">Selecione ou crie eventos para visualizar e monitorar o quadro de tarefas.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          id="btn-create-event"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-cards-grid">
        {events.map((event) => {
          const isActive = event.id === activeEventId;
          const org = collaborators.find(c => c.id === event.organizerId) || { name: "Organizador Principal" };
          
          return (
            <div
              key={event.id}
              onClick={() => setActiveEventId(event.id)}
              className={`bg-white border rounded-3xl p-5 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between text-left h-64 ${
                isActive 
                  ? "border-blue-600 ring-2 ring-blue-100" 
                  : "border-slate-200 hover:border-slate-350"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                      Visualizando
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-4 leading-snug line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{getCollaboratorCount(event.id)} Colaboradores</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEventId(event.id);
                    setActiveTab("minhas_tarefas");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    isActive 
                      ? "bg-blue-600 hover:bg-blue-750 text-white" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Abrir Quadro
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- CREATE EVENT MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-create-event">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Criar Novo Evento
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome do Evento</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Hackathon de Desenvolvimento 2026"
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Data de Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Data de Término</label>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Descrição do Evento</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Forneça detalhes breves do propósito do evento..."
                  rows="3"
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium resize-none"
                />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                >
                  Criar Evento
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
