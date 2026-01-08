import { faker } from '@faker-js/faker';

faker.locale = 'es';

export function generateAtencionCancelada() {
  return [
    { is_cancelado: false, cancelado: 'No cancelado' },
    { is_cancelado: true, cancelado: 'Cancelado' }
  ];
}

export function generateSexo() {
  return [
    { id_sexo: false, sexo: 'Femenino' },
    { id_sexo: true, sexo: 'Masculino' }
  ];
}

export function generateTieneDiagnostico() {
  return [
    { has_diagnostico: false, tiene_diagnostico: 'Sin diagnóstico' },
    { has_diagnostico: true, tiene_diagnostico: 'Con diagnóstico' }
  ];
}

export function generateTieneMotivo() {
  return [
    { has_motivo_con: false, tiene_motivo_consulta: 'Sin motivo de consulta' },
    { has_motivo_con: true, tiene_motivo_consulta: 'Con motivo de consulta' }
  ];
}

export function generateClasificacionTriage() {
  return [
    { id_clas_triage: 1, color_triage: 'Rojo' },
    { id_clas_triage: 2, color_triage: 'Naranja' },
    { id_clas_triage: 3, color_triage: 'Amarillo' },
    { id_clas_triage: 4, color_triage: 'Verde' },
    { id_clas_triage: 5, color_triage: 'Azul' }
  ];
}

export function generateDiaSemana() {
  return [
    { id_dia_sem: 0, dia_semana: 'Domingo' },
    { id_dia_sem: 1, dia_semana: 'Lunes' },
    { id_dia_sem: 2, dia_semana: 'Martes' },
    { id_dia_sem: 3, dia_semana: 'Miércoles' },
    { id_dia_sem: 4, dia_semana: 'Jueves' },
    { id_dia_sem: 5, dia_semana: 'Viernes' },
    { id_dia_sem: 6, dia_semana: 'Sábado' }
  ];
}

export function generateEdadRangos() {
  return [
    { id_rango_sinadi: 1, rango_sinadi: '0-4 años' },
    { id_rango_sinadi: 2, rango_sinadi: '5-9 años' },
    { id_rango_sinadi: 3, rango_sinadi: '10-14 años' },
    { id_rango_sinadi: 4, rango_sinadi: '15-19 años' },
    { id_rango_sinadi: 5, rango_sinadi: '20-24 años' },
    { id_rango_sinadi: 6, rango_sinadi: '25-29 años' },
    { id_rango_sinadi: 7, rango_sinadi: '30-34 años' },
    { id_rango_sinadi: 8, rango_sinadi: '35-39 años' },
    { id_rango_sinadi: 9, rango_sinadi: '40-44 años' },
    { id_rango_sinadi: 10, rango_sinadi: '45-49 años' },
    { id_rango_sinadi: 11, rango_sinadi: '50-54 años' },
    { id_rango_sinadi: 12, rango_sinadi: '55-59 años' },
    { id_rango_sinadi: 13, rango_sinadi: '60-64 años' },
    { id_rango_sinadi: 14, rango_sinadi: '65-69 años' },
    { id_rango_sinadi: 15, rango_sinadi: '70-74 años' },
    { id_rango_sinadi: 16, rango_sinadi: '75-79 años' },
    { id_rango_sinadi: 17, rango_sinadi: '80-84 años' },
    { id_rango_sinadi: 18, rango_sinadi: '85+ años' }
  ];
}

export function generateProcedencias() {
  return [
    { id_procedencia: 1, procedencia: 'Domicilio' },
    { id_procedencia: 2, procedencia: 'Vía pública' },
    { id_procedencia: 3, procedencia: 'Lugar de trabajo' },
    { id_procedencia: 4, procedencia: 'Institución educativa' },
    { id_procedencia: 5, procedencia: 'Centro de salud' },
    { id_procedencia: 6, procedencia: 'Otro hospital' },
    { id_procedencia: 7, procedencia: 'Ambulancia SAME' },
    { id_procedencia: 8, procedencia: 'Traslado privado' },
    { id_procedencia: 9, procedencia: 'Policía' },
    { id_procedencia: 10, procedencia: 'Otro' }
  ];
}

