---
description: "Check rápido de rendimiento: diagnostica problemas de rendimiento del modelo conectado via MCP evaluando tamaño, cardinalidad, storage modes y complejidad DAX."
mode: agent
tools: ['powerbi-remote/*', 'powerbi-modeling-mcp/*', 'read', 'search', 'web']
---

# Power BI Quick Performance Check — Diagnóstico rápido de rendimiento

Ejecuta un diagnóstico rápido de rendimiento del modelo semántico conectado para identificar cuellos de botella y oportunidades de optimización.

## Requisito previo

Antes de iniciar, verifica que hay una conexión MCP activa. Si no la hay, indica al usuario:
```
❌ No hay conexión MCP activa.
   Ejecuta #delfos-pbi-init para conectar a Power BI Desktop primero.
```

## Paso 1: Recopilar métricas del modelo

Usa MCP para obtener las siguientes métricas:

### Tamaño y cardinalidad
```dax
// Tamaño de tablas (filas)
EVALUATE
SELECTCOLUMNS(
    INFO.TABLES(),
    "Tabla", [Name],
    "Filas", [RowCount]
)
ORDER BY [RowCount] DESC

// Cardinalidad de columnas
EVALUATE
SELECTCOLUMNS(
    INFO.STORAGETABLECOLUMNS(),
    "Tabla", [TableName],
    "Columna", [ColumnName],
    "CardinalidadDistinta", [DistinctCount],
    "TamañoBytes", [ColumnSize]
)
ORDER BY [ColumnSize] DESC
```

### Relaciones y complejidad
```dax
// Relaciones activas
EVALUATE INFO.RELATIONSHIPS()

// Measures (cantidad y complejidad)
EVALUATE
SELECTCOLUMNS(
    INFO.MEASURES(),
    "Tabla", [TableName],
    "Measure", [Name],
    "Expresión", [Expression]
)
```

## Paso 2: Análisis de rendimiento (6 dimensiones)

### 1. Tamaño del modelo
- Número total de filas en tablas de hechos
- Tablas con más de 10M de filas (flag)
- Tamaño estimado en memoria

**Umbrales:**
| Indicador | 🟢 OK | 🟡 Atención | 🔴 Crítico |
|-----------|--------|-------------|------------|
| Filas tabla hechos | <10M | 10M-100M | >100M |
| Total columnas | <200 | 200-500 | >500 |
| Tamaño modelo | <500MB | 500MB-1GB | >1GB |

### 2. Cardinalidad de columnas
- Columnas con cardinalidad >1M (flag)
- Columnas de texto con alta cardinalidad (candidatas a eliminación o hash)
- Columnas DateTime que deberían ser solo Date

### 3. Storage modes
- Tablas en DirectQuery (cada una genera query al origen)
- Tablas Dual (verificar justificación)
- Mezcla Import + DirectQuery (modelo compuesto — verificar diseño)

### 4. Relaciones problemáticas
- Relaciones bidireccionales (impactan rendimiento de filtrado)
- Relaciones many-to-many (evaluar alternativas)
- Cadenas de relaciones largas (>3 hops entre tablas)

### 5. DAX complejo
- Measures con CALCULATE anidados (>2 niveles)
- Uso de FILTER(ALL(...)) sobre tablas grandes
- Measures con iteradores costosos (SUMX, ADDCOLUMNS sobre hechos)
- Columnas calculadas en tablas de hechos (deberían estar en Power Query)

### 6. Potencial de optimización
- Columnas no referenciadas por measures ni relaciones
- Tablas sin relaciones (huérfanas)
- Columnas importadas pero nunca usadas en visuales

## Paso 3: Generar informe de rendimiento

```
⚡ Diagnóstico Rápido de Rendimiento
═════════════════════════════════════

📊 Perfil del Modelo
   Tablas:              {N}
   Columnas totales:    {N}
   Measures:            {N}
   Relaciones:          {N}
   Storage mode:        {Import | DirectQuery | Compuesto}
   Filas (tabla mayor): {N} ({nombre tabla})

🔴 Problemas Críticos de Rendimiento
   {lista con impacto estimado y acción recomendada}

🟡 Advertencias
   {lista con descripción y sugerencia}

🟢 Aspectos Positivos
   {patrones de rendimiento correctos detectados}

📋 Resumen por Dimensión
   | Dimensión              | Estado |
   |------------------------|--------|
   | Tamaño del modelo      | {🟢🟡🔴} |
   | Cardinalidad           | {🟢🟡🔴} |
   | Storage modes          | {🟢🟡🔴} |
   | Relaciones             | {🟢🟡🔴} |
   | Complejidad DAX        | {🟢🟡🔴} |
   | Optimización posible   | {🟢🟡🔴} |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Siguiente paso recomendado:
   {Usar @power-bi-performance-expert para análisis profundo y plan de optimización}
```
