# Planificador de Tareas

Aplicación web para gestionar tareas, con el objetivo de facilitar la organización y el seguimiento de actividades personales y laborales.

## **Consideraciones importantes**

Para la entrega del Sprint 2 **se debe usar los archivos de “crear-tarea” y “tareas”, no el index**, ya que para la visión de la creación de este planificador no se contempla que las tareas figuren en el index. Cuando se desarrolle el dashboard, habrá opciones que nos permitan visualizar todas las tareas creadas.

**Características**
Crear tareas: registrar nuevas tareas mediante un formulario.
Validar información: comprobar que los campos obligatorios contengan datos válidos.
Visualizar tareas: mostrar las tareas en tarjetas con su información.
Gestionar estados: identificar el progreso de cada tarea.
Asignar responsables: registrar la persona encargada de cada actividad.
Establecer fechas de entrega: indicar cuándo debe completarse cada tarea.
Eliminar tareas: quitar tareas de la lista.

**Tecnologías utilizadas**
HTML5: estructura y contenido de las páginas.
CSS3: estilos personalizados.
JavaScript: validación de formularios y lógica de gestión de tareas.
Bootstrap 5: diseño adaptable y componentes visuales.

**Estructura del proyecto**
proyecto/
├── index.html
├── scripts.js
├── styles.css
├── css/
│ ├── crear-tarea.css
│ └── tarea.css
├── pages/
│ ├── crear-tarea.html
│ └── tareas.html
├── js/
│ ├── task-manager.js
│ ├── crear-tarea.js
│ └── tareas.js
├── components/
│ └── sidebar.html
└── assets/

**Instalación y ejecución**
Clonar el repositorio o descargar el proyecto.
Abrir la carpeta del proyecto en Visual Studio Code.
Ejecutar el archivo crear-tarea.html mediante una extensión como Live Server.
Acceder al formulario para crear una tarea.
Consultar el listado para visualizar y gestionar las tareas.
Información de las tareas

Cada tarea contiene los siguientes datos:
Identificador único.
Título.
Descripción.
Persona asignada.
Fecha de entrega.
Estado de progreso.
Categoría.
Usuario asociado, si corresponde.

Estados de progreso
POR HACER: tarea pendiente de iniciar.
EN PROCESO: tarea en desarrollo.
REVISIÓN: tarea pendiente de revisión.
HECHO: tarea completada.
