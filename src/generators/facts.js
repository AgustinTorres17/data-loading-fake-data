import { faker } from '@faker-js/faker';

function getRandomElement(array) {
  return array[faker.number.int({ min: 0, max: array.length - 1 })];
}

// Normalize date to string format YYYY-MM-DD
function normalizeDate(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === 'string') {
    return dateValue.split('T')[0]; // Handle ISO strings
  }
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }
  return String(dateValue).split('T')[0];
}

// Normalize time to string format HH:MM:SS
function normalizeTime(timeValue) {
  if (!timeValue) return null;
  if (typeof timeValue === 'string') {
    // Handle various formats like "08:00:00", "08:00:00.000Z", etc.
    return timeValue.split('.')[0].substring(0, 8);
  }
  return String(timeValue).substring(0, 8);
}

function getRandomDate(fechas) {
  const fecha = getRandomElement(fechas).fecha;
  return normalizeDate(fecha);
}

function getRandomTime(horarios) {
  const horario = getRandomElement(horarios).horarios;
  return normalizeTime(horario);
}

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  return date.getDay();
}

// Round time to nearest 15-minute interval (to match horario table)
function roundToNearest15Min(timeString) {
  const [hours, mins] = timeString.split(':').map(Number);
  const roundedMins = Math.floor(mins / 15) * 15;
  return `${hours.toString().padStart(2, '0')}:${roundedMins.toString().padStart(2, '0')}:00`;
}

