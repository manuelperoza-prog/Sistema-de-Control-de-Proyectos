// src/store/projectStore.js
import { reactive, ref, computed, watch } from 'vue';

const STORAGE_KEY = 'control_proyectos_db';

const fechaLocalActual = () => {
    const ahora = new Date();
    const desplazamiento = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora.getTime() - desplazamiento).toISOString().slice(0, 10);
};
const fechaActual = ref(fechaLocalActual());

if (typeof window !== 'undefined') {
    window.setInterval(() => {
        const hoy = fechaLocalActual();
        if (hoy !== fechaActual.value) fechaActual.value = hoy;
    }, 60000);
}

const diasEntreFechas = (inicio, fin) => {
    if (!inicio || !fin) return 0;
    const fechaInicio = Date.parse(`${inicio}T00:00:00Z`);
    const fechaFin = Date.parse(`${fin}T00:00:00Z`);
    if (Number.isNaN(fechaInicio) || Number.isNaN(fechaFin) || fechaFin < fechaInicio) return 0;
    return Math.floor((fechaFin - fechaInicio) / 86400000) + 1;
};

// Datos por defecto (se usan si no hay nada guardado en el navegador)
const datosPorDefecto = {
    personal: [
        { id: 1, nombre: 'Carlos Rodríguez', costoHora: 25 },
        { id: 2, nombre: 'Ana Martínez', costoHora: 30 },
        { id: 3, nombre: 'Luis Morales', costoHora: 20 }
    ],
    materiales: [
        { id: 1, nombre: 'Bolsa de Cemento', costoUnidad: 12 },
        { id: 2, nombre: 'Cabilla 1/2 pulgada', costoUnidad: 8 },
        { id: 3, nombre: 'Pintura Epóxica (Galón)', costoUnidad: 45 }
    ],
    otrosCostos: [
        { id: 1, concepto: 'Alquiler de Generador Eléctrico', costoUnidad: 150 },
        { id: 2, concepto: 'Transporte y Flete de Escombros', costoUnidad: 80 },
        { id: 3, concepto: 'Permisología Municipal', costoUnidad: 200 }
    ],
    tareas: [
        {
            id: 1,
            nombre: 'Preparación de Terreno y Fundaciones',
            fechaInicio: '2026-10-05',
            fechaCierre: '2026-10-05',
            completada: true,
            asignacionesPersonal: [
                { personalId: 1, horas: 6 },
                { personalId: 2, horas: 5 }
            ],
            materialesUsados: [
                { materialId: 1, cantidad: 50 },
                { materialId: 2, cantidad: 30 }
            ],
            otrosCostosUsados: [
                { costoId: 1, cantidad: 1 },
                { costoId: 2, cantidad: 2 }
            ]
        },
        {
            id: 2,
            nombre: 'Vaciado de Concreto e Instalación Eléctrica',
            fechaInicio: '2026-10-05',
            fechaCierre: '',
            completada: false,
            asignacionesPersonal: [
                { personalId: 1, horas: 4 },
                { personalId: 2, horas: 4 }
            ],
            materialesUsados: [
                { materialId: 1, cantidad: 20 },
                { materialId: 3, cantidad: 5 }
            ],
            otrosCostosUsados: [
                { costoId: 1, cantidad: 1 }
            ]
        },
        {
            id: 3,
            nombre: 'Acabados y Pintura Final',
            fechaInicio: '2026-10-06',
            fechaCierre: '',
            completada: false,
            asignacionesPersonal: [
                { personalId: 3, horas: 7 }
            ],
            materialesUsados: [
                { materialId: 3, cantidad: 8 }
            ],
            otrosCostosUsados: [
                { costoId: 3, cantidad: 1 }
            ]
        }
    ]
};

// Cargar datos iniciales desde LocalStorage o usar los predeterminados
const cargarEstadoInicial = () => {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
        try {
            const datos = JSON.parse(datosGuardados);
            datos.tareas = (datos.tareas || []).map(tarea => {
                const fechaInicio = tarea.fechaInicio || tarea.fecha || fechaLocalActual();
                return {
                    ...tarea,
                    fechaInicio,
                    fechaCierre: tarea.fechaCierre || (tarea.completada ? tarea.fecha || fechaInicio : '')
                };
            });
            return datos;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
        }
    }
    return JSON.parse(JSON.stringify(datosPorDefecto));
};

// Estado global reactivo
const state = reactive(cargarEstadoInicial());

// Sincronización automática con LocalStorage ante cualquier cambio profundo
watch(
    state,
    (nuevoEstado) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoEstado));
    },
    { deep: true }
);

// ==========================================
// CÁLCULOS REACTIVOS (DASHBOARD)
// ==========================================

const avanceProyecto = computed(() => {
    if (state.tareas.length === 0) return 0;
    const completadas = state.tareas.filter(t => t.completada).length;
    return Math.round((completadas / state.tareas.length) * 100);
});

