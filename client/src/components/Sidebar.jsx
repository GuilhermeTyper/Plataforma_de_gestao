import React from "react";
import { CalendarDays, ListTodo, Users, BarChart3 } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onlineCount }) {
  const menuItems = [
    { id: "eventos", label: "Eventos", icon: CalendarDays },
    { id: "minhas_tarefas", label: "Minhas Tarefas", icon: ListTodo },
    { id: "equipe", label: "Equipe", icon: Users },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen flex flex-col justify-between hidden md:flex" id="app-sidebar">
      <div>
        {/* Navigation Section */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold font-display text-sm shadow-sm">
              GE
            </div>
            <div>
              <h1 className="font-display font-bold text-sm text-slate-800 tracking-tight">ColabEventos</h1>
              <span className="text-[10px] text-slate-500 font-mono">WORKSPACE ATIVO</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5" id="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? "bg-slate-200/80 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <IconComponent className={`w-4.5 h-4.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Servidor Online</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {onlineCount} Colabs
          </span>
        </div>
      </div>
    </aside>
  );
}
