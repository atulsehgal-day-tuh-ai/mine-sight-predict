
import type { Risk, RiskLevel, HistoricalAccident, AccidentSeverity, AreaCCOInspections, RiskFactor, AreaRiskFactorRatings } from '@/types';

const createTrendData = (baseValue: number, level: RiskLevel): { date: string; value: number }[] => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) { // Generate data for the last 12 weeks, week 0 is 11 weeks ago, week 11 is today
    const date = new Date(today);
    date.setDate(today.getDate() - (11 - i) * 7); // Go back (11-i) weeks
    
    let value;
    switch (level) {
      case 'critical':
        // Start high, strong upward trend
        value = Math.round(baseValue + (i * 0.7) + (Math.random() * 3));
        break;
      case 'high':
        // Start moderately high, moderate upward trend
        value = Math.round(baseValue + (i * 0.5) + (Math.random() * 2.5) - 1);
        break;
      case 'medium':
        // Start mid, relatively flat trend with some fluctuation
        value = Math.round(baseValue + (Math.random() - 0.5) * 10);
        break;
      case 'low':
        // Start moderately low, moderate downward trend
        value = Math.round(baseValue - (i * 0.5) + (Math.random() * -2.5) + 1);
        break;
      default:
        value = Math.round(baseValue + (Math.random() - 0.5) * 10);
    }
    // Clamp values between 5 and 100
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.min(100, Math.max(5, value)), 
    });
  }
  return data;
};


