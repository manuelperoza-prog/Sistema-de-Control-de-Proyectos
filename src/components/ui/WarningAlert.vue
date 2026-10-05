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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.alert-item:hover {
    transform: translateX(5px);
    box-shadow: -4px 4px 10px var(--c-bg-main);
}

.alert-header strong {
    color: var(--c-warning);
}

.highlight {
    color: var(--c-warning);
    font-weight: 600;
}

.alert-details small {
    color: var(--c-text-main);
    display: inline-block;
    margin-top: 4px;
}
</style>