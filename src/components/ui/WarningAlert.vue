<script setup>
defineProps({
    nombre: {
        type: String,
        required: true
    },
    totalHoras: {
        type: [Number, String],
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    tareas: {
        type: Array,
        default: () => []
    }
});
</script>

<template>
    <div class="alert-item">
        <div class="alert-header">
            <strong>{{ nombre }}:</strong> Asignado a 
            <span class="highlight">{{ totalHoras }} horas</span> el día {{ fecha }}.
        </div>
        
        <div v-if="tareas.length > 0" class="alert-details">
            <small>
                Tareas: {{ tareas.map(t => `${t.nombre} (${t.horas}h)`).join(', ') }}
            </small>
        </div>
    </div>
</template>

<style scoped>
.alert-item {
    background-color: var(--c-bg-main);
    color: var(--c-text-main);
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 12px;
    border-left: 6px solid var(--c-warning);
    border-top: 1px solid var(--c-bg-sidebar);
    border-right: 1px solid var(--c-bg-sidebar);
    border-bottom: 1px solid var(--c-bg-sidebar);
    transition: transform 0.2s ease;
    font-family: var(--t-body-font);
}

.alert-item:hover {
    transform: translateX(6px);
}

.alert-header strong {
    color: var(--c-warning);
    font-family: var(--t-body-font);
}

.highlight {
    color: var(--c-warning);
    font-weight: bold;
}

.alert-details small {
    color: var(--c-text-main);
    opacity: 0.7;
    display: inline-block;
    margin-top: 4px;
    font-family: var(--t-body-font);
}
</style>