# 🔄 Restaurar Dashboards y Consultas en Metabase

Este documento explica cómo restaurar tus dashboards y consultas de Metabase desde los archivos JSON de backup.

## 📋 Pre-requisitos

- Metabase instalado y corriendo
- Archivos de backup:
  - `dashboards_backup.json`
  - `questions_backup.json`
- Base de datos PostgreSQL configurada y conectada
- Credenciales de administrador de Metabase

## 🚀 Método 1: Restauración via API (Recomendado)

### Paso 1: Obtener token de sesión

```bash
# Guarda tu token en una variable
TOKEN=$(curl -X POST http://localhost:3000/api/session \
  -H 'Content-Type: application/json' \
  -d '{"username":"tu_email@ejemplo.com","password":"tu_password"}' \
  | grep -o '"id":"[^"]*"' \
  | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### Paso 2: Restaurar las consultas (Questions/Cards)

Las consultas deben importarse **antes** que los dashboards, ya que los dashboards las referencian.

```bash
# Leer el archivo de consultas
cat questions_backup.json | jq -c '.[]' | while read question; do
  # Extraer información relevante
  name=$(echo $question | jq -r '.name')
  
  echo "Importando consulta: $name"
  
  # Crear la consulta
  curl -X POST http://localhost:3000/api/card \
    -H 'Content-Type: application/json' \
    -H "X-Metabase-Session: $TOKEN" \
    -d "$question"
  
  echo ""
done
```

### Paso 3: Restaurar los dashboards

```bash
# Leer el archivo de dashboards
cat dashboards_backup.json | jq -c '.[]' | while read dashboard; do
  # Extraer información relevante
  name=$(echo $dashboard | jq -r '.name')
  
  echo "Importando dashboard: $name"
  
  # Crear el dashboard
  curl -X POST http://localhost:3000/api/dashboard \
    -H 'Content-Type: application/json' \
    -H "X-Metabase-Session: $TOKEN" \
    -d "$dashboard"
  
  echo ""
done
```

## 🛠️ Método 2: Script automatizado

Crea un archivo `restore.sh`:

```bash
#!/bin/bash

# Configuración
METABASE_URL="http://localhost:3000"
USERNAME="tu_email@ejemplo.com"
PASSWORD="tu_password"
QUESTIONS_FILE="questions_backup.json"
DASHBOARDS_FILE="dashboards_backup.json"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Iniciando restauración de Metabase...${NC}\n"

