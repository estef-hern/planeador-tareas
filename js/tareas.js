document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-tareas");

  const contenedorCompletadas = document.getElementById(
    "contenedor-completadas",
  );
  let filtroActual = "TODAS";
  let filtroTiempo = "TODOS";

  if (!contenedor || !contenedorCompletadas) {
    console.error("No se encontraron los contenedores de tareas.");
    return;
  }

  const taskManager = new TaskManager();
  window.taskManager = taskManager;
  taskManager.seedExampleTasks();

// ACCESO RÁPIDO A LAS TAREAS

document.getElementById("btn-pendientes").addEventListener("click", () => {
  document.getElementById("contenedor-tareas").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("btn-completadas").addEventListener("click", () => {
  document.getElementById("contenedor-completadas").scrollIntoView({
    behavior: "smooth"
  });
});

  function filtrarPorTiempo(fechaEntrega) {
    if (!fechaEntrega) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [anio, mes, dia] = fechaEntrega.split("-").map(Number);

    const fechaTarea = new Date(anio, mes - 1, dia);
    fechaTarea.setHours(0, 0, 0, 0);

    if (filtroTiempo === "HOY") {
      return fechaTarea.getTime() === hoy.getTime();
    }

    if (filtroTiempo === "SEMANA") {
      const diaSemana = hoy.getDay();

      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

      const domingo = new Date(lunes);
      domingo.setDate(lunes.getDate() + 6);

      return fechaTarea >= lunes && fechaTarea <= domingo;
    }

    if (filtroTiempo === "MES") {
      return (
        fechaTarea.getMonth() === hoy.getMonth() &&
        fechaTarea.getFullYear() === hoy.getFullYear()
      );
    }

    return true;
  }

  function renderTasks() {
    const tareas = taskManager.getAllTasks();

    // Separar tareas pendientes y completadas
    const tareasPendientes = tareas.filter((tarea) => tarea.estado !== "HECHO");

    const tareasCompletadas = tareas.filter(
      (tarea) => tarea.estado === "HECHO",
    );

    // ACTUALIZAR CONTADORES
document.getElementById("total-pendientes").textContent =
  tareasPendientes.length;

document.getElementById("total-completadas").textContent =
  tareasCompletadas.length;

   const tareasFiltradas = tareasPendientes
  .filter((tarea) => {
    const estadoVisible = taskManager.getTaskDisplayStatus(tarea);
    const coincideEstado =
      filtroActual === "TODAS" || estadoVisible === filtroActual;
    const coincideTiempo = filtrarPorTiempo(tarea.fechaDeEntrega);

    return coincideEstado && coincideTiempo;
  })
  .sort((a, b) => {
    return a.fechaDeEntrega.localeCompare(b.fechaDeEntrega);
  });

    // Limpiar contenedores
    contenedor.replaceChildren();
    contenedorCompletadas.replaceChildren();

    // Mostrar tareas pendientes filtradas
    if (tareasFiltradas.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.className = "text-secondary text-center py-4";
      mensaje.textContent = "No hay tareas para este filtro.";
      contenedor.appendChild(mensaje);
    } else {
      tareasFiltradas.forEach((tarea) => {
        const tarjeta = taskManager.createTaskCard(tarea);
        contenedor.appendChild(tarjeta);
      });
    }

    // Mostrar tareas completadas en su contenedor independiente
    if (tareasCompletadas.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.className = "text-secondary text-center py-4";
      mensaje.textContent = "Todavía no tienes tareas completadas.";
      contenedorCompletadas.appendChild(mensaje);
    } else {
      tareasCompletadas.forEach((tarea) => {
        const tarjeta = taskManager.createTaskCard(tarea);
        contenedorCompletadas.appendChild(tarjeta);
      });
    }
  }

  // EVENTOS DE LOS FILTROS POR ESTADO
  const botonesFiltro = document.querySelectorAll(".filtro-btn");

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filtro;

    botonesFiltro.forEach((btn) => {
      btn.classList.remove("active");
    });

    boton.classList.add("active");

    renderTasks();
  });
});

  // EVENTOS DE LOS FILTROS POR TIEMPO
  const botonesTiempo = document.querySelectorAll(".filtro-tiempo");