export const MOCK_RISKS: Risk[] = [
  {
    id: 'risk-co',
    name: 'Caída de Objetos',
    description: 'Caída de objeto desde altura',
    level: 'critical', 
    rank: 1,
    causes: [
      { id: 'c-co-1', name: 'Fallo en el aseguramiento de herramientas o materiales.', probabilityOrImpact: 0.75 },
      { id: 'c-co-2', name: 'Vibraciones durante operación de equipos en altura.', probabilityOrImpact: 0.6 },
      { id: 'c-co-3', name: 'Mal estado o deterioro de estructuras de soporte (bandejas, racks, barandas).', probabilityOrImpact: 0.65 },
      { id: 'c-co-4', name: 'Impacto de equipos móviles o maquinaria contra estructuras elevadas.', probabilityOrImpact: 0.5 },
      { id: 'c-co-5', name: 'Trabajo en altura sin procedimientos de aseguramiento de herramientas.', probabilityOrImpact: 0.8 },
      { id: 'c-co-6', name: 'Condiciones ambientales (viento fuerte, lluvias).', probabilityOrImpact: 0.45 },
      { id: 'c-co-7', name: 'Instalación defectuosa de componentes estructurales.', probabilityOrImpact: 0.55 },
    ],
    preventiveControls: [
      { id: 'pc-co-1', name: 'Uso obligatorio de dispositivos de retención de herramientas y materiales (lanyards, redes, bolsas de herramientas con amarre).', effectiveness: 0.85 },
      { id: 'pc-co-2', name: 'Inspecciones regulares de estructuras en altura (plataformas, bandejas de cables, barandas).', effectiveness: 0.8 },
      { id: 'pc-co-3', name: 'Procedimientos de aseguramiento de carga implementados en trabajos en altura.', effectiveness: 0.75 },
      { id: 'pc-co-4', name: 'Diseño estructural con protección contra caídas de objetos (redes, cubiertas, paneles de contención).', effectiveness: 0.9 },
      { id: 'pc-co-5', name: 'Capacitación específica en prevención de caída de objetos para trabajadores en altura.', effectiveness: 0.7 },
      { id: 'pc-co-6', name: 'Permiso de trabajo en altura que contemple control de caída de objetos.', effectiveness: 0.75 },
      { id: 'pc-co-7', name: 'Evaluaciones meteorológicas antes de trabajos en altura.', effectiveness: 0.6 },
      { id: 'pc-co-8', name: 'Separación física o desvío de tránsito de maquinaria pesada cerca de estructuras elevadas.', effectiveness: 0.65 },
    ],
    mitigatingControls: [
      { id: 'mc-co-1', name: 'Instalación de zonas de exclusión bajo áreas de trabajo en altura (con barreras físicas y señalización).', effectiveness: 0.8 },
      { id: 'mc-co-2', name: 'Uso de cascos de seguridad certificados en toda el área de riesgo.', effectiveness: 0.9 },
      { id: 'mc-co-3', name: 'Sistemas de captura de objetos (redes anticaída, bandejas de retención).', effectiveness: 0.75 },
      { id: 'mc-co-4', name: 'Procedimientos de evacuación rápida y protocolos de emergencia.', effectiveness: 0.7 },
      { id: 'mc-co-5', name: 'Monitoreo activo durante operaciones de alto riesgo.', effectiveness: 0.65 },
      { id: 'mc-co-6', name: 'Seguro de responsabilidad civil y protocolos de respuesta post-accidente.', effectiveness: 0.5 },
    ],
    consequences: [
      { id: 'cq-co-1', name: 'Lesiones graves o fatales a personas en niveles inferiores.', probabilityOrImpact: 0.9 },
      { id: 'cq-co-2', name: 'Daños a maquinaria, equipos o infraestructura.', probabilityOrImpact: 0.8 },
      { id: 'cq-co-3', name: 'Interrupciones operativas.', probabilityOrImpact: 0.85 },
      { id: 'cq-co-4', name: 'Daño a la reputación corporativa.', probabilityOrImpact: 0.7 },
      { id: 'cq-co-5', name: 'Costos por reparaciones, indemnizaciones y sanciones regulatorias.', probabilityOrImpact: 0.75 },
    ],
    trendData: createTrendData(88, 'critical'),
  },
  {
    id: 'risk-ce',
    name: 'Contacto con Energía Eléctrica',
    description: 'Contacto no controlado con energía eléctrica',
    level: 'high', 
    rank: 2,
    causes: [
      { id: 'c-ce-1', name: 'Mantenimiento o reparación de equipos eléctricos sin corte de energía.', probabilityOrImpact: 0.8 },
      { id: 'c-ce-2', name: 'Fallo de aislamiento en cables o componentes eléctricos.', probabilityOrImpact: 0.7 },
      { id: 'c-ce-3', name: 'Manipulación inadecuada de tableros eléctricos o celdas.', probabilityOrImpact: 0.65 },
      { id: 'c-ce-4', name: 'Uso de herramientas no aisladas o equipos defectuosos.', probabilityOrImpact: 0.6 },
      { id: 'c-ce-5', name: 'Equipos eléctricos expuestos a condiciones de humedad o agua.', probabilityOrImpact: 0.55 },
      { id: 'c-ce-6', name: 'Instalaciones eléctricas deterioradas o sin mantenimiento.', probabilityOrImpact: 0.75 },
      { id: 'c-ce-7', name: 'Trabajos en áreas energizadas sin permisos o procedimientos específicos.', probabilityOrImpact: 0.85 },
      { id: 'c-ce-8', name: 'Desconocimiento de los riesgos eléctricos por parte de los trabajadores.', probabilityOrImpact: 0.5 },
    ],
    preventiveControls: [
      { id: 'pc-ce-1', name: 'Procedimiento de bloqueo y etiquetado (“Lock Out Tag Out” - LOTO) obligatorio antes de intervenir instalaciones eléctricas.', effectiveness: 0.95 },
      { id: 'pc-ce-2', name: 'Inspecciones periódicas de equipos, tableros y cables eléctricos.', effectiveness: 0.8 },
      { id: 'pc-ce-3', name: 'Instalación de protecciones diferenciales (RCDs) y sistemas de desconexión rápida.', effectiveness: 0.9 },
      { id: 'pc-ce-4', name: 'Uso de equipos de protección personal (EPP) certificado para trabajos eléctricos (guantes dieléctricos, ropa ignífuga, casco dieléctrico).', effectiveness: 0.85 },
      { id: 'pc-ce-5', name: 'Capacitación en seguridad eléctrica para todo el personal relacionado.', effectiveness: 0.75 },
      { id: 'pc-ce-6', name: 'Señalización clara de zonas energizadas o de alto voltaje.', effectiveness: 0.7 },
      { id: 'pc-ce-7', name: 'Procedimientos de verificación de ausencia de tensión antes de iniciar trabajos.', effectiveness: 0.9 },
      { id: 'pc-ce-8', name: 'Diseño de instalaciones eléctricas según normas de minería (Ej: NCh Elec. 4/2003 en Chile o estándares IEC/IEEE aplicables).', effectiveness: 0.8 },
    ],
    mitigatingControls: [
      { id: 'mc-ce-1', name: 'Instalación de sistemas de detección y corte automático en caso de fallas eléctricas.', effectiveness: 0.85 },
      { id: 'mc-ce-2', name: 'Protocolos de emergencia médica inmediata (RCP y uso de desfibriladores - DEA disponibles en sitio).', effectiveness: 0.9 },
      { id: 'mc-ce-3', name: 'Delimitación de zonas de riesgo eléctrico con acceso restringido.', effectiveness: 0.7 },
      { id: 'mc-ce-4', name: 'Planes de evacuación y respuesta ante incidentes eléctricos.', effectiveness: 0.75 },
      { id: 'mc-ce-5', name: 'Equipos de extinción de incendios específicos para riesgos eléctricos (extintores clase C).', effectiveness: 0.8 },
      { id: 'mc-ce-6', name: 'Aseguramiento de comunicaciones de emergencia disponibles en todas las áreas de operación.', effectiveness: 0.65 },
    ],
    consequences: [
      { id: 'cq-ce-1', name: 'Lesiones graves o fatales por electrocución.', probabilityOrImpact: 0.95 },
      { id: 'cq-ce-2', name: 'Incendios en instalaciones eléctricas.', probabilityOrImpact: 0.7 },
      { id: 'cq-ce-3', name: 'Daños severos a equipos e infraestructura crítica.', probabilityOrImpact: 0.8 },
      { id: 'cq-ce-4', name: 'Pérdida de continuidad operacional.', probabilityOrImpact: 0.85 },
      { id: 'cq-ce-5', name: 'Costos por sanciones legales, seguros e indemnizaciones.', probabilityOrImpact: 0.6 },
      { id: 'cq-ce-6', name: 'Afectación reputacional y pérdida de licencias regulatorias.', probabilityOrImpact: 0.65 },
    ],
    trendData: createTrendData(75, 'high'),
  },
  {
    id: 'risk-ca',
    name: 'Caída de Altura',
    description: 'Caída de persona desde altura',
    level: 'high', 
    rank: 3,
    causes: [
      { id: 'c-ca-1', name: 'Trabajos en altura sin protección colectiva (barandas, plataformas cerradas).', probabilityOrImpact: 0.8 },
      { id: 'c-ca-2', name: 'Uso incorrecto o ausencia de sistemas de protección personal contra caídas (arnés, línea de vida).', probabilityOrImpact: 0.85 },
      { id: 'c-ca-3', name: 'Superficies de trabajo resbaladizas, inestables o deterioradas.', probabilityOrImpact: 0.7 },
      { id: 'c-ca-4', name: 'Condiciones meteorológicas adversas (viento fuerte, lluvia).', probabilityOrImpact: 0.5 },
      { id: 'c-ca-5', name: 'Falta de capacitación específica en trabajo seguro en altura.', probabilityOrImpact: 0.75 },
      { id: 'c-ca-6', name: 'Falta de inspección previa de las áreas de trabajo en altura.', probabilityOrImpact: 0.65 },
      { id: 'c-ca-7', name: 'Fatiga o distracción del trabajador durante la tarea.', probabilityOrImpact: 0.6 },
      { id: 'c-ca-8', name: 'Instalaciones improvisadas o no certificadas para acceso en altura (escaleras, andamios, plataformas).', probabilityOrImpact: 0.7 },
    ],
    preventiveControls: [
      { id: 'pc-ca-1', name: 'Instalación de protecciones colectivas como barandas, pasarelas cerradas y cubiertas antideslizantes.', effectiveness: 0.9 },
      { id: 'pc-ca-2', name: 'Uso obligatorio de arnés de seguridad certificado y líneas de vida ancladas correctamente.', effectiveness: 0.95 },
      { id: 'pc-ca-3', name: 'Evaluación previa de riesgos específicos antes de cada tarea en altura.', effectiveness: 0.8 },
      { id: 'pc-ca-4', name: 'Inspecciones diarias de andamios, escaleras, plataformas de trabajo y líneas de vida.', effectiveness: 0.85 },
      { id: 'pc-ca-5', name: 'Capacitación continua en procedimientos seguros de trabajo en altura (incluyendo rescate en altura).', effectiveness: 0.75 },
      { id: 'pc-ca-6', name: 'Control de acceso a áreas de trabajo en altura solo a personal autorizado y capacitado.', effectiveness: 0.7 },
      { id: 'pc-ca-7', name: 'Revisión de condiciones climáticas antes de iniciar trabajos en altura.', effectiveness: 0.6 },
      { id: 'pc-ca-8', name: 'Uso de sistemas de anclaje certificados y verificados antes de su uso.', effectiveness: 0.9 },
    ],
    mitigatingControls: [
      { id: 'mc-ca-1', name: 'Instalación de sistemas de detención de caídas como redes de seguridad.', effectiveness: 0.8 },
      { id: 'mc-ca-2', name: 'Implementación de planes de rescate en altura bien definidos y ensayados regularmente.', effectiveness: 0.85 },
      { id: 'mc-ca-3', name: 'Disponibilidad de brigadas de rescate formadas y entrenadas en recuperación de trabajadores en altura.', effectiveness: 0.75 },
      { id: 'mc-ca-4', name: 'Equipos de primeros auxilios y desfibriladores automáticos externos (DEA) cercanos al área de trabajo.', effectiveness: 0.7 },
      { id: 'mc-ca-5', name: 'Procedimientos de activación rápida de servicios de emergencia internos o externos.', effectiveness: 0.7 },
      { id: 'mc-ca-6', name: 'Monitoreo y supervisión continua durante todas las actividades en altura.', effectiveness: 0.65 },
    ],
    consequences: [
      { id: 'cq-ca-1', name: 'Lesiones graves o muerte del trabajador.', probabilityOrImpact: 0.95 },
      { id: 'cq-ca-2', name: 'Daños estructurales en la infraestructura por caída del cuerpo o herramientas.', probabilityOrImpact: 0.6 },
      { id: 'cq-ca-3', name: 'Interrupción de actividades operativas.', probabilityOrImpact: 0.8 },
      { id: 'cq-ca-4', name: 'Costos elevados por indemnizaciones, multas o sanciones regulatorias.', probabilityOrImpact: 0.7 },
      { id: 'cq-ca-5', name: 'Impacto en la moral de los trabajadores y en la cultura de seguridad.', probabilityOrImpact: 0.65 },
      { id: 'cq-ca-6', name: 'Pérdida de reputación y licencias de operación.', probabilityOrImpact: 0.7 },
    ],
    trendData: createTrendData(72, 'high'),
  },
  {
    id: 'risk-il',
    name: 'Inundación de Labores Subterráneas',
    description: 'Ingreso masivo de agua a áreas de trabajo subterráneas.',
    level: 'medium', 
    rank: 4,
    causes: [
      { id: 'c-il-1', name: 'Fallas en sistemas de bombeo.', probabilityOrImpact: 0.7 },
      { id: 'c-il-2', name: 'Rotura de cañerías o embalses cercanos.', probabilityOrImpact: 0.6 },
      { id: 'c-il-3', name: 'Eventos climáticos extremos (lluvias intensas).', probabilityOrImpact: 0.5 },
    ],
    preventiveControls: [
      { id: 'pc-il-1', name: 'Mantenimiento preventivo de bombas y sistemas de drenaje.', effectiveness: 0.85 },
      { id: 'pc-il-2', name: 'Monitoreo de niveles freáticos y cuerpos de agua cercanos.', effectiveness: 0.75 },
    ],
    mitigatingControls: [
      { id: 'mc-il-1', name: 'Sistemas de alerta temprana de inundación.', effectiveness: 0.8 },
      { id: 'mc-il-2', name: 'Rutas de evacuación y refugios seguros.', effectiveness: 0.9 },
    ],
    consequences: [
      { id: 'cq-il-1', name: 'Atrapamiento y ahogamiento de personal.', probabilityOrImpact: 0.95 },
      { id: 'cq-il-2', name: 'Pérdida de equipos y paralización de la producción.', probabilityOrImpact: 0.9 },
    ],
    trendData: createTrendData(55, 'medium'),
  },
  {
    id: 'risk-gt',
    name: 'Exposición a Gases Tóxicos',
    description: 'Presencia de gases nocivos en el ambiente laboral (CO, H2S, etc.).',
    level: 'medium', 
    rank: 5,
    causes: [
      { id: 'c-gt-1', name: 'Ventilación deficiente en labores subterráneas.', probabilityOrImpact: 0.75 },
      { id: 'c-gt-2', name: 'Emanaciones de gases desde la roca o procesos.', probabilityOrImpact: 0.65 },
      { id: 'c-gt-3', name: 'Fallas en equipos de detección de gases.', probabilityOrImpact: 0.55 },
    ],
    preventiveControls: [
      { id: 'pc-gt-1', name: 'Sistemas de ventilación forzada y monitoreo continuo de gases.', effectiveness: 0.9 },
      { id: 'pc-gt-2', name: 'Uso de detectores de gases portátiles por personal.', effectiveness: 0.8 },
    ],
    mitigatingControls: [
      { id: 'mc-gt-1', name: 'Equipos de respiración autónoma (ERA) y auto-rescatadores.', effectiveness: 0.85 },
      { id: 'mc-gt-2', name: 'Procedimientos de evacuación y zonas de refugio con aire limpio.', effectiveness: 0.75 },
    ],
    consequences: [
      { id: 'cq-gt-1', name: 'Intoxicación, asfixia o fatalidades.', probabilityOrImpact: 0.85 },
      { id: 'cq-gt-2', name: 'Enfermedades respiratorias crónicas.', probabilityOrImpact: 0.7 },
    ],
    trendData: createTrendData(50, 'medium'),
  },
  {
    id: 'risk-am',
    name: 'Atrapamiento por Maquinaria',
    description: 'Partes del cuerpo atrapadas por componentes móviles de equipos.',
    level: 'medium', 
    rank: 6,
    causes: [
      { id: 'c-am-1', name: 'Falta de guardas de protección en maquinaria.', probabilityOrImpact: 0.8 },
      { id: 'c-am-2', name: 'Intervención de equipos en movimiento sin bloqueo.', probabilityOrImpact: 0.7 },
      { id: 'c-am-3', name: 'Ropa suelta o elementos personales que pueden engancharse.', probabilityOrImpact: 0.6 },
    ],
    preventiveControls: [
      { id: 'pc-am-1', name: 'Instalación y mantenimiento de guardas y protecciones físicas.', effectiveness: 0.9 },
      { id: 'pc-am-2', name: 'Procedimientos LOTO (Lockout/Tagout) para mantenimiento.', effectiveness: 0.95 },
    ],
    mitigatingControls: [
      { id: 'mc-am-1', name: 'Sistemas de parada de emergencia accesibles.', effectiveness: 0.8 },
      { id: 'mc-am-2', name: 'Capacitación en rescate y primeros auxilios.', effectiveness: 0.7 },
    ],
    consequences: [
      { id: 'cq-am-1', name: 'Lesiones graves, amputaciones o fatalidades.', probabilityOrImpact: 0.9 },
      { id: 'cq-am-2', name: 'Daño al equipo.', probabilityOrImpact: 0.6 },
    ],
    trendData: createTrendData(48, 'medium'),
  },
  {
    id: 'risk-ii',
    name: 'Incendio en Equipos o Instalaciones',
    description: 'Fuego no controlado en maquinaria, vehículos o estructuras.',
    level: 'low', 
    rank: 7,
    causes: [
      { id: 'c-ii-1', name: 'Cortocircuitos o fallas eléctricas.', probabilityOrImpact: 0.7 },
      { id: 'c-ii-2', name: 'Sobrecalentamiento de motores o componentes mecánicos.', probabilityOrImpact: 0.65 },
      { id: 'c-ii-3', name: 'Acumulación de material combustible cerca de fuentes de ignición.', probabilityOrImpact: 0.6 },
    ],
    preventiveControls: [
      { id: 'pc-ii-1', name: 'Sistemas de detección y supresión de incendios en equipos.', effectiveness: 0.85 },
      { id: 'pc-ii-2', name: 'Mantenimiento preventivo de sistemas eléctricos y mecánicos.', effectiveness: 0.8 },
    ],
    mitigatingControls: [
      { id: 'mc-ii-1', name: 'Brigadas de emergencia y equipos de extinción portátiles.', effectiveness: 0.8 },
      { id: 'mc-ii-2', name: 'Planes de evacuación y control de incendios.', effectiveness: 0.75 },
    ],
    consequences: [
      { id: 'cq-ii-1', name: 'Quemaduras graves o fatalidades por inhalación de humo.', probabilityOrImpact: 0.8 },
      { id: 'cq-ii-2', name: 'Pérdida total de equipos e instalaciones.', probabilityOrImpact: 0.85 },
    ],
    trendData: createTrendData(35, 'low'),
  },
  {
    id: 'risk-dt',
    name: 'Deslizamiento de Taludes',
    description: 'Movimiento inesperado de masas de tierra o roca en minas a cielo abierto o subterráneas.',
    level: 'low', 
    rank: 8,
    causes: [
      { id: 'c-dt-1', name: 'Inestabilidad geomecánica no detectada.', probabilityOrImpact: 0.75 },
      { id: 'c-dt-2', name: 'Sobrecarga en la cresta del talud.', probabilityOrImpact: 0.6 },
      { id: 'c-dt-3', name: 'Saturación de agua por lluvias o filtraciones.', probabilityOrImpact: 0.65 },
    ],
    preventiveControls: [
      { id: 'pc-dt-1', name: 'Monitoreo geotécnico constante (prismas, radares).', effectiveness: 0.9 },
      { id: 'pc-dt-2', name: 'Diseño de taludes con ángulos de seguridad adecuados.', effectiveness: 0.85 },
    ],
    mitigatingControls: [
      { id: 'mc-dt-1', name: 'Sistemas de alerta temprana de movimiento de taludes.', effectiveness: 0.8 },
      { id: 'mc-dt-2', name: 'Protocolos de evacuación de personal y equipos.', effectiveness: 0.85 },
    ],
    consequences: [
      { id: 'cq-dt-1', name: 'Sepultamiento de personal y equipos.', probabilityOrImpact: 0.95 },
      { id: 'cq-dt-2', name: 'Bloqueo de accesos y vías de transporte.', probabilityOrImpact: 0.8 },
    ],
    trendData: createTrendData(30, 'low'),
  },
  {
    id: 'risk-ps',
    name: 'Exposición a Polvo de Sílice',
    description: 'Inhalación de polvo con contenido de sílice cristalina, causando silicosis.',
    level: 'low', 
    rank: 9,
    causes: [
      { id: 'c-ps-1', name: 'Procesos de perforación, tronadura y chancado sin control de polvo.', probabilityOrImpact: 0.8 },
      { id: 'c-ps-2', name: 'Ventilación inadecuada en áreas de generación de polvo.', probabilityOrImpact: 0.7 },
      { id: 'c-ps-3', name: 'Falta de uso o uso incorrecto de EPP respiratorio.', probabilityOrImpact: 0.65 },
    ],
    preventiveControls: [
      { id: 'pc-ps-1', name: 'Sistemas de supresión de polvo (humectación, encapsulamiento).', effectiveness: 0.8 },
      { id: 'pc-ps-2', name: 'Uso obligatorio de protección respiratoria adecuada.', effectiveness: 0.85 },
    ],
    mitigatingControls: [
      { id: 'mc-ps-1', name: 'Programas de vigilancia médica periódica.', effectiveness: 0.7 },
      { id: 'mc-ps-2', name: 'Rotación de personal en áreas de alta exposición.', effectiveness: 0.6 },
    ],
    consequences: [
      { id: 'cq-ps-1', name: 'Desarrollo de silicosis y otras enfermedades pulmonares.', probabilityOrImpact: 0.75 },
      { id: 'cq-ps-2', name: 'Disminución de la calidad de vida y capacidad laboral.', probabilityOrImpact: 0.7 },
    ],
    trendData: createTrendData(25, 'low'),
  },
  {
    id: 'risk-cv',
    name: 'Colisión de Vehículos y Equipos Móviles',
    description: 'Impacto entre vehículos de transporte, equipos de carguío u otros equipos móviles.',
    level: 'low', 
    rank: 10,
    causes: [
      { id: 'c-cv-1', name: 'Exceso de velocidad o conducción imprudente.', probabilityOrImpact: 0.7 },
      { id: 'c-cv-2', name: 'Visibilidad reducida por polvo, neblina o diseño de vías.', probabilityOrImpact: 0.65 },
      { id: 'c-cv-3', name: 'Fatiga del operador.', probabilityOrImpact: 0.6 },
    ],
    preventiveControls: [
      { id: 'pc-cv-1', name: 'Sistemas anticolisión y de detección de proximidad en vehículos.', effectiveness: 0.85 },
      { id: 'pc-cv-2', name: 'Reglas de tránsito internas y capacitación en manejo defensivo.', effectiveness: 0.8 },
    ],
    mitigatingControls: [
      { id: 'mc-cv-1', name: 'Diseño de cabinas reforzadas y cinturones de seguridad.', effectiveness: 0.9 },
      { id: 'mc-cv-2', name: 'Protocolos de respuesta a emergencias viales.', effectiveness: 0.75 },
    ],
    consequences: [
      { id: 'cq-cv-1', name: 'Lesiones graves o fatales a operadores.', probabilityOrImpact: 0.85 },
      { id: 'cq-cv-2', name: 'Daños mayores a equipos y vehículos.', probabilityOrImpact: 0.8 },
    ],
    trendData: createTrendData(20, 'low'),
  },
];