function addMinutesToTime(timeString, minutes) {
  const [hours, mins, secs] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}:00`;
}

// Get a valid time from horarios dimension that's close to the calculated time
function getValidHorario(horarios, calculatedTime) {
  // Round to nearest 15-minute interval
  const rounded = roundToNearest15Min(calculatedTime);
  // Find matching horario
  const found = horarios.find(h => h.horarios === rounded);
  if (found) {
    return found.horarios;
  }
  // Fallback: return random valid horario
  return getRandomElement(horarios).horarios;
}

// Get a valid date from fechas dimension, return the date if valid or the last valid date
function getValidFecha(fechas, calculatedDate) {
  const dateStr = normalizeDate(calculatedDate);
  const found = fechas.find(f => normalizeDate(f.fecha) === dateStr);
  if (found) {
    return normalizeDate(found.fecha);
  }
  // If date is out of range, return the last valid date in the range
  const lastFecha = fechas[fechas.length - 1];
  return normalizeDate(lastFecha.fecha);
}

function calculateInterval(date1, time1, date2, time2) {
  const start = new Date(`${date1}T${time1}`);
  const end = new Date(`${date2}T${time2}`);
  let diffMs = end - start;

  // If negative (end before start due to date capping), use absolute value or minimum interval
  if (diffMs < 0) {
    diffMs = Math.abs(diffMs);
  }

  // Ensure minimum of 1 minute if we have dates
  if (diffMs === 0) {
    diffMs = 60000; // 1 minute
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function generateAdmisionFacts(count, dimensions) {
  console.log(`  Generating ${count} admission facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const cie10 = faker.datatype.boolean() ? getRandomElement(dimensions.cie10) : null;
    const fecha = getRandomDate(dimensions.fechas);
    const horario = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage_llegada: triage.id_clas_triage,
      id_cie10: cie10 ? cie10.id_codigo_cie10 : null,
      fecha_llegada: fecha,
      horario_llegada: horario,
      id_dia_semana: getDayOfWeek(fecha),
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateTriageFacts(count, dimensions) {
  console.log(`  Generating ${count} triage facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const cie10 = faker.datatype.boolean({ probability: 0.7 }) ? getRandomElement(dimensions.cie10) : null;
    const fecha = getRandomDate(dimensions.fechas);
    const horario = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_cie10: cie10 ? cie10.id_codigo_cie10 : null,
      id_dia_semana: getDayOfWeek(fecha),
      fecha_triage: fecha,
      horario_triage: horario,
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateEmergenciaFacts(count, dimensions) {
  console.log(`  Generating ${count} emergency facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const cie10 = faker.datatype.boolean({ probability: 0.8 }) ? getRandomElement(dimensions.cie10) : null;
    const fecha = getRandomDate(dimensions.fechas);
    const horario = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_cie10: cie10 ? cie10.id_codigo_cie10 : null,
      id_dia_semana: getDayOfWeek(fecha),
      fecha_atencion: fecha,
      horario_atencion: horario,
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateDiagnosticosAltaFacts(count, dimensions) {
  console.log(`  Generating ${count} discharge diagnosis facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const cie10 = getRandomElement(dimensions.cie10);
    const fechaLlegada = getRandomDate(dimensions.fechas);
    const horarioLlegada = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    const hasAlta = faker.datatype.boolean({ probability: 0.9 });
    let fechaAlta = null;
    let horarioAlta = null;
    let idDiaAlta = null;

    if (hasAlta) {
      const hoursToAdd = faker.number.int({ min: 2, max: 48 });
      const llegadaDate = new Date(`${fechaLlegada}T${horarioLlegada}`);
      llegadaDate.setHours(llegadaDate.getHours() + hoursToAdd);
      const rawFechaAlta = llegadaDate.toISOString().split('T')[0];
      fechaAlta = getValidFecha(dimensions.fechas, rawFechaAlta);
      const rawHorarioAlta = llegadaDate.toTimeString().split(' ')[0];
      horarioAlta = getValidHorario(dimensions.horarios, rawHorarioAlta);
      idDiaAlta = getDayOfWeek(fechaAlta);
    }

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_cie10: cie10.id_codigo_cie10,
      fecha_llegada: fechaLlegada,
      id_dia_llegada: getDayOfWeek(fechaLlegada),
      horario_llegada: horarioLlegada,
      fecha_alta: fechaAlta,
      id_dia_alta: idDiaAlta,
      horario_alta: horarioAlta,
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateIngresosPisoFacts(count, dimensions) {
  console.log(`  Generating ${count} floor admission facts...`);
  const facts = [];

  // Filter for hospitalization-related destinations, fallback to all destinos if no match
  const hospitalizationDestinos = dimensions.destino.filter(d =>
    d.destino && (
      d.destino.toUpperCase().includes('PASE') ||
      d.destino.toUpperCase().includes('INTERNACION') ||
      d.destino.toUpperCase().includes('CTI') ||
      d.destino.toUpperCase().includes('UCI') ||
      d.destino.toUpperCase().includes('CIRUGIA') ||
      d.destino.toUpperCase().includes('CLINICA')
    )
  );
  const validDestinos = hospitalizationDestinos.length > 0 ? hospitalizationDestinos : dimensions.destino;

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const destino = getRandomElement(validDestinos);
    const fecha = getRandomDate(dimensions.fechas);
    const horario = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_servicio_destino: destino.id_servicio_destino,
      fecha_llegada: fecha,
      id_dia_llegada: getDayOfWeek(fecha),
      horario_llegada: horario,
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateMortalidadFacts(count, dimensions) {
  console.log(`  Generating ${count} mortality facts...`);
  const facts = [];

  // Get high-severity triage levels (first 2 if available, otherwise use all)
  const severeTriage = dimensions.clasificacion_triage.length >= 2
    ? dimensions.clasificacion_triage.slice(0, 2)
    : dimensions.clasificacion_triage;

  // Find death-related destination
  const destinoMuerte = dimensions.destino.find(d =>
    d.destino && (
      d.destino.toUpperCase().includes('DEFUNCION') ||
      d.destino.toUpperCase().includes('FALLEC') ||
      d.destino.toUpperCase().includes('MUERTE') ||
      d.destino.toUpperCase().includes('OBITO')
    )
  );

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(severeTriage);
    const cie10 = faker.datatype.boolean({ probability: 0.8 }) ? getRandomElement(dimensions.cie10) : null;
    const fecha = getRandomDate(dimensions.fechas);
    const horario = getRandomTime(dimensions.horarios);
    const geo = getRandomElement(dimensions.referencia_geografica);

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_cie10: cie10 ? cie10.id_codigo_cie10 : null,
      id_ultimo_lugar_asignado: destinoMuerte ? destinoMuerte.id_servicio_destino : null,
      fecha_llegada: fecha,
      id_dia_llegada: getDayOfWeek(fecha),
      horario_llegada: horario,
      latitud: geo.latitud,
      longitud: geo.longitud
    });
  }

  return facts;
}

export function generateTiempoAtencionFacts(count, dimensions) {
  console.log(`  Generating ${count} attention time facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const cie10 = faker.datatype.boolean({ probability: 0.7 }) ? getRandomElement(dimensions.cie10) : null;
    const fechaLlegada = getRandomDate(dimensions.fechas);
    const horarioLlegada = getRandomTime(dimensions.horarios);

    const hasSalida = faker.datatype.boolean({ probability: 0.95 });
    let fechaSalida = null;
    let horarioSalida = null;
    let idDiaSalida = null;
    let tiempoTotal = null;

    if (hasSalida) {
      const minutesToAdd = faker.number.int({ min: 30, max: 1440 });
      const llegadaDate = new Date(`${fechaLlegada}T${horarioLlegada}`);
      llegadaDate.setMinutes(llegadaDate.getMinutes() + minutesToAdd);
      const rawFechaSalida = llegadaDate.toISOString().split('T')[0];
      fechaSalida = getValidFecha(dimensions.fechas, rawFechaSalida);
      const rawHorarioSalida = llegadaDate.toTimeString().split(' ')[0];
      horarioSalida = getValidHorario(dimensions.horarios, rawHorarioSalida);
      idDiaSalida = getDayOfWeek(fechaSalida);
      tiempoTotal = calculateInterval(fechaLlegada, horarioLlegada, fechaSalida, horarioSalida);
    } else {
      tiempoTotal = '00:00:00';
    }

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      id_cie10: cie10 ? cie10.id_codigo_cie10 : null,
      fecha_llegada: fechaLlegada,
      id_dia_llegada: getDayOfWeek(fechaLlegada),
      horario_llegada: horarioLlegada,
      fecha_salida: fechaSalida,
      id_dia_salida: idDiaSalida,
      horario_salida: horarioSalida,
      tiempo_total_atencion: tiempoTotal
    });
  }

  return facts;
}

