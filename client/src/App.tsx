import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, CalendarDays } from "lucide-react";
import Sidebar from "./components/Sidebar.tsx";
import Topbar from "./components/Topbar.tsx";
import BoardView from "./components/BoardView.tsx";
import EventsView from "./components/EventsView.tsx";
import TeamView from "./components/TeamView.tsx";
import ReportsView from "./components/ReportsView.tsx";
import { Event, Collaborator, Task } from "./types.js";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("minhas_tarefas");
  const [activeEventId, setActiveEventId] = useState<string | null>("event-1");
  const [events, setEvents] = useState<Event[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load baseline resources
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const res = await axios.get("/api/collaborators");
      setCollaborators(res.data);
    } catch (err) {
      console.error("Erro ao buscar colaboradores:", err);
    }
  };

  const fetchTasks = async () => {
    if (!activeEventId) return;
    try {
      const res = await axios.get(`/api/tasks?eventId=${activeEventId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchCollaborators()]);
      setLoading(false);
    };
    initData();
  }, []);

  // Sync tasks when event active identifier switches
  useEffect(() => {
    if (activeEventId) {
      fetchTasks();
    }
  }, [activeEventId]);

  // Current logged user selector
  const currentUser = collaborators.find(c => c.id === "colab-me") || {
    id: "colab-me",
    name: "Fulano de Tal (Você)",
    role: "organizador" as const,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop"
  };

  // Find currently viewed event structure
  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "eventos": return "Lista de Eventos";
      case "minhas_tarefas": return "Quadro de Tarefas";
      case "equipe": return "Diretório do Time";
      case "relatorios": return "Relatórios Geral";
      default: return "Colab Workspace";
    }
  };

  // Loading indicator template
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex relative">
            <span className="flex h-12 w-12 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-2xl h-10 w-10 bg-blue-600 justify-center items-center text-white font-bold text-sm">GE</span>
            </span>
          </div>
          <h2 className="text-slate-800 font-display font-bold text-base">Iniciando ColabEventos...</h2>
          <p className="text-slate-400 font-medium text-xs">Aguarde enquanto sincronizamos as tarefas e sentimentos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex" id="app-root-layout">
      {/* Sidebar sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onlineCount={collaborators.length}
      />

      {/* Main operational panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar header */}
        <Topbar currentUser={currentUser} activeTabLabel={getTabLabel(activeTab)} />

        {/* Tab specific content switches and renders */}
        <main className="flex-1 flex flex-col" id="app-main-content">
          {activeTab === "eventos" && (
            <EventsView 
              events={events}
              collaborators={collaborators}
              activeEventId={activeEventId}
              setActiveEventId={setActiveEventId}
              setActiveTab={setActiveTab}
              onEventCreated={fetchEvents}
            />
          )}

          {activeTab === "minhas_tarefas" && activeEvent && (
            <BoardView 
              activeEvent={activeEvent}
              tasks={tasks}
              collaborators={collaborators}
              onTaskChange={fetchTasks}
              onCollaboratorChange={fetchCollaborators}
            />
          )}

          {activeTab === "minhas_tarefas" && !activeEvent && (
            <div className="p-12 text-center bg-slate-50 flex-1 flex flex-col justify-center items-center">
              <CalendarDays className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700">Selecione um evento ativo</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm">Nenhum evento está selecionado do momento. Navegue até a tela de Eventos para escolher um.</p>
              <button 
                onClick={() => setActiveTab("eventos")}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                Navegar para Eventos
              </button>
            </div>
          )}

          {activeTab === "equipe" && (
            <TeamView 
              collaborators={collaborators}
              onTeamChange={fetchCollaborators}
            />
          )}

          {activeTab === "relatorios" && (
            <ReportsView 
              tasks={tasks} 
              collaborators={collaborators} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
