---
description: "Revisión rápida del modelo semántico: ejecuta un diagnóstico del modelo conectado via MCP evaluando esquema, relaciones, storage modes y convenciones de nombres."
mode: agent
tools: ['powerbi-remote/*', 'powerbi-modeling-mcp/*', 'read', 'search', 'web']
---

# Power BI Quick Model Review — Revisión rápida del modelo semántico

Ejecuta una revisión rápida del modelo semántico conectado para identificar problemas críticos y oportunidades de mejora.

## Requisito previo

Antes de iniciar, verifica que hay una conexión MCP activa. Si no la hay, indica al usuario:
```
❌ No hay conexión MCP activa.
   Ejecuta #delfos-pbi-init para conectar a Power BI Desktop primero.
```

## Paso 1: Recopilar información del modelo

Usa las herramientas MCP para obtener:

1. **Lista de tablas** — nombres, tipos (fact/dimension), número de columnas, filas estimadas
2. **Relaciones** — tabla origen, tabla destino, cardinalidad, dirección de filtro
3. **Measures** — nombre, tabla, expresión DAX (al menos las primeras 20)
4. **Storage modes** — Import, DirectQuery, Dual por tabla

Ejecuta estas consultas DAX via MCP Remote:

```dax
// Inventario de tablas
EVALUATE
SELECTCOLUMNS(
    INFO.TABLES(),
    "Tabla", [Name],
    "Filas", [RowCount],
    "Columnas", COUNTROWS(FILTER(INFO.COLUMNS(), [TableName] = [Name]))
)

// Inventario de relaciones
EVALUATE INFO.RELATIONSHIPS()

// Inventario de measures
EVALUATE INFO.MEASURES()
```

## Paso 2: Auditoría rápida (8 categorías)

Evalúa el modelo contra estos criterios:

### 1. Esquema Star Schema
- [ ] Separación clara de hechos y dimensiones
- [ ] Grano consistente en tablas de hechos
- [ ] Sin snowflaking innecesario
- [ ] Tabla de calendario/fechas presente

### 2. Relaciones
- [ ] Cardinalidades correctas (preferir 1:*)
- [ ] Dirección de filtro single (evitar bidireccional)
- [ ] Sin dependencias circulares
- [ ] Claves foráneas ocultas del report view

### 3. Convenciones de nombres
- [ ] Nombres de tablas descriptivos (singular vs plural consistente)
- [ ] Columnas con nombres claros (sin prefijos técnicos innecesarios)
- [ ] Measures con prefijo de categoría o agrupados en display folders

### 4. Tipos de datos
- [ ] Claves como enteros (no texto)
- [ ] Fechas como Date (no DateTime si no es necesario)
- [ ] Sin columnas de texto con alta cardinalidad innecesaria

### 5. Storage modes
- [ ] Import para dimensiones (rendimiento óptimo)
- [ ] DirectQuery justificado donde se use
- [ ] Dual mode para tablas compartidas en modelos compuestos

### 6. Columnas calculadas vs Measures
- [ ] Measures preferidas sobre columnas calculadas
- [ ] Columnas calculadas solo para atributos fijos de dimensiones
- [ ] Sin columnas calculadas en tablas de hechos

### 7. Documentación del modelo
- [ ] Descriptions en tablas principales
- [ ] Descriptions en measures de negocio
- [ ] Display folders organizados

### 8. Potencial de optimización
- [ ] Columnas no utilizadas que podrían eliminarse
- [ ] Tablas sin relaciones (huérfanas)
- [ ] Measures sin uso aparente

## Paso 3: Generar informe

Presenta los resultados con este formato:

```
📊 Revisión Rápida del Modelo Semántico
═══════════════════════════════════════

📈 Resumen General
   Tablas:       {N} ({N} dimensiones, {N} hechos, {N} otras)
   Relaciones:   {N} ({N} activas, {N} inactivas)
   Measures:     {N}
   Storage mode: {Import | DirectQuery | Compuesto}

🔴 Problemas Críticos
   {lista de problemas que requieren acción inmediata}

🟡 Advertencias
   {lista de mejoras recomendadas}

🟢 Buenas Prácticas Detectadas
   {lista de aspectos positivos del modelo}

📋 Puntuación: {X}/8 categorías OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Siguiente paso recomendado:
   {Usar @power-bi-data-modeling-expert para resolver problemas críticos}
   {o "Modelo en buen estado, considerar optimización de DAX"}
```
