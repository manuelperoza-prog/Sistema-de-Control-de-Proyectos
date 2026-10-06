<script setup>
defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    }
});

defineEmits(['click']);
</script>

<template>
    <button 
        type="button" 
        class="btn-delete" 
        :disabled="disabled" 
        :title="title"
        @click="$emit('click')"
    >
        <svg viewBox="0 0 448 512" class="svg-icon">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
        </svg>
    </button>
</template>

<style scoped>
.btn-delete {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-bg-sidebar);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    padding: 0;
    margin: 0 auto;
    vertical-align: middle;
}

.svg-icon {
    width: 14px;
    height: 14px;
    transition-duration: 0.3s;
    display: block;
}

.svg-icon path {
    fill: var(--c-text-main);
    transition-duration: 0.3s;
}

.btn-delete::before {
    position: absolute;
    top: -20px;
    content: "Eliminar";
    color: var(--c-bg-sidebar);
    font-family: var(--t-body-font);
    font-weight: bold;
    transition-duration: 0.3s;
    font-size: 2px;
    opacity: 0;
}

.btn-delete:hover:not(:disabled) {
    width: 125px;
    border-radius: 50px;
    background-color: var(--c-warning);
    border-color: var(--c-warning);
}

.btn-delete:hover:not(:disabled) .svg-icon {
    width: 15px;
    height: 15px;
    transform: translateY(60%);
}

.btn-delete:hover:not(:disabled) .svg-icon path {
    fill: var(--c-bg-sidebar);
}

.btn-delete:hover:not(:disabled)::before {
    font-size: 13px;
    opacity: 1;
    transform: translateY(28px);
}

.btn-delete:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: var(--c-bg-sidebar);
}
</style>