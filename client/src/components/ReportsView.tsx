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
import { Task, Collaborator } from "../types.js";
import { BarChart3, TrendingUp, AlertTriangle, Smile, ShieldAlert } from "lucide-react";

interface ReportsViewProps {
  tasks: Task[];
  collaborators: Collaborator[];
}

export default function ReportsView({ tasks, collaborators }: ReportsViewProps) {
  // 1. Calculate status distribution
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, { pendente: 0, em_andamento: 0, concluido: 0 });

  const statusData = [
    { name: "Pendente", value: statusCounts.pendente, color: "#a0aec0" },
    { name: "Em Andamento", value: statusCounts.em_andamento, color: "#3182ce" },
    { name: "Concluído", value: statusCounts.concluido, color: "#38a169" },
  ].filter(d => d.value > 0);

  // 2. Calculate sentiment distribution
  const sentimentCounts = tasks.reduce((acc, t) => {
    acc[t.sentimentType] = (acc[t.sentimentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => {
    let color = "#718096";
    if (sentiment === "Ansioso") color = "#dd6b20";
    else if (sentiment.startsWith("Desafiad")) color = "#e53e3e";
    else if (sentiment === "Focado") color = "#3182ce";
    else if (sentiment === "Satisfeito") color = "#38a169";
    else if (sentiment === "Animado") color = "#319795";
    
    return { name: sentiment, quantidade: count, color };
  });

  // 3. Task distribution per Collaborator
  const workDistribution = collaborators.map(c => {
    const total = tasks.filter(t => t.assignedId === c.id).length;
    const completed = tasks.filter(t => t.assignedId === c.id && t.status === "concluido").length;
    return {
      name: c.name.replace(/ \(Você\)/, ""),
      Tarefas: total,
      Concluídas: completed
    };
  });

  return (
    <div className="p-6 flex-1 bg-slate-50 overflow-y-auto" id="reports-view-container">
      
      {/* Header section */}
      <div className="text-left mb-6" id="reports-header">
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Painel de Métricas Colaborativas</h2>
        <p className="text-xs text-slate-500 font-medium">Acompanhe estatísticas de produtividade das tarefas e sinta a moderação de sentimentos gerais da sua equipe em tempo real.</p>
      </div>

      {/* Metrics indicators overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left" id="reports-stats-cards">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total de Tarefas</span>
            <div className="text-2xl font-display font-bold text-slate-800">{tasks.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Taxa de Conclusão</span>
            <div className="text-2xl font-display font-bold text-slate-800">
              {tasks.length > 0 ? Math.round((statusCounts.concluido / tasks.length) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sinalização de Desafio</span>
            <div className="text-2xl font-display font-bold text-slate-800">
              {sentimentCounts["Desafiada"] || sentimentCounts["Desafiado"] || 0} Membros
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left" id="reports-charts-grid">
        
        {/* Pie Chart Status */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Distribuição do Kanban</h3>
          <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
            <div className="w-48 h-48">
              {statusData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Sem dados</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tarefas`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-2 mt-4 sm:mt-0 text-xs font-medium">
              {statusData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600">{d.name}:</span>
                  <strong className="text-slate-800">{d.value} ({Math.round((d.value / tasks.length) * 100)}%)</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart Sentiments */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Status de Sentimento do Time</h3>
          <div className="h-64">
            {sentimentData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Nenhum sentimento reportado</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(241, 245, 249, 0.4)" }} />
                  <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Work distribution chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs lg:col-span-2">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Volume de Demandas por Colaborador</h3>
          <div className="h-64">
            {workDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Sem membros</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
                  <Bar dataKey="Tarefas" fill="#3182ce" radius={[6, 6, 0, 0]} name="Total Atribuídas" />
                  <Bar dataKey="Concluídas" fill="#38a169" radius={[6, 6, 0, 0]} name="Concluídas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
