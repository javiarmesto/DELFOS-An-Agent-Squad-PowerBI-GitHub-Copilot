---
description: "Reconectar a Power BI Desktop: intenta restaurar la última conexión usada o conectar a una instancia activa."
mode: agent
tools: ['mcp_powerbi-model_connection_operations', 'mcp_powerbi-model_database_operations']
---

# Power BI Reconnect — Restaurar conexión

Restaura rápidamente la conexión con Power BI Desktop.

## Paso 1: Verificar si ya hay conexión activa

Usa `mcp_powerbi-model_connection_operations` → `ListConnections`.

### Si hay conexión activa:
Muestra:
```
✅ Ya hay una conexión activa.

   🔌 Conexión: {connectionName}
   📊 Modelo: {nombre}

   No es necesario reconectar. Puedes trabajar directamente.
```
Y DETENTE.

### Si NO hay conexión activa:
Continúa al Paso 2.

## Paso 2: Intentar recuperar última conexión

Usa `mcp_powerbi-model_connection_operations` → `GetLastUsed`.

### Si hay última conexión guardada:
Guarda el `dataSource` (puerto) de la última conexión. Continúa al Paso 3.

### Si NO hay última conexión:
Muestra:
```
⚠️ No hay conexión previa guardada.
   Ejecuta #delfos-pbi-init para iniciar una nueva sesión.
```
Y DETENTE.

## Paso 3: Detectar instancias locales

Usa `mcp_powerbi-model_connection_operations` → `ListLocalInstances`.

### Si NO hay instancias:
Muestra:
```
❌ Power BI Desktop no está abierto.

   La última conexión fue a: {nombre modelo anterior}
   
   Por favor:
   1. Abre ese archivo .pbix en Power BI Desktop
   2. Espera a que cargue completamente
   3. Vuelve a ejecutar #delfos-pbi-reconnect
```
Y DETENTE.

### Si hay instancias:
Continúa al Paso 4.

## Paso 4: Reconectar

Busca entre las instancias detectadas la que coincida con la última conexión guardada (por nombre de modelo o puerto).

### Si encuentra coincidencia:
Usa `mcp_powerbi-model_connection_operations` → `Connect` con:
- `dataSource`: `localhost:{puerto}`

### Si NO encuentra coincidencia exacta:
Muestra las instancias disponibles y pregunta:
```
⚠️ La última conexión era a "{nombre modelo anterior}" pero no se encuentra esa instancia.

   Instancias disponibles:
   | #  | Modelo              | Puerto |
   |----|---------------------|--------|
   | 1  | {nombre modelo 1}   | {port} |

   ¿Quieres conectarte a alguna de estas? (indica el número, o "no" para cancelar)
```

## Paso 5: Verificar y confirmar

1. Usa `mcp_powerbi-model_connection_operations` → `ListConnections` para confirmar.
2. Usa `mcp_powerbi-model_connection_operations` → `SetLastUsed` con el nuevo `connectionName`.
3. Usa `mcp_powerbi-model_database_operations` → `List` para mostrar los modelos.

Muestra:
```
✅ Reconexión exitosa con Power BI Desktop

   📊 Modelo: {nombre del modelo}
   🔌 Conexión: {connectionName}
   🏠 Puerto: localhost:{puerto}
   💾 Actualizada como última conexión usada

   Listo para continuar trabajando.
```
