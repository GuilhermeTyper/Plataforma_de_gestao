import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// In-memory Database
let collaborators = [
  {
    id: "colab-me",
    name: "Fulano de Tal (Você)",
    role: "organizador",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "colab-maria",
    name: "Maria",
    role: "editor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "colab-carlos",
    name: "Carlos",
    role: "visualizador",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop"
  },
  {
    id: "colab-joao",
    name: "João",
    role: "editor",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=128&auto=format&fit=crop"
  }
];

let events = [
  {
    id: "event-1",
    title: "Workshop de React",
    organizerId: "colab-me",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    description: "Um workshop colaborativo focado no desenvolvimento moderno em React e Tailwind."
  },
  {
    id: "event-2",
    title: "Hackathon de Inovação",
    organizerId: "colab-maria",
    startDate: "2026-06-20",
    endDate: "2026-06-22",
    description: "Maratona intensa de programação para criar soluções web que solucionam desafios locais."
  },
  {
    id: "event-3",
    title: "Lançamento do Portal",
    organizerId: "colab-joao",
    startDate: "2026-07-01",
    endDate: "2026-07-02",
    description: "Alinhamento das fases finais e lançamento oficial do portal corporativo de serviços."
  }
];

let tasks = [
  {
    id: "task-1",
    title: "Configurar Ambiente Docker",
    status: "pendente",
    assignedId: "colab-joao",
    sentimentType: "Ansioso",
    sentimentText: "Prazo apertado, mas animado!",
    eventId: "event-1"
  },
  {
    id: "task-2",
    title: "Desenvolver API Laravel",
    status: "em_andamento",
    assignedId: "colab-me",
    sentimentType: "Focado",
    sentimentText: "Estruturando os endpoints primordiais.",
    progress: 50,
    eventId: "event-1"
  },
  {
    id: "task-3",
    title: "Integrar Axios no React",
    status: "em_andamento",
    assignedId: "colab-maria",
    sentimentType: "Desafiada",
    sentimentText: "CORS está dando erro, preciso de ajuda.",
    eventId: "event-1"
  },
  {
    id: "task-4",
    title: "Modelar Banco PostgreSQL",
    status: "concluido",
    assignedId: "colab-carlos",
    sentimentType: "Satisfeito",
    sentimentText: "DER pronto e validado em português.",
    eventId: "event-1"
  },
  {
    id: "task-5",
    title: "Configurar Servidores de Monitoria",
    status: "pendente",
    assignedId: "colab-joao",
    sentimentType: "Desafiada",
    sentimentText: "Ajustando as chaves SSH adicionais.",
    eventId: "event-1"
  },
  {
    id: "task-6",
    title: "Definir Temas e Regras",
    status: "concluido",
    assignedId: "colab-maria",
    sentimentType: "Satisfeito",
    sentimentText: "Regulamento concluído.",
    eventId: "event-2"
  },
  {
    id: "task-7",
    title: "Configurar Servidor de Discord",
    status: "em_andamento",
    assignedId: "colab-joao",
    sentimentType: "Focado",
    sentimentText: "Canais e bots de integração prontos.",
    progress: 75,
    eventId: "event-2"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // === API ENDPOINTS ===

  // Greet / Health
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Events API
  app.get("/api/events", (_req, res) => {
    res.json(events);
  });

  app.post("/api/events", (req, res) => {
    const { title, startDate, endDate, description, organizerId } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Campos obrigatórios: title, startDate, endDate" });
    }
    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      organizerId: organizerId || "colab-me",
      startDate,
      endDate,
      description: description || "Sem descrição adicional."
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

  // Get specific event details
  app.get("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id === id);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }
    res.json(event);
  });

  // Collaborators API
  app.get("/api/collaborators", (_req, res) => {
    res.json(collaborators);
  });

  app.post("/api/collaborators", (req, res) => {
    const { name, role, avatarUrl } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: "Campos obrigatórios: name, role" });
    }
    const newColab = {
      id: `colab-${Date.now()}`,
      name,
      role: role,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };
    collaborators.push(newColab);
    res.status(201).json(newColab);
  });

  // Tasks API
  app.get("/api/tasks", (req, res) => {
    const { eventId } = req.query;
    if (eventId) {
      res.json(tasks.filter(t => t.eventId === eventId));
    } else {
      res.json(tasks);
    }
  });

  app.post("/api/tasks", (req, res) => {
    const { title, status, assignedId, sentimentType, sentimentText, progress, eventId } = req.body;
    if (!title || !eventId || !assignedId) {
      return res.status(400).json({ error: "Campos obrigatórios: title, eventId, assignedId" });
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title,
      status: status || "pendente",
      assignedId,
      sentimentType: sentimentType || "Focado",
      sentimentText: sentimentText || "Novas atribuições.",
      progress: progress !== undefined ? Number(progress) : undefined,
      eventId
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  // Update a task (status change, editing details, progress slider)
  app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    const currentTask = tasks[taskIndex];
    const { title, status, assignedId, sentimentType, sentimentText, progress } = req.body;

    const updatedTask = {
      ...currentTask,
      title: title !== undefined ? title : currentTask.title,
      status: status !== undefined ? status : currentTask.status,
      assignedId: assignedId !== undefined ? assignedId : currentTask.assignedId,
      sentimentType: sentimentType !== undefined ? sentimentType : currentTask.sentimentType,
      sentimentText: sentimentText !== undefined ? sentimentText : currentTask.sentimentText,
      progress: progress !== undefined ? (progress === null ? undefined : Number(progress)) : currentTask.progress
    };

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  });

  // Delete task
  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    const deleted = tasks.splice(taskIndex, 1)[0];
    res.json(deleted);
  });

  // === VITE / STATIC MIDDLEWARE ===

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
