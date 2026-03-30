---
description: "Auditar contexto del proyecto: revisa ficheros de configuración, estructura PBIP, MCP, memory.md y valida que el entorno esté correctamente configurado."
mode: agent
tools: ['read', 'search', 'web']
---

# Power BI Audit Context — Revisar configuración del proyecto

Realiza una auditoría completa del contexto del proyecto Power BI actual para verificar que la configuración, estructura y ficheros de soporte estén correctos.

## Paso 1: Detectar estructura del proyecto

Busca en el workspace actual los siguientes ficheros y directorios:

### Ficheros de configuración:
- `.vscode/mcp.json` — Configuración de servidores MCP
- `.github/memory.md` — Memoria cross-session de decisiones
- `.github/bc-api-v2-catalog.md` — Catálogo BC API (si aplica)

### Estructura PBIP (si existe):
- `*.pbip` — Fichero de proyecto Power BI
- `*.pbism` — Definición del modelo semántico
- `*.platform` — Metadatos de plataforma
- `*.SemanticModel/` — Directorio del modelo (TMDL)
- `*.Report/` — Directorio del report (PBIR)
- `.gitignore` — Exclusiones de Git

### Agentes y skills disponibles:
- `.github/agents/*.agent.md` — Agentes Delfos configurados
- `.github/instructions/*.instructions.md` — Instructions activas
- `.github/skills/*/SKILL.md` — Skills disponibles
- `.github/prompts/*.prompt.md` — Prompts de sesión
- `.github/hooks/` — Hooks de seguridad

## Paso 2: Validar configuración MCP

Si existe `.vscode/mcp.json`:
1. Verificar que contiene el endpoint de Power BI Remote MCP
2. Verificar si incluye el endpoint de Modeling MCP
3. Reportar servidores MCP configurados

Si NO existe:
```
⚠️ No se encontró .vscode/mcp.json
   Sin configuración MCP, los agentes no podrán conectar con Power BI.

   Configuración mínima recomendada:
   {
     "servers": {
       "powerbi-remote": {
         "type": "http",
         "url": "https://api.fabric.microsoft.com/v1/mcp/powerbi"
       }
     }
   }
```

## Paso 3: Validar estructura PBIP (si aplica)

Si se detecta un proyecto PBIP:
1. Verificar que existe `model.tmdl` en el directorio del modelo
2. Verificar que existen `definition.pbir` y `report.json` en el directorio del report
3. Comprobar que `.gitignore` incluye las exclusiones necesarias (`.pbi/`, `cache.abf`)
4. Verificar encoding UTF-8 sin BOM en ficheros TMDL

Si NO hay proyecto PBIP:
```
ℹ️ No se detectó proyecto PBIP en el workspace.
   Esto es normal si trabajas directamente con .pbix via MCP.
```

## Paso 4: Revisar memoria de sesión

Si existe `.github/memory.md`:
1. Verificar si tiene entradas de decisiones previas
2. Mostrar resumen de las últimas decisiones registradas (si las hay)
3. Indicar la fecha de la última entrada

Si está vacío o no existe:
```
ℹ️ Memoria de sesión vacía. Las decisiones arquitectónicas se registrarán aquí
   durante el trabajo con Delfos Architect y Lead Squad.
```

## Paso 5: Generar informe de contexto

Presenta el informe con este formato:

```
📋 Informe de Contexto del Proyecto
═══════════════════════════════════

🔧 Configuración MCP
   Remote MCP:   {✅ Configurado | ❌ No encontrado}
   Modeling MCP: {✅ Configurado | ⚠️ No en mcp.json (puede estar como extensión VS Code)}

📁 Estructura del Proyecto
   Tipo:         {PBIP | Solo .pbix via MCP | No detectado}
   Modelo:       {nombre del directorio .SemanticModel si existe}
   Report:       {nombre del directorio .Report si existe}
   .gitignore:   {✅ Correcto | ⚠️ Faltan exclusiones | ❌ No existe}

🤖 Agentes Delfos Disponibles
   {lista de agentes detectados}

📚 Instructions Activas
   {lista de instructions con sus patrones applyTo}

🛠️ Skills Disponibles
   {lista de skills}

🧠 Memoria Cross-Session
   Estado:       {Con entradas (N) | Vacía | No existe}
   Última:       {fecha última entrada o N/A}

🔒 Hooks de Seguridad
   {lista de hooks configurados}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recomendaciones:
{lista de acciones sugeridas si se detectan problemas}
```
