<script setup>
defineProps({
    titulo: {
        type: String,
        default: 'Visión General del Proyecto'
    }
});
</script>

<template>
    <header class="top-header">
        <h1>{{ titulo }}</h1>
        
        <!-- Mantén aquí tu botón/icono actual de la esquina derecha -->
        <div class="user-action">
            <button class="btn-menu">
                <img src="/public/favicon.png" alt="favicon" />
            </button>
        </div>
    </header>
</template>

<style scoped>
.top-header {
    height: 12.3vh;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--c-bg-card);
    background-color: var(--c-bg-main);
    box-sizing: border-box;
}

h1 {
    margin: 0;
    font-size: 1.6rem;
    color: var(--c-text-main);
    font-family: var(--t-subtitle-font);
}

.btn-menu {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
}
.btn-menu img {
    width: 50px;
    height: 50px;
}
</style>