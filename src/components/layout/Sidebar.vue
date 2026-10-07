<script setup>
import ButtonSide from '../ui/ButtonSide.vue';

defineProps({
    status: {
        type: Array,
        required: true
    }
});

    const emit = defineEmits(['cambiarVista']);

    const seleccionar = (indice) => {
        emit('cambiarVista', indice);
    };
</script>

<template>
    <div class="sidebar-container">
        <div class="logo">
            <h2>Control Proyectos</h2>
        </div>
        <nav class="nav-list">
            <ButtonSide label="Dashboard" :status="status[0]" @click="seleccionar(0)" />
            <ButtonSide label="Tareas" :status="status[1]" @click="seleccionar(1)" />
            <ButtonSide label="Personal" :status="status[2]" @click="seleccionar(2)" />
            <ButtonSide label="Materiales" :status="status[3]" @click="seleccionar(3)" />
            <ButtonSide label="Otros Costos" :status="status[4]" @click="seleccionar(4)" />
        </nav>
    </div>
</template>

<style scoped>
.sidebar-container {
    width: 250px;
    min-width: 19vw;
    height: 100vh;
    background-color: var(--c-bg-sidebar);
    border-right: 1px solid var(--c-bg-card);
    display: flex;
    flex-direction: column;
}

.logo {
    padding: 36px;
    border-bottom: 1px solid var(--c-bg-card);
}

.logo h2 {
    margin: 0;
    font-size: 1.6rem;
    color: var(--c-text-main);
}

.nav-list {
    display: flex;
    flex-direction: column;
}
</style>