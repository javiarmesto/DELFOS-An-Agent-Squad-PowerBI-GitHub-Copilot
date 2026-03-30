# CLAUDE.md — Delfos Repository Guide

## What Is This Repository?

**Delfos** is an AI agent framework for Power BI development using GitHub Copilot agent modes. It is **not** a traditional application — it contains no executable code, no packages, and no build system. The entire repository is prompt engineering: Markdown-based agent definitions, coding instructions, skills, and session management prompts that run inside VS Code with GitHub Copilot.

**Current version:** 1.1.0 (2026-03-26)
**License:** MIT

## Repository Structure

```
.github/
├── agents/              # 7 AI agent mode definitions (.agent.md)
│   ├── delfos-architect.agent.md          # Full-stack PBI architecture designer (orchestration)
│   ├── delfos-lead-squad.agent.md         # Project orchestrator with HITL gates (orchestration)
│   ├── power-bi-data-modeling-expert.agent.md   # Star schema & relationships
│   ├── power-bi-dax-expert.agent.md             # DAX formulas & calculations
│   ├── power-bi-pbip-validator.agent.md         # PBIP project validation
│   ├── power-bi-performance-expert.agent.md     # Query optimization & monitoring
│   └── power-bi-visualization-expert.agent.md   # Report design & UX
├── instructions/        # 7 always-on coding guidelines (.instructions.md)
│   ├── delfos-tmdl-file-editing.instructions.md
│   ├── power-bi-custom-visuals-development.instructions.md
│   ├── power-bi-data-modeling-best-practices.instructions.md
│   ├── power-bi-dax-best-practices.instructions.md
│   ├── power-bi-devops-alm-best-practices.instructions.md
│   ├── power-bi-power-query-best-practices.instructions.md
│   └── power-bi-security-rls-best-practices.instructions.md
├── skills/              # 21 on-demand prompt templates (directory/SKILL.md)
│   ├── bc-data-source-mapping/            # BC API → PBI model mapping
│   ├── power-bi-dax-optimization/         # DAX formula analysis & optimization
│   ├── power-bi-deneb-visuals/            # Deneb/Vega-Lite custom visuals
│   ├── power-bi-fabric-cli/               # Fabric CLI remote operations
│   ├── power-bi-lineage-analysis/         # Dependency tracing & impact analysis
│   ├── power-bi-model-design-review/      # Semantic model audit
│   ├── power-bi-naming-conventions/       # Naming standards audit
│   ├── power-bi-pbip-format/              # PBIP project structure reference
│   ├── power-bi-pbir-format/              # PBIR report metadata reference
│   ├── power-bi-performance-troubleshooting/ # Performance diagnosis
│   ├── power-bi-python-visuals/           # Python (matplotlib/seaborn) visuals
│   ├── power-bi-r-visuals/                # R (ggplot2) visuals
│   ├── power-bi-report-design-consultation/  # Report design methodology
│   ├── power-bi-semantic-model-refresh/   # Refresh management & troubleshooting
│   ├── power-bi-svg-visuals/              # SVG visuals via DAX measures
│   ├── power-bi-tabular-editor-bpa/       # Best Practice Analyzer rules
│   ├── power-bi-theme-json/               # Report theme JSON management
│   ├── power-bi-tmdl-authoring/           # Advanced TMDL file authoring
│   ├── markdown-converter/
│   ├── markdown-to-html/
│   └── markdown-to-word/
├── prompts/             # 8 quick-invoke prompts (.prompt.md)
│   ├── delfos-pbi-init.prompt.md              # Connect to PBI Desktop via MCP
│   ├── delfos-pbi-reconnect.prompt.md         # Restore previous MCP connection
│   ├── delfos-pbi-preflight-check.prompt.md   # Verify MCP connection status
│   ├── delfos-pbi-audit-context.prompt.md     # Audit project configuration
│   ├── delfos-pbi-quick-model-review.prompt.md    # Quick semantic model health check
│   ├── delfos-pbi-quick-dax-review.prompt.md      # Quick DAX anti-pattern scan
│   ├── delfos-pbi-quick-performance-check.prompt.md # Quick performance diagnostics
│   └── delfos-pbi-security-audit.prompt.md    # RLS/OLS security audit
├── hooks/               # Pre and PostToolUse safety gates
│   ├── delfos-pbi-preflight-check.json        # PreToolUse: block risky TMDL edits
│   ├── delfos-pbi-post-validation.json        # PostToolUse: validate JSON/TMDL after edits
│   └── scripts/
│       ├── delfos-check-pbi-tmdl.ps1          # Pre-flight gate script
│       └── delfos-post-validate.ps1           # Post-edit validation script
├── AGENT-TONE.md        # Consistent tone & behavior guidelines for all agents
├── memory.md            # Cross-session decision memory (append-only, with template)
└── bc-api-v2-catalog.md # Business Central API v2.0 entity reference
.vscode/
└── mcp.json             # MCP server configuration (Remote MCP + Microsoft Learn MCP)
CHANGELOG.md
CONTRIBUTING.md
LICENSE
QUICKSTART.md            # 30-minute Sales Order Tracker walkthrough
README.md
```

