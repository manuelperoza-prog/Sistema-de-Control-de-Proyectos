<template>
    <div class="terms-content">
        <h2>Términos y Condiciones de Uso — Sistema de Control de Proyectos</h2>
        <p><strong>Última actualización:</strong> 7 de octubre de 2026</p>
        <p>Le solicitamos leer detenidamente los siguientes Términos y Condiciones antes de operar la plataforma, módulos analíticos y herramientas de gestión del Sistema de Control de Proyectos.</p>

        <p><strong>1. Definiciones e Interpretación:</strong> Para los efectos de este documento, se define como <em>"Servicio"</em>, <em>"Sistema"</em> o <em>"Plataforma"</em> a la aplicación web accesible mediante la dirección oficial (https://sistema-de-control-de-proyectos.vercel.app). Se define como <em>"Usuario"</em> a cualquier persona física o jurídica que ingrese y gestione información dentro del sistema. Por <em>"Administración"</em> o <em>"Nosotros"</em> se hace referencia al titular y equipo desarrollador de la plataforma.</p>

        <p><strong>2. Aceptación y Capacidad Operativa:</strong> La navegación, carga de datos o interacción con los módulos del sistema implica la adhesión plena e incondicional a estos términos. El usuario declara contar con capacidad legal suficiente para vincularse contractualmente bajo la legislación vigente aplicable.</p>

        <p><strong>3. Alcance Operativo y Modelos de Cálculo:</strong> La plataforma permite la creación y parametrización de tareas, recursos humanos con tarifas por hora, materiales y costos asociados con valores unitarios. El sistema procesa métricas de control presupuestario mediante tableros dinámicos que contrastan costos estimados frente a costos reales (determinados al concluir las actividades), así como alertas de sobreutilización de jornada laboral (cuando un recurso supera las 8 horas diarias de asignación).</p>

        <p><strong>4. Almacenamiento Local, Persistencia y Privacidad de Datos:</strong> La persistencia de los registros se fundamenta en un modelo de almacenamiento local descentralizado (*client-side storage*), gestionado a través de estructuras en memoria (arreglos) sincronizadas con el almacenamiento del navegador del usuario (<em>Web Storage / LocalStorage</em>). La plataforma opera bajo un principio estricto de privacidad por diseño: ningún dato de proyectos, personal o costos es transmitido ni almacenado en bases de datos o servidores centrales externos. En consecuencia:
        <br>a) La persistencia está sujeta exclusivamente al navegador, dispositivo y dominio de origen utilizados por el usuario.
        <br>b) La eliminación intencional o accidental de la memoria caché, el uso de modos de navegación privada o la limpieza del almacenamiento local del navegador ocasionará la pérdida irreversible de los registros, eximiendo a la administración de cualquier responsabilidad.</p>

        <p><strong>5. Integridad Referencial y Regla de No Eliminación:</strong> Para asegurar la coherencia en la auditoría presupuestaria y evitar inconsistencias en el balance financiero de costos reales, el sistema aplica una regla inmutable de integridad referencial: ningún elemento (personal, material o concepto de gasto) podrá ser eliminado si se encuentra actualmente vinculado o ha estado asignado previamente a una tarea dentro del ciclo operativo. Dicha restricción es parte inherente de la lógica transaccional del software.</p>

        <p><strong>6. Propiedad Intelectual:</strong> La arquitectura de software, algoritmos de cálculo, diseño gráfico, componentes visuales, transformaciones y transiciones de interfaz son propiedad exclusiva del titular del software y están protegidos por la normativa de derechos de autor y propiedad intelectual aplicable[cite: 1, 2]. Queda prohibida su reproducción o explotación comercial no autorizada.</p>

        <p><strong>7. Exclusión de Garantías y Limitación de Responsabilidad:</strong> El servicio se provee "tal cual" (<em>as is</em>) y "según disponibilidad" (<em>as available</em>). La administración no asume responsabilidad alguna por discrepancias derivadas de insumos incorrectos proporcionados por el operador, ni por pérdidas de información ocasionadas por fallos en el navegador cliente, desbordamientos de cuota de almacenamiento local o cierres forzados del entorno de ejecución. Las métricas visualizadas constituyen herramientas de apoyo operativo y no reemplazan dictámenes contables o peritajes laborales formales[cite: 1, 2].</p>

        <p><strong>8. Proveedores y Enlaces de Terceros:</strong> El sistema puede hacer uso de infraestructura de alojamiento web estático o enlaces a repositorios públicos de código abierto ajenos a nuestro control[cite: 1]. La administración no asume responsabilidad por las políticas o disponibilidad de dichos proveedores externos de infraestructura[cite: 1].</p>

        <p><strong>9. Jurisdicción y Ley Aplicable:</strong> Las relaciones derivadas del uso de esta plataforma se rigen e interpretan conforme a las leyes de la República Bolivariana de Venezuela[cite: 1]. El acceso global y transfronterizo a través de internet se realiza bajo la exclusiva responsabilidad del usuario internacional respecto al cumplimiento de sus leyes locales. Cualquier diferencia o controversia será canalizada preferentemente mediante resolución directa y amistosa entre las partes previo a acudir a la jurisdicción ordinaria competente en territorio venezolano[cite: 1].</p>

        <p><strong>10. Modificaciones y Contacto:</strong> La administración se reserva el derecho de modificar estos términos en cualquier momento, adquiriendo vigencia a partir de su publicación en el sistema[cite: 1]. Para consultas o reportes técnicos, los usuarios pueden dirigirse al canal oficial del proyecto en: https://github.com/manuelperoza-prog/Sistema-de-Control-de-Proyectos[cite: 1].</p>
    </div>
</template>

<style scoped>
.terms-content {
    color: var(--c-text-main);
    font-family: var(--t-body-font);
    font-size: 0.9rem;
    line-height: 1.55;
}

.terms-content h2 {
    margin: 0 0 12px;
    color: var(--c-text-main);
    font-family: var(--t-subtitle-font);
    font-size: 1.15rem;
    line-height: 1.35;
}

.terms-content p {
    margin: 0 0 12px;
}

.terms-content p:last-child {
    margin-bottom: 0;
}
</style>