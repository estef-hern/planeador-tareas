document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-papelera");
  const botonVaciar = document.getElementById("vaciarPapelera");

  const taskManager = new TaskManager();

  function renderPapelera() {

    const tareasEliminadas = taskManager.getDeletedTasks();

    contenedor.replaceChildren();

    botonVaciar.disabled = tareasEliminadas.length === 0;

    if (tareasEliminadas.length === 0) {
      const mensaje = document.createElement("p");

      mensaje.className = "text-secondary text-center py-5";
      mensaje.textContent = "La papelera está vacía.";

      contenedor.appendChild(mensaje);
      return;
    }

    tareasEliminadas.forEach((tarea) => {

      const columna = document.createElement("div");
      columna.className = "col";

      const tarjeta = document.createElement("article");
      tarjeta.className = "card h-100 shadow-sm";

      const cuerpo = document.createElement("div");
      cuerpo.className = "card-body d-flex flex-column";

      const titulo = document.createElement("h5");
      titulo.className = "card-title fw-bold";
      titulo.textContent = tarea.nombre;

      const descripcion = document.createElement("p");
      descripcion.className = "card-text text-secondary";
      descripcion.textContent = tarea.descripcion;

      const fecha = document.createElement("p");
      fecha.className = "mb-2";

      fecha.textContent = tarea.fechaDeEntrega
        ? `Fecha de entrega: ${tarea.fechaDeEntrega.split("-").reverse().join("-")}`
        : "Sin fecha de entrega";

      const estado = document.createElement("span");
      estado.className = "badge text-bg-secondary align-self-start mb-3";
      estado.textContent = tarea.estado;

      const fechaEliminacion = document.createElement("small");
      fechaEliminacion.className = "text-secondary mb-3";

      fechaEliminacion.textContent = tarea.fechaEliminacion
        ? `Eliminada: ${new Date(tarea.fechaEliminacion).toLocaleString("es-PE")}`
        : "Fecha de eliminación no disponible";

      const acciones = document.createElement("div");
      acciones.className = "d-flex flex-wrap gap-2 mt-auto";

      // BOTÓN RESTAURAR
      const botonRestaurar = document.createElement("button");
      botonRestaurar.type = "button";
      botonRestaurar.className = "btn btn-outline-success btn-sm flex-fill";
      botonRestaurar.innerHTML = '<i class="bi bi-arrow-counterclockwise me-1"></i> Restaurar';

      botonRestaurar.addEventListener("click", () => {

        const restaurada = taskManager.restoreTask(tarea.id);

        if (restaurada) {
          renderPapelera();
        }

      });

      // BOTÓN ELIMINAR DEFINITIVAMENTE
      const botonEliminar = document.createElement("button");
      botonEliminar.type = "button";
      botonEliminar.className = "btn btn-outline-danger btn-sm flex-fill";
      botonEliminar.innerHTML = '<i class="bi bi-trash3 me-1"></i> Eliminar definitivamente';

      botonEliminar.addEventListener("click", () => {

        const confirmar = confirm(
          `¿Estás seguro de eliminar definitivamente "${tarea.nombre}"?`
        );

        if (!confirmar) return;

        const eliminada = taskManager.permanentlyDeleteTask(tarea.id);

        if (eliminada) {
          renderPapelera();
        }

      });

      acciones.append(botonRestaurar, botonEliminar);

      cuerpo.append(
        titulo,
        descripcion,
        fecha,
        estado,
        fechaEliminacion,
        acciones
      );

      tarjeta.appendChild(cuerpo);
      columna.appendChild(tarjeta);

      contenedor.appendChild(columna);

    });

  }

  // VACIAR PAPELERA
  botonVaciar.addEventListener("click", () => {

    const tareasEliminadas = taskManager.getDeletedTasks();

    if (tareasEliminadas.length === 0) return;

    const confirmar = confirm(
      "¿Estás seguro de que deseas eliminar definitivamente todas las tareas de la papelera?"
    );

    if (!confirmar) return;

    tareasEliminadas.forEach((tarea) => {
      taskManager.permanentlyDeleteTask(tarea.id);
    });

    renderPapelera();

  });

  renderPapelera();

});