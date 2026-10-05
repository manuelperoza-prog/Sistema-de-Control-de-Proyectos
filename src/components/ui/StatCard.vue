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

        <!-- Slot para inyectar elementos especiales (como la barra de progreso) -->
        <slot></slot>

        <!-- Comparativa Estimado vs Real -->
        <div v-if="estimado !== null && real !== null" class="comparison">
            <span class="est">Est: ${{ Number(estimado).toLocaleString() }}</span>
            <span class="real">Real: ${{ Number(real).toLocaleString() }}</span>
        </div>
    </div>
</template>

<style scoped>
.card {
    background-color: var(--c-bg-card);
    padding: 22px;
    border-radius: 10px;
    border: 1px solid var(--c-bg-main);
    box-sizing: border-box;
    font-family: var(--t-body-font);
    /* Transición suave para elevación y borde */
    transition: transform 0.3s ease, border-color 0.3s ease;
}

/* Efecto hover exigido */
.card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: var(--c-primary);
}

h3 {
    margin: 0;
    font-size: 1.05rem;
    color: var(--c-text-main);
    font-family: var(--t-subtitle-font);
}

.value {
    font-size: 2.1rem;
    font-weight: bold;
    margin: 12px 0 8px 0;
    color: var(--c-primary);
    font-family: var(--t-body-font);
}

.comparison {
    font-size: 0.88rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--c-bg-main);
    padding-top: 10px;
    margin-top: 10px;
    font-family: var(--t-body-font);
}

.comparison span.real {
    color: var(--c-text-main);
    font-weight: bold;
}

.comparison span.est {
    color: var(--c-text-main);
    opacity: 0.6;
}
</style>