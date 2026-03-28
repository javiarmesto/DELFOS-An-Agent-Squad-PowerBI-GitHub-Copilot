---
description: "Iniciar sesión Power BI: detecta instancias locales, pregunta al usuario qué archivo .pbix usar y conecta via MCP."
mode: agent
tools: ['mcp_powerbi-model_connection_operations', 'mcp_powerbi-model_database_operations']
---

# Power BI Init — Conectar a archivo PBIX

Inicia una sesión de trabajo con un modelo semántico de Power BI Desktop.

## Paso 1: Detectar instancias locales

Usa `mcp_powerbi-model_connection_operations` → `ListLocalInstances` para detectar todas las instancias de PBI Desktop que estén corriendo.

### Si NO hay instancias:
Muestra este mensaje y DETENTE:
```
❌ No se detectó ninguna instancia de Power BI Desktop.

   Por favor:
   1. Abre el archivo .pbix que quieras trabajar en Power BI Desktop
   2. Espera a que cargue completamente
   3. Vuelve a ejecutar este prompt (#delfos-pbi-init)
```

### Si hay instancias:
Continúa al Paso 2.

## Paso 2: Preguntar al usuario qué archivo usar

Presenta las instancias detectadas al usuario en una tabla clara con:
- Nombre del modelo / base de datos
- Puerto local
- Estado (si está disponible)

Pregunta al usuario:
```
Se detectaron las siguientes instancias de Power BI Desktop:

| #  | Modelo              | Puerto |
|----|---------------------|--------|
| 1  | {nombre modelo 1}   | {port} |
| 2  | {nombre modelo 2}   | {port} |

¿A cuál quieres conectarte? (indica el número)
```

Si solo hay UNA instancia, confirma con el usuario antes de conectar:
```
Se detectó una instancia de Power BI Desktop:
   📊 Modelo: {nombre}
   🔌 Puerto: {puerto}

¿Procedo a conectar? (sí/no)
```

## Paso 3: Conectar

Usa `mcp_powerbi-model_connection_operations` → `Connect` con:
- `dataSource`: `localhost:{puerto_seleccionado}`

## Paso 4: Verificar conexión y guardar como última usada

1. Usa `mcp_powerbi-model_connection_operations` → `ListConnections` para confirmar que la conexión está activa.
2. Usa `mcp_powerbi-model_connection_operations` → `SetLastUsed` con el `connectionName` de la conexión recién creada.
3. Usa `mcp_powerbi-model_database_operations` → `List` para mostrar los modelos disponibles en la conexión.

## Paso 5: Confirmar al usuario

Muestra el resumen:
```
✅ Conexión establecida con Power BI Desktop

   📊 Modelo: {nombre del modelo/base de datos}
   🔌 Conexión: {connectionName}
   🏠 Puerto: localhost:{puerto}
   💾 Guardada como última conexión usada

   Ya puedes trabajar con el modelo semántico.
   Las herramientas MCP usarán esta conexión automáticamente.
```
