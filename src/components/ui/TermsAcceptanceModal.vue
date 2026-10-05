<script setup>
import TermsContent from './TermsContent.vue';

const emit = defineEmits(['accepted']);

const acceptTerms = () => {
    emit('accepted');
};

const rejectTerms = () => {
    window.location.replace('about:blank');
};
</script>

<template>
    <Teleport to="body">
        <div class="consent-backdrop">
            <section
                class="consent-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="consent-title"
            >
                <header class="consent-header">
                    <h1 id="consent-title">Antes de continuar</h1>
                    <p>Lee los términos y condiciones. Debes aceptarlos para ingresar al sistema.</p>
                </header>

                <div class="consent-terms">
                    <TermsContent />
                </div>

                <footer class="consent-actions">
                    <button class="btn-reject" type="button" @click="rejectTerms">
                        Rechazar términos
                    </button>
                    <button class="btn-accept" type="button" @click="acceptTerms">
                        Aceptar términos y condiciones
                    </button>
                </footer>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
.consent-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background-color: color-mix(in srgb, var(--c-bg-sidebar) 88%, transparent);
}

.consent-modal {
    display: flex;
    flex-direction: column;
    width: min(760px, 100%);
    max-height: min(900px, calc(100vh - 32px));
    padding: 24px;
    box-sizing: border-box;
    border: 1px solid var(--c-primary);
    border-radius: 12px;
    background-color: var(--c-bg-card);
    color: var(--c-text-main);
    font-family: var(--t-body-font);
    box-shadow: 0 18px 60px rgb(0 0 0 / 55%);
}

.consent-header h1 {
    margin: 0;
    font-family: var(--t-subtitle-font);
    font-size: 1.4rem;
}

.consent-header p {
    margin: 8px 0 16px;
    opacity: 0.8;
}

.consent-terms {
    min-height: 0;
    padding: 18px;
    overflow-y: auto;
    border: 1px solid var(--c-bg-sidebar);
    border-radius: 8px;
    background-color: var(--c-bg-main);
    overscroll-behavior: contain;
}

.consent-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-top: 18px;
}

.consent-actions button {
    min-height: 44px;
    padding: 10px 16px;
    border: 0;
    border-radius: 6px;
    color: var(--c-text-main);
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    transition: filter 0.2s ease, transform 0.2s ease;
}

.consent-actions button:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
}

.consent-actions button:focus-visible {
    outline: 3px solid var(--c-text-main);
    outline-offset: 3px;
}

.btn-reject {
    background-color: var(--c-warning);
}

.btn-accept {
    background-color: var(--c-primary);
}

@media (max-width: 520px) {
    .consent-modal {
        padding: 16px;
    }

    .consent-terms {
        padding: 12px;
    }

    .consent-actions {
        flex-direction: column;
    }
}
</style>