const costosPersonal = computed(() => {
    let estimado = 0;
    let real = 0;

    state.tareas.forEach(tarea => {
        const hoy = fechaActual.value;
        const fechaFinEstimada = tarea.fechaCierre || hoy;
        const fechaFinReal = tarea.completada ? tarea.fechaCierre || hoy : hoy;
        const diasEstimados = diasEntreFechas(tarea.fechaInicio, fechaFinEstimada);
        const diasReales = diasEntreFechas(tarea.fechaInicio, fechaFinReal);

        tarea.asignacionesPersonal.forEach(asig => {
            const persona = state.personal.find(p => p.id === asig.personalId);
            if (persona) {
                estimado += asig.horas * persona.costoHora * diasEstimados;
                real += asig.horas * persona.costoHora * diasReales;
            }
        });
    });

    return { estimado, real };
});

const costosMateriales = computed(() => {
    let estimado = 0;
    let real = 0;

    state.tareas.forEach(tarea => {
        tarea.materialesUsados.forEach(item => {
            const mat = state.materiales.find(m => m.id === item.materialId);
            if (mat) {
                const subtotal = item.cantidad * mat.costoUnidad;
                estimado += subtotal;
                if (tarea.completada) real += subtotal;
            }
        });
    });

    return { estimado, real };
});

const costosOtros = computed(() => {
    let estimado = 0;
    let real = 0;

    state.tareas.forEach(tarea => {
        tarea.otrosCostosUsados.forEach(item => {
            const gasto = state.otrosCostos.find(g => g.id === item.costoId);
            if (gasto) {
                const subtotal = item.cantidad * gasto.costoUnidad;
                estimado += subtotal;
                if (tarea.completada) real += subtotal;
            }
        });
    });

    return { estimado, real };
});

const costoTotalProyecto = computed(() => ({
    estimado: costosPersonal.value.estimado + costosMateriales.value.estimado + costosOtros.value.estimado,
    real: costosPersonal.value.real + costosMateriales.value.real + costosOtros.value.real
}));

const personalSobreutilizado = computed(() => {
    const mapaHoras = {};
    const hoy = fechaActual.value;

    state.tareas.forEach(tarea => {
        const fechaFin = tarea.fechaCierre && tarea.fechaCierre < hoy ? tarea.fechaCierre : hoy;
        const dias = diasEntreFechas(tarea.fechaInicio, fechaFin);

        tarea.asignacionesPersonal.forEach(asig => {
            for (let desplazamiento = 0; desplazamiento < dias; desplazamiento += 1) {
                const fecha = new Date(Date.parse(`${tarea.fechaInicio}T00:00:00Z`) + desplazamiento * 86400000)
                    .toISOString()
                    .slice(0, 10);
                const clave = `${asig.personalId}_${fecha}`;
                if (!mapaHoras[clave]) {
                    mapaHoras[clave] = {
                        personalId: asig.personalId,
                        fecha,
                        totalHoras: 0,
                        tareas: []
                    };
                }
                mapaHoras[clave].totalHoras += asig.horas;
                mapaHoras[clave].tareas.push({ nombre: tarea.nombre, horas: asig.horas });
            }
        });
    });

    const alertas = [];
    Object.values(mapaHoras).forEach(registro => {
        if (registro.totalHoras > 8) {
            const persona = state.personal.find(p => p.id === registro.personalId);
            alertas.push({
                personalId: registro.personalId,
                nombre: persona ? persona.nombre : 'Desconocido',
                fecha: registro.fecha,
                totalHoras: registro.totalHoras,
                tareas: registro.tareas
            });
        }
    });

    return alertas;
});

// ==========================================
// REGLAS DE ELIMINACIÓN Y MUTACIONES
// ==========================================

const puedeBorrarPersonal = (id) => {
    return !state.tareas.some(t => t.asignacionesPersonal.some(a => a.personalId === id));
};

const puedeBorrarMaterial = (id) => {
    return !state.tareas.some(t => t.materialesUsados.some(m => m.materialId === id));
};

const puedeBorrarOtroCosto = (id) => {
    return !state.tareas.some(t => t.otrosCostosUsados.some(o => o.costoId === id));
};

const puedeBorrarTarea = (id) => {
    const tarea = state.tareas.find(t => t.id === id);
    if (!tarea) return false;
    const tienePersonal = tarea.asignacionesPersonal.length > 0;
    const tieneMateriales = tarea.materialesUsados.length > 0;
    const tieneCostos = tarea.otrosCostosUsados.length > 0;
    return !tienePersonal && !tieneMateriales && !tieneCostos;
};

const agregarPersonal = (nombre, costoHora) => {
    state.personal.push({
        id: Date.now(),
        nombre,
        costoHora: Number(costoHora)
    });
};

