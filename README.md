# Medical Data Loader

Herramienta para generar y cargar datos ficticios médicos en una base de datos PostgreSQL utilizando Faker.js. Genera datos realistas para un sistema de gestión hospitalaria con múltiples tablas de dimensiones y hechos.

## Características

- ✅ Generación de datos ficticios realistas usando Faker.js
- ✅ Soporte para 14 tablas de dimensiones y 10 tablas de hechos
- ✅ Datos geográficos de Uruguay (Montevideo, Salto, Paysandú, Maldonado, Rivera, Tacuarembó)
- ✅ Códigos médicos CIE-10 y SNOMED
- ✅ Sistema de triage Manchester con 5 niveles
- ✅ Generación de fechas (2020-2025) y horarios (cada 15 minutos)
- ✅ Inserción por lotes para rendimiento óptimo
- ✅ Soporte de transacciones para integridad de datos
- ✅ Cantidad configurable de registros

## Prerequisitos

- Node.js v14 o superior
- PostgreSQL 12 o superior
- Base de datos PostgreSQL con el schema proporcionado ya creado

## Instalación

1. Clonar o descargar este proyecto:
```bash
cd dataLoading
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` con tus credenciales de base de datos:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_SSL=false
```

## Uso

### Ejecución básica (10,000 registros por tabla de hechos)
```bash
npm start
```

### **NUEVO: Cargar SOLO tablas de hechos (dimensiones ya en DB)**
Si ya cargaste las dimensiones desde KNIME u otra fuente:
```bash
npm start -- --facts-only --records 10000
# O versión corta:
npm start -- -f -r 10000
```
Esto lee las dimensiones existentes de la base de datos y solo genera e inserta las tablas de hechos.

### Especificar cantidad de registros
```bash
npm start -- --records 50000
```

### Cargar datos sin truncar tablas existentes
```bash
npm start -- --no-truncate
```

### Generar conjunto de datos pequeño para pruebas
```bash
npm run test
```
Esto genera 100 registros por tabla de hechos.

### Ver ayuda
```bash
npm start -- --help
```

## Estructura del Proyecto

```
dataLoading/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── generators/
│   │   ├── dimensions.js        # Generadores de datos para dimensiones
│   │   └── facts.js             # Generadores de datos para tablas de hechos
│   ├── loaders/
│   │   ├── dimensionLoader.js   # Carga dimensiones a la BD
│   │   └── factLoader.js        # Carga hechos a la BD
│   └── index.js                 # Script principal de orquestación
├── package.json
├── .env.example
├── .env                         # Tu archivo de configuración (no versionado)
└── README.md
```

## Tablas Generadas

### Tablas de Dimensiones

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| `atencion_cancelada` | Estados de cancelación | 2 |
| `sexo` | Sexos biológicos | 2 |
| `tiene_diagnostico` | Indicador de diagnóstico | 2 |
| `tiene_motivo_consulta` | Indicador de motivo | 2 |
| `clasificacion_triage` | Niveles de triage Manchester | 5 |
| `dia_semana` | Días de la semana | 7 |
| `edad` | Rangos etarios SINADI | 18 |
| `procedencia` | Origen del paciente | 10 |
| `destino` | Servicios de destino | 12 |
| `fecha` | Dimensión de fechas | ~2,190 |
| `horario` | Dimensión de horarios | 96 |
| `cie10` | Códigos CIE-10 | 100 |
| `snomed` | Códigos SNOMED | 50 |
| `referencia_geografica` | Ubicaciones Uruguay | 50 |

### Tablas de Hechos

| Tabla | Descripción | Registros por defecto |
|-------|-------------|-----------------------|
| `fact_os_admision` | Admisiones | 10,000 |
| `fact_os_triage` | Triages realizados | 10,000 |
| `fact_os_emergencia` | Atenciones de emergencia | 10,000 |
| `fact_os_diagnosticos_alta` | Diagnósticos de alta | 10,000 |
| `fact_os_ingresos_piso` | Ingresos a piso | 10,000 |
| `fact_os_mortalidad_emergencia` | Mortalidad (2%) | 200 |
| `fact_os_tiempo_atencion` | Tiempos de atención | 10,000 |
| `fact_os_tiempo_espera_triage` | Espera para triage | 10,000 |
| `fact_os_tiempo_espera_asignacion` | Espera para asignación | 10,000 |
| `fact_os_espera_interconsulta` | Espera interconsulta (30%) | 3,000 |

## Datos Geográficos

El sistema genera datos de las siguientes ciudades de Uruguay:

- **Montevideo** (Departamento: Montevideo)
  - Barrios: Centro, Ciudad Vieja, Pocitos, Punta Carretas, Carrasco, etc.

- **Salto** (Departamento: Salto)
- **Paysandú** (Departamento: Paysandú)
- **Maldonado** (Departamento: Maldonado)
- **Rivera** (Departamento: Rivera)
- **Tacuarembó** (Departamento: Tacuarembó)

Cada registro incluye:
- Coordenadas geográficas (latitud/longitud)
- Código postal
- Barrio
- Ciudad y departamento
- Dirección generada

## Características de los Datos Generados

### Sistema de Triage Manchester
- **Rojo (1)**: Inmediato - Emergencia vital
- **Naranja (2)**: Muy urgente - 10 minutos
- **Amarillo (3)**: Urgente - 60 minutos
- **Verde (4)**: Estándar - 120 minutos
- **Azul (5)**: No urgente - 240 minutos

### Códigos Médicos
- **CIE-10**: Códigos internacionales de enfermedades con jerarquía completa (capítulo, grupo, categoría, subcategoría)
- **SNOMED**: Códigos SNOMED CT para terminología clínica

### Rangos Etarios (SINADI)
18 rangos de edad estándar:
- 0-4 años, 5-9 años, ..., 80-84 años, 85+ años

### Tiempos Realistas
- **Espera de triage**: 5-120 minutos
- **Espera de asignación**: 10-240 minutos
- **Tiempo total de atención**: 30 minutos - 24 horas
- **Espera de interconsulta**: 30 minutos - 4 horas

## Solución de Problemas

### Error de conexión a la base de datos
```
✗ Database connection failed: connection refused
```
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos existe

### Error de constraint de clave foránea
```
Error: violates foreign key constraint
```
- El script trunca todas las tablas antes de cargar
- Si usas `--no-truncate`, asegúrate de que las dimensiones ya existan

### Error de memoria (para datasets grandes)
```
JavaScript heap out of memory
```
- Reduce el número de registros con `--records <número_menor>`
- O aumenta el límite de memoria de Node:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start -- --records 100000
```

## Rendimiento

Tiempos aproximados de carga (en una máquina estándar):
- 1,000 registros: ~10 segundos
- 10,000 registros: ~30 segundos
- 50,000 registros: ~2 minutos
- 100,000 registros: ~4 minutos

El tiempo varía según:
- Velocidad de la conexión a la base de datos
- Recursos del servidor PostgreSQL
- Índices y constraints en las tablas

## Customización

### Cambiar rango de fechas
Edita `src/generators/dimensions.js`:
```javascript
export function generateFechas(startDate = '2023-01-01', endDate = '2024-12-31') {
  // ...
}
```

### Agregar más ciudades uruguayas
Edita el array `ciudadesUruguay` en `src/generators/dimensions.js`

### Ajustar probabilidades
En `src/generators/facts.js`, modifica las probabilidades:
```javascript
const cie10 = faker.datatype.boolean({ probability: 0.7 }) // 70% tienen CIE-10
```

## Contribución

Si encuentras algún error o tienes sugerencias, por favor abre un issue o pull request.

## Licencia

MIT

## Autor

Generado con Faker.js y amor para el análisis de datos médicos.
