document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-tareas");

  if (!contenedor) {
    console.error('No se encontró el contenedor "contenedor-tareas".');
    return;
  }

  const taskManager = new TaskManager();
  taskManager.seedExampleTasks();

  function renderTasks() {
    const tareas = taskManager.getAllTasks();

    // Limpiar las tarjetas anteriores.
    contenedor.replaceChildren();

    if (tareas.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.className = "text-secondary text-center py-4";
      mensaje.textContent = "Todavía no tienes tareas. ¡Crea tu primera tarea!";

      contenedor.appendChild(mensaje);
      return;
    }

    // Crear y agregar una tarjeta por cada tarea.
    tareas.forEach((tarea) => {
      const tarjeta = taskManager.createTaskCard(tarea);
      contenedor.appendChild(tarjeta);
    });
  }

  renderTasks();
});
