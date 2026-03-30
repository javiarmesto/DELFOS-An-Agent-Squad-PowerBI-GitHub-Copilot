---
description: "Auditoría de seguridad: revisa roles RLS, expresiones de filtro, seguridad a nivel de objeto y buenas prácticas de seguridad del modelo conectado via MCP."
mode: agent
tools: ['powerbi-remote/*', 'powerbi-modeling-mcp/*', 'read', 'search', 'web']
---

# Power BI Security Audit — Auditoría rápida de seguridad

Ejecuta una auditoría de seguridad del modelo semántico conectado para verificar la implementación de Row-Level Security (RLS), Object-Level Security (OLS) y buenas prácticas de seguridad.

## Requisito previo

Antes de iniciar, verifica que hay una conexión MCP activa. Si no la hay, indica al usuario:
```
❌ No hay conexión MCP activa.
   Ejecuta #delfos-pbi-init para conectar a Power BI Desktop primero.
```

## Paso 1: Recopilar información de seguridad

Usa MCP para obtener la configuración de seguridad del modelo:

### Roles y miembros
```dax
// Roles definidos en el modelo
EVALUATE
SELECTCOLUMNS(
    INFO.ROLES(),
    "Rol", [Name],
    "Descripción", [Description],
    "PermisosModelo", [ModelPermission]
)
```

### Expresiones de filtro RLS
Consulta las table permissions (filtros DAX) asociadas a cada rol.

### Object-Level Security
Verifica si hay columnas o tablas con restricciones OLS por rol.

## Paso 2: Auditoría de seguridad (7 categorías)

### 1. Existencia de RLS
- [ ] El modelo tiene al menos un rol definido (si maneja datos sensibles)
- [ ] Los roles tienen nombres descriptivos
- [ ] Los roles tienen descripciones que explican su propósito

### 2. Expresiones de filtro RLS
- [ ] Las expresiones usan `USERNAME()` o `USERPRINCIPALNAME()` (no valores hardcoded)
- [ ] Las expresiones usan DIVIDE o manejo de errores cuando aplica
- [ ] Sin filtros que devuelvan `TRUE()` sin condición (abre acceso total)
- [ ] Sin uso de `LOOKUPVALUE` en expresiones RLS (rendimiento pobre)
- [ ] Filtros aplicados en dimensiones, no en tablas de hechos directamente

### 3. Dynamic RLS
- [ ] Tabla de seguridad separada del modelo de negocio
- [ ] Relación 1:* entre tabla de seguridad y dimensión filtrada
- [ ] Patrón correcto: `[Email] = USERPRINCIPALNAME()`
- [ ] Sin relaciones bidireccionales usadas exclusivamente para RLS

### 4. Object-Level Security (OLS)
- [ ] Columnas sensibles (salarios, datos personales) protegidas con OLS si aplica
- [ ] OLS aplicado consistentemente en todos los roles necesarios

### 5. Seguridad del modelo compuesto
- [ ] En modelos DirectQuery: verificar que RLS se aplica en el origen
- [ ] En modelos compuestos: verificar que tablas Import y DirectQuery tienen cobertura RLS
- [ ] Verificar que las relaciones entre tablas con diferente storage mode no filtran datos de seguridad

### 6. Anti-patrones de seguridad
- [ ] Sin measures que expongan datos pre-filtro (ej: `CALCULATE([Ventas], ALL(Seguridad))`)
- [ ] Sin columnas calculadas que expandan el contexto de seguridad
- [ ] Sin relaciones bidireccionales que puedan bypassear filtros RLS
- [ ] Sin tablas huérfanas con datos sensibles sin protección RLS

### 7. Preparación para deployment
- [ ] Roles probados con "View As" en Power BI Desktop
- [ ] Plan de asignación de usuarios/grupos a roles documentado
- [ ] Estrategia de testing post-publicación definida

## Paso 3: Generar informe de seguridad

```
🔒 Auditoría de Seguridad del Modelo
═════════════════════════════════════

📊 Resumen de Seguridad
   Roles definidos:         {N}
   Expresiones de filtro:   {N}
   Tablas protegidas:       {N}/{total}
   OLS configurado:         {Sí/No}
   Tipo de RLS:             {Estático | Dinámico | Mixto | No configurado}

🔴 Vulnerabilidades Críticas
   {lista de problemas que exponen datos sensibles}

🟡 Advertencias de Seguridad
   {lista de mejoras de seguridad recomendadas}

🟢 Controles Correctos
   {lista de buenas prácticas de seguridad implementadas}

📋 Detalle por Rol
   | Rol | Tablas filtradas | Tipo | Estado |
   |-----|-----------------|------|--------|
   | {nombre} | {tablas} | {Estático/Dinámico} | {🟢🟡🔴} |

📋 Cobertura de Seguridad
   | Tabla          | RLS | OLS | Datos sensibles |
   |----------------|-----|-----|-----------------|
   | {nombre}       | {✅/❌} | {✅/❌/N/A} | {Sí/No} |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Siguiente paso recomendado:
   {Usar @power-bi-data-modeling-expert para implementar/corregir RLS}
   {Consultar la instrucción power-bi-security-rls-best-practices para patrones detallados}
```
