const TASKS_STORAGE_KEY = "planificador_tareas";

class Task {
  constructor(id, nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.asignadoA = asignadoA;
    this.fechaDeEntrega = fechaDeEntrega;
    this.estado = estado;
  }
}

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();

    // Evita reutilizar un ID que ya existe.
    this.nextId =
      this.tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
  }

  loadTasks() {
    try {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = savedTasks ? JSON.parse(savedTasks) : [];

      if (!Array.isArray(tasks)) {
        return [];
      }

      return tasks.filter(
        (task) => Number.isInteger(task.id) && typeof task.nombre === "string",
      );
    } catch (error) {
      console.error("No se pudieron cargar las tareas:", error);
      return [];
    }
  }

  saveTasks() {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks));
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getTasksWithStatus(status) {
    return this.tasks.filter((task) => task.estado === status);
  }

  addTask(task) {
    const estadosValidos = ["POR HACER", "EN PROCESO", "REVISIÓN", "HECHO"];

    if (!estadosValidos.includes(task.estado)) {
      throw new Error("El estado de la tarea no es válido.");
    }

    const nuevaTarea = new Task(
      this.nextId++,
      task.nombre,
      task.descripcion,
      task.asignadoA,
      task.fechaDeEntrega,
      task.estado,
    );

    nuevaTarea.usuario = task.usuario || "";
    nuevaTarea.categoria = task.categoria || "";

    this.tasks.push(nuevaTarea);
    this.saveTasks();

    return nuevaTarea;
  }

  deleteTask(taskId) {
    const id = Number(taskId);
    const cantidadAnterior = this.tasks.length;

    this.tasks = this.tasks.filter((task) => task.id !== id);

    if (this.tasks.length === cantidadAnterior) {
      return false;
    }

    this.saveTasks();
    return true;
  }

  createTaskCard(task) {
    const columna = document.createElement("div");
    columna.className = "col";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100 shadow-sm";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const titulo = document.createElement("h5");
    titulo.className = "card-title fw-bold";
    titulo.textContent = task.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text text-secondary";
    descripcion.textContent = task.descripcion;

    const asignados = document.createElement("p");
    asignados.className = "mb-2";
    asignados.textContent = `Asignado a: ${task.asignadoA}`;

    const fecha = document.createElement("p");
    fecha.className = "mb-2";
    fecha.textContent = `Fecha de entrega: ${task.fechaDeEntrega}`;

    const estado = document.createElement("span");
    const clasesEstado = {
      "POR HACER": "text-bg-warning",
      "EN PROCESO": "text-bg-primary",
      REVISIÓN: "text-bg-info",
      HECHO: "text-bg-success",
    };

    estado.className = `badge rounded-pill align-self-start ${clasesEstado[task.estado] || "text-bg-secondary"}`;
    estado.textContent = task.estado;

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-outline-danger btn-sm mt-auto pt-2";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.setAttribute("aria-label", `Eliminar tarea ${task.nombre}`);

    botonEliminar.addEventListener("click", () => {
      const eliminada = this.deleteTask(task.id);

      if (eliminada) {
        columna.remove();
        console.log("Tarea eliminada. ID:", task.id);
        console.log("Tareas restantes:", this.getAllTasks());
      }
    });

    cuerpo.append(titulo, descripcion, asignados, fecha, estado);

    estado.classList.add("mb-3");

    cuerpo.appendChild(botonEliminar);

    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
  }
}