# 1. Login
echo -e "${YELLOW}📝 Obteniendo token de sesión...${NC}"
TOKEN=$(curl -s -X POST "$METABASE_URL/api/session" \
  -H 'Content-Type: application/json' \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  | grep -o '"id":"[^"]*"' \
  | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener el token de sesión${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token obtenido${NC}\n"

# 2. Restaurar consultas
echo -e "${YELLOW}📊 Restaurando consultas...${NC}"
QUESTIONS_COUNT=0

if [ -f "$QUESTIONS_FILE" ]; then
  cat "$QUESTIONS_FILE" | jq -c '.[]' | while read question; do
    name=$(echo $question | jq -r '.name')
    echo "  → $name"
    
    curl -s -X POST "$METABASE_URL/api/card" \
      -H 'Content-Type: application/json' \
      -H "X-Metabase-Session: $TOKEN" \
      -d "$question" > /dev/null
    
    ((QUESTIONS_COUNT++))
  done
  echo -e "${GREEN}✅ Consultas restauradas${NC}\n"
else
  echo -e "${RED}❌ Archivo $QUESTIONS_FILE no encontrado${NC}\n"
fi

# 3. Restaurar dashboards
echo -e "${YELLOW}📈 Restaurando dashboards...${NC}"
DASHBOARDS_COUNT=0

if [ -f "$DASHBOARDS_FILE" ]; then
  cat "$DASHBOARDS_FILE" | jq -c '.[]' | while read dashboard; do
    name=$(echo $dashboard | jq -r '.name')
    echo "  → $name"
    
    curl -s -X POST "$METABASE_URL/api/dashboard" \
      -H 'Content-Type: application/json' \
      -H "X-Metabase-Session: $TOKEN" \
      -d "$dashboard" > /dev/null
    
    ((DASHBOARDS_COUNT++))
  done
  echo -e "${GREEN}✅ Dashboards restaurados${NC}\n"
else
  echo -e "${RED}❌ Archivo $DASHBOARDS_FILE no encontrado${NC}\n"
fi

echo -e "${GREEN}🎉 Restauración completada${NC}"
```

**Hacer el script ejecutable y correrlo:**

```bash
chmod +x restore.sh
./restore.sh
```

## 📝 Método 3: Restauración manual via UI

Si prefieres hacerlo manualmente:

1. Accede a Metabase: `http://localhost:3000`
2. Ve a **Settings** (⚙️) → **Admin**
3. En el menú lateral, selecciona **Serialization**
4. Haz clic en **Import**
5. Sube tus archivos JSON
6. Verifica que se importen correctamente

**Nota:** Esta opción puede no estar disponible en todas las versiones de Metabase.

## ⚠️ Consideraciones importantes

### 1. IDs de base de datos
Los archivos JSON contienen referencias a IDs de bases de datos. Si cambias de instalación:

```bash
# Ver el ID de tu base de datos actual
curl -X GET http://localhost:3000/api/database \
  -H "X-Metabase-Session: $TOKEN" | jq '.[] | {id, name}'

# Actualizar IDs en los JSONs (si es necesario)
sed -i 's/"database":1/"database":2/g' questions_backup.json
```

### 2. IDs de colecciones
Si las consultas estaban en colecciones específicas, puede que necesites:

```bash
# Crear colecciones primero
curl -X POST http://localhost:3000/api/collection \
  -H 'Content-Type: application/json' \
  -H "X-Metabase-Session: $TOKEN" \
  -d '{"name":"Mi Colección","color":"#509EE3"}'
```

### 3. Orden de importación
**Siempre importa en este orden:**
1. ✅ Conexiones a bases de datos
2. ✅ Colecciones (si existen)
3. ✅ Preguntas/Consultas (questions)
4. ✅ Dashboards

## 🔍 Verificación post-restauración

```bash
# Verificar consultas importadas
curl -X GET http://localhost:3000/api/card \
  -H "X-Metabase-Session: $TOKEN" \
  | jq '.[] | {id, name, collection_id}'

# Verificar dashboards importados
curl -X GET http://localhost:3000/api/dashboard \
  -H "X-Metabase-Session: $TOKEN" \
  | jq '.[] | {id, name, collection_id}'
```

## 🐛 Troubleshooting

### Error: "Foreign key constraint fails"
**Causa:** Intentaste importar dashboards antes que las consultas.
**Solución:** Importa primero las consultas, luego los dashboards.

### Error: "Database not found"
**Causa:** El ID de base de datos en el JSON no existe en tu instalación.
**Solución:** Actualiza los IDs en los archivos JSON o recrea las conexiones.

### Error: "Invalid authentication token"
**Causa:** El token expiró.
**Solución:** Genera un nuevo token (Paso 1).

## 📦 Backup automatizado (recomendado)

Crea un script de backup regular:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR=~/metabase-backups/$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

TOKEN=$(curl -s -X POST http://localhost:3000/api/session \
  -H 'Content-Type: application/json' \
  -d '{"username":"tu_email","password":"tu_pass"}' \
  | grep -o '"id":"[^"]*"' \
  | cut -d'"' -f4)

curl -X GET http://localhost:3000/api/dashboard \
  -H "X-Metabase-Session: $TOKEN" \
  > $BACKUP_DIR/dashboards_backup.json

curl -X GET http://localhost:3000/api/card \
  -H "X-Metabase-Session: $TOKEN" \
  > $BACKUP_DIR/questions_backup.json

echo "✅ Backup guardado en: $BACKUP_DIR"
```

Configura un cron job:

```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /ruta/a/backup.sh
```

## 📚 Recursos adicionales

- [Documentación oficial de Metabase API](https://www.metabase.com/docs/latest/api-documentation)
- [Serialization en Metabase](https://www.metabase.com/docs/latest/installation-and-operation/serialization)

---

**Última actualización:** Enero 2026