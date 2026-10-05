<script setup>
import { useProjectStore } from '../store/projectStore';
import StatCard from '../components/ui/StatCard.vue';
import WarningAlert from '../components/ui/WarningAlert.vue';

const { 
    avanceProyecto, 
    costoTotalProyecto, 
    costosPersonal, 
    costosMateriales, 
    costosOtros, 
    personalSobreutilizado 
} = useProjectStore();
</script>

<template>
    <div class="dashboard-content">
        <section class="dashboard-grid">
            <StatCard title="Avance del Proyecto" :value="`${avanceProyecto}%`">
                <div class="progress-container">
                    <div class="progress-bar" :style="{ width: avanceProyecto + '%' }">
                        {{ avanceProyecto }}%
                    </div>
                </div>
            </StatCard>

            <StatCard 
                title="Costo Total del Proyecto" 
                :value="`$${costoTotalProyecto.real.toLocaleString()}`"
                :estimado="costoTotalProyecto.estimado"
                :real="costoTotalProyecto.real"
            />

            <StatCard 
                title="Costo de Personal" 
                :value="`$${costosPersonal.real.toLocaleString()}`"
                :estimado="costosPersonal.estimado"
                :real="costosPersonal.real"
            />

            <StatCard 
                title="Costo de Materiales" 
                :value="`$${costosMateriales.real.toLocaleString()}`"
                :estimado="costosMateriales.estimado"
                :real="costosMateriales.real"
            />

            <StatCard 
                title="Otros Gastos" 
                :value="`$${costosOtros.real.toLocaleString()}`"
                :estimado="costosOtros.estimado"
                :real="costosOtros.real"
            />
        </section>

        <section class="alerts-section">
            <h3>⚠️ Alertas: Personal Sobreutilizado (&gt; 8h/día)</h3>
            
            <div v-if="personalSobreutilizado.length === 0" class="no-alerts">
                No hay personal sobreutilizado actualmente.
            </div>

            <WarningAlert 
                v-for="alerta in personalSobreutilizado" 
                :key="alerta.personalId + alerta.fecha"
                :nombre="alerta.nombre"
                :totalHoras="alerta.totalHoras"
                :fecha="alerta.fecha"
                :tareas="alerta.tareas"
            />
        </section>
    </div>
</template>

<style scoped>
.dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    font-family: var(--t-body-font);
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
}

.progress-container {
    width: 100%;
    background-color: var(--c-bg-main);
    border-radius: 20px;
    margin-top: 10px;
    overflow: hidden;
    height: 18px;
}

.progress-bar {
    height: 100%;
    background-color: var(--c-primary);
    text-align: center;
    color: var(--c-text-main);
    font-size: 0.75rem;
    line-height: 18px;
    font-weight: bold;
    font-family: var(--t-body-font);
    transition: width 1s ease-in-out;
}

.alerts-section {
    background-color: var(--c-bg-card);
    padding: 25px;
    border-radius: 10px;
    border: 1px solid var(--c-bg-main);
}

.alerts-section h3 {
    margin: 0 0 15px 0;
    color: var(--c-warning);
    font-family: var(--t-subtitle-font);
    display: flex;
    align-items: center;
    gap: 10px;
}

.no-alerts {
    color: var(--c-text-main);
    opacity: 0.7;
    font-size: 0.95rem;
    font-family: var(--t-body-font);
}
</style>