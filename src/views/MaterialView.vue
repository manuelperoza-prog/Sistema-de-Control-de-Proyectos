<script setup>
import { ref } from 'vue';
import { useProjectStore } from '../store/projectStore';

const { state, agregarMaterial, eliminarMaterial, puedeBorrarMaterial } = useProjectStore();

const nombre = ref('');
const costoUnidad = ref('');

const guardar = () => {
    if (!nombre.value.trim() || costoUnidad.value <= 0) return;
    agregarMaterial(nombre.value.trim(), costoUnidad.value);
    nombre.value = '';
    costoUnidad.value = '';
};
</script>

<template>
    <div class="view-container">
        <!-- Formulario -->
        <section class="card-box form-section">
            <h2>Registrar Material</h2>
            <form @submit.prevent="guardar" class="form-row">
                <div class="form-group">
                    <label>Nombre del Material</label>
                    <input 
                        v-model="nombre" 
                        type="text" 
                        placeholder="Ej. Bolsa de Yeso" 
                        required 
                    />
                </div>
                <div class="form-group">
                    <label>Costo Unitario ($)</label>
                    <input 
                        v-model.number="costoUnidad" 
                        type="number" 
                        min="1" 
                        step="0.01" 
                        placeholder="0.00" 
                        required 
                    />
                </div>
                <button type="submit" class="btn-submit">Agregar Material</button>
            </form>
        </section>

        <!-- Tabla -->
        <section class="card-box table-section">
            <h2>Inventario de Materiales</h2>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Costo Unitario</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="mat in state.materiales" :key="mat.id">
                            <td>{{ mat.nombre }}</td>
                            <td>${{ mat.costoUnidad }}</td>
                            <td>
                                <span 
                                    class="badge" 
                                    :class="puedeBorrarMaterial(mat.id) ? 'badge-free' : 'badge-busy'"
                                >
                                    {{ puedeBorrarMaterial(mat.id) ? 'Sin Asignar' : 'En Uso' }}
                                </span>
                            </td>
                            <td>
                                <button 
                                    class="btn-delete"
                                    :disabled="!puedeBorrarMaterial(mat.id)"
                                    :title="!puedeBorrarMaterial(mat.id) ? 'No se puede eliminar: está asignado a tareas' : 'Eliminar material'"
                                    @click="eliminarMaterial(mat.id)"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
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

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-end;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 220px;
}

label {
    font-size: 0.9rem;
    font-family: var(--t-body-font);
}

input {
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-bg-sidebar);
    color: var(--c-text-main);
    padding: 12px 15px;
    border-radius: 6px;
    font-family: var(--t-body-font);
    outline: none;
    transition: border-color 0.3s ease;
}

input:focus {
    border-color: var(--c-primary);
}

.btn-submit {
    background-color: var(--c-primary);
    color: var(--c-text-main);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-family: var(--t-subtitle-font);
    transition: background-color 0.3s ease;
    height: 44px;
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
}

th {
    font-family: var(--t-subtitle-font);
    color: var(--c-primary);
    font-size: 0.95rem;
}

.badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-family: var(--t-body-font);
}

.badge-free {
    border: 1px solid var(--c-primary);
    color: var(--c-primary);
}

.badge-busy {
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
}

.btn-delete {
    background: transparent;
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    transition: background-color 0.2s ease, opacity 0.2s ease;
}

.btn-delete:hover:not(:disabled) {
    background-color: var(--c-warning);
    color: var(--c-bg-sidebar);
}

.btn-delete:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: var(--c-text-main);
    color: var(--c-text-main);
}
</style>