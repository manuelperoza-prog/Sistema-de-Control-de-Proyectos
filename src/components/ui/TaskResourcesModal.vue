<script setup>
import { ref, computed, watch } from 'vue';
import { useProjectStore } from '../../store/projectStore';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    tarea: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close']);

const { state, actualizarRecursosTarea } = useProjectStore();

// Borrador local y foto inicial para detectar cambios
const snapshotInicial = ref('');
const draft = ref({
    asignacionesPersonal: [],
    materialesUsados: [],
    otrosCostosUsados: []
});

// Campos para nuevos recursos
const nuevoPersonalId = ref('');
const nuevasHoras = ref(1);

const nuevoMaterialId = ref('');
const nuevaCantidadMat = ref(1);

const nuevoCostoId = ref('');
const nuevaCantidadCosto = ref(1);

// Inicializar el borrador cada vez que se abre el modal con una tarea
const inicializarBorrador = () => {
    if (!props.tarea) return;
    draft.value = {
        asignacionesPersonal: JSON.parse(JSON.stringify(props.tarea.asignacionesPersonal || [])),
        materialesUsados: JSON.parse(JSON.stringify(props.tarea.materialesUsados || [])),
        otrosCostosUsados: JSON.parse(JSON.stringify(props.tarea.otrosCostosUsados || []))
    };
    snapshotInicial.value = JSON.stringify(draft.value);

    nuevoPersonalId.value = '';
    nuevasHoras.value = 1;
    nuevoMaterialId.value = '';
    nuevaCantidadMat.value = 1;
    nuevoCostoId.value = '';
    nuevaCantidadCosto.value = 1;
};

watch(
    () => [props.isOpen, props.tarea],
    ([nuevoAbierto, nuevaTarea]) => {
        if (nuevoAbierto && nuevaTarea) {
            inicializarBorrador();
        }
    },
    { immediate: true }
);

// Comprobacion de cambios no guardados
const hayCambios = computed(() => {
    return JSON.stringify(draft.value) !== snapshotInicial.value;
});

// Listas de recursos aun no asignados en el borrador
const personalDisponible = computed(() => {
    const asignados = draft.value.asignacionesPersonal.map(a => a.personalId);
    return state.personal.filter(p => !asignados.includes(p.id));
});

const materialesDisponibles = computed(() => {
    const asignados = draft.value.materialesUsados.map(m => m.materialId);
    return state.materiales.filter(m => !asignados.includes(m.id));
});

const otrosCostosDisponibles = computed(() => {
    const asignados = draft.value.otrosCostosUsados.map(o => o.costoId);
    return state.otrosCostos.filter(o => !asignados.includes(o.id));
});

// Helpers de resolucion de nombres
const obtenerNombrePersonal = (id) => {
    const p = state.personal.find(item => item.id === id);
    return p ? `${p.nombre} ($${p.costoHora}/h)` : 'Desconocido';
};

const obtenerNombreMaterial = (id) => {
    const m = state.materiales.find(item => item.id === id);
    return m ? `${m.nombre} ($${m.costoUnidad}/u)` : 'Desconocido';
};

const obtenerNombreCosto = (id) => {
    const c = state.otrosCostos.find(item => item.id === id);
    return c ? `${c.concepto} ($${c.costoUnidad})` : 'Desconocido';
};

// Acciones sobre el borrador local
const modificarHorasPersonal = (personalId, delta) => {
    const asig = draft.value.asignacionesPersonal.find(p => p.personalId === personalId);
    if (asig) {
        const nuevo = asig.horas + delta;
        if (nuevo > 0) {
            asig.horas = Math.round(nuevo * 10) / 10;
        }
    }
};

const ejecutarAgregarPersonal = () => {
    if (!nuevoPersonalId.value || nuevasHoras.value <= 0) return;
    const idNum = Number(nuevoPersonalId.value);
    const existe = draft.value.asignacionesPersonal.find(p => p.personalId === idNum);
    if (existe) {
        existe.horas += Number(nuevasHoras.value);
    } else {
        draft.value.asignacionesPersonal.push({ personalId: idNum, horas: Number(nuevasHoras.value) });
    }
    nuevoPersonalId.value = '';
    nuevasHoras.value = 1;
};

