const TASKS_STORAGE_KEY = "planificador_tareas";

class Task {
  constructor(id, nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.asignadoA = asignadoA;
    this.fechaDeEntrega = fechaDeEntrega;
    this.estado = estado;
    this.estadoAnterior = estado;
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

      return tasks
        .filter(
          (task) =>
            Number.isInteger(task.id) && typeof task.nombre === "string",
        )
        .map((task) => {
          if (task.estado === "HECHO") {
            task.estadoAnterior =
              task.estadoAnterior && task.estadoAnterior !== "HECHO"
                ? task.estadoAnterior
                : "POR HACER";
          } else {
            task.estadoAnterior = task.estado;
          }

          return task;
        });
    } catch (error) {
      console.error("No se pudieron cargar las tareas:", error);
      return [];
    }
  }

  saveTasks() {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks));
  }

  getAllTasks() {
  return this.tasks.filter((task) => !task.eliminada);
}

  getTasksWithStatus(status) {
  return this.tasks.filter(
    (task) => task.estado === status && !task.eliminada
  );
}

  getTaskDisplayStatus(task) {
    // Una tarea completada siempre conserva HECHO.
    if (task.estado === "HECHO") {
      return "HECHO";
    }

    // Obtener la fecha actual en formato YYYY-MM-DD.
    const hoy = new Date();
    const fechaActual = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      String(hoy.getDate()).padStart(2, "0"),
    ].join("-");

    // Comprobar si la fecha de entrega ya pasó.
    if (task.fechaDeEntrega && task.fechaDeEntrega < fechaActual) {
      return "VENCIDA";
    }

    return task.estado;
  }

  getTaskById(id) {
  return this.tasks.find(
    (task) => task.id === Number(id) && !task.eliminada
  );
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

    nuevaTarea.categoria = task.categoria || "";

    this.tasks.push(nuevaTarea);
    this.saveTasks();

    return nuevaTarea;
  }

  deleteTask(taskId) {
  const tarea = this.tasks.find(
    (task) => task.id === Number(taskId) && !task.eliminada
  );

  if (!tarea) return false;

  tarea.eliminada = true;
  tarea.fechaEliminacion = new Date().toISOString();

  this.saveTasks();
  return true;
}

getDeletedTasks() {
  return this.tasks.filter((task) => task.eliminada === true);
}

restoreTask(taskId) {
  const tarea = this.tasks.find(
    (task) => task.id === Number(taskId) && task.eliminada === true
  );

  if (!tarea) return false;

  tarea.eliminada = false;
  delete tarea.fechaEliminacion;

  this.saveTasks();
  return true;
}

