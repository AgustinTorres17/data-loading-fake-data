#!/usr/bin/env node

import { testConnection, executeInTransaction, executeWithClient, closePool } from './config/database.js';
import { truncateAllTables, loadAllDimensions, readDimensionsFromDatabase } from './loaders/dimensionLoader.js';
import { loadAllFacts } from './loaders/factLoader.js';

function parseArgs() {
  const args = process.argv.slice(2);
  let recordCount = 10000;
  let truncate = true;
  let factsOnly = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--records' || args[i] === '-r') {
      recordCount = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--no-truncate') {
      truncate = false;
    } else if (args[i] === '--facts-only' || args[i] === '-f') {
      factsOnly = true;
      truncate = false; // Don't truncate dimensions when loading only facts
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Medical Data Loader - Generate and load fake medical data into PostgreSQL

Usage:
  npm start [options]

Options:
  --records, -r <number>   Number of records to generate per fact table (default: 10000)
  --no-truncate            Skip truncating existing data (default: truncate)
  --facts-only, -f         Load ONLY fact tables (reads dimensions from DB)
  --help, -h               Show this help message

Examples:
  npm start                                  # Load dimensions and facts
  npm start -- --records 50000               # Load with 50k records per table
  npm start -- --facts-only --records 10000  # Load only facts (dimensions already in DB)
  npm start -- -f -r 100000                  # Short version

Environment Variables (set in .env file):
  DB_HOST       Database host (default: localhost)
  DB_PORT       Database port (default: 5432)
  DB_NAME       Database name (required)
  DB_USER       Database user (required)
  DB_PASSWORD   Database password (required)
  DB_SSL        Enable SSL (default: false)
      `);
      process.exit(0);
    }
  }

  if (isNaN(recordCount) || recordCount < 1) {
    console.error('Error: --records must be a positive integer');
    process.exit(1);
  }

  return { recordCount, truncate, factsOnly };
}

async function main() {
  const startTime = Date.now();

  console.log('');
  console.log('     Medical Data Loader - Fake Data Generation Tool       ');
  console.log('');

  const { recordCount, truncate, factsOnly } = parseArgs();

  console.log('\n  Configuration:');
  console.log(`  Mode: ${factsOnly ? 'Facts Only (dimensions already in DB)' : 'Full Load (dimensions + facts)'}`);
  console.log(`  Records per fact table: ${recordCount.toLocaleString()}`);
  if (!factsOnly) {
    console.log(`  Truncate existing data: ${truncate ? 'Yes' : 'No'}`);
  }

  try {

    console.log('\n Testing database connection...');
    await testConnection();

    let dimensions;

    if (factsOnly) {
      // First: Load any missing dimensions (without transaction, so they persist)
      dimensions = await executeWithClient(async (client) => {
        return await readDimensionsFromDatabase(client);
      });

      // Then: Load facts in a transaction
      await executeInTransaction(async (client) => {
        await loadAllFacts(client, recordCount, dimensions);
      });
    } else {
      // Full load: dimensions and facts in one transaction
      await executeInTransaction(async (client) => {
        if (truncate) {
          await truncateAllTables(client);
        }
        dimensions = await loadAllDimensions(client);
        await loadAllFacts(client, recordCount, dimensions);
      });
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n');
    console.log('                    LOAD SUMMARY                            ');
    console.log('');

    if (!factsOnly) {
      console.log('\n Dimension Tables Loaded:');
      console.log('   atencion_cancelada: 2 rows');
      console.log('   sexo: 2 rows');
      console.log('   tiene_diagnostico: 2 rows');
      console.log('   tiene_motivo_consulta: 2 rows');
      console.log('   clasificacion_triage: 5 rows');
      console.log('   dia_semana: 7 rows');
      console.log('   edad: 18 rows');
      console.log('   procedencia: 10 rows');
      console.log('   destino: 12 rows');
      console.log('   fecha: ~2,190 rows (2020-2025)');
      console.log('   horario: 96 rows (every 15 min)');
      console.log('   cie10: 100 rows');
      console.log('   snomed: 50 rows');
      console.log('   referencia_geografica: 50 rows (Uruguay)');
    }

    console.log('\n Fact Tables Loaded:');
    console.log(`   fact_os_admision: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_triage: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_emergencia: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_diagnosticos_alta: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_ingresos_piso: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_mortalidad_emergencia: ${Math.floor(recordCount * 0.02).toLocaleString()} rows (2%)`);
    console.log(`   fact_os_tiempo_atencion: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_tiempo_espera_triage: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_tiempo_espera_asignacion: ${recordCount.toLocaleString()} rows`);
    console.log(`   fact_os_espera_interconsulta: ${Math.floor(recordCount * 0.3).toLocaleString()} rows (30%)`);

    const totalFactRows = recordCount * 8 + Math.floor(recordCount * 0.02) + Math.floor(recordCount * 0.3);
    console.log(`\n  Total fact rows: ${totalFactRows.toLocaleString()}`);

    console.log(`\n  Total execution time: ${duration} seconds`);
    console.log('\n Data loading completed successfully!');

  } catch (error) {
    console.error('\n Error during data loading:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