const modificarCantidadMaterial = (materialId, delta) => {
    const mat = draft.value.materialesUsados.find(m => m.materialId === materialId);
    if (mat) {
        const nuevo = mat.cantidad + delta;
        if (nuevo > 0) {
            mat.cantidad = nuevo;
        }
    }
};

const ejecutarAgregarMaterial = () => {
    if (!nuevoMaterialId.value || nuevaCantidadMat.value <= 0) return;
    const idNum = Number(nuevoMaterialId.value);
    const existe = draft.value.materialesUsados.find(m => m.materialId === idNum);
    if (existe) {
        existe.cantidad += Number(nuevaCantidadMat.value);
    } else {
        draft.value.materialesUsados.push({ materialId: idNum, cantidad: Number(nuevaCantidadMat.value) });
    }
    nuevoMaterialId.value = '';
    nuevaCantidadMat.value = 1;
};

const modificarCantidadOtroCosto = (costoId, delta) => {
    const gasto = draft.value.otrosCostosUsados.find(o => o.costoId === costoId);
    if (gasto) {
        const nuevo = gasto.cantidad + delta;
        if (nuevo > 0) {
            gasto.cantidad = nuevo;
        }
    }
};

const ejecutarAgregarOtroCosto = () => {
    if (!nuevoCostoId.value || nuevaCantidadCosto.value <= 0) return;
    const idNum = Number(nuevoCostoId.value);
    const existe = draft.value.otrosCostosUsados.find(o => o.costoId === idNum);
    if (existe) {
        existe.cantidad += Number(nuevaCantidadCosto.value);
    } else {
        draft.value.otrosCostosUsados.push({ costoId: idNum, cantidad: Number(nuevaCantidadCosto.value) });
    }
    nuevoCostoId.value = '';
    nuevaCantidadCosto.value = 1;
};

// Guardado de cambios
const guardarCambios = () => {
    if (!props.tarea) return;
    actualizarRecursosTarea(props.tarea.id, draft.value);
    snapshotInicial.value = JSON.stringify(draft.value);
    emit('close');
};