export const getRiskById = (id: string): Risk | undefined => {
  return MOCK_RISKS.find(risk => risk.id === id);
};


export const MOCK_HISTORICAL_ACCIDENTS: HistoricalAccident[] = [
  {
    id: 'hist-acc-001',
    date: '2023-01-15',
    areaId: 'open-pit',
    areaName: 'Operaciones de Rajo Abierto',
    description: 'Pequeño deslizamiento de rocas desde la cara de un banco, sin heridos, daño menor a equipo (neumático de camión).',
    severity: 'Minor',
    contributingFactors: ['Saturación por lluvias intensas recientes', 'Falla geológica menor no detectada'],
    lessonsLearned: ['Aumentar inspecciones de la cara del banco después de lluvias', 'Revisar datos de monitoreo microsísmico más frecuentemente para esta zona'],
    equipmentDamaged: ['Camión de Extracción A-102 (Neumático)'],
    personnelInvolved: 0,
  },
  {
    id: 'hist-acc-002',
    date: '2023-03-22',
    areaId: 'processing-plant',
    areaName: 'Planta de Procesamiento de Mineral',
    description: 'Electricista recibió descarga leve mientras trabajaba en panel de control que se creía desenergizado.',
    severity: 'Minor',
    contributingFactors: ['Procedimiento LOTO incorrecto seguido', 'Etiquetado del panel no era claro'],
    lessonsLearned: ['Capacitación de actualización LOTO obligatoria para todos los electricistas', 'Auditar y mejorar todo el etiquetado de paneles'],
    personnelInvolved: 1,
  },
  {
    id: 'hist-acc-003',
    date: '2023-05-10',
    areaId: 'underground-mine',
    areaName: 'Accesos y Obras de Mina Subterránea',
    description: 'Caída de terreno (rocas pequeñas) en un rebaje recién desarrollado. Un minero sufrió una contusión en la pierna.',
    severity: 'Minor',
    contributingFactors: ['Escalamiento insuficiente del soporte del terreno después de la tronadura', 'Trabajador demasiado cerca de la cara sin soporte'],
    lessonsLearned: ['Reforzar protocolos de escalamiento post-tronadura', 'Distanciamiento obligatorio de 5m de caras sin soporte hasta ser liberado por geotecnia'],
    personnelInvolved: 1,
  },
  {
    id: 'hist-acc-004',
    date: '2023-07-01',
    areaId: 'haul-roads',
    areaName: 'Vías de Transporte y Tráfico del Sitio',
    description: 'Casi Accidente: Camión de extracción casi colisiona con vehículo liviano en intersección debido a baja visibilidad (polvo).',
    severity: 'Near Miss',
    contributingFactors: ['Excesivo polvo por condiciones secas', 'Vehículo liviano no cedió el paso según reglas del sitio'],
    lessonsLearned: ['Aumentar despliegue de camiones aljibe en vías durante temporada seca', 'Reentrenar a operadores de VL en procedimientos de derecho de paso en intersecciones'],
  },
  {
    id: 'hist-acc-005',
    date: '2023-09-18',
    areaId: 'maintenance-workshops',
    areaName: 'Talleres de Mantenimiento',
    description: 'Mecánico se cortó la mano usando esmeril con disco agrietado. Requirió sutura.',
    severity: 'Serious',
    contributingFactors: ['Falla en inspeccionar disco de esmeril antes de usar', 'Guarda removida del esmeril'],
    lessonsLearned: ['Implementar lista de verificación pre-uso obligatoria para herramientas eléctricas', 'Tolerancia cero para remoción de guardas en equipos'],
    personnelInvolved: 1,
  },
  {
    id: 'hist-acc-006',
    date: '2022-11-05',
    areaId: 'open-pit',
    areaName: 'Operaciones de Rajo Abierto',
    description: 'Una gran roca se desprendió del talud superior, impactando la berma. No había personal en el área.',
    severity: 'Near Miss',
    contributingFactors: ['Efectos del ciclo de congelación-descongelación en la estabilidad del talud', 'Sistema de monitoreo detectó movimiento pero umbral de alerta no se alcanzó para acción inmediata'],
    lessonsLearned: ['Ajustar umbrales de alerta para sistemas de monitoreo de taludes durante cambios estacionales', 'Aumentar ancho de berma en zonas identificadas de mayor riesgo'],
  },
  {
    id: 'hist-acc-007',
    date: '2022-08-12',
    areaId: 'tailings-storage',
    areaName: 'Depósito de Relaves',
    description: 'Rebalse menor de agua de proceso desde una piscina de contención secundaria debido a falla de bomba durante tormenta.',
    severity: 'Minor',
    contributingFactors: ['Falla de bomba (falla eléctrica)', 'Intensidad de lluvia inesperadamente alta'],
    lessonsLearned: ['Instalar bombas redundantes para piscinas de contención críticas', 'Revisar y actualizar plan de manejo de aguas lluvia para eventos de mayor intensidad'],
    equipmentDamaged: ['Bomba P-TSF-02B'],
  },
   {
    id: 'hist-acc-008',
    date: '2023-10-02',
    areaId: 'processing-plant',
    areaName: 'Planta de Procesamiento de Mineral',
    description: 'Trabajador resbaló en superficie mojada cerca de las celdas de flotación, resultando en esguince de tobillo.',
    severity: 'Minor',
    contributingFactors: ['Derrame de agua de tubería con fuga', 'Rejilla antideslizante inadecuada en el área'],
    lessonsLearned: ['Implementar revisiones diarias de fugas en el área de flotación', 'Instalar rejilla antideslizante adicional y mejorar drenaje'],
    personnelInvolved: 1,
  },
  {
    id: 'hist-acc-009',
    date: '2024-01-20',
    areaId: 'underground-mine',
    areaName: 'Accesos y Obras de Mina Subterránea',
    description: 'Operador de jumbo reportó sentirse mareado debido a mala ventilación en galería sin salida.',
    severity: 'Near Miss',
    contributingFactors: ['Mal funcionamiento de ventilador auxiliar', 'Retraso en reportar problema de ventilación'],
    lessonsLearned: ['Mejorar programa de mantenimiento para ventiladores auxiliares', 'Fomentar reporte inmediato de problemas de ventilación; implementar monitoreo de calidad de aire en tiempo real en galerías de alto riesgo'],
  },
  {
    id: 'hist-acc-010',
    date: '2024-02-11',
    areaId: 'open-pit',
    areaName: 'Operaciones de Rajo Abierto',
    description: 'Colisión entre dos vehículos livianos en área de estacionamiento debido a distracción del conductor.',
    severity: 'Minor',
    contributingFactors: ['Conductor usando teléfono móvil', 'Área de estacionamiento congestionada'],
    lessonsLearned: ['Aplicación estricta de política de no uso de teléfono móvil al conducir', 'Rediseñar área de estacionamiento para mejor flujo y visibilidad'],
    equipmentDamaged: ['VL-04 (parachoques)', 'VL-11 (faro)'],
    personnelInvolved: 0,
  }
];