export function generateTiempoEsperaTriageFacts(count, dimensions) {
  console.log(`  Generating ${count} triage wait time facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const fechaLlegada = getRandomDate(dimensions.fechas);
    const horarioLlegada = getRandomTime(dimensions.horarios);

    const hasTriage = faker.datatype.boolean({ probability: 0.98 });
    let fechaTriage = null;
    let horarioTriage = null;
    let idDiaTriage = null;
    let tiempoEspera = null;

    if (hasTriage) {
      const minutesToAdd = faker.number.int({ min: 5, max: 120 });
      const llegadaDate = new Date(`${fechaLlegada}T${horarioLlegada}`);
      llegadaDate.setMinutes(llegadaDate.getMinutes() + minutesToAdd);
      const rawFechaTriage = llegadaDate.toISOString().split('T')[0];
      fechaTriage = getValidFecha(dimensions.fechas, rawFechaTriage);
      const rawHorarioTriage = llegadaDate.toTimeString().split(' ')[0];
      horarioTriage = getValidHorario(dimensions.horarios, rawHorarioTriage);
      idDiaTriage = getDayOfWeek(fechaTriage);
      tiempoEspera = calculateInterval(fechaLlegada, horarioLlegada, fechaTriage, horarioTriage);
    } else {
      tiempoEspera = '00:00:00';
    }

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      fecha_llegada: fechaLlegada,
      id_dia_llegada: getDayOfWeek(fechaLlegada),
      horario_llegada: horarioLlegada,
      fecha_triage: fechaTriage,
      id_dia_triage: idDiaTriage,
      horario_triage: horarioTriage,
      tiempo_espera_triage: tiempoEspera
    });
  }

  return facts;
}

export function generateTiempoEsperaAsignacionFacts(count, dimensions) {
  console.log(`  Generating ${count} assignment wait time facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const fechaTriage = getRandomDate(dimensions.fechas);
    const horarioTriage = getRandomTime(dimensions.horarios);

    const hasAsignacion = faker.datatype.boolean({ probability: 0.92 });
    let fechaAsignacion = null;
    let horarioAsignacion = null;
    let idDiaAsignacion = null;
    let tiempoEspera = null;

    if (hasAsignacion) {
      const minutesToAdd = faker.number.int({ min: 10, max: 240 });
      const triageDate = new Date(`${fechaTriage}T${horarioTriage}`);
      triageDate.setMinutes(triageDate.getMinutes() + minutesToAdd);
      const rawFechaAsignacion = triageDate.toISOString().split('T')[0];
      fechaAsignacion = getValidFecha(dimensions.fechas, rawFechaAsignacion);
      const rawHorarioAsignacion = triageDate.toTimeString().split(' ')[0];
      horarioAsignacion = getValidHorario(dimensions.horarios, rawHorarioAsignacion);
      idDiaAsignacion = getDayOfWeek(fechaAsignacion);
      tiempoEspera = calculateInterval(fechaTriage, horarioTriage, fechaAsignacion, horarioAsignacion);
    } else {
      tiempoEspera = '00:00:00';
    }

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      fecha_triage: fechaTriage,
      id_dia_triage: getDayOfWeek(fechaTriage),
      horario_triage: horarioTriage,
      fecha_asignacion: fechaAsignacion,
      id_dia_asignacion: idDiaAsignacion,
      horario_asignacion: horarioAsignacion,
      tiempo_espera_asignacion: tiempoEspera
    });
  }

  return facts;
}

