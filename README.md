# Sistema de Control de Proyectos

Aplicación web para organizar la planificación y el seguimiento de un proyecto. Permite registrar tareas, asignar personal y recursos, consultar costos estimados y revisar el avance desde un panel general.

El proyecto fue desarrollado con Vue 3 y Vite como una aplicación de una sola página (SPA). No utiliza un servidor ni una base de datos remota: la información del proyecto se guarda en el almacenamiento local del navegador.

## Funcionalidades

- **Panel general:** muestra el porcentaje de tareas concluidas, los costos estimados y reales del proyecto, los costos por categoría y alertas de personal con más de ocho horas asignadas en una misma fecha.
- **Tareas:** permite crear tareas con fecha de inicio, asignar personal, materiales y otros gastos, modificar los recursos asociados, cambiar su estado y registrar la fecha de cierre.
- **Personal:** administra el catálogo de personas y su costo por hora. El personal asignado a tareas no se puede eliminar.
- **Materiales:** administra materiales y costo unitario. Los materiales vinculados a tareas no se pueden eliminar.
- **Otros costos:** administra conceptos de gastos adicionales y su costo unitario. Los conceptos en uso tampoco se pueden eliminar.
- **Opciones del proyecto:** permite iniciar un proyecto vacío, restaurar los datos de ejemplo, consultar los términos y condiciones y abrir el repositorio del proyecto.
- **Aceptación de términos:** solicita aceptar los términos antes de acceder a las pantallas de la aplicación.

### Cómo se calculan los indicadores

- El **avance** es la proporción de tareas marcadas como concluidas respecto del total de tareas.
- El costo **estimado** suma los recursos asignados a todas las tareas.
- El costo **real** suma los recursos de las tareas concluidas.
- Las alertas de sobreutilización agrupan las horas de cada persona por fecha de inicio de tarea y se muestran cuando el total supera ocho horas.

Estos valores se calculan a partir de los costos unitarios y las cantidades u horas registradas. Al marcar una tarea como concluida, se asigna la fecha actual como fecha de cierre si todavía no tenía una.

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`.
- pnpm.

## Instalación y ejecución local

Desde la raíz del repositorio:

```sh
pnpm install
pnpm dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo de Vite. |
| `pnpm build` | Genera la versión optimizada para producción en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación de `dist/` para previsualizarla. |

Para generar y previsualizar una compilación:

```sh
pnpm build
pnpm preview
```

El proyecto no define actualmente scripts de pruebas automatizadas.

## Persistencia y datos

El estado del proyecto se guarda en `localStorage` bajo la clave `control_proyectos_db`. La aceptación de los términos se guarda aparte, bajo `control_proyectos_terms_accepted`.

Esto implica que:

- Los datos permanecen en el navegador y origen donde se utilizó la aplicación; no se sincronizan entre dispositivos ni navegadores.
- Borrar los datos del sitio en el navegador elimina la información almacenada.
- **Iniciar Proyecto Nuevo** borra los registros del proyecto en ese navegador.
- **Devolver Valores por Defecto** carga nuevamente los datos de demostración incluidos en el sistema.

La primera carga de la aplicación incluye ejemplos de personal, materiales, otros costos y tareas. No hay autenticación, API ni sincronización remota implementadas.

## Estructura del proyecto

```text
.
├── index.html
├── public/
│   └── favicon.png
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── store/
│   │   └── projectStore.js
│   ├── components/
│   │   ├── layout/       # Encabezado y navegación lateral
│   │   └── ui/           # Modales, alertas, botones y tarjetas
│   ├── views/            # Dashboard y módulos de gestión
│   └── assets/
│       ├── css/
│       └── fonts/
├── package.json
├── pnpm-lock.yaml
└── vite.config.js
```

### Organización

- `src/main.js` inicializa Vue, importa los estilos globales y monta la aplicación.
- `src/App.vue` define el diseño general, controla la navegación entre pantallas y solicita la aceptación de términos.
- `src/store/projectStore.js` contiene el estado reactivo compartido, los datos iniciales, los cálculos y las operaciones de lectura y escritura en `localStorage`.
- `src/components/layout/` agrupa los componentes del encabezado y la barra lateral.
- `src/components/ui/` contiene componentes reutilizables para acciones, avisos y ventanas modales.
- `src/views/` contiene las pantallas Dashboard, Tareas, Personal, Materiales y Otros Costos.
- `src/assets/` contiene estilos globales y fuentes locales.

La navegación entre vistas se implementa en `App.vue` mediante componentes dinámicos; el proyecto no incorpora una biblioteca de enrutamiento.

## Tecnologías

- [Vue 3](https://vuejs.org/) con componentes de archivo único y `<script setup>`.
- [Vite](https://vite.dev/) y `@vitejs/plugin-vue` para desarrollo y compilación.
- JavaScript con módulos ES.
- pnpm para instalar dependencias, con versiones fijadas en `pnpm-lock.yaml`.
