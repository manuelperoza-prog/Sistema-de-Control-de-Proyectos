<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    estimado: {
        type: [String, Number],
        default: null
    },
    real: {
        type: [String, Number],
        default: null
    }
});
</script>

<template>
    <div class="card">
        <h3>{{ title }}</h3>
        <div class="value">{{ value }}</div>

        <!-- Slot para contenido personalizado (como la barra de progreso) -->
        <slot></slot>

        <!-- Comparación condicional (solo aparece si pasas estimado y real) -->
        <div v-if="estimado !== null && real !== null" class="comparison">
            <span class="est">Est: ${{ Number(estimado).toLocaleString() }}</span>
            <span class="real">Real: ${{ Number(real).toLocaleString() }}</span>
        </div>
    </div>
</template>

<style scoped>
.card {
    background-color: var(--c-bg-card);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px var(--c-bg-main);
    border: 1px solid var(--c-bg-card);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 20px var(--c-bg-main);
    border-color: var(--c-secondary);
}

h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--c-text-main);
    opacity: 0.9;
}

.value {
    font-size: 2rem;
    font-weight: bold;
    margin: 10px 0;
    color: var(--c-primary);
}

.comparison {
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--c-bg-main);
    padding-top: 10px;
    margin-top: 10px;
}

.comparison span.real {
    color: var(--c-text-main);
    font-weight: bold;
}

.comparison span.est {
    color: var(--c-bg-card);
}
</style>