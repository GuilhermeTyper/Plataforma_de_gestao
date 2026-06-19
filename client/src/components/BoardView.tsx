import React, { useState } from "react";
import axios from "axios";
import { 
  FolderPlus, 
  MoreHorizontal, 
  Plus, 
  UserPlus, 
  Info, 
  Calendar, 
  X, 
  ChevronRight, 
  Trash2, 
  Sparkles, 
  CheckSquare, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { Task, Collaborator, Event, TaskStatus } from "../types.js";

interface BoardViewProps {
  activeEvent: Event;
  tasks: Task[];
  collaborators: Collaborator[];
  onTaskChange: () => void;
  onCollaboratorChange: () => void;
}

export default function BoardView({ 
  activeEvent, 
  tasks, 
  collaborators, 
  onTaskChange, 
  onCollaboratorChange 
}: BoardViewProps) {
  // Modal states
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // New task form fields state
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<TaskStatus>("pendente");
  const [newAssignedId, setNewAssignedId] = useState("");
  const [newSentimentType, setNewSentimentType] = useState<Task["sentimentType"]>("Focado");
  const [newSentimentText, setNewSentimentText] = useState("");
  const [newProgress, setNewProgress] = useState<number | "">("");

  // Invite form fields state
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<'editor' | 'visualizador'>("editor");

  // Edit task form fields state
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("pendente");
  const [editAssignedId, setEditAssignedId] = useState("");
  const [editSentimentType, setEditSentimentType] = useState<Task["sentimentType"]>("Focado");
  const [editSentimentText, setEditSentimentText] = useState("");
  const [editProgress, setEditProgress] = useState<number | "">("");

  // Find info helpers
  const eventOrganizer = collaborators.find(c => c.id === activeEvent.organizerId);

  // Sentiment class mapper
  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'Ansioso':
        return 'text-amber-700 bg-amber-100/70 border-amber-250 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
      case 'Desafiado':
      case 'Desafiada':
        return 'text-rose-700 bg-rose-100/70 border-rose-250 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
      case 'Focado':
        return 'text-blue-700 bg-blue-100/70 border-blue-250 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
      case 'Satisfeito':
        return 'text-emerald-800 bg-emerald-100/70 border-emerald-250 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
      case 'Animado':
        return 'text-teal-750 bg-teal-100/70 border-teal-250 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
      default:
        return 'text-slate-600 bg-slate-150 px-2 py-0.5 rounded-md font-semibold text-xs inline-block';
    }
  };

  // Format dates beautifully
  const formatDateRange = (start: string, end: string) => {
    const parseDateStr = (dateStr: string) => {
      if (!dateStr) return "";
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };
    return `${parseDateStr(start)} - ${parseDateStr(end)}`;
  };

  // Submit handers
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignedId) {
      alert("Por favor, preencha o título e atribute para um colaborador!");
      return;
    }
    try {
      await axios.post("/api/tasks", {
        title: newTitle,
        status: newStatus,
        assignedId: newAssignedId,
        sentimentType: newSentimentType,
        sentimentText: newSentimentText || "Sem considerações extras.",
        progress: newStatus === "em_andamento" ? (newProgress !== "" ? Number(newProgress) : 50) : undefined,
        eventId: activeEvent.id
      });
      // Clear
      setNewTitle("");
      setNewStatus("pendente");
      setNewAssignedId("");
      setNewSentimentType("Focado");
      setNewSentimentText("");
      setNewProgress("");
      setShowNewTaskModal(false);
      onTaskChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar a tarefa.");
    }
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditAssignedId(task.assignedId);
    setEditSentimentType(task.sentimentType);
    setEditSentimentText(task.sentimentText);
    setEditProgress(task.progress !== undefined ? task.progress : "");
    setShowEditTaskModal(true);
  };

  const handleSaveEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await axios.put(`/api/tasks/${selectedTask.id}`, {
        title: editTitle,
        status: editStatus,
        assignedId: editAssignedId,
        sentimentType: editSentimentType,
        sentimentText: editSentimentText,
        progress: editStatus === "em_andamento" ? (editProgress !== "" ? Number(editProgress) : 50) : null
      });
      setShowEditTaskModal(false);
      setSelectedTask(null);
      onTaskChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar tarefa.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setShowEditTaskModal(false);
      setSelectedTask(null);
      onTaskChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar tarefa.");
    }
  };

  const handleInviteCollaborator = async (e: React.FormEvent) => {
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
      onCollaboratorChange();
    } catch (err) {
      console.error(err);
      alert("Erro ao convidar colaborador.");
    }
  };

  const handleQuickStatusChange = async (task: Task, targetStatus: TaskStatus) => {
    try {
      await axios.put(`/api/tasks/${task.id}`, {
        status: targetStatus,
        // Reset or set progress
        progress: targetStatus === "em_andamento" ? 50 : undefined
      });
      onTaskChange();
    } catch (err) {
      console.error(err);
    }
  };

  // Filters tasks for columns
  const pTasks = tasks.filter(t => t.status === "pendente");
  const aTasks = tasks.filter(t => t.status === "em_andamento");
  const cTasks = tasks.filter(t => t.status === "concluido");

  return (
    <div className="flex flex-col lg:flex-row flex-1 bg-slate-150/40 p-4 md:p-6 overflow-x-hidden" id="board-container">
      
      {/* Board Left Pane */}
      <div className="flex-1 lg:pr-6 whitespace-normal" id="board-left-panel">
        
        {/* Breadcrumb bread */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3" id="breadcrumb-navigation">
          <span className="cursor-pointer hover:text-slate-800 transition-colors">Início</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-850 font-semibold">{activeEvent.title}</span>
        </div>

        {/* Board Title Section */}
        <div className="flex items-center justify-between mb-5" id="board-title-section">
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Tarefas</h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNewTaskModal(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white border hover:border-slate-350 bg-slate-50/50 rounded-lg transition-all"
              title="Nova Pasta / Nova Listagem"
            >
              <FolderPlus className="w-4.5 h-4.5" />
            </button>
            <button 
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white border hover:border-slate-350 bg-slate-50/50 rounded-lg transition-all"
              title="Mais Opções"
            >
              <MoreHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Columns Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="columns-grid">
          
          {/* Column Pendente */}
          <div className="flex flex-col min-h-[450px]" id="col-pendente">
            <div className="bg-[#a0aec0] text-white px-5 py-2.5 rounded-2xl font-bold font-display text-center text-[13px] tracking-wide mb-4 shadow-sm select-none">
              Pendente
            </div>
            <div className="space-y-4 flex-1">
              {pTasks.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs font-medium">
                  Nenhuma tarefa pendente
                </div>
              ) : (
                pTasks.map((task) => {
                  const assigned = collaborators.find(c => c.id === task.assignedId);
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleEditTaskClick(task)}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group relative"
                    >
                      <h4 className="font-bold text-slate-800 font-display text-sm leading-snug mb-1 text-left">
                        {task.title}
                      </h4>
                      <p className="text-[11px] font-mono font-medium text-slate-400 mb-2.5">
                        ID: uuid-{task.id}
                      </p>
                      
                      <div className="space-y-1.5 text-left text-xs mb-3">
                        <div className="text-slate-500 font-medium">
                          <span className="text-slate-400">Assigned:</span> {assigned ? assigned.name.replace(/ \(Você\)/, "") : "Sem responsável"}
                        </div>
                        <div className="text-slate-500 flex items-wrap items-center gap-1.5">
                          <span className="text-slate-400">Sentimento:</span> 
                          <span className={getSentimentStyles(task.sentimentType)}>
                            {task.sentimentType}
                          </span>
                          <span className="text-slate-600 block sm:inline">
                            - {task.sentimentText}
                          </span>
                        </div>
                      </div>

                      {/* Quick action handle column move */}
                      <div className="border-t border-slate-100 pt-2.5 flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusChange(task, "em_andamento");
                          }}
                          className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2 py-1 rounded"
                        >
                          Mover para Em Andamento →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column Em Andamento */}
          <div className="flex flex-col min-h-[450px]" id="col-andamento">
            <div className="bg-[#3182ce] text-white px-5 py-2.5 rounded-2xl font-bold font-display text-center text-[13px] tracking-wide mb-4 shadow-sm select-none">
              Em Andamento
            </div>
            <div className="space-y-4 flex-1">
              {aTasks.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs font-medium">
                  Nenhuma operacional de momento
                </div>
              ) : (
                aTasks.map((task) => {
                  const assigned = collaborators.find(c => c.id === task.assignedId);
                  const displayProgress = task.progress !== undefined ? task.progress : 50;
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleEditTaskClick(task)}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                    >
                      <h4 className="font-bold text-slate-800 font-display text-sm leading-snug mb-1 text-left">
                        {task.title}
                      </h4>
                      <p className="text-[11px] font-mono font-medium text-slate-400 mb-2.5">
                        ID: uuid-{task.id}
                      </p>
                      
                      <div className="space-y-1.5 text-left text-xs mb-3">
                        <div className="text-slate-500 font-medium">
                          <span className="text-slate-400">Assigned:</span> {assigned ? assigned.name : "Sem responsável"}
                        </div>
                        <div className="text-slate-500 flex items-wrap items-center gap-1.5">
                          <span className="text-slate-400">Sentimento:</span> 
                          <span className={getSentimentStyles(task.sentimentType)}>
                            {task.sentimentType}
                          </span>
                          <span className="text-slate-600 block sm:inline">
                            - {task.sentimentText}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3.5 space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                          <span className="text-[9px] uppercase tracking-wide text-slate-400">Progress</span>
                          <span>{displayProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${displayProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick action buttons */}
                      <div className="border-t border-slate-100 mt-2.5 pt-2 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusChange(task, "pendente");
                          }}
                          className="text-[10px] bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold px-2 py-0.5 rounded"
                        >
                          ← Voltar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusChange(task, "concluido");
                          }}
                          className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-semibold px-2 py-0.5 rounded"
                        >
                          Finalizar ✓
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column Concluído */}
          <div className="flex flex-col min-h-[450px]" id="col-concluido">
            <div className="bg-[#38a169] text-white px-5 py-2.5 rounded-2xl font-bold font-display text-center text-[13px] tracking-wide mb-4 shadow-sm select-none">
              Concluído
            </div>
            <div className="space-y-4 flex-1">
              {cTasks.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs font-medium">
                  Nenhuma conclusão ainda
                </div>
              ) : (
                cTasks.map((task) => {
                  const assigned = collaborators.find(c => c.id === task.assignedId);
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleEditTaskClick(task)}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                    >
                      <h4 className="font-bold text-slate-800 font-display text-sm leading-snug mb-1 text-left">
                        {task.title}
                      </h4>
                      <p className="text-[11px] font-mono font-medium text-slate-400 mb-2.5">
                        ID: uuid-{task.id}
                      </p>
                      
                      <div className="space-y-1.5 text-left text-xs mb-3">
                        <div className="text-slate-500 font-medium">
                          <span className="text-slate-400">Assigned:</span> {assigned ? assigned.name.replace(/ \(Você\)/, "") : "Carlos"}
                        </div>
                        <div className="text-slate-500 flex items-wrap items-center gap-1.5">
                          <span className="text-slate-400">Sentimento:</span> 
                          <span className={getSentimentStyles(task.sentimentType)}>
                            {task.sentimentType}
                          </span>
                          <span className="text-slate-600 block sm:inline">
                            - {task.sentimentText}
                          </span>
                        </div>
                      </div>

                      {/* Quick actions status change */}
                      <div className="border-t border-slate-100 pt-2.5 flex justify-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickStatusChange(task, "em_andamento");
                          }}
                          className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2 py-0.5 rounded"
                        >
                          ← Reabrir Tarefa
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Board Right Sidebar containing Event Details matching Mockup */}
      <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between mt-6 lg:mt-0" id="board-right-panel">
        <div className="space-y-6">
          
          {/* Header Title Event */}
          <div className="border-b border-slate-100 pb-4 text-left">
            <h3 className="text-lg font-display font-bold text-slate-900 tracking-tight">
              {activeEvent.title}
            </h3>
          </div>

          {/* Organizador Section */}
          <div className="text-left space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Organizador</div>
            <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-2xl p-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <img 
                  src={eventOrganizer?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop"} 
                  alt="Organizer Avatar" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <span className="text-xs font-bold text-slate-700">
                  {eventOrganizer?.name || "Fulano de Tal (Você)"}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1" title="Visualizar informações do organizador">
                <Info className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Data Section */}
          <div className="text-left space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data</div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                {formatDateRange(activeEvent.startDate, activeEvent.endDate)}
              </span>
            </div>
          </div>

          {/* Colaboradores Section */}
          <div className="text-left space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Colaboradores</div>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {collaborators.map((member) => (
                <div key={member.id} className="flex items-center gap-2.5">
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100" 
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    {member.name.replace(/ \(Você\)/, "")} <span className="text-slate-400 font-mono">({member.role})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Buttons pane */}
        <div className="space-y-2.5 pt-6 mt-6 border-t border-slate-100">
          <button 
            onClick={() => setShowNewTaskModal(true)}
            id="btn-new-task"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            id="btn-invite-collaborator"
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-2xs active:scale-95"
          >
            Convidar Colaborador
          </button>
        </div>
      </div>

      {/* --- POPUP MODAL: CREATE NEW TASK --- */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-new-task">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button 
              onClick={() => setShowNewTaskModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Criar Nova Tarefa
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Título da Tarefa</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Configurar Ambiente Docker" 
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Coluna Ativa</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Responsável</label>
                  <select 
                    value={newAssignedId} 
                    onChange={(e) => setNewAssignedId(e.target.value)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    required
                  >
                    <option value="">Selecione...</option>
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newStatus === "em_andamento" && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Progresso Atual ({newProgress || 50}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={newProgress === "" ? 50 : newProgress} 
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sentimento Coletivo</label>
                    <select 
                      value={newSentimentType} 
                      onChange={(e) => setNewSentimentType(e.target.value as any)}
                      className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    >
                      <option value="Focado">Focado</option>
                      <option value="Ansioso">Ansioso</option>
                      <option value="Desafiado">Desafiando</option>
                      <option value="Desafiada">Desafiada</option>
                      <option value="Satisfeito">Satisfeito</option>
                      <option value="Animado">Animado</option>
                      <option value="Neutro">Neutro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Descrição do Sentimento / Status</label>
                  <input 
                    type="text" 
                    value={newSentimentText} 
                    onChange={(e) => setNewSentimentText(e.target.value)}
                    placeholder="Ex: Prazo apertado, mas animado!" 
                    className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL: INVITE COLLABORATOR --- */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-invite">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Convidar Colaborador
            </h3>

            <form onSubmit={handleInviteCollaborator} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome do Colaborador</label>
                <input 
                  type="text" 
                  value={inviteName} 
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ex: Juliana Santos" 
                  className="w-full border border-slate-250 bg-white hover:border-slate-400 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cargo / Permissão</label>
                <select 
                  value={inviteRole} 
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                >
                  <option value="editor">Editor (pode criar e modificar tarefas)</option>
                  <option value="visualizador">Visualizador (pode ver painel e relatórios)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-500 border border-slate-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>
                  O novo colaborador receberá as permissões de acesso ao workspace e será listado nas atribuições de tarefas corporativas do <strong>{activeEvent.title}</strong> instantaneamente.
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
                  Convidar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL: EDIT TASK DETAILS --- */}
      {showEditTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="modal-edit-task">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-150 p-6 relative animate-in fade-in zoom-in duration-200 text-left">
            <button 
              onClick={() => {
                setShowEditTaskModal(false);
                setSelectedTask(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              Editar Detalhes da Tarefa
            </h3>

            <form onSubmit={handleSaveEditTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Título da Tarefa</label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-slate-250 bg-white focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status (Coluna)</label>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Responsável</label>
                  <select 
                    value={editAssignedId} 
                    onChange={(e) => setEditAssignedId(e.target.value)}
                    className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    required
                  >
                    {collaborators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {editStatus === "em_andamento" && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Progresso Atual ({editProgress === "" ? 50 : editProgress}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={editProgress === "" ? 50 : editProgress} 
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sentimento de Equipe</label>
                    <select 
                      value={editSentimentType} 
                      onChange={(e) => setEditSentimentType(e.target.value as any)}
                      className="w-full border border-slate-250 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                    >
                      <option value="Focado">Focado</option>
                      <option value="Ansioso">Ansioso</option>
                      <option value="Desafiado">Desafiando</option>
                      <option value="Desafiada">Desafiada</option>
                      <option value="Satisfeito">Satisfeito</option>
                      <option value="Animado">Animado</option>
                      <option value="Neutro">Neutro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Esclarecimentos de Ajuste</label>
                  <input 
                    type="text" 
                    value={editSentimentText} 
                    onChange={(e) => setEditSentimentText(e.target.value)}
                    className="w-full border border-slate-250 bg-white focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold rounded-xl text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Deleta Tarefa
                </button>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEditTaskModal(false);
                      setSelectedTask(null);
                    }}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Mudar Nada
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                  >
                    Salvar Ajustes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