botonesTiempo.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroTiempo = boton.dataset.tiempo;

    botonesTiempo.forEach((btn) => {
      btn.classList.remove("active");
    });

    boton.classList.add("active");

    renderTasks();
  });
});

  // Mostrar modal de visualización
  window.abrirModalVer = function (id) {
    const tarea = taskManager.getTaskById(id);

    if (!tarea) return;

    document.getElementById("verNombre").textContent = tarea.nombre;
    document.getElementById("verDescripcion").textContent = tarea.descripcion;
    document.getElementById("verAsignado").textContent = tarea.asignadoA;
    document.getElementById("verFecha").textContent = tarea.fechaDeEntrega;
    document.getElementById("verEstado").textContent =
      taskManager.getTaskDisplayStatus(tarea);
   document.getElementById("verCategoria").textContent =
  tarea.categoria
    ? tarea.categoria.charAt(0).toUpperCase() + tarea.categoria.slice(1)
    : "Sin categoría";


    console.log("Bootstrap:", bootstrap);
    console.log("Modal:", bootstrap.Modal);

    const modalElemento = document.getElementById("modalVerTarea");

    console.log("Elemento modal:", modalElemento);
    console.log("HTML del modal:", modalElemento?.outerHTML);

    const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

    modal.show();
  };

  // Mostrar modal de edición
  window.abrirModalEditar = function (id) {
    const tarea = taskManager.getTaskById(id);

    if (!tarea) return;

    document.getElementById("editarId").value = tarea.id;
    document.getElementById("editarNombre").value = tarea.nombre;
    document.getElementById("editarDescripcion").value = tarea.descripcion;
    document.getElementById("editarAsignado").value = tarea.asignadoA;
    const hoy = new Date();
const fechaMinima = [
  hoy.getFullYear(),
  String(hoy.getMonth() + 1).padStart(2, "0"),
  String(hoy.getDate()).padStart(2, "0"),
].join("-");

document.getElementById("editarFecha").min = fechaMinima;
    document.getElementById("editarFecha").value = tarea.fechaDeEntrega;
    document.getElementById("editarEstado").value = tarea.estado;
    document.getElementById("editarCategoria").value =
  tarea.categoria
    ? tarea.categoria.charAt(0).toUpperCase() + tarea.categoria.slice(1)
    : "";
    
    const modalElemento = document.getElementById("modalEditarTarea");

    const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

    modal.show();
  };

  // Guardar cambios de edición
  document
    .getElementById("formEditarTarea")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const id = Number(document.getElementById("editarId").value);
      const tarea = taskManager.getTaskById(id);

      if (!tarea) return;

      const nuevoEstado = document.getElementById("editarEstado").value;

      if (tarea.estado !== "HECHO" && nuevoEstado === "HECHO") {
        tarea.estadoAnterior = tarea.estado;
      } else if (tarea.estado === "HECHO" && nuevoEstado !== "HECHO") {
        tarea.estadoAnterior = nuevoEstado;
      } else if (nuevoEstado !== "HECHO") {
        tarea.estadoAnterior = nuevoEstado;
      }

      tarea.nombre = document.getElementById("editarNombre").value.trim();
      tarea.descripcion = document
        .getElementById("editarDescripcion")
        .value.trim();
      tarea.asignadoA = document.getElementById("editarAsignado").value.trim();
      tarea.fechaDeEntrega = document.getElementById("editarFecha").value;
      tarea.estado = nuevoEstado;
      tarea.categoria = document.getElementById("editarCategoria").value.trim();
      
      taskManager.saveTasks();
      renderTasks();

      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarTarea"),
      ).hide();
    });

  renderTasks();
  // ABRIR AUTOMÁTICAMENTE LA TAREA SELECCIONADA
const parametrosURL = new URLSearchParams(window.location.search);
const tareaId = parametrosURL.get("id");

if (tareaId) {
    const tarea = taskManager.getTaskById(tareaId);

    if (tarea) {
        window.abrirModalVer(tarea.id);
    }
}
  //revisar las fechas de entrega a cada minuto
  setInterval(() => {
    renderTasks();
  }, 60000);

  document.addEventListener("click", (event) => {
    const boton = event.target.closest(".done-button");

    if (!boton) return;

    const tarjeta = boton.closest("[data-task-id]");

    if (!tarjeta) return;

    const taskId = Number(tarjeta.dataset.taskId);
    const tarea = taskManager.getTaskById(taskId);

    if (!tarea) return;

    if (tarea.estado !== "HECHO") {
      tarea.estadoAnterior = tarea.estado;
      tarea.estado = "HECHO";
    } else {
      tarea.estado = tarea.estadoAnterior || "POR HACER";
    }

    taskManager.saveTasks();
    renderTasks();
  });
});