export function generateEsperaInterconsultaFacts(count, dimensions) {
  console.log(`  Generating ${count} inter-consultation wait time facts...`);
  const facts = [];

  for (let i = 0; i < count; i++) {
    const sexo = getRandomElement(dimensions.sexo);
    const edad = getRandomElement(dimensions.edad);
    const procedencia = getRandomElement(dimensions.procedencia);
    const triage = getRandomElement(dimensions.clasificacion_triage);
    const fechaLlegada = getRandomDate(dimensions.fechas);
    const horarioLlegada = getRandomTime(dimensions.horarios);

    const hoursToSolicitud = faker.number.int({ min: 1, max: 6 });
    const llegadaDate = new Date(`${fechaLlegada}T${horarioLlegada}`);
    llegadaDate.setHours(llegadaDate.getHours() + hoursToSolicitud);
    const rawFechaSolicitud = llegadaDate.toISOString().split('T')[0];
    const fechaSolicitud = getValidFecha(dimensions.fechas, rawFechaSolicitud);
    const rawHorarioSolicitud = llegadaDate.toTimeString().split(' ')[0];
    const horarioSolicitud = getValidHorario(dimensions.horarios, rawHorarioSolicitud);

    const hasEscritura = faker.datatype.boolean({ probability: 0.85 });
    let fechaEscritura = null;
    let horarioEscritura = null;
    let idDiaEscritura = null;
    let tiempoEspera = null;

    if (hasEscritura) {
      const minutesToAdd = faker.number.int({ min: 30, max: 240 });
      const solicitudDate = new Date(`${fechaSolicitud}T${horarioSolicitud}`);
      solicitudDate.setMinutes(solicitudDate.getMinutes() + minutesToAdd);
      const rawFechaEscritura = solicitudDate.toISOString().split('T')[0];
      fechaEscritura = getValidFecha(dimensions.fechas, rawFechaEscritura);
      const rawHorarioEscritura = solicitudDate.toTimeString().split(' ')[0];
      horarioEscritura = getValidHorario(dimensions.horarios, rawHorarioEscritura);
      idDiaEscritura = getDayOfWeek(fechaEscritura);
      tiempoEspera = calculateInterval(fechaSolicitud, horarioSolicitud, fechaEscritura, horarioEscritura);
    } else {
      tiempoEspera = '00:00:00';
    }

    facts.push({
      id_os: faker.number.bigInt({ min: 100000n, max: 999999999n }),
      id_sexo: sexo.id_sexo,
      id_edad: edad.id_rango_sinadi,
      id_procedencia: procedencia.id_procedencia,
      id_clas_triage: triage.id_clas_triage,
      fecha_llegada: fechaLlegada,
      id_dia_llegada: getDayOfWeek(fechaLlegada),
      horario_llegada: horarioLlegada,
      fecha_solicitud: fechaSolicitud,
      id_dia_solicitud: getDayOfWeek(fechaSolicitud),
      horario_solicitud: horarioSolicitud,
      fecha_escritura: fechaEscritura,
      id_dia_escritura: idDiaEscritura,
      horario_escritura: horarioEscritura,
      tiempo_espera_interconsulta: tiempoEspera
    });
  }

  return facts;
}