## Architecture: Three-Tier Agent System

```
Tier 1 — ORCHESTRATION (planning & coordination)
  ├── Delfos Architect       → Unified design across 6 layers
  └── Delfos Lead Squad      → Phased execution with HITL gates

Tier 2 — DOMAIN EXPERTS (specialized execution)
  ├── Data Modeling Expert   → Star schema, relationships, SCD
  ├── DAX Expert             → Formulas, variables, time intelligence
  ├── Performance Expert     → Query optimization, monitoring
  ├── Visualization Expert   → Reports, accessibility, mobile
  └── PBIP Validator         → Project structure & file validation

Tier 3 — ENABLERS (always-on & on-demand)
  ├── 7 Instruction Sets     → Auto-applied coding guidelines (via applyTo globs)
  ├── 21 Skills              → Prompt templates for specific analysis tasks
  ├── 8 Prompts              → Session management + quick diagnostics
  ├── 2 Hooks                → Pre and PostToolUse safety gates
  └── 1 AGENT-TONE.md        → Consistent behavior guidelines for all agents
```

## File Naming Conventions

| Type | Pattern | Location |
|------|---------|----------|
| Agent modes | `{name}.agent.md` | `.github/agents/` |
| Instructions | `{topic}-best-practices.instructions.md` | `.github/instructions/` |
| Skills | `{name}/SKILL.md` (directory-based) | `.github/skills/` |
| Prompts | `{name}.prompt.md` | `.github/prompts/` |
| Hooks | `{name}.json` + `scripts/{name}.ps1` | `.github/hooks/` |

## YAML Frontmatter Conventions

All `.agent.md`, `.instructions.md`, and skill `SKILL.md` files use YAML frontmatter:

- **Agents:** `name`, `description`, `model` (Claude Opus 4.6), `tools` (list of MCP tools)
- **Instructions:** `description`, `applyTo` (glob pattern like `**/*.{pbix,dax,md,txt}`)
- **Skills:** `name`, `description`

## Key Technologies and Integrations

| Component | Purpose |
|-----------|---------|
| GitHub Copilot (Business/Enterprise) | Hosts agent modes in VS Code |
| Power BI Desktop | Local semantic model development |
| Power BI Remote MCP | READ operations — query models, execute DAX |
| Power BI Modeling MCP | WRITE operations — create/edit tables, measures (VS Code extension) |
| Microsoft Learn MCP | Documentation lookups referenced in agents |
| Business Central API v2.0 | Data source mapping for BC projects (optional) |

**MCP endpoint:** `https://api.fabric.microsoft.com/v1/mcp/powerbi` (configured in `.vscode/mcp.json`)

## Content Style Conventions

- **Language:** English for all agents, instructions, skills, and documentation. Prompts (`.prompt.md`) are in Spanish.
- **Documentation style:** DO/DON'T checklists with ✅/❌ indicators, real code examples, Microsoft docs references.
- **Code examples:** DAX, M (Power Query), PowerShell, TypeScript/React (for custom visuals), TMSL/SQL.
- **Memory file** (`.github/memory.md`): Append-only — never delete existing entries.

## Development Workflow

### Editing Agent Content

1. **Agent modes** define persona, responsibilities, tool access, and response methodology. Edit `.github/agents/*.agent.md`.
2. **Instructions** auto-apply to files matching their `applyTo` glob. Edit `.github/instructions/*.instructions.md`.
3. **Skills** are loaded on demand. Each lives in its own directory under `.github/skills/`.
4. **Prompts** are quick session starters invoked via `#prompt-name` in Copilot Chat.
5. **Hooks** add safety gates (e.g., block direct TMDL file writes, require MCP instead).

### Quality Standards

- All guidance must align with official Microsoft Power BI documentation.
- Include concrete code examples for every pattern and anti-pattern.
- Provide validation checklists at the end of instructions.
- Agent definitions must include structured response methodology sections.

### Branch Strategy

- `main` — stable, released content
- Feature branches for new agents, instructions, skills, or improvements
- PR-based contributions (see `CONTRIBUTING.md`)

## What This Repository Does NOT Have

- No `package.json`, `tsconfig`, `pyproject.toml`, or any build system
- No CI/CD workflows (`.github/workflows/` does not exist)
- No test suite — quality is validated manually via Copilot Chat and MCP
- No runtime dependencies — pure Markdown/YAML configuration
- No linting/formatting config files — style guidance is embedded in instruction files

## Common Tasks

| Task | What to edit |
|------|-------------|
| Add a new domain expert agent | Create `.github/agents/{name}.agent.md` with YAML frontmatter |
| Add a new coding guideline | Create `.github/instructions/{topic}.instructions.md` with `applyTo` glob |
| Add a new skill | Create `.github/skills/{name}/SKILL.md` directory |
| Add a session prompt | Create `.github/prompts/{name}.prompt.md` |
| Update MCP configuration | Edit `.vscode/mcp.json` |
| Record a cross-session decision | Append to `.github/memory.md` (never delete) |
| Update BC API reference | Edit `.github/bc-api-v2-catalog.md` |
