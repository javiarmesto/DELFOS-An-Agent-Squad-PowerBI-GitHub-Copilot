---
description: "Pre-flight check: verifica si Power BI Desktop está conectado via MCP antes de editar el modelo semántico."
mode: agent
tools: ['mcp_powerbi-model_connection_operations']
---

# Power BI Pre-flight Check

Ejecuta esta comprobación antes de trabajar con el modelo semántico.

## Paso 1: Detectar instancias locales de Power BI Desktop

Usa `mcp_powerbi-model_connection_operations` con `ListLocalInstances` para ver si hay alguna instancia de PBI Desktop corriendo.

## Paso 2: Verificar conexiones activas

Usa `mcp_powerbi-model_connection_operations` con `ListConnections` para ver si ya hay una conexión activa.

## Paso 3: Evaluar y recomendar

Según el resultado:

### Si hay instancias Y conexión activa:
Responde:
```
✅ PBI Desktop conectado via MCP.
   Conexión: {nombre conexión}
   Puerto: {puerto}
   
   Puedes proceder con las operaciones MCP directamente.
```

### Si hay instancias PERO no hay conexión:
Responde:
```
⚠️ PBI Desktop está abierto pero NO conectado.
   Instancias detectadas: {lista}
   
   Recomendación: Conectar antes de operar.
   Ejecuta: mcp_powerbi-model_connection_operations → Connect
   con dataSource: "localhost:{puerto}"
```

### Si NO hay instancias:
Responde:
```
❌ Power BI Desktop NO está abierto.

   Tienes 2 opciones:
   
   A) RECOMENDADO: Abre el archivo .pbip en Power BI Desktop y vuelve a ejecutar
      este check para conectar via MCP.
      → Ventajas: validación en tiempo real, sin riesgo de BOM/encoding
   
   B) FALLBACK: Edición directa de TMDL (solo via PowerShell con UTF8 sin BOM)
      → Riesgo: errores de encoding, M syntax no validada hasta abrir PBI
      → Requiere ejecutar fix-tmdl.ps1 como verificación posterior
```
