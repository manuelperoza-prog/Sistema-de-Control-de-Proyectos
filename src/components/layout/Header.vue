<script setup>
import { ref } from 'vue';
import OptionsModal from '../ui/OptionsModal.vue';
import MenuIcon from '../ui/MenuIcon.vue';

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
            <MenuIcon 
                :isOpen="mostrarModal" 
                @click="mostrarModal = !mostrarModal" 
            />
        </div>

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

.user-action {
    display: flex;
    align-items: center;
}
</style>