export function generateDestinos() {
  const destinos = [
    { id: 1, destino: 'Alta médica', servicio: 'Domicilio', prestacion: 'Alta' },
    { id: 2, destino: 'Internación', servicio: 'Clínica médica', prestacion: 'Internación' },
    { id: 3, destino: 'Internación', servicio: 'Cirugía', prestacion: 'Internación' },
    { id: 4, destino: 'Internación', servicio: 'Pediatría', prestacion: 'Internación' },
    { id: 5, destino: 'Internación', servicio: 'Obstetricia', prestacion: 'Internación' },
    { id: 6, destino: 'Cuidados intensivos', servicio: 'UCI Adultos', prestacion: 'Cuidados críticos' },
    { id: 7, destino: 'Cuidados intensivos', servicio: 'UTI Pediátrica', prestacion: 'Cuidados críticos' },
    { id: 8, destino: 'Quirófano', servicio: 'Cirugía de urgencia', prestacion: 'Intervención quirúrgica' },
    { id: 9, destino: 'Traslado', servicio: 'Otro centro', prestacion: 'Derivación' },
    { id: 10, destino: 'Observación', servicio: 'Emergencia', prestacion: 'Observación' },
    { id: 11, destino: 'Fuga', servicio: 'N/A', prestacion: 'Retiro voluntario' },
    { id: 12, destino: 'Fallecimiento', servicio: 'Emergencia', prestacion: 'Defunción' }
  ];

  return destinos.map(d => ({
    id_destino: d.id,
    destino: d.destino,
    id_servicio_destino: d.id,
    servicio_destino: d.servicio,
    id_prestacion_destino: d.id,
    prestacion_destino: d.prestacion
  }));
}

export function generateFechas(startDate = '2020-01-01', endDate = '2025-12-31') {
  const fechas = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const fecha = new Date(d);
    fechas.push({
      fecha: fecha.toISOString().split('T')[0]
    });
  }

  console.log(`  Generated ${fechas.length} dates from ${startDate} to ${endDate}`);
  return fechas;
}

export function generateHorarios() {
  const horarios = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      horarios.push({ horarios: `${h}:${m}:00` });
    }
  }

  console.log(`  Generated ${horarios.length} time slots`);
  return horarios;
}

export function generateCIE10Codes(count = 100) {
  const chapters = [
    { id: 1, code: 'A00-B99', desc: 'Enfermedades infecciosas y parasitarias' },
    { id: 2, code: 'C00-D48', desc: 'Neoplasias' },
    { id: 3, code: 'E00-E90', desc: 'Enfermedades endocrinas, nutricionales y metabólicas' },
    { id: 4, code: 'I00-I99', desc: 'Enfermedades del sistema circulatorio' },
    { id: 5, code: 'J00-J99', desc: 'Enfermedades del sistema respiratorio' },
    { id: 6, code: 'K00-K93', desc: 'Enfermedades del sistema digestivo' },
    { id: 7, code: 'M00-M99', desc: 'Enfermedades del sistema musculoesquelético' },
    { id: 8, code: 'N00-N99', desc: 'Enfermedades del sistema genitourinario' },
    { id: 9, code: 'R00-R99', desc: 'Síntomas, signos y hallazgos anormales' },
    { id: 10, code: 'S00-T98', desc: 'Traumatismos, envenenamientos' }
  ];

  const diseases = [
    'Gastroenteritis aguda', 'Hipertensión arterial', 'Diabetes mellitus tipo 2',
    'Infección respiratoria aguda', 'Neumonía', 'Asma bronquial',
    'Traumatismo craneoencefálico', 'Fractura de miembro', 'Herida cortante',
    'Infección urinaria', 'Cefalea', 'Dolor abdominal',
    'Síndrome febril', 'Intoxicación', 'Quemadura',
    'Angina de pecho', 'Infarto agudo de miocardio', 'Arritmia cardíaca',
    'Crisis hipertensiva', 'Accidente cerebrovascular'
  ];

  const codes = [];
  const letters = ['A', 'B', 'C', 'E', 'I', 'J', 'K', 'M', 'N', 'R', 'S', 'T'];

  for (let i = 0; i < count; i++) {
    const letter = faker.helpers.arrayElement(letters);
    const number = faker.number.int({ min: 0, max: 99 }).toString().padStart(2, '0');
    const subcode = faker.number.int({ min: 0, max: 9 });
    const codigo = `${letter}${number}.${subcode}`;

    const chapter = faker.helpers.arrayElement(chapters);
    const disease = faker.helpers.arrayElement(diseases);

    codes.push({
      id_codigo_cie10: i + 1,
      codigo_cie10: codigo,
      descripcion_codigo: `${disease} - ${codigo}`,
      id_capitulo: chapter.id,
      capitulo: chapter.code,
      descripcion_capitulo: chapter.desc,
      id_grupo: faker.number.int({ min: 1, max: 20 }),
      grupo: `${letter}${number}-${letter}${number}`,
      descripcion_grupo: `Grupo de ${disease}`,
      id_categoria: faker.number.int({ min: 1, max: 100 }),
      categoria: `${letter}${number}`,
      descripcion_categoria: `Categoría ${disease}`,
      id_sub_categoria: faker.number.int({ min: 1, max: 500 }),
      sub_categoria: codigo,
      descripcion_sub_categoria: `${disease} específica`
    });
  }

  console.log(`  Generated ${codes.length} CIE-10 codes`);
  return codes;
}

export function generateSNOMEDCodes(count = 50) {
  const conditions = [
    'Dolor torácico', 'Disnea', 'Fiebre', 'Cefalea intensa',
    'Náuseas y vómitos', 'Dolor abdominal agudo', 'Mareos',
    'Palpitaciones', 'Pérdida de conciencia', 'Convulsiones',
    'Traumatismo', 'Hemorragia', 'Dificultad respiratoria',
    'Hipoglucemia', 'Hiperglucemia', 'Shock', 'Sepsis'
  ];

  const codes = [];

  for (let i = 0; i < count; i++) {
    const snomedId = faker.number.int({ min: 100000000, max: 999999999 });
    const condition = faker.helpers.arrayElement(conditions);

    codes.push({
      id_snomed: i + 1,
      snomed: `${snomedId}|${condition}|`
    });
  }

  console.log(`  Generated ${codes.length} SNOMED codes`);
  return codes;
}

export function generateReferenciasGeograficas(count = 50) {
  const ciudadesUruguay = [
    {
      ciudad: 'Montevideo',
      departamento: 'Montevideo',
      lat: -34.9011,
      lon: -56.1645,
      barrios: ['Centro', 'Ciudad Vieja', 'Pocitos', 'Punta Carretas', 'Carrasco',
                'Malvín', 'Buceo', 'Cordón', 'Parque Rodó', 'Tres Cruces'],
      codPostalMin: 11000,
      codPostalMax: 11900
    },
    {
      ciudad: 'Salto',
      departamento: 'Salto',
      lat: -31.3833,
      lon: -57.9667,
      barrios: ['Centro', 'Barrio Sur', 'La Caballada', 'Cerrito', 'Villa Universal'],
      codPostalMin: 50000,
      codPostalMax: 50999
    },
    {
      ciudad: 'Paysandú',
      departamento: 'Paysandú',
      lat: -32.3217,
      lon: -58.0756,
      barrios: ['Centro', 'Barrio Anglo', 'Parque Tecnológico', 'La Española', 'Porvenir'],
      codPostalMin: 60000,
      codPostalMax: 60999
    },
    {
      ciudad: 'Maldonado',
      departamento: 'Maldonado',
      lat: -34.9000,
      lon: -54.9500,
      barrios: ['Centro', 'San Fernando', 'Parque del Plata', 'El Jagüel', 'Pinares'],
      codPostalMin: 20000,
      codPostalMax: 20999
    },
    {
      ciudad: 'Rivera',
      departamento: 'Rivera',
      lat: -30.9000,
      lon: -55.5500,
      barrios: ['Centro', 'Cuareim', 'Mandubí', 'La Pedrera', 'Barrio Artigas'],
      codPostalMin: 40000,
      codPostalMax: 40999
    },
    {
      ciudad: 'Tacuarembó',
      departamento: 'Tacuarembó',
      lat: -31.7167,
      lon: -55.9833,
      barrios: ['Centro', 'Barrio Ferrocarril', 'Barrio Yacuy', 'La Tahona', 'Iporá'],
      codPostalMin: 45000,
      codPostalMax: 45999
    }
  ];

  const referencias = [];

  for (let i = 0; i < count; i++) {
    const ciudadData = faker.helpers.arrayElement(ciudadesUruguay);
    const barrio = faker.helpers.arrayElement(ciudadData.barrios);
    const spread = 0.05;

    const lat = parseFloat((ciudadData.lat + (Math.random() - 0.5) * spread).toFixed(6));
    const lon = parseFloat((ciudadData.lon + (Math.random() - 0.5) * spread).toFixed(6));

    referencias.push({
      latitud: lat,
      longitud: lon,
      cod_postal: faker.number.int({ min: ciudadData.codPostalMin, max: ciudadData.codPostalMax }),
      zona_postal: faker.number.int({ min: 1, max: 10 }),
      id_barrio: ciudadData.barrios.indexOf(barrio) + 1,
      barrio: barrio,
      id_ciudad: ciudadesUruguay.indexOf(ciudadData) + 1,
      ciudad: ciudadData.ciudad,
      id_departamento: ciudadesUruguay.indexOf(ciudadData) + 1,
      departamento: ciudadData.departamento,
      direccion_obtenida: `${faker.location.streetAddress()}, ${barrio}, ${ciudadData.ciudad}`,
      observaciones: null
    });
  }

  console.log(`  Generated ${referencias.length} geographic references across Uruguay cities`);
  return referencias;
}
