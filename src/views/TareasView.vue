<script setup>
import { ref } from 'vue';
import { useProjectStore } from '../store/projectStore';
import DeleteButton from '../components/ui/DeleteButton.vue';
import TaskResourcesModal from '../components/ui/TaskResourcesModal.vue';

const { 
    state,
    fechaActual,
    agregarTarea, 
    alternarEstadoTarea, 
    eliminarTarea, 
    puedeBorrarTarea,
    calcularCostoTarea
} = useProjectStore();

// Campos principales del formulario
const nombre = ref('');
const fechaLocal = () => {
    const ahora = new Date();
    return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const fechaHoy = ref(fechaLocal());
const fechaInicio = ref(fechaHoy.value);

// Listas dinámicas para la asignación de recursos a la nueva tarea
const asignacionesPersonal = ref([]);
const materialesUsados = ref([]);
const otrosCostosUsados = ref([]);

// Modal de edición de recursos
const modalRecursosAbierto = ref(false);
const tareaSeleccionada = ref(null);

const abrirModalRecursos = (tarea) => {
    tareaSeleccionada.value = tarea;
    modalRecursosAbierto.value = true;
};

const cerrarModalRecursos = () => {
    modalRecursosAbierto.value = false;
    tareaSeleccionada.value = null;
};

// Métodos para agregar/quitar filas dinámicas en el formulario
const agregarFilaPersonal = () => {
    asignacionesPersonal.value.push({ personalId: '', horas: 1 });
};
const removerFilaPersonal = (index) => {
    asignacionesPersonal.value.splice(index, 1);
};

const agregarFilaMaterial = () => {
    materialesUsados.value.push({ materialId: '', cantidad: 1 });
};
const removerFilaMaterial = (index) => {
    materialesUsados.value.splice(index, 1);
};

const agregarFilaOtroCosto = () => {
    otrosCostosUsados.value.push({ costoId: '', cantidad: 1 });
};
const removerFilaOtroCosto = (index) => {
    otrosCostosUsados.value.splice(index, 1);
};

// Guardar tarea y limpiar formulario
const guardar = () => {
    if (!nombre.value.trim() || !fechaInicio.value) return;

    const personalValido = asignacionesPersonal.value.filter(a => a.personalId && a.horas > 0);
    const materialesValidos = materialesUsados.value.filter(m => m.materialId && m.cantidad > 0);
    const otrosValidos = otrosCostosUsados.value.filter(o => o.costoId && o.cantidad > 0);

    agregarTarea({
        nombre: nombre.value.trim(),
        fechaInicio: fechaInicio.value,
        asignacionesPersonal: personalValido,
        materialesUsados: materialesValidos,
        otrosCostosUsados: otrosValidos
    });

    nombre.value = '';
    fechaHoy.value = fechaLocal();
    fechaInicio.value = fechaHoy.value;
    asignacionesPersonal.value = [];
    materialesUsados.value = [];
    otrosCostosUsados.value = [];
};

// Generador dinámico del tooltip de borrado
const mensajeTooltipBorrado = (tarea) => {
    if (tarea.completada) {
        return 'No se puede eliminar: la tarea ya fue concluida';
    }
    if (puedeBorrarTarea(tarea.id)) {
        return 'Eliminar tarea';
    }
    return 'No se puede eliminar: ya inició su ejecución y tiene recursos asignados';
};
</script>

<template>
    <div class="view-container">
        <!-- Formulario de Creación de Tarea -->
        <section class="card-box">
            <h2>Crear Nueva Tarea</h2>
            <form @submit.prevent="guardar" class="task-form">
                
                <div class="form-row">
                    <div class="form-group flex-2">
                        <label>Nombre de la Tarea</label>
                        <input 
                            v-model="nombre" 
                            type="text" 
                            placeholder="Ej. Instalación de Tuberías Sanitarias" 
                            required 
                        />
                    </div>
                    <div class="form-group flex-1">
                        <label>Fecha de Inicio</label>
                        <input 
                            v-model="fechaInicio"
                            type="date" 
                            required 
                        />
                    </div>
                </div>
                <p class="date-help">
                    La fecha de inicio se establece hoy por defecto. Si la fecha de inicio es futura, la tarea podrá eliminarse antes de comenzar.
                </p>

                <!-- Sub-sección: Asignación de Personal -->
                <div class="sub-section">
                    <div class="sub-header">
                        <h3>Personal Asignado</h3>
                        <button type="button" class="btn-secondary-action" @click="agregarFilaPersonal">
                            + Asignar Personal
                        </button>
                    </div>
                    <div v-for="(asig, index) in asignacionesPersonal" :key="index" class="dynamic-row">
                        <select v-model="asig.personalId" required>
                            <option value="" disabled>Seleccione personal...</option>
                            <option v-for="p in state.personal" :key="p.id" :value="p.id">
                                {{ p.nombre }} (${{ p.costoHora }}/h)
                            </option>
                        </select>
                        <input 
                            v-model.number="asig.horas" 
                            type="number" 
                            min="0.5" 
                            step="0.5" 
                            placeholder="Horas por día"
                            required 
                        />
                        <button type="button" class="btn-remove" @click="removerFilaPersonal(index)">✕</button>
                    </div>
                </div>

                <!-- Sub-sección: Asignación de Materiales -->
                <div class="sub-section">
                    <div class="sub-header">
                        <h3>Materiales Requeridos</h3>
                        <button type="button" class="btn-secondary-action" @click="agregarFilaMaterial">
                            + Asignar Material
                        </button>
                    </div>
                    <div v-for="(mat, index) in materialesUsados" :key="index" class="dynamic-row">
                        <select v-model="mat.materialId" required>
                            <option value="" disabled>Seleccione material...</option>
                            <option v-for="m in state.materiales" :key="m.id" :value="m.id">
                                {{ m.nombre }} (${{ m.costoUnidad }}/u)
                            </option>
                        </select>
                        <input 
                            v-model.number="mat.cantidad" 
                            type="number" 
                            min="1" 
                            placeholder="Cantidad" 
                            required 
                        />
                        <button type="button" class="btn-remove" @click="removerFilaMaterial(index)">✕</button>
                    </div>
                </div>

                <!-- Sub-sección: Otros Costos -->
                <div class="sub-section">
                    <div class="sub-header">
                        <h3>Otros Costos / Gastos</h3>
                        <button type="button" class="btn-secondary-action" @click="agregarFilaOtroCosto">
                            + Asignar Costo
                        </button>
                    </div>
                    <div v-for="(gasto, index) in otrosCostosUsados" :key="index" class="dynamic-row">
                        <select v-model="gasto.costoId" required>
                            <option value="" disabled>Seleccione concepto...</option>
                            <option v-for="o in state.otrosCostos" :key="o.id" :value="o.id">
                                {{ o.concepto }} (${{ o.costoUnidad }})
                            </option>
                        </select>
                        <input 
                            v-model.number="gasto.cantidad" 
                            type="number" 
                            min="1" 
                            placeholder="Cantidad" 
                            required 
                        />
                        <button type="button" class="btn-remove" @click="removerFilaOtroCosto(index)">✕</button>
                    </div>
                </div>

                <button type="submit" class="btn-submit">Guardar Tarea</button>
            </form>
        </section>

        <!-- Listado de Tareas -->
        <section class="card-box">
            <h2>Tareas del Proyecto</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Tarea</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Cierre</th>
                            <th>Recursos Vinculados</th>
                            <th>Costo Estimado</th>
                            <th>Estado</th>
                            <th class="col-acciones">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tarea in state.tareas" :key="tarea.id">
                            <td>
                                <strong>{{ tarea.nombre }}</strong>
                            </td>
                            <td>
                                <input
                                    v-model="tarea.fechaInicio"
                                    type="date"
                                    :max="tarea.completada ? tarea.fechaCierre : undefined"
                                    aria-label="Fecha de inicio de la tarea"
                                />
                            </td>
                            <td>
                                <input
                                    v-model="tarea.fechaCierre"
                                    type="date"
                                    :min="tarea.fechaInicio"
                                    :max="fechaActual"
                                    :disabled="!tarea.completada"
                                    aria-label="Fecha de cierre de la tarea"
                                />
                            </td>
                            <td>
                                <div class="resources-cell">
                                    <div class="resources-summary">
                                        <span v-if="tarea.asignacionesPersonal.length > 0">
                                            {{ tarea.asignacionesPersonal.length }} trab.
                                        </span>
                                        <span v-if="tarea.materialesUsados.length > 0">
                                            {{ tarea.materialesUsados.length }} mat.
                                        </span>
                                        <span v-if="tarea.otrosCostosUsados.length > 0">
                                            {{ tarea.otrosCostosUsados.length }} gastos
                                        </span>
                                        <span v-if="tarea.asignacionesPersonal.length === 0 && tarea.materialesUsados.length === 0 && tarea.otrosCostosUsados.length === 0" class="muted">
                                            Sin recursos
                                        </span>
                                    </div>
                                    <button 
                                        type="button" 
                                        class="btn-manage-res" 
                                        @click="abrirModalRecursos(tarea)"
                                        title="Gestionar recursos de esta tarea"
                                    >
                                        Modificar
                                    </button>
                                </div>
                            </td>
                            <td class="cost-cell">${{ calcularCostoTarea(tarea).toLocaleString() }}</td>
                            <td>
                                <button 
                                    class="badge-toggle"
                                    :class="tarea.completada ? 'completed' : 'pending'"
                                    @click="alternarEstadoTarea(tarea.id)"
                                >
                                    {{ tarea.completada ? 'Concluida' : 'Pendiente' }}
                                </button>
                            </td>
                            <td class="col-acciones">
                                <DeleteButton 
                                    :disabled="!puedeBorrarTarea(tarea.id)"
                                    :title="mensajeTooltipBorrado(tarea)"
                                    @click="eliminarTarea(tarea.id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Modal para editar los recursos de la tarea seleccionada -->
        <TaskResourcesModal 
            :isOpen="modalRecursosAbierto" 
            :tarea="tareaSeleccionada" 
            @close="cerrarModalRecursos" 
        />
    </div>
</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    font-family: var(--t-body-font);
    color: var(--c-text-main);
}

