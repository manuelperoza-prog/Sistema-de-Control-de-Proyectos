<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

defineEmits(['click']);
</script>

<template>
    <button 
        type="button" 
        class="icon-button" 
        :class="{ 'is-open': isOpen }" 
        @click="$emit('click')"
        title="Opciones"
    >
        <svg viewBox="0 0 100 100" class="svg-icon">
            <!-- Marco base del isotipo -->
            <rect class="bg-frame" x="4" y="4" width="92" height="92" rx="22" />

            <!-- Línea 1 (Píldora y punto superior) -->
            <g class="line-group line-1">
                <rect class="pill" x="22" y="26" width="30" height="9" rx="4.5" />
                <circle class="dot" cx="60" cy="30.5" r="4.5" />
            </g>

            <!-- Línea 2 (Píldora y punto central) -->
            <g class="line-group line-2">
                <rect class="pill" x="22" y="45.5" width="44" height="9" rx="4.5" />
                <circle class="dot" cx="74" cy="50" r="4.5" />
            </g>

            <!-- Línea 3 (Píldora inferior) -->
            <g class="line-group line-3">
                <rect class="pill" x="22" y="65" width="24" height="9" rx="4.5" />
            </g>

            <!-- Insignia inferior derecha -->
            <g class="badge-group">
                <circle class="badge-circle" cx="70" cy="70" r="16" />
                <path class="badge-check" d="M 62 70 L 67 75 L 78 64" />
            </g>
        </svg>
    </button>
</template>

<style scoped>
.icon-button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    outline: none;
}

.svg-icon {
    width: 100%;
    height: 100%;
    display: block;
}

/* Marco exterior */
.bg-frame {
    fill: var(--c-bg-card);
    stroke: var(--c-bg-main);
    stroke-width: 2px;
    transition: stroke 0.3s ease;
}

.icon-button:hover .bg-frame {
    stroke: var(--c-primary);
}

/* Elementos gráficos */
.pill, .dot, .badge-group, .line-group {
    transition: transform 0.4s ease, opacity 0.3s ease, fill 0.3s ease;
}

.line-1 .pill,
.line-1 .dot {
    fill: var(--c-primary);
}

.line-2 .pill {
    fill: var(--c-primary);
}

.line-2 .dot {
    fill: var(--c-secondary);
}

.line-3 .pill {
    fill: var(--c-text-main);
    opacity: 0.35;
}

.badge-circle {
    fill: var(--c-primary);
}

.badge-check {
    fill: none;
    stroke: var(--c-text-main);
    stroke-width: 3.5px;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* --- Animación a estado activo ("X") --- */
.is-open .line-1 {
    transform-origin: 50px 50px;
    transform: translate(0, 19.5px) rotate(45deg);
}

.is-open .line-1 .pill {
    x: 22px;
    width: 56px;
    fill: var(--c-warning);
}

.is-open .line-1 .dot {
    opacity: 0;
    transform: scale(0);
}

.is-open .line-2 {
    transform-origin: 50px 50px;
    transform: rotate(-45deg);
}

.is-open .line-2 .pill {
    x: 22px;
    width: 56px;
    fill: var(--c-warning);
}

.is-open .line-2 .dot {
    opacity: 0;
    transform: scale(0);
}

.is-open .line-3 {
    opacity: 0;
    transform-origin: 22px 65px;
    transform: scaleX(0);
}

.is-open .badge-group {
    opacity: 0;
    transform-origin: 70px 70px;
    transform: scale(0);
}
</style>