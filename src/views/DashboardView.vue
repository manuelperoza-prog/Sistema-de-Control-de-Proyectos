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
        <!-- Tarjetas Principales del Dashboard -->
        <section class="dashboard-grid">
            
            <!-- 1. Avance General -->
            <StatCard title="Avance del Proyecto" :value="`${avanceProyecto}%`">
                <div class="progress-track">
                    <div class="progress-fill" :style="{ width: avanceProyecto + '%' }">
                        <span v-if="avanceProyecto > 10">{{ avanceProyecto }}%</span>
                    </div>
                </div>
            </StatCard>

            <!-- 2. Costo Total del Proyecto -->
            <StatCard 
                title="Costo Total del Proyecto" 
                :value="`$${costoTotalProyecto.real.toLocaleString()}`"
                :estimado="costoTotalProyecto.estimado"
                :real="costoTotalProyecto.real"
            />

            <!-- 3. Costo de Personal -->
            <StatCard 
                title="Costo de Personal" 
                :value="`$${costosPersonal.real.toLocaleString()}`"
                :estimado="costosPersonal.estimado"
                :real="costosPersonal.real"
            />

            <!-- 4. Costo de Materiales -->
            <StatCard 
                title="Costo de Materiales" 
                :value="`$${costosMateriales.real.toLocaleString()}`"
                :estimado="costosMateriales.estimado"
                :real="costosMateriales.real"
            />

            <!-- 5. Otros Costos -->
            <StatCard 
                title="Otros Gastos" 
                :value="`$${costosOtros.real.toLocaleString()}`"
                :estimado="costosOtros.estimado"
                :real="costosOtros.real"
            />
        </section>

        <!-- Contenedor de Alertas de Sobreutilización -->
        <section class="alerts-section">
            <h3>⚠️ Alertas: Personal Sobreutilizado (&gt; 8h/día)</h3>
            
            <div v-if="personalSobreutilizado.length === 0" class="no-alerts">
                No hay personal con exceso de horas asignadas.
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

/* Barra de progreso reactiva dentro del slot */
.progress-track {
    width: 100%;
    background-color: var(--c-bg-main);
    border-radius: 20px;
    margin-top: 10px;
    overflow: hidden;
    height: 18px;
    border: 1px solid var(--c-bg-sidebar);
}

.progress-fill {
    height: 100%;
    background-color: var(--c-primary);
    text-align: center;
    color: var(--c-text-main);
    font-size: 0.75rem;
    line-height: 18px;
    font-weight: bold;
    font-family: var(--t-body-font);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Bloque de alertas */
.alerts-section {
    background-color: var(--c-bg-card);
    padding: 25px;
    border-radius: 10px;
    border: 1px solid var(--c-bg-main);
}

.alerts-section h3 {
    margin: 0 0 16px 0;
    color: var(--c-warning);
    font-family: var(--t-subtitle-font);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.15rem;
}

.no-alerts {
    color: var(--c-text-main);
    opacity: 0.6;
    font-size: 0.95rem;
    font-family: var(--t-body-font);
}
</style>