permanentlyDeleteTask(taskId) {
  const id = Number(taskId);
  const cantidadAnterior = this.tasks.length;

  this.tasks = this.tasks.filter(
    (task) => !(task.id === id && task.eliminada === true)
  );

  if (this.tasks.length === cantidadAnterior) return false;

  this.saveTasks();
  return true;
}

  createTaskCard(task) {
    const columna = document.createElement("div");
    columna.className = "col";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100 shadow-sm task-card";
    tarjeta.dataset.taskId = task.id;

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column task-card-body";

   // Contenedor superior: título y botones
const encabezado = document.createElement("div");
encabezado.className =
  "d-flex justify-content-between align-items-start gap-2 mb-2";

// Título
const titulo = document.createElement("h5");
titulo.className = "card-title fw-bold mb-0 titulo-tarea";
titulo.textContent = task.nombre;
titulo.title = task.nombre;

// Contenedor de botones
const acciones = document.createElement("div");
acciones.className = "d-flex gap-1 flex-shrink-0";

// Botón ver
const botonVer = document.createElement("button");
botonVer.type = "button";
botonVer.className = "btn btn-sm btn-accion btn-ver-tarea";
botonVer.innerHTML = '<i class="bi bi-eye"></i>';
botonVer.setAttribute("aria-label", "Ver tarea");
botonVer.title = "Ver tarea";

botonVer.addEventListener("click", () => {
  window.abrirModalVer(task.id);
});


// Botón editar
const botonEditar = document.createElement("button");
botonEditar.type = "button";
botonEditar.className = "btn btn-sm btn-accion btn-editar-tarea";
botonEditar.innerHTML = '<i class="bi bi-pencil"></i>';
botonEditar.setAttribute("aria-label", "Editar tarea");
botonEditar.title = "Editar tarea";

botonEditar.addEventListener("click", () => {
  abrirModalEditar(task.id);
});

// Agregar botones al contenedor
acciones.append(botonVer, botonEditar);

// Agregar título y acciones al encabezado
encabezado.append(titulo, acciones);

    const descripcion = document.createElement("p");
descripcion.className = "card-text text-secondary descripcion-tarea";
descripcion.textContent = task.descripcion;
descripcion.title = task.descripcion;

    const asignados = document.createElement("p");
asignados.className = "mb-2 asignados-tarea";

const listaAsignados = Array.isArray(task.asignadoA)
  ? task.asignadoA
  : String(task.asignadoA || "")
      .split(",")
      .map(persona => persona.trim())
      .filter(Boolean);

const visibles = listaAsignados.slice(0, 2);
const restantes = listaAsignados.length - visibles.length;

asignados.textContent = visibles.length > 0
  ? `Asignado a: ${visibles.join(", ")}${restantes > 0 ? ` y ${restantes} más` : ""}`
  : "Sin asignar";

    const fecha = document.createElement("p");
fecha.className = "mb-2";

const fechaFormateada = task.fechaDeEntrega
  ? task.fechaDeEntrega.split("-").reverse().join("-")
  : "Sin fecha";

fecha.textContent = `Fecha de entrega: ${fechaFormateada}`;

    const estado = document.createElement("span");

    // Obtener el estado que corresponde mostrar.
    const estadoActual = this.getTaskDisplayStatus(task);

    const clasesEstado = {
      "POR HACER": "text-bg-warning",
      "EN PROCESO": "text-bg-primary",
      REVISIÓN: "text-bg-info",
      HECHO: "text-bg-success",
      VENCIDA: "text-bg-danger",
    };

    estado.className = `badge rounded-pill align-self-start ${
      clasesEstado[estadoActual] || "text-bg-secondary"
    }`;

    estado.textContent = estadoActual;

    const botonCompletar = document.createElement("button");

    botonCompletar.type = "button";
    botonCompletar.className =
  "btn btn-outline-success btn-sm mb-1 done-button";

    botonCompletar.textContent =
      task.estado === "HECHO" ? "Completada" : "Completar";

    if (task.estado === "HECHO") {
      botonCompletar.addEventListener("mouseenter", () => {
        botonCompletar.textContent = "Deshacer";
      });

      botonCompletar.addEventListener("mouseleave", () => {
        botonCompletar.textContent = "Completada";
      });
    }

    if (task.estado === "HECHO") {
      botonCompletar.style.backgroundColor = "#69BC6A";
      botonCompletar.style.borderColor = "#69BC6A";
      botonCompletar.style.color = "#FFFFFF";
    }

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-accion-eliminar";
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

    cuerpo.append(encabezado, descripcion, asignados, fecha, estado);

    estado.classList.add("mb-3");

    cuerpo.append(botonCompletar, botonEliminar);

    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
  }

  seedExampleTasks() {
    // No agrega ejemplos si ya hay tareas guardadas
    if (this.tasks.length > 0) {
      return;
    }

    const tareasEjemplo = [
      {
        nombre: "Preparación presentación",
        descripcion: "Preparar las diapositivas para la reunión semanal.",
        asignadoA: "María Lira",
        fechaDeEntrega: "2026-11-02",
        estado: "EN PROCESO",
        categoria: "trabajo",
      },
      {
        nombre: "Entregar informe mensual",
        descripcion: "Revisar los resultados y entregar el informe del mes.",
        asignadoA: "Lino Limera",
        fechaDeEntrega: "2026-11-05",
        estado: "POR HACER",
        categoria: "trabajo",
      },
      {
        nombre: "Organizar reunión familiar",
        descripcion: "Coordinar el horario y los detalles de la reunión.",
        asignadoA: "Ani Torres",
        fechaDeEntrega: "2026-11-08",
        estado: "REVISIÓN",
        categoria: "familia",
      },
      {
        nombre: "Completar curso de JavaScript",
        descripcion: "Finalizar los ejercicios del módulo de funciones.",
        asignadoA: "Luis Robles",
        fechaDeEntrega: "2026-11-12",
        estado: "POR HACER",
        categoria: "personal",
      },
      {
        nombre: "Actualizar página web",
        descripcion: "Corregir estilos y revisar el diseño adaptable.",
        asignadoA: "Sofía Ramírez",
        fechaDeEntrega: "2026-10-30",
        estado: "HECHO",
        categoria: "trabajo",
      },
    ];

    tareasEjemplo.forEach((tarea) => this.addTask(tarea));
  }
}
