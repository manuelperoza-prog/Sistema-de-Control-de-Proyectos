<script setup>
import { ref } from 'vue';
import { useProjectStore } from '../../store/projectStore';
import TermsContent from './TermsContent.vue';

defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const { iniciarProyectoNuevo, restablecerPorDefecto } = useProjectStore();
const mostrarTerminos = ref(false);

const cerrar = () => {
    mostrarTerminos.value = false;
    emit('close');
};

const toggleTerminos = () => {
    mostrarTerminos.value = !mostrarTerminos.value;
};

const irAGitHub = () => {
    window.open('https://github.com/manuelperoza-prog/Sistema-de-Control-de-Proyectos', '_blank');
    cerrar();
};

const accionProyectoNuevo = () => {
    const confirmar = confirm('¿Deseas iniciar un nuevo proyecto? Se borraran todos los datos registrados.');
    if (confirmar) {
        iniciarProyectoNuevo();
        cerrar();
    }
};

const accionRestablecerDefecto = () => {
    const confirmar = confirm('¿Deseas restablecer los valores por defecto del sistema?');
    if (confirmar) {
        restablecerPorDefecto();
        cerrar();
    }
};
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-backdrop" @click.self="cerrar">
            <div class="modal-card">
                <!-- Cabecera -->
                <div class="modal-header">
                    <h2>Opciones del Proyecto</h2>
                    <button class="btn-close" @click="cerrar">Cerrar</button>
                </div>

                <!-- Acciones -->
                <div class="modal-actions">
                    <button class="btn-action" @click="toggleTerminos">
                        Terminos y Condiciones
                    </button>

                    <button class="btn-action" @click="irAGitHub">
                        Contactanos
                    </button>

                    <button class="btn-action btn-warning-action" @click="accionProyectoNuevo">
                        Iniciar Proyecto Nuevo
                    </button>

                    <button class="btn-action" @click="accionRestablecerDefecto">
                        Devolver Valores por Defecto
                    </button>
                </div>

                <!-- Desplegable de Términos -->
                <div v-if="mostrarTerminos" class="terms-panel">
                    <TermsContent />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: color-mix(in srgb, var(--c-bg-sidebar) 70%, transparent);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-card {
    background-color: var(--c-bg-card);
    border: 1px solid var(--c-text-main);
    border-radius: 10px;
    width: min(90%, 640px);
    max-height: calc(100vh - 32px);
    padding: 25px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-family: var(--t-body-font);
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--c-text-main);
    padding-bottom: 12px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.3rem;
    color: var(--c-text-main);
    font-family: var(--t-subtitle-font);
}

.btn-close {
    background: transparent;
    border: 1px solid var(--c-warning);
    color: var(--c-warning);
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--t-body-font);
    font-size: 0.85rem;
    font-weight: bold;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-close:hover {
    background-color: var(--c-warning);
    color: var(--c-bg-sidebar);
}

.modal-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn-action {
    background-color: var(--c-bg-main);
    color: var(--c-text-main);
    border: 1px solid var(--c-text-main);
    padding: 14px 18px;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 0.95rem;
    font-family: var(--t-body-font);
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.btn-action:hover {
    background-color: var(--c-secondary);
    border-color: var(--c-primary);
    transform: translateX(4px);
}

.btn-warning-action {
    border-color: var(--c-warning);
    color: var(--c-warning);
}

.btn-warning-action:hover {
    background-color: var(--c-warning);
    color: var(--c-bg-sidebar);
    border-color: var(--c-warning);
}

.terms-panel {
    background-color: var(--c-bg-main);
    border: 1px solid var(--c-text-main);
    padding: 15px;
    border-radius: 6px;
    font-family: var(--t-body-font);
    max-height: min(55vh, 520px);
    overflow-y: auto;
    overscroll-behavior: contain;
}

.terms-panel h3 {
    margin: 0 0 8px 0;
    font-size: 0.95rem;
    color: var(--c-primary);
    font-family: var(--t-subtitle-font);
}

.terms-panel p {
    margin: 0 0 10px;
    font-size: 0.85rem;
    color: var(--c-text-main);
    line-height: 1.4;
    font-family: var(--t-body-font);
}

.terms-panel p:last-child {
    margin-bottom: 0;
}

@media (max-width: 600px) {
    .modal-card {
        width: calc(100% - 24px);
        padding: 18px;
    }
}
</style>