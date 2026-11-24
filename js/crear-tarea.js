document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioTarea");

  if (!formulario) {
    console.error('No se encontró el formulario "formularioTarea".');
    return;
  }

  // TaskManager está definido en task-manager.js
  const taskManager = new TaskManager();
  const campoFecha = document.getElementById("fechaSimple");

  function obtenerFechaHoyLocal() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }

  function actualizarFechaMinima() {
    if (campoFecha) {
      campoFecha.min = obtenerFechaHoyLocal();
    }
  }

  // Fijar fecha mínima al cargar y si la pestaña vuelve a activarse
  actualizarFechaMinima();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      actualizarFechaMinima();
    }
  });

  // VALIDAR FORMULARIO

  function validateTaskForm() {
    const titulo = document.getElementById("titulo4");
    const descripcion = document.getElementById("inputdescripcion4");
    const asignado = document.getElementById("inlineFormInput");
    const fecha = document.getElementById("fechaSimple");
    const progresoContenedor = document.querySelector(".progreso-botones");

    const errorTitulo = document.getElementById("errorTitulo");
    const errorDescripcion = document.getElementById("errorDescripcion");
    const errorAsignado = document.getElementById("errorAsignado");
    const errorFecha = document.getElementById("errorFecha");
    const errorProgreso = document.getElementById("errorProgreso");

    // Comprobar que existan los elementos necesarios
    const elementos = [
      titulo,
      descripcion,
      asignado,
      fecha,
      progresoContenedor,
      errorTitulo,
      errorDescripcion,
      errorAsignado,
      errorFecha,
      errorProgreso,
    ];

    if (elementos.some((elemento) => !elemento)) {
      console.error("Falta uno o más campos o mensajes de error en el HTML.");
      return false;
    }

    const progreso = document.querySelector('input[name="progreso"]:checked');

    // Limpiar errores anteriores
    [
      [errorTitulo, titulo],
      [errorDescripcion, descripcion],
      [errorAsignado, asignado],
      [errorFecha, fecha],
    ].forEach(([elementoError, campo]) => {
      elementoError.textContent = "";
      campo.classList.remove("campo-invalido");
    });

    errorProgreso.textContent = "";
    progresoContenedor.classList.remove("progreso-invalido");

    let valido = true;

    function mostrarError(campo, elementoError, mensaje) {
      elementoError.textContent = mensaje;
      campo.classList.add("campo-invalido");
      valido = false;
    }

    // Validar título
    const textoTitulo = titulo.value.trim();

    if (textoTitulo.length === 0) {
      mostrarError(titulo, errorTitulo, "El título no puede estar vacío.");
    } else if (textoTitulo.length <= 8) {
      mostrarError(
        titulo,
        errorTitulo,
        "El título debe tener más de 8 caracteres.",
      );
    }

    // Validar descripción
    const textoDescripcion = descripcion.value.trim();

    if (textoDescripcion.length === 0) {
      mostrarError(
        descripcion,
        errorDescripcion,
        "La descripción no puede estar vacía.",
      );
    } else if (textoDescripcion.length <= 15) {
      mostrarError(
        descripcion,
        errorDescripcion,
        "La descripción debe tener más de 15 caracteres.",
      );
    }

    // Validar persona asignada
    const textoAsignado = asignado.value.trim();

    if (textoAsignado.length === 0) {
      mostrarError(
        asignado,
        errorAsignado,
        "Debes indicar la persona asignada.",
      );
    } else if (textoAsignado.length <= 8) {
      mostrarError(
        asignado,
        errorAsignado,
        "El nombre del asignado debe tener más de 8 caracteres.",
      );
    }

    // Validar fecha
    const hoyLocal = obtenerFechaHoyLocal();
    if (fecha.value === "") {
      mostrarError(
        fecha,
        errorFecha,
        "Debes seleccionar una fecha de entrega.",
      );
    } else if (fecha.value < hoyLocal) {
      mostrarError(
        fecha,
        errorFecha,
        "La fecha de entrega no puede ser anterior a hoy.",
      );
    }

    // Validar progreso
    if (!progreso) {
      errorProgreso.textContent = "Debes seleccionar un estado de progreso.";

      progresoContenedor.classList.add("progreso-invalido");
      valido = false;
    }

    return valido;
  }

  // CONFIGURACIÓN DE MODAL DE TAREA CREADA

  const modalElemento = document.getElementById("modalTareaCreada");
  const botonVerTareas = document.getElementById("btnVerTareas");

  let modalExito = null;

  if (modalElemento && typeof bootstrap !== "undefined") {
    modalExito = bootstrap.Modal.getOrCreateInstance(modalElemento);
  } else {
    console.error(
      "No se encontró el modal o no se ha cargado Bootstrap correctamente.",
    );
  }

  // El botón navega al listado solo cuando el usuario lo pulsa.
  if (botonVerTareas) {
    botonVerTareas.addEventListener("click", function () {
      window.location.href = "tareas.html";
    });
  }

  // ENVIAR FORMULARIO Y CREAR TAREA

  formulario.addEventListener("submit", function (event) {
    // Evitar que la página se recargue automáticamente
    event.preventDefault();

    // 1. Validar el formulario
    if (!validateTaskForm()) {
      return;
    }

    try {
      // 2. Traducir los estados del formulario
      const equivalenciaEstados = {
        sin_comenzar: "POR HACER",
        en_curso: "EN PROCESO",
        revision: "REVISIÓN",
        completado: "HECHO",
      };

      const progresoSeleccionado = document.querySelector(
        'input[name="progreso"]:checked',
      );

      const estadoSeleccionado =
        equivalenciaEstados[progresoSeleccionado.value];

      if (!estadoSeleccionado) {
        document.getElementById("errorProgreso").textContent =
          "El estado seleccionado no es válido.";

        return;
      }

      // 3. Obtener usuario y categoría
      const campoUsuario = document.getElementById("inlineFormInputGroup");

      const campoCategoria = document.getElementById("categoria");

      if (!campoUsuario || !campoCategoria) {
        throw new Error("No se encontraron los campos de usuario o categoría.");
      }

      // 4. Crear el objeto de tarea
      const tarea = {
        nombre: document.getElementById("titulo4").value.trim(),

        descripcion: document.getElementById("inputdescripcion4").value.trim(),

        asignadoA: document.getElementById("inlineFormInput").value.trim(),

        fechaDeEntrega: document.getElementById("fechaSimple").value,

        estado: estadoSeleccionado,

        usuario: campoUsuario.value.trim(),

        categoria: campoCategoria.value,
      };

      // 5. Agregar la tarea al TaskManager
      const nuevaTarea = taskManager.addTask(tarea);

      console.log("Tarea creada correctamente:", nuevaTarea);
      console.log("ID de la tarea:", nuevaTarea.id);
      console.log("Lista actual de tareas:", taskManager.getAllTasks());

      // 6. Limpiar el formulario
      formulario.reset();
      actualizarFechaMinima();

      // Quitar estilos de campos inválidos
      document.querySelectorAll(".campo-invalido").forEach((campo) => {
        campo.classList.remove("campo-invalido");
      });

      const progresoContenedor = document.querySelector(".progreso-botones");

      if (progresoContenedor) {
        progresoContenedor.classList.remove("progreso-invalido");
      }

      // Limpiar mensajes de error
      [
        "errorTitulo",
        "errorDescripcion",
        "errorAsignado",
        "errorFecha",
        "errorProgreso",
      ].forEach((id) => {
        const elemento = document.getElementById(id);

        if (elemento) {
          elemento.textContent = "";
        }
      });

      // 7. Mostrar el modal
      if (modalExito) {
        modalExito.show();
      } else {
        alert("¡Tarea creada con éxito!");
      }
    } catch (error) {
      console.error("Error al crear la tarea:", error);

      alert("No se pudo crear la tarea. Detalle: " + error.message);
    }
  });
});
