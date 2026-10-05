<script setup>
import { ref, shallowRef } from 'vue';
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';

// Vistas
import DashboardView from './views/DashboardView.vue';
import TareasView from './views/TareasView.vue';
import PersonalView from './views/PersonalView.vue';
import MaterialView from './views/MaterialView.vue';
import OtrosCostosView from './views/OtrosCostosView.vue';

const vistas = [
    DashboardView,
    TareasView,
    PersonalView,
    MaterialView,
    OtrosCostosView
];

// Títulos para cada pantalla
const titulos = [
    'Visión General del Proyecto',
    'Gestión de Tareas',
    'Control de Personal',
    'Inventario de Materiales',
    'Otros Costos'
];

const status = ref(['active', 'btn', 'btn', 'btn', 'btn']);
const vistaActual = shallowRef(vistas[0]);
const tituloActual = ref(titulos[0]);

const cambiarVista = (indice) => {
    status.value = status.value.map((_, i) => (i === indice ? 'active' : 'btn'));
    vistaActual.value = vistas[indice];
    tituloActual.value = titulos[indice]; // Actualiza el título del Header
};
</script>

<template>
    <div class="layout-wrapper">
        <Sidebar :status="status" @cambiarVista="cambiarVista" />

        <div class="main-wrapper">
            <!-- Pasamos el título reactivo al Header -->
            <Header :titulo="tituloActual" />
            
            <main class="content-area">
                <component :is="vistaActual" />
            </main>
        </div>
    </div>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: var(--c-bg-main);
}

.main-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100vh;
    overflow: hidden;
}

.content-area {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    box-sizing: border-box;
}
</style>