export const getHistoricalAccidents = (): HistoricalAccident[] => {
  return MOCK_HISTORICAL_ACCIDENTS.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock CCO Field Inspections Data
export const MOCK_AREA_CCO_INSPECTIONS: AreaCCOInspections[] = [
  { areaId: 'open-pit', areaName: 'Operaciones de Rajo Abierto', totalInspections: 250, failedInspections: 20 },
  { areaId: 'underground-mine', areaName: 'Accesos y Obras de Mina Subterránea', totalInspections: 180, failedInspections: 25 },
  { areaId: 'processing-plant', areaName: 'Planta de Procesamiento de Mineral', totalInspections: 300, failedInspections: 10 },
  { areaId: 'stockpiles', areaName: 'Acopios y Manejo de Materiales', totalInspections: 120, failedInspections: 5 },
  { areaId: 'tailings-storage', areaName: 'Depósito de Relaves', totalInspections: 90, failedInspections: 8 },
  { areaId: 'maintenance-workshops', areaName: 'Talleres de Mantenimiento', totalInspections: 220, failedInspections: 18 },
  { areaId: 'haul-roads', areaName: 'Vías de Transporte y Tráfico del Sitio', totalInspections: 150, failedInspections: 12 },
  { areaId: 'admin-buildings', areaName: 'Edificios Administrativos', totalInspections: 50, failedInspections: 2 },
  { areaId: 'control-room', areaName: 'Sala de Control', totalInspections: 70, failedInspections: 1 },
  { areaId: 'safety-emergency', areaName: 'Servicios de Seguridad y Emergencia', totalInspections: 60, failedInspections: 0 },
];

export const getAreaCCOInspections = (): AreaCCOInspections[] => {
  return MOCK_AREA_CCO_INSPECTIONS;
};

// --- New Mock Data for Risk Factor Ratings ---

export const MOCK_RISK_FACTORS: RiskFactor[] = [
  { 
    id: 'rf-fatigue', 
    name: 'Índice de Fatiga del Trabajador', 
    description: 'Nivel de cansancio y alerta del personal, afectado por horas de trabajo, descanso y factores personales. Alto índice puede llevar a errores y accidentes.' 
  },
  { 
    id: 'rf-maintenance', 
    name: 'KPIs de Mantenimiento de Equipos Críticos',
    description: 'Eficacia y oportunidad del mantenimiento preventivo y correctivo de equipos esenciales. Fallas en mantenimiento aumentan el riesgo de fallos de equipo.'
  },
  { 
    id: 'rf-geotech', 
    name: 'Estabilidad de Taludes y Geotecnia',
    description: 'Condición geomecánica de taludes en rajo abierto o estabilidad de excavaciones subterráneas. Inestabilidad puede causar deslizamientos o derrumbes.'
  },
  { 
    id: 'rf-ventilation', 
    name: 'Ventilación y Control de Gases (Subterráneo)',
    description: 'Calidad y cantidad de aire en labores subterráneas, incluyendo control de gases tóxicos o inflamables. Deficiencias pueden causar asfixia, intoxicación o explosiones.'
  },
  { 
    id: 'rf-compliance', 
    name: 'Tasa de Cumplimiento de Protocolos de Seguridad',
    description: 'Adherencia del personal a los procedimientos y estándares de seguridad establecidos. Bajo cumplimiento indica una cultura de seguridad débil.'
  },
  { 
    id: 'rf-corrosion', 
    name: 'Índice de Corrosión e Integridad de Infraestructura',
    description: 'Nivel de deterioro por corrosión en estructuras metálicas, tuberías y equipos. Alta corrosión compromete la integridad estructural y funcional.'
  },
  { 
    id: 'rf-emergency', 
    name: 'Tiempo de Respuesta a Emergencias',
    description: 'Rapidez y eficacia con la que los equipos de emergencia responden a incidentes. Tiempos largos pueden agravar las consecuencias de un evento.'
  },
  { 
    id: 'rf-transport', 
    name: 'Tasa de Incidentes en Transporte',
    description: 'Frecuencia de accidentes, cuasi accidentes o infracciones relacionadas con el transporte de personal y materiales dentro del sitio. Alta tasa indica problemas en la seguridad vial.'
  },
];

export const MOCK_AREA_FACTOR_RATINGS: AreaRiskFactorRatings[] = [
  { 
    areaName: 'Operaciones de Rajo Abierto', 
    areaId: 'open-pit', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 3 },      // Med
      { factorId: 'rf-maintenance', rating: 4 },  // High
      { factorId: 'rf-geotech', rating: 5 },      // Critical
      { factorId: 'rf-ventilation', rating: 1 },  // N/A or Low for open pit
      { factorId: 'rf-compliance', rating: 3 },   // Med
      { factorId: 'rf-corrosion', rating: 2 },    // Low
      { factorId: 'rf-emergency', rating: 4 },    // High
      { factorId: 'rf-transport', rating: 3 },    // Med
    ]
  },
  { 
    areaName: 'Accesos y Obras de Mina Subterránea', 
    areaId: 'underground-mine', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 4 },      // High
      { factorId: 'rf-maintenance', rating: 3 },  // Med
      { factorId: 'rf-geotech', rating: 4 },      // High
      { factorId: 'rf-ventilation', rating: 5 },  // Critical
      { factorId: 'rf-compliance', rating: 2 },   // Low
      { factorId: 'rf-corrosion', rating: 3 },    // Med
      { factorId: 'rf-emergency', rating: 3 },    // Med
      { factorId: 'rf-transport', rating: 2 },    // Low
    ]
  },
  { 
    areaName: 'Planta de Procesamiento de Mineral', 
    areaId: 'processing-plant', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 2 },      // Low
      { factorId: 'rf-maintenance', rating: 5 },  // Critical
      { factorId: 'rf-geotech', rating: 1 },      // N/A or Low
      { factorId: 'rf-ventilation', rating: 2 },  // Low (general plant, not confined space focus)
      { factorId: 'rf-compliance', rating: 4 },   // High
      { factorId: 'rf-corrosion', rating: 4 },    // High
      { factorId: 'rf-emergency', rating: 3 },    // Med
      { factorId: 'rf-transport', rating: 1 },    // Low
    ]
  },
  { 
    areaName: 'Acopios y Manejo de Materiales', 
    areaId: 'stockpiles', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 3 },
      { factorId: 'rf-maintenance', rating: 3 }, // Equipment like stackers, reclaimers
      { factorId: 'rf-geotech', rating: 3 }, // Stockpile stability
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 3 },
      { factorId: 'rf-corrosion', rating: 2 },
      { factorId: 'rf-emergency', rating: 2 },
      { factorId: 'rf-transport', rating: 2 }, // Interactions with trucks
    ]
  },
  { 
    areaName: 'Depósito de Relaves', 
    areaId: 'tailings-storage', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 2 },
      { factorId: 'rf-maintenance', rating: 4 }, // Pumping systems, monitoring eq.
      { factorId: 'rf-geotech', rating: 5 }, // Dam stability is critical
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 4 },
      { factorId: 'rf-corrosion', rating: 3 }, // Pipelines
      { factorId: 'rf-emergency', rating: 5 }, // High consequence
      { factorId: 'rf-transport', rating: 1 },
    ]
  },
  { 
    areaName: 'Talleres de Mantenimiento', 
    areaId: 'maintenance-workshops', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 3 },
      { factorId: 'rf-maintenance', rating: 2 }, // Self-maintenance of workshop tools
      { factorId: 'rf-geotech', rating: 1 },
      { factorId: 'rf-ventilation', rating: 3 }, // Welding fumes, paint shops
      { factorId: 'rf-compliance', rating: 4 },
      { factorId: 'rf-corrosion', rating: 2 },
      { factorId: 'rf-emergency', rating: 3 },
      { factorId: 'rf-transport', rating: 1 },
    ]
  },
  { 
    areaName: 'Vías de Transporte y Tráfico del Sitio', 
    areaId: 'haul-roads', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 4 }, // For drivers
      { factorId: 'rf-maintenance', rating: 2 }, // Road maintenance itself
      { factorId: 'rf-geotech', rating: 2 }, // Road cut stability
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 3 }, // Traffic rules
      { factorId: 'rf-corrosion', rating: 1 },
      { factorId: 'rf-emergency', rating: 4 },
      { factorId: 'rf-transport', rating: 5 }, // This is the primary risk
    ]
  },
  { 
    areaName: 'Edificios Administrativos', 
    areaId: 'admin-buildings', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 1 },
      { factorId: 'rf-maintenance', rating: 1 },
      { factorId: 'rf-geotech', rating: 1 },
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 2 },
      { factorId: 'rf-corrosion', rating: 1 },
      { factorId: 'rf-emergency', rating: 2 },
      { factorId: 'rf-transport', rating: 1 },
    ]
  },
  { 
    areaName: 'Sala de Control', 
    areaId: 'control-room', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 3 }, // For operators
      { factorId: 'rf-maintenance', rating: 2 }, // Control systems
      { factorId: 'rf-geotech', rating: 1 },
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 3 },
      { factorId: 'rf-corrosion', rating: 1 },
      { factorId: 'rf-emergency', rating: 4 }, // Critical for site-wide response
      { factorId: 'rf-transport', rating: 1 },
    ]
  },
  { 
    areaName: 'Servicios de Seguridad y Emergencia', 
    areaId: 'safety-emergency', 
    factorRatings: [
      { factorId: 'rf-fatigue', rating: 3 },
      { factorId: 'rf-maintenance', rating: 3 }, // Emergency equipment
      { factorId: 'rf-geotech', rating: 1 },
      { factorId: 'rf-ventilation', rating: 1 },
      { factorId: 'rf-compliance', rating: 5 }, // Must be exemplary
      { factorId: 'rf-corrosion', rating: 2 },
      { factorId: 'rf-emergency', rating: 2 }, // Their own internal response capability
      { factorId: 'rf-transport', rating: 2 },
    ]
  },
];

export const getRiskFactors = (): RiskFactor[] => MOCK_RISK_FACTORS;
export const getAreaFactorRatings = (): AreaRiskFactorRatings[] => MOCK_AREA_FACTOR_RATINGS;
