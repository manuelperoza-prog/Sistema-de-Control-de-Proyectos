import { reactive, computed } from 'vue';

const state = reactive({
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
            fecha: '2026-10-05',
            completada: true, // Tarea concluida -> Suma a costos reales
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
            fecha: '2026-10-05', // Misma fecha que la tarea 1 para activar sobreutilización
            completada: false,
            asignacionesPersonal: [
                { personalId: 1, horas: 4 }, // Carlos acumula 6h + 4h = 10h (> 8h en el día)
                { personalId: 2, horas: 4 }  // Ana acumula 5h + 4h = 9h (> 8h en el día)
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
            fecha: '2026-10-06',
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
});


// CÁLCULOS REACTIVOS (DASHBOARD)

// Porcentaje de avance del proyecto
const avanceProyecto = computed(() => {
    if (state.tareas.length === 0) return 0;
    const completadas = state.tareas.filter(t => t.completada).length;
    return Math.round((completadas / state.tareas.length) * 100);
});

// Costo de Personal: Estimado vs Real
const costosPersonal = computed(() => {
    let estimado = 0;
    let real = 0;

    state.tareas.forEach(tarea => {
        tarea.asignacionesPersonal.forEach(asig => {
            const persona = state.personal.find(p => p.id === asig.personalId);
            if (persona) {
                const subtotal = asig.horas * persona.costoHora;
                estimado += subtotal;
                if (tarea.completada) real += subtotal;
            }
        });
    });

    return { estimado, real };
});

// Costo de Materiales: Estimado vs Real
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

// Otros Gastos: Estimado vs Real
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

// Costo Total del Proyecto: Estimado vs Real
const costoTotalProyecto = computed(() => ({
    estimado: costosPersonal.value.estimado + costosMateriales.value.estimado + costosOtros.value.estimado,
    real: costosPersonal.value.real + costosMateriales.value.real + costosOtros.value.real
}));

// Detección de Personal Sobreutilizado (> 8 horas asignadas en una misma fecha)
const personalSobreutilizado = computed(() => {
    const mapaHoras = {}; // Clave: "personalId_fecha" -> { totalHoras, tareas }

    state.tareas.forEach(tarea => {
        tarea.asignacionesPersonal.forEach(asig => {
            const clave = `${asig.personalId}_${tarea.fecha}`;
            if (!mapaHoras[clave]) {
                mapaHoras[clave] = {
                    personalId: asig.personalId,
                    fecha: tarea.fecha,
                    totalHoras: 0,
                    tareas: []
                };
            }
            mapaHoras[clave].totalHoras += asig.horas;
            mapaHoras[clave].tareas.push({ nombre: tarea.nombre, horas: asig.horas });
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


// REGLAS DE ELIMINACIÓN Y MUTACIONES

// Validaciones de dependencia (Ningún elemento puede borrarse si está/fue asignado)
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
    // No puede borrarse si tuvo o tiene asignado personal, materiales o costos
    const tienePersonal = tarea.asignacionesPersonal.length > 0;
    const tieneMateriales = tarea.materialesUsados.length > 0;
    const tieneCostos = tarea.otrosCostosUsados.length > 0;
    return !tienePersonal && !tieneMateriales && !tieneCostos;
};

// Acciones para agregar registros
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
        fecha: nuevaTarea.fecha,
        completada: false,
        asignacionesPersonal: nuevaTarea.asignacionesPersonal || [],
        materialesUsados: nuevaTarea.materialesUsados || [],
        otrosCostosUsados: nuevaTarea.otrosCostosUsados || []
    });
};

// Acciones para eliminar con validación estricta
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

// Alternar estado concluido de la tarea
const alternarEstadoTarea = (id) => {
    const tarea = state.tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
    }
};

// Exportación del hook composable del store
export const useProjectStore = () => {
    return {
        state,
        // Métricas reactivas
        avanceProyecto,
        costosPersonal,
        costosMateriales,
        costosOtros,
        costoTotalProyecto,
        personalSobreutilizado,
        // Validaciones
        puedeBorrarPersonal,
        puedeBorrarMaterial,
        puedeBorrarOtroCosto,
        puedeBorrarTarea,
        // Acciones
        agregarPersonal,
        agregarMaterial,
        agregarOtroCosto,
        agregarTarea,
        eliminarPersonal,
        eliminarMaterial,
        eliminarOtroCosto,
        eliminarTarea,
        alternarEstadoTarea
    };
};