// Salida con validacion de cambios pendientes
const intentarCerrar = () => {
    if (hayCambios.value) {
        const confirmar = confirm('¿Esta seguro de salir sin guardar los cambios realizados en los recursos?');
        if (!confirmar) return;
    }
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen && tarea" class="modal-backdrop" @click.self="intentarCerrar">
            <div class="modal-card">
                <div class="modal-header">
                    <div class="header-titles">
                        <h2>Recursos de la Tarea</h2>
                        <span class="task-subtitle">{{ tarea.nombre }}</span>
                    </div>
                    <div class="header-actions">
                        <button 
                            class="btn-save" 
                            :disabled="!hayCambios" 
                            @click="guardarCambios"
                            title="Guardar cambios en la tarea"
                        >
                            Guardar
                        </button>
                        <button class="btn-close" @click="intentarCerrar">Cerrar</button>
                    </div>
                </div>

                <div class="modal-body">
                    <!-- Seccion Personal -->
                    <section class="resource-block">
                        <h3>Personal Asignado</h3>
                        
                        <div v-if="draft.asignacionesPersonal.length === 0" class="empty-hint">
                            No hay trabajadores asignados.
                        </div>

                        <div 
                            v-for="asig in draft.asignacionesPersonal" 
                            :key="asig.personalId" 
                            class="resource-row"
                        >
                            <span class="resource-name">{{ obtenerNombrePersonal(asig.personalId) }}</span>
                            <div class="counter-box">
                                <button 
                                    class="btn-counter" 
                                    @click="modificarHorasPersonal(asig.personalId, -0.5)"
                                    :disabled="asig.horas <= 0.5"
                                    title="Disminuir horas"
                                >
                                    -
                                </button>
                                <span class="counter-val">{{ asig.horas }}h</span>
                                <button 
                                    class="btn-counter" 
                                    @click="modificarHorasPersonal(asig.personalId, 0.5)"
                                    title="Aumentar horas"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="add-row">
                            <select v-model="nuevoPersonalId">
                                <option value="" disabled>Seleccionar personal...</option>
                                <option v-for="p in personalDisponible" :key="p.id" :value="p.id">
                                    {{ p.nombre }} (${{ p.costoHora }}/h)
                                </option>
                            </select>
                            <input 
                                v-model.number="nuevasHoras" 
                                type="number" 
                                min="0.5" 
                                step="0.5" 
                                placeholder="Horas" 
                            />
                            <button 
                                class="btn-add-action" 
                                :disabled="!nuevoPersonalId" 
                                @click="ejecutarAgregarPersonal"
                            >
                                Asignar
                            </button>
                        </div>
                    </section>

                    <!-- Seccion Materiales -->
                    <section class="resource-block">
                        <h3>Materiales Utilizados</h3>
                        
                        <div v-if="draft.materialesUsados.length === 0" class="empty-hint">
                            No hay materiales vinculados.
                        </div>

                        <div 
                            v-for="mat in draft.materialesUsados" 
                            :key="mat.materialId" 
                            class="resource-row"
                        >
                            <span class="resource-name">{{ obtenerNombreMaterial(mat.materialId) }}</span>
                            <div class="counter-box">
                                <button 
                                    class="btn-counter" 
                                    @click="modificarCantidadMaterial(mat.materialId, -1)"
                                    :disabled="mat.cantidad <= 1"
                                    title="Disminuir cantidad"
                                >
                                    -
                                </button>
                                <span class="counter-val">{{ mat.cantidad }}u</span>
                                <button 
                                    class="btn-counter" 
                                    @click="modificarCantidadMaterial(mat.materialId, 1)"
                                    title="Aumentar cantidad"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="add-row">
                            <select v-model="nuevoMaterialId">
                                <option value="" disabled>Seleccionar material...</option>
                                <option v-for="m in materialesDisponibles" :key="m.id" :value="m.id">
                                    {{ m.nombre }} (${{ m.costoUnidad }}/u)
                                </option>
                            </select>
                            <input 
                                v-model.number="nuevaCantidadMat" 
                                type="number" 
                                min="1" 
                                placeholder="Cantidad" 
                            />
                            <button 
                                class="btn-add-action" 
                                :disabled="!nuevoMaterialId" 
                                @click="ejecutarAgregarMaterial"
                            >
                                Asignar
                            </button>
                        </div>
                    </section>

                    <!-- Seccion Otros Costos -->
                    <section class="resource-block">
                        <h3>Otros Costos y Servicios</h3>
                        
                        <div v-if="draft.otrosCostosUsados.length === 0" class="empty-hint">
                            No hay otros costos vinculados.
                        </div>

                        <div 
                            v-for="gasto in draft.otrosCostosUsados" 
                            :key="gasto.costoId" 
                            class="resource-row"
                        >
                            <span class="resource-name">{{ obtenerNombreCosto(gasto.costoId) }}</span>
                            <div class="counter-box">
                                <button 
                                    class="btn-counter" 
                                    @click="modificarCantidadOtroCosto(gasto.costoId, -1)"
                                    :disabled="gasto.cantidad <= 1"
                                    title="Disminuir cantidad"
                                >
                                    -
                                </button>
                                <span class="counter-val">{{ gasto.cantidad }}u</span>
                                <button 
                                    class="btn-counter" 
                                    @click="modificarCantidadOtroCosto(gasto.costoId, 1)"
                                    title="Aumentar cantidad"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="add-row">
                            <select v-model="nuevoCostoId">
                                <option value="" disabled>Seleccionar concepto...</option>
                                <option v-for="c in otrosCostosDisponibles" :key="c.id" :value="c.id">
                                    {{ c.concepto }} (${{ c.costoUnidad }})
                                </option>
                            </select>
                            <input 
                                v-model.number="nuevaCantidadCosto" 
                                type="number" 
                                min="1" 
                                placeholder="Cantidad" 
                            />
                            <button 
                                class="btn-add-action" 
                                :disabled="!nuevoCostoId" 
                                @click="ejecutarAgregarOtroCosto"
                            >
                                Asignar
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: color-mix(in srgb, var(--c-bg-sidebar) 70%, transparent);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-card {
    background-color: var(--c-bg-card);
    border: 1px solid var(--c-text-main);
    border-radius: 10px;
    width: min(92%, 620px);
    max-height: calc(100vh - 40px);
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: var(--t-body-font);
    overflow-y: auto;
    overflow-x: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid var(--c-text-main);
    padding-bottom: 12px;
    gap: 12px;
}

.header-titles {
    flex: 1;
    min-width: 0;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--c-text-main);
    font-family: var(--t-subtitle-font);
}

