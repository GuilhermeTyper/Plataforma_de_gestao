import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Sparkles, Smile, CheckSquare } from "lucide-react";

export default function ReportsView({ tasks, collaborators }) {
  // 1. Calculate status distribution metrics
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter(t => t.status === "pendente").length;
  const inProgressCount = tasks.filter(t => t.status === "em_andamento").length;
  const completedCount = tasks.filter(t => t.status === "concluido").length;

  const statusData = [
    { name: "Pendente", valor: pendingCount },
    { name: "Em Andamento", valor: inProgressCount },
    { name: "Concluído", valor: completedCount },
  ];

  // Colors matching the dashboard columns
  const STATUS_COLORS = ["#a0aec0", "#3182ce", "#38a169"];

  // 2. Sentiment distribution calculation
  const sentimentMap = {};
  tasks.forEach((task) => {
    const s = task.sentimentType || "Neutro";
    sentimentMap[s] = (sentimentMap[s] || 0) + 1;
  });

  const sentimentData = Object.keys(sentimentMap).map(key => ({
    name: key,
    Quantidade: sentimentMap[key]
  }));

  const SENTIMENT_COLORS = {
    Ansioso: "#d69e2e",    // amber
    Desafiado: "#e53e3e",  // red/rose
    Desafiada: "#e53e3e",  // red/rose
    Focado: "#3182ce",     // blue
    Satisfeito: "#38a169", // green
    Animado: "#319795",    // teal
    Neutro: "#718096"      // slate
  };

  // 3. Team contribution metric (tasks per collaborator)
  const contributorMap = {};
  collaborators.forEach(c => {
    contributorMap[c.name] = { total: 0, completed: 0 };
  });

  tasks.forEach((task) => {
    const assigned = collaborators.find(c => c.id === task.assignedId);
    if (assigned) {
      if (!contributorMap[assigned.name]) {
        contributorMap[assigned.name] = { total: 0, completed: 0 };
      }
      contributorMap[assigned.name].total += 1;
      if (task.status === "concluido") {
        contributorMap[assigned.name].completed += 1;
      }
    }
  });

  const contributionData = Object.keys(contributorMap).map(name => ({
    name: name.replace(/ \(Você\)/, ""),
    "Total Atribuído": contributorMap[name].total,
    "Completado": contributorMap[name].completed
  }));

  return (
    <div className="flex-1 bg-slate-50/50 p-4 md:p-6 text-left" id="reports-view-container">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Relatório Operacional
        </h2>
        <p className="text-slate-500 text-xs mt-1">Monitore o progresso do evento ativo, métricas de produtividade e humor da equipe.</p>
      </div>

      {/* Basic Metrics Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Tarefas</span>
          <span className="text-2xl font-bold text-slate-800 font-display mt-1 block">{totalTasks}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Concluídas</span>
          <span className="text-2xl font-bold text-emerald-600 font-display mt-1 block">{completedCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Em Andamento</span>
          <span className="text-2xl font-bold text-blue-600 font-display mt-1 block">{inProgressCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Percentual Conclusão</span>
          <span className="text-2xl font-bold text-slate-800 font-display mt-1 block">
            {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Main Charts Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Status Distribution (Pie Chart) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm font-display">Distribuição de Status</h3>
          </div>
          <div className="h-64 flex justify-center items-center">
            {totalTasks === 0 ? (
              <p className="text-xs text-slate-400">Nenhum dado disponível</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefas`, "Quantidade"]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sentiment Analysis (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Smile className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm font-display">Sinalizações de Sentimento da Equipe</h3>
          </div>
          <div className="h-64">
            {sentimentData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-400">Nenhum sentimento sinalizado no momento</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Quantidade" radius={[6, 6, 0, 0]}>
                    {sentimentData.map((entry, index) => {
                      const color = SENTIMENT_COLORS[entry.name] || "#718096";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Contribution Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs xl:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm font-display">Contribuição Individual por Colaborador</h3>
          </div>
          <div className="h-64">
            {contributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-400">Nenhum dado disponível</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total Atribuído" fill="#3182ce" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completado" fill="#38a169" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