const agregarMaterial = (nombre, costoUnidad) => {
    state.materiales.push({
        id: Date.now(),
        nombre,
        costoUnidad: Number(costoUnidad)
    });
};

const agregarOtroCosto = (concepto, costoUnidad) => {
    state.otrosCostos.push({
        id: Date.now(),
        concepto,
        costoUnidad: Number(costoUnidad)
    });
};

const agregarTarea = (nuevaTarea) => {
    state.tareas.push({
        id: Date.now(),
        nombre: nuevaTarea.nombre,
        fechaInicio: nuevaTarea.fechaInicio,
        fechaCierre: nuevaTarea.fechaCierre || '',
        completada: false,
        asignacionesPersonal: nuevaTarea.asignacionesPersonal || [],
        materialesUsados: nuevaTarea.materialesUsados || [],
        otrosCostosUsados: nuevaTarea.otrosCostosUsados || []
    });
};

const eliminarPersonal = (id) => {
    if (!puedeBorrarPersonal(id)) {
        alert('No se puede eliminar este personal: está asignado a una o más tareas.');
        return false;
    }
    state.personal = state.personal.filter(p => p.id !== id);
    return true;
};

const eliminarMaterial = (id) => {
    if (!puedeBorrarMaterial(id)) {
        alert('No se puede eliminar este material: está asignado a una o más tareas.');
        return false;
    }
    state.materiales = state.materiales.filter(m => m.id !== id);
    return true;
};

const eliminarOtroCosto = (id) => {
    if (!puedeBorrarOtroCosto(id)) {
        alert('No se puede eliminar este costo: está asignado a una o más tareas.');
        return false;
    }
    state.otrosCostos = state.otrosCostos.filter(o => o.id !== id);
    return true;
};

const eliminarTarea = (id) => {
    if (!puedeBorrarTarea(id)) {
        alert('No se puede eliminar la tarea: tiene elementos o recursos asignados.');
        return false;
    }
    state.tareas = state.tareas.filter(t => t.id !== id);
    return true;
};

const alternarEstadoTarea = (id) => {
    const tarea = state.tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        if (tarea.completada && !tarea.fechaCierre) {
            tarea.fechaCierre = fechaActual.value;
        } else if (!tarea.completada) {
            tarea.fechaCierre = '';
        }
    }
};

const calcularCostoTarea = (tarea) => {
    const fechaFin = tarea.fechaCierre || fechaActual.value;
    const dias = diasEntreFechas(tarea.fechaInicio, fechaFin);
    let total = 0;

    tarea.asignacionesPersonal.forEach(asig => {
        const persona = state.personal.find(p => p.id === asig.personalId);
        if (persona) total += asig.horas * persona.costoHora * dias;
    });

    tarea.materialesUsados.forEach(item => {
        const material = state.materiales.find(m => m.id === item.materialId);
        if (material) total += item.cantidad * material.costoUnidad;
    });

    tarea.otrosCostosUsados.forEach(item => {
        const gasto = state.otrosCostos.find(g => g.id === item.costoId);
        if (gasto) total += item.cantidad * gasto.costoUnidad;
    });

    return total;
};

// ==========================================
// REINICIOS DEL MODAL (OPCIONES 3 Y 4)
// ==========================================

// 3. Iniciar Proyecto Nuevo: vacía todos los arreglos por completo
const iniciarProyectoNuevo = () => {
    state.personal = [];
    state.materiales = [];
    state.otrosCostos = [];
    state.tareas = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        personal: [],
        materiales: [],
        otrosCostos: [],
        tareas: []
    }));
};

// 4. Devolver Valores por Defecto: elimina el LocalStorage y restaura los datos iniciales
const restablecerPorDefecto = () => {
    localStorage.removeItem(STORAGE_KEY);
    state.personal = JSON.parse(JSON.stringify(datosPorDefecto.personal));
    state.materiales = JSON.parse(JSON.stringify(datosPorDefecto.materiales));
    state.otrosCostos = JSON.parse(JSON.stringify(datosPorDefecto.otrosCostos));
    state.tareas = JSON.parse(JSON.stringify(datosPorDefecto.tareas));
};

export const useProjectStore = () => {
    return {
        state,
        fechaActual,
        avanceProyecto,
        costosPersonal,
        costosMateriales,
        costosOtros,
        costoTotalProyecto,
        personalSobreutilizado,
        puedeBorrarPersonal,
        puedeBorrarMaterial,
        puedeBorrarOtroCosto,
        puedeBorrarTarea,
        agregarPersonal,
        agregarMaterial,
        agregarOtroCosto,
        agregarTarea,
        eliminarPersonal,
        eliminarMaterial,
        eliminarOtroCosto,
        eliminarTarea,
        alternarEstadoTarea,
        calcularCostoTarea,
        // Funciones para el Modal
        iniciarProyectoNuevo,
        restablecerPorDefecto,
        reiniciarDatos: restablecerPorDefecto
    };
};