---
description: "Revisión rápida de DAX: analiza las measures del modelo conectado via MCP buscando anti-patrones, oportunidades de optimización y violaciones de buenas prácticas."
mode: agent
tools: ['powerbi-remote/*', 'powerbi-modeling-mcp/*', 'read', 'search', 'web']
---

# Power BI Quick DAX Review — Revisión rápida de fórmulas DAX

Ejecuta un análisis rápido de todas las measures del modelo conectado para detectar anti-patrones DAX y oportunidades de optimización.

## Requisito previo

Antes de iniciar, verifica que hay una conexión MCP activa. Si no la hay, indica al usuario:
```
❌ No hay conexión MCP activa.
   Ejecuta #delfos-pbi-init para conectar a Power BI Desktop primero.
```

## Paso 1: Recopilar measures del modelo

Usa MCP para obtener todas las measures con sus expresiones DAX:

```dax
EVALUATE
SELECTCOLUMNS(
    INFO.MEASURES(),
    "Tabla", [TableName],
    "Measure", [Name],
    "Expresión", [Expression],
    "DisplayFolder", [DisplayFolder],
    "Descripción", [Description],
    "FormatString", [FormatString]
)
ORDER BY [TableName], [Name]
```

## Paso 2: Análisis de anti-patrones (10 checks)

Evalúa cada measure contra estos patrones:

### 🔴 Anti-patrones Críticos

1. **División sin DIVIDE**
   - Buscar: `/` en divisiones sin protección contra división por cero
   - Correcto: `DIVIDE(numerador, denominador, 0)`

2. **CALCULATE sin filtros**
   - Buscar: `CALCULATE(expresión)` sin argumentos de filtro
   - Indica CALCULATE redundante que debería eliminarse

3. **Columnas no cualificadas**
   - Buscar: `[Columna]` sin prefijo de tabla
   - Correcto: `Tabla[Columna]` para columnas, `[Measure]` para measures

4. **IF anidados excesivos**
   - Buscar: más de 3 niveles de `IF` anidados
   - Alternativa: usar `SWITCH(TRUE(), ...)`

5. **Iteradores sobre tablas completas sin filtro**
   - Buscar: `SUMX(Tabla, ...)`, `FILTER(ALL(Tabla), ...)` sobre tablas grandes
   - Evaluar si se puede simplificar con aggregaciones directas

### 🟡 Mejoras Recomendadas

6. **Ausencia de variables (VAR/RETURN)**
   - Buscar: expresiones repetidas que deberían almacenarse en VARs
   - Beneficio: rendimiento, legibilidad, depuración

7. **COUNTROWS vs COUNT**
   - Buscar: `COUNT(Tabla[Columna])` que debería ser `COUNTROWS(Tabla)`
   - COUNT ignora blancos, COUNTROWS cuenta filas

8. **VALUES vs DISTINCT**
   - Buscar: uso intercambiable sin considerar la fila en blanco
   - VALUES incluye la fila en blanco, DISTINCT no

9. **Format strings ausentes**
   - Buscar: measures numéricas sin FormatString definido
   - Impacta la presentación en reports

10. **Descriptions ausentes**
    - Buscar: measures de negocio sin descripción
    - Impacta documentación y AI/Copilot readiness

## Paso 3: Clasificar measures

Agrupa las measures en 3 categorías:
- **Base measures**: aggregaciones simples (SUM, COUNT, AVERAGE)
- **Measures calculadas**: usan CALCULATE, time intelligence, o lógica compleja
- **KPI measures**: measures de alto nivel que referencian otras measures

## Paso 4: Generar informe

Presenta los resultados con este formato:

```
📐 Revisión Rápida de DAX
═════════════════════════

📈 Resumen General
   Measures totales:    {N}
   Base measures:       {N}
   Measures calculadas: {N}
   KPI measures:        {N}

🔴 Anti-patrones Críticos Detectados
   {lista con measure afectada, anti-patrón, y sugerencia de corrección}

🟡 Mejoras Recomendadas
   {lista con measure afectada y mejora sugerida}

🟢 Buenas Prácticas Detectadas
   {patrones positivos encontrados}

📊 Estadísticas
   Measures con VAR:         {N}/{total} ({%})
   Measures con DIVIDE:      {N}/{total divisiones}
   Measures documentadas:    {N}/{total} ({%})
   Measures con formato:     {N}/{total} ({%})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Siguiente paso recomendado:
   {Usar @power-bi-dax-expert para optimizar las measures con anti-patrones críticos}
```
