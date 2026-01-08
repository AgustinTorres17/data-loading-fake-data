import * as dimensionGenerators from '../generators/dimensions.js';

export async function truncateAllTables(client) {
  console.log('\n  Truncating existing data...');

  try {

    await client.query('SET session_replication_role = replica;');

    const factTables = [
      'fact_os_admision',
      'fact_os_diagnosticos_alta',
      'fact_os_emergencia',
      'fact_os_espera_interconsulta',
      'fact_os_ingresos_piso',
      'fact_os_mortalidad_emergencia',
      'fact_os_tiempo_atencion',
      'fact_os_tiempo_espera_asignacion',
      'fact_os_tiempo_espera_triage',
      'fact_os_triage'
    ];

    for (const table of factTables) {
      await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    const dimensionTables = [
      'atencion_cancelada',
      'cie10',
      'clasificacion_triage',
      'destino',
      'dia_semana',
      'edad',
      'fecha',
      'horario',
      'procedencia',
      'referencia_geografica',
      'sexo',
      'snomed',
      'tiene_diagnostico',
      'tiene_motivo_consulta'
    ];

    for (const table of dimensionTables) {
      await client.query(`TRUNCATE TABLE ${table} CASCADE`);
    }

    await client.query('SET session_replication_role = DEFAULT;');

    console.log('   All tables truncated');
  } catch (error) {
    console.error('   Error truncating tables:', error.message);
    throw error;
  }
}

export async function loadAtencionCancelada(client) {
  const data = dimensionGenerators.generateAtencionCancelada();

  for (const row of data) {
    await client.query(
      'INSERT INTO atencion_cancelada (is_cancelado, cancelado) VALUES ($1, $2)',
      [row.is_cancelado, row.cancelado]
    );
  }

  console.log('   Loaded atencion_cancelada');
  return data;
}

export async function loadSexo(client) {
  const data = dimensionGenerators.generateSexo();

  for (const row of data) {
    await client.query(
      'INSERT INTO sexo (id_sexo, sexo) VALUES ($1, $2)',
      [row.id_sexo, row.sexo]
    );
  }

  console.log('   Loaded sexo');
  return data;
}

export async function loadTieneDiagnostico(client) {
  const data = dimensionGenerators.generateTieneDiagnostico();

  for (const row of data) {
    await client.query(
      'INSERT INTO tiene_diagnostico (has_diagnostico, tiene_diagnostico) VALUES ($1, $2)',
      [row.has_diagnostico, row.tiene_diagnostico]
    );
  }

  console.log('   Loaded tiene_diagnostico');
  return data;
}

export async function loadTieneMotivo(client) {
  const data = dimensionGenerators.generateTieneMotivo();

  for (const row of data) {
    await client.query(
      'INSERT INTO tiene_motivo_consulta (has_motivo_con, tiene_motivo_consulta) VALUES ($1, $2)',
      [row.has_motivo_con, row.tiene_motivo_consulta]
    );
  }

  console.log('   Loaded tiene_motivo_consulta');
  return data;
}

export async function loadClasificacionTriage(client) {
  const data = dimensionGenerators.generateClasificacionTriage();

  for (const row of data) {
    await client.query(
      'INSERT INTO clasificacion_triage (id_clas_triage, color_triage) VALUES ($1, $2)',
      [row.id_clas_triage, row.color_triage]
    );
  }

  console.log('   Loaded clasificacion_triage');
  return data;
}

export async function loadDiaSemana(client) {
  const data = dimensionGenerators.generateDiaSemana();

  for (const row of data) {
    await client.query(
      'INSERT INTO dia_semana (id_dia_sem, dia_semana) VALUES ($1, $2)',
      [row.id_dia_sem, row.dia_semana]
    );
  }

  console.log('   Loaded dia_semana');
  return data;
}

export async function loadEdad(client) {
  const data = dimensionGenerators.generateEdadRangos();

  for (const row of data) {
    await client.query(
      'INSERT INTO edad (id_rango_sinadi, rango_sinadi) VALUES ($1, $2)',
      [row.id_rango_sinadi, row.rango_sinadi]
    );
  }

  console.log('   Loaded edad');
  return data;
}

export async function loadProcedencia(client) {
  const data = dimensionGenerators.generateProcedencias();

  for (const row of data) {
    await client.query(
      'INSERT INTO procedencia (id_procedencia, procedencia) VALUES ($1, $2)',
      [row.id_procedencia, row.procedencia]
    );
  }

  console.log('   Loaded procedencia');
  return data;
}

export async function loadDestino(client) {
  const data = dimensionGenerators.generateDestinos();

  for (const row of data) {
    await client.query(
      `INSERT INTO destino (id_destino, destino, id_servicio_destino, servicio_destino,
       id_prestacion_destino, prestacion_destino) VALUES ($1, $2, $3, $4, $5, $6)`,
      [row.id_destino, row.destino, row.id_servicio_destino, row.servicio_destino,
       row.id_prestacion_destino, row.prestacion_destino]
    );
  }

  console.log('   Loaded destino');
  return data;
}

export async function loadFechas(client) {
  const data = dimensionGenerators.generateFechas();

  const batchSize = 1000;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map(row => `('${row.fecha}')`).join(',');
    await client.query(`INSERT INTO fecha (fecha) VALUES ${values}`);
  }

  console.log('   Loaded fecha');
  return data;
}

