<script setup>
import { ref } from 'vue';
import OptionsModal from '../ui/OptionsModal.vue';

defineProps({
    titulo: {
        type: String,
        default: 'Visión General del Proyecto'
    }
});

const mostrarModal = ref(false);
</script>

<template>
    <header class="top-header">
        <h1>{{ titulo }}</h1>
        
        <div class="user-action">
            <button class="btn-menu" @click="mostrarModal = true" title="Opciones">
                <img src="/public/favicon.png" alt="favicon" />
            </button>
        </div>

        <!-- Componente Modal UI modularizado -->
        <OptionsModal 
            :isOpen="mostrarModal" 
            @close="mostrarModal = false" 
        />
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
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.btn-menu:hover {
    transform: scale(1.05);
}

.btn-menu img {
    width: 50px;
    height: 50px;
    display: block;
}
</style>