.card-box {
    background-color: var(--c-bg-card);
    padding: 25px;
    border-radius: 10px;
    border: 1px solid var(--c-bg-main);
}

h2 {
    margin: 0 0 20px 0;
    font-family: var(--t-subtitle-font);
    color: var(--c-text-main);
    font-size: 1.25rem;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.date-help {
    margin: -12px 0 0;
    font-size: 0.85rem;
    opacity: 0.7;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.flex-1 { flex: 1; min-width: 200px; }
.flex-2 { flex: 2; min-width: 250px; }

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 0.9rem;
    font-family: var(--t-body-font);
}

input, select {
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-bg-sidebar);
    color: var(--c-text-main);
    padding: 10px 14px;
    border-radius: 6px;
    font-family: var(--t-body-font);
    outline: none;
    transition: border-color 0.3s ease;
}

input:focus, select:focus {
    border-color: var(--c-primary);
}

.sub-section {
    background-color: var(--c-bg-main);
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid var(--c-bg-sidebar);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sub-header h3 {
    margin: 0;
    font-size: 1rem;
    font-family: var(--t-subtitle-font);
    color: var(--c-text-main);
}

.btn-secondary-action {
    background: transparent;
    border: 1px solid var(--c-primary);
    color: var(--c-primary);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-secondary-action:hover {
    background-color: var(--c-primary);
    color: var(--c-text-main);
}

.dynamic-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.dynamic-row select {
    flex: 2;
}

.dynamic-row input {
    flex: 1;
}

.btn-remove {
    background: transparent;
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
    border-radius: 4px;
    padding: 9px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-remove:hover {
    background-color: var(--c-warning);
    color: var(--c-bg-sidebar);
}

.btn-submit {
    align-self: flex-start;
    background-color: var(--c-primary);
    color: var(--c-text-main);
    border: none;
    padding: 12px 28px;
    border-radius: 6px;
    cursor: pointer;
    font-family: var(--t-subtitle-font);
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.btn-submit:hover {
    background-color: var(--c-secondary);
}

.table-responsive {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

th, td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--c-bg-main);
    font-family: var(--t-body-font);
    vertical-align: middle;
}

th {
    font-family: var(--t-subtitle-font);
    color: var(--c-primary);
    font-size: 0.95rem;
}

.cost-cell {
    font-weight: bold;
    color: var(--c-primary);
}

.resources-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.resources-summary {
    display: flex;
    gap: 6px;
    font-size: 0.85rem;
    flex-wrap: wrap;
}

.muted {
    opacity: 0.5;
}

.btn-manage-res {
    background: transparent;
    border: 1px solid var(--c-primary);
    color: var(--c-primary);
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    font-size: 0.78rem;
    transition: 200ms;
}

.btn-manage-res:hover {
    background-color: var(--c-primary);
    color: var(--c-text-main);
}

.badge-toggle {
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.85rem;
    cursor: pointer;
    border: none;
    font-family: var(--t-body-font);
    font-weight: bold;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.badge-toggle:hover {
    opacity: 0.85;
    transform: scale(1.03);
}

.badge-toggle.completed {
    background-color: var(--c-primary);
    color: var(--c-text-main);
}

.badge-toggle.pending {
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
}

/* Columna de acciones fija y centrada */
th.col-acciones,
td.col-acciones {
    text-align: center;
    width: 160px;
    min-width: 160px;
}
</style>