<script setup>
import ButtonSide from '../ui/ButtonSide.vue';

defineProps({
    status: {
        type: Array,
        required: true
    }
});

</script>

<template>

    <div class="container">
        <h2 class="title">Control Proyectos</h2>
        <ButtonSide label="Dashboard" :status="status[0]" />
        <ButtonSide label="Tareas" :status="status[1]" />
        <ButtonSide label="Personal" :status="status[2]" />
        <ButtonSide label="Materiales" :status="status[3]" />
        <ButtonSide label="Otros Costos" :status="status[4]" />
    </div>

</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 16vw;
        border-right: 1px solid var(--c-bg-card);
        background-color: var(--c-bg-sidebar);
        justify-content: flex-start; 
        padding-top: 20px; 
        gap: 0; 
    }

    .title {
        color: var(--c-text-main);
        text-align: center;
        margin-bottom:25px;
        font-family: var(--t-title-font);
    }
</style>