.task-subtitle {
    font-size: 0.85rem;
    color: var(--c-primary);
    display: block;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.btn-save {
    background-color: var(--c-primary);
    color: var(--c-text-main);
    border: none;
    padding: 6px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    font-weight: bold;
    transition: 300ms;
    box-sizing: border-box;
}

.btn-save:hover:not(:disabled) {
    background-color: var(--c-secondary);
}

.btn-save:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.btn-close {
    background: transparent;
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    font-weight: bold;
    transition: 300ms;
    box-sizing: border-box;
}

.btn-close:hover {
    background-color: var(--c-warning);
    color: var(--c-bg-sidebar);
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-sizing: border-box;
}

.resource-block {
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-bg-sidebar);
    border-radius: 8px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
}

.resource-block h3 {
    margin: 0;
    font-size: 0.95rem;
    color: var(--c-primary);
    font-family: var(--t-subtitle-font);
}

.empty-hint {
    font-size: 0.8rem;
    color: var(--c-text-main);
    opacity: 0.5;
    font-style: italic;
}

.resource-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--c-bg-card);
    box-sizing: border-box;
    width: 100%;
}

.resource-name {
    flex: 1;
    min-width: 0;
    font-size: 0.88rem;
    color: var(--c-text-main);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.counter-box {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.btn-counter {
    background-color: var(--c-bg-card);
    border: 1px solid var(--c-primary);
    color: var(--c-text-main);
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-family: var(--t-body-font);
    transition: 200ms;
    padding: 0;
    box-sizing: border-box;
}

.btn-counter:hover:not(:disabled) {
    background-color: var(--c-primary);
}

.btn-counter:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: var(--c-text-main);
}

.counter-val {
    min-width: 44px;
    text-align: center;
    font-weight: bold;
    color: var(--c-primary);
    font-size: 0.9rem;
}

/* Fila de adicion adaptada para evitar desbordamientos en cualquier navegador */
.add-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.add-row select {
    flex: 1 1 180px;
    min-width: 0; /* Previene que el ancho intrinseco de las opciones desborde el flexbox */
    background-color: var(--c-bg-card);
    border: 1px solid var(--c-bg-sidebar);
    color: var(--c-text-main);
    padding: 8px 10px;
    border-radius: 4px;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    outline: none;
    box-sizing: border-box;
}

.add-row input {
    flex: 0 0 75px;
    width: 75px;
    min-width: 60px;
    background-color: var(--c-bg-card);
    border: 1px solid var(--c-bg-sidebar);
    color: var(--c-text-main);
    padding: 8px;
    border-radius: 4px;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    outline: none;
    box-sizing: border-box;
}

.btn-add-action {
    flex: 0 0 auto;
    background-color: var(--c-primary);
    color: var(--c-text-main);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    font-family: var(--t-subtitle-font);
    transition: 200ms;
    box-sizing: border-box;
    white-space: nowrap;
}

.btn-add-action:hover:not(:disabled) {
    background-color: var(--c-secondary);
}

.btn-add-action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* En pantallas angostas o móviles, apilamos ordenadamente */
@media (max-width: 520px) {
    .add-row {
        flex-direction: column;
        align-items: stretch;
    }

    .add-row select,
    .add-row input,
    .btn-add-action {
        flex: 1 1 100%;
        width: 100%;
        max-width: 100%;
    }
}
</style>