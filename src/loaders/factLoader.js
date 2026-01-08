import * as factGenerators from '../generators/facts.js';

async function batchInsert(client, tableName, columns, data, batchSize = 1000) {
  if (data.length === 0) {
    console.log(`    No data to insert for ${tableName}`);
    return;
  }

  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const currentBatch = Math.floor(i / batchSize) + 1;

    const valueRows = [];
    const params = [];
    let paramIndex = 1;

    for (const row of batch) {
      const rowParams = columns.map(col => {
        params.push(row[col]);
        return `$${paramIndex++}`;
      });
      valueRows.push(`(${rowParams.join(', ')})`);
    }

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${valueRows.join(', ')}`;

    try {
      await client.query(query, params);
      process.stdout.write(`\r   Batch ${currentBatch}/${totalBatches} (${i + batch.length}/${data.length} rows)`);
    } catch (error) {
      console.error(`\n   Error inserting batch ${currentBatch}:`, error.message);
      throw error;
    }
  }

  console.log('');
}

export async function loadAdmisionFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_admision (${count} records)...`);
  const facts = factGenerators.generateAdmisionFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage_llegada',
    'id_cie10', 'fecha_llegada', 'horario_llegada', 'id_dia_semana', 'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_admision', columns, facts);
  console.log('   Loaded fact_os_admision');
}

export async function loadTriageFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_triage (${count} records)...`);
  const facts = factGenerators.generateTriageFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'id_cie10', 'id_dia_semana', 'fecha_triage', 'horario_triage', 'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_triage', columns, facts);
  console.log('   Loaded fact_os_triage');
}

export async function loadEmergenciaFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_emergencia (${count} records)...`);
  const facts = factGenerators.generateEmergenciaFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'id_cie10', 'id_dia_semana', 'fecha_atencion', 'horario_atencion', 'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_emergencia', columns, facts);
  console.log('   Loaded fact_os_emergencia');
}

export async function loadDiagnosticosAltaFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_diagnosticos_alta (${count} records)...`);
  const facts = factGenerators.generateDiagnosticosAltaFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage', 'id_cie10',
    'fecha_llegada', 'id_dia_llegada', 'horario_llegada',
    'fecha_alta', 'id_dia_alta', 'horario_alta', 'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_diagnosticos_alta', columns, facts);
  console.log('   Loaded fact_os_diagnosticos_alta');
}

export async function loadIngresosPisoFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_ingresos_piso (${count} records)...`);
  const facts = factGenerators.generateIngresosPisoFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'id_servicio_destino', 'fecha_llegada', 'id_dia_llegada', 'horario_llegada',
    'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_ingresos_piso', columns, facts);
  console.log('   Loaded fact_os_ingresos_piso');
}

export async function loadMortalidadFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_mortalidad_emergencia (${count} records)...`);
  const facts = factGenerators.generateMortalidadFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'id_cie10', 'id_ultimo_lugar_asignado', 'fecha_llegada', 'id_dia_llegada',
    'horario_llegada', 'latitud', 'longitud'
  ];

  await batchInsert(client, 'fact_os_mortalidad_emergencia', columns, facts);
  console.log('   Loaded fact_os_mortalidad_emergencia');
}

export async function loadTiempoAtencionFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_tiempo_atencion (${count} records)...`);
  const facts = factGenerators.generateTiempoAtencionFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage', 'id_cie10',
    'fecha_llegada', 'id_dia_llegada', 'horario_llegada',
    'fecha_salida', 'id_dia_salida', 'horario_salida', 'tiempo_total_atencion'
  ];

  await batchInsert(client, 'fact_os_tiempo_atencion', columns, facts);
  console.log('   Loaded fact_os_tiempo_atencion');
}

export async function loadTiempoEsperaTriageFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_tiempo_espera_triage (${count} records)...`);
  const facts = factGenerators.generateTiempoEsperaTriageFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'fecha_llegada', 'id_dia_llegada', 'horario_llegada',
    'fecha_triage', 'id_dia_triage', 'horario_triage', 'tiempo_espera_triage'
  ];

  await batchInsert(client, 'fact_os_tiempo_espera_triage', columns, facts);
  console.log('   Loaded fact_os_tiempo_espera_triage');
}

export async function loadTiempoEsperaAsignacionFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_tiempo_espera_asignacion (${count} records)...`);
  const facts = factGenerators.generateTiempoEsperaAsignacionFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'fecha_triage', 'id_dia_triage', 'horario_triage',
    'fecha_asignacion', 'id_dia_asignacion', 'horario_asignacion', 'tiempo_espera_asignacion'
  ];

  await batchInsert(client, 'fact_os_tiempo_espera_asignacion', columns, facts);
  console.log('   Loaded fact_os_tiempo_espera_asignacion');
}

export async function loadEsperaInterconsultaFacts(client, count, dimensions) {
  console.log(`\n Loading fact_os_espera_interconsulta (${count} records)...`);
  const facts = factGenerators.generateEsperaInterconsultaFacts(count, dimensions);

  const columns = [
    'id_os', 'id_sexo', 'id_edad', 'id_procedencia', 'id_clas_triage',
    'fecha_llegada', 'id_dia_llegada', 'horario_llegada',
    'fecha_solicitud', 'id_dia_solicitud', 'horario_solicitud',
    'fecha_escritura', 'id_dia_escritura', 'horario_escritura', 'tiempo_espera_interconsulta'
  ];

  await batchInsert(client, 'fact_os_espera_interconsulta', columns, facts);
  console.log('   Loaded fact_os_espera_interconsulta');
}

export async function loadAllFacts(client, recordCount, dimensions) {
  console.log('\n Loading fact tables...');

  await loadAdmisionFacts(client, recordCount, dimensions);
  await loadTriageFacts(client, recordCount, dimensions);
  await loadEmergenciaFacts(client, recordCount, dimensions);
  await loadDiagnosticosAltaFacts(client, recordCount, dimensions);
  await loadIngresosPisoFacts(client, recordCount, dimensions);
  await loadMortalidadFacts(client, Math.floor(recordCount * 0.02), dimensions);
  await loadTiempoAtencionFacts(client, recordCount, dimensions);
  await loadTiempoEsperaTriageFacts(client, recordCount, dimensions);
  await loadTiempoEsperaAsignacionFacts(client, recordCount, dimensions);
  await loadEsperaInterconsultaFacts(client, Math.floor(recordCount * 0.3), dimensions);

  console.log('\n All fact tables loaded successfully!');
}
