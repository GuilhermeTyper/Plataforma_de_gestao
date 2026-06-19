import React, { useState } from "react";
import { Bell, Menu, User, Sparkles, CheckSquare, MessageSquare } from "lucide-react";
import { Collaborator } from "../types.js";

interface TopbarProps {
  currentUser: Collaborator;
  activeTabLabel: string;
}

export default function Topbar({ currentUser, activeTabLabel }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock server status / notifications matching the theme
  const notifications = [
    {
      id: "1",
      title: "Nova tarefa atribuída",
      desc: "João atribuiu 'Design do Banco De Dados' a você",
      time: "Agora mesmo",
      type: "task",
    },
    {
      id: "2",
      title: "Desafio na equipe",
      desc: "Maria sinalizou sentimento 'Desafiada' em 'Integrar Axios'",
      time: "Há 10 min",
      type: "sentiment",
    },
    {
      id: "3",
      title: "Parabéns!",
      desc: "Carlos completou 'Modelar Banco PostgreSQL'",
      time: "Há 1 hora",
      type: "success",
    },
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs" id="app-topbar">
      {/* Left title and hamburger */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100" id="btn-mobile-menu">
          <Menu className="w-5.5 h-5.5" />
        </button>
        <span className="font-display font-bold text-lg md:text-xl text-slate-800 tracking-tight" id="topbar-logo-title">
          Gestão de Eventos Colaborativos
        </span>
      </div>

      {/* Right side utils */}
      <div className="flex items-center gap-4">
        {/* Active tab label pill (desktop only) */}
        <span className="hidden leading-none sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-100 rounded-full">
          <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
          Modo: {activeTabLabel}
        </span>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors duration-150"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1 origin-top-right transition-all">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Sinalizações Recentes</span>
                <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">3 Novas</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5">
                    <div className="mt-0.5">
                      {n.type === "task" ? (
                        <CheckSquare className="w-4 h-4 text-blue-500" />
                      ) : n.type === "sentiment" ? (
                        <MessageSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            id="btn-profile"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 focus:outline-hidden"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8.5 h-8.5 rounded-full object-cover ring-2 ring-slate-100 hover:ring-blue-100 transition-all cursor-pointer"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] font-mono font-medium text-slate-500 capitalize">{currentUser.role}</p>
              </div>
              <div className="p-1 mt-1 text-slate-600 text-xs">
                <div className="p-2 font-medium text-slate-400 select-none text-[10px]">PREFERÊNCIAS</div>
                <div className="p-2 flex justify-between items-center rounded-lg hover:bg-slate-50 cursor-pointer">
                  <span>Tema</span>
                  <span className="font-bold text-slate-700">Light</span>
                </div>
                <div className="p-2 flex justify-between items-center rounded-lg hover:bg-slate-50 cursor-pointer">
                  <span>Idioma</span>
                  <span className="font-bold text-slate-700">Português (BR)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