export async function loadHorarios(client) {
  const data = dimensionGenerators.generateHorarios();

  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map(row => `('${row.horarios}')`).join(',');
    await client.query(`INSERT INTO horario (horarios) VALUES ${values}`);
  }

  console.log('   Loaded horario');
  return data;
}

export async function loadCIE10(client) {
  const data = dimensionGenerators.generateCIE10Codes(100);

  for (const row of data) {
    await client.query(
      `INSERT INTO cie10 (id_codigo_cie10, codigo_cie10, descripcion_codigo,
       id_capitulo, capitulo, descripcion_capitulo, id_grupo, grupo, descripcion_grupo,
       id_categoria, categoria, descripcion_categoria, id_sub_categoria, sub_categoria,
       descripcion_sub_categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [row.id_codigo_cie10, row.codigo_cie10, row.descripcion_codigo,
       row.id_capitulo, row.capitulo, row.descripcion_capitulo,
       row.id_grupo, row.grupo, row.descripcion_grupo,
       row.id_categoria, row.categoria, row.descripcion_categoria,
       row.id_sub_categoria, row.sub_categoria, row.descripcion_sub_categoria]
    );
  }

  console.log('   Loaded cie10');
  return data;
}

export async function loadSNOMED(client) {
  const data = dimensionGenerators.generateSNOMEDCodes(50);

  for (const row of data) {
    await client.query(
      'INSERT INTO snomed (id_snomed, snomed) VALUES ($1, $2)',
      [row.id_snomed, row.snomed]
    );
  }

  console.log('   Loaded snomed');
  return data;
}

export async function loadReferenciasGeograficas(client) {
  const data = dimensionGenerators.generateReferenciasGeograficas(50);

  for (const row of data) {
    await client.query(
      `INSERT INTO referencia_geografica (latitud, longitud, cod_postal, zona_postal,
       id_barrio, barrio, id_ciudad, ciudad, id_departamento, departamento,
       direccion_obtenida, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [row.latitud, row.longitud, row.cod_postal, row.zona_postal,
       row.id_barrio, row.barrio, row.id_ciudad, row.ciudad,
       row.id_departamento, row.departamento, row.direccion_obtenida, row.observaciones]
    );
  }

  console.log('   Loaded referencia_geografica');
  return data;
}

// New function: Read existing dimensions from database
export async function readDimensionsFromDatabase(client) {
  console.log('\n Reading existing dimension data from database...');

  const dimensions = {};

  // Read sexo
  const sexoResult = await client.query('SELECT id_sexo, sexo FROM sexo ORDER BY id_sexo');
  dimensions.sexo = sexoResult.rows;
  console.log(`   Read sexo: ${dimensions.sexo.length} rows`);

  // Read edad
  const edadResult = await client.query('SELECT id_rango_sinadi, rango_sinadi FROM edad ORDER BY id_rango_sinadi');
  dimensions.edad = edadResult.rows;
  console.log(`   Read edad: ${dimensions.edad.length} rows`);

  // Read procedencia
  const procedenciaResult = await client.query('SELECT id_procedencia, procedencia FROM procedencia ORDER BY id_procedencia');
  dimensions.procedencia = procedenciaResult.rows;
  console.log(`   Read procedencia: ${dimensions.procedencia.length} rows`);

  // Read clasificacion_triage
  const triageResult = await client.query('SELECT id_clas_triage, color_triage FROM clasificacion_triage ORDER BY id_clas_triage');
  dimensions.clasificacion_triage = triageResult.rows;
  console.log(`   Read clasificacion_triage: ${dimensions.clasificacion_triage.length} rows`);

  // Read cie10
  const cie10Result = await client.query('SELECT id_codigo_cie10, codigo_cie10 FROM cie10 ORDER BY id_codigo_cie10');
  dimensions.cie10 = cie10Result.rows;
  console.log(`   Read cie10: ${dimensions.cie10.length} rows`);

  // Read destino
  const destinoResult = await client.query('SELECT id_servicio_destino, destino, servicio_destino FROM destino ORDER BY id_servicio_destino');
  dimensions.destino = destinoResult.rows;
  console.log(`   Read destino: ${dimensions.destino.length} rows`);

  // Read fechas - generate if empty
  const fechasResult = await client.query('SELECT fecha FROM fecha ORDER BY fecha');
  if (fechasResult.rows.length === 0) {
    console.log('   fecha table is empty - generating and loading...');
    dimensions.fechas = await loadFechas(client);
  } else {
    dimensions.fechas = fechasResult.rows;
    console.log(`   Read fecha: ${dimensions.fechas.length} rows`);
  }

  // Read horarios
  const horariosResult = await client.query('SELECT horarios FROM horario ORDER BY horarios');
  if (horariosResult.rows.length === 0) {
    console.log('   horario table is empty - generating and loading...');
    dimensions.horarios = await loadHorarios(client);
  } else {
    dimensions.horarios = horariosResult.rows;
    console.log(`   Read horario: ${dimensions.horarios.length} rows`);
  }

  // Read referencia_geografica - generate if empty
  const geoResult = await client.query('SELECT latitud, longitud FROM referencia_geografica ORDER BY latitud, longitud');
  if (geoResult.rows.length === 0) {
    console.log('   referencia_geografica table is empty - generating and loading...');
    dimensions.referencia_geografica = await loadReferenciasGeograficas(client);
  } else {
    dimensions.referencia_geografica = geoResult.rows;
    console.log(`   Read referencia_geografica: ${dimensions.referencia_geografica.length} rows`);
  }

  // Read dia_semana
  const diaResult = await client.query('SELECT id_dia_sem, dia_semana FROM dia_semana ORDER BY id_dia_sem');
  dimensions.dia_semana = diaResult.rows;
  console.log(`   Read dia_semana: ${dimensions.dia_semana.length} rows`);

  // Validate required dimensions have data
  const requiredDimensions = ['sexo', 'edad', 'procedencia', 'clasificacion_triage', 'cie10', 'destino', 'dia_semana'];
  for (const dimName of requiredDimensions) {
    if (!dimensions[dimName] || dimensions[dimName].length === 0) {
      throw new Error(`Required dimension '${dimName}' is empty. Please load it first from KNIME or run without --facts-only.`);
    }
  }

  console.log('\n All dimensions read successfully from database!');
  return dimensions;
}

export async function loadAllDimensions(client) {
  console.log('\n Loading dimension tables...');

  const dimensions = {};

  dimensions.atencion_cancelada = await loadAtencionCancelada(client);
  dimensions.sexo = await loadSexo(client);
  dimensions.tiene_diagnostico = await loadTieneDiagnostico(client);
  dimensions.tiene_motivo_consulta = await loadTieneMotivo(client);
  dimensions.clasificacion_triage = await loadClasificacionTriage(client);
  dimensions.dia_semana = await loadDiaSemana(client);
  dimensions.edad = await loadEdad(client);
  dimensions.procedencia = await loadProcedencia(client);
  dimensions.destino = await loadDestino(client);
  dimensions.fechas = await loadFechas(client);
  dimensions.horarios = await loadHorarios(client);
  dimensions.cie10 = await loadCIE10(client);
  dimensions.snomed = await loadSNOMED(client);
  dimensions.referencia_geografica = await loadReferenciasGeograficas(client);

  console.log('\n All dimensions loaded successfully!');
  return dimensions;
}
