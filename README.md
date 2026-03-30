# 🏛️ Delfos — Power BI Agentic Squad

**A curated collection of AI agent modes, coding instructions, and reusable skills for Power BI development with GitHub Copilot and Claude.**

[![License: MIT](https://img.shields.io/badge/License-MIT-818CF8.svg)](LICENSE)
[![Power BI](https://img.shields.io/badge/Power%20BI-Expert%20Framework-F2C811.svg)](https://learn.microsoft.com/power-bi/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Agent%20Ready-000000.svg)](https://docs.github.com/copilot)
[![MCP](https://img.shields.io/badge/MCP-Power%20BI%20Fabric-0078D4.svg)](https://api.fabric.microsoft.com/v1/mcp/powerbi)
[![awesome-copilot](https://img.shields.io/badge/awesome--copilot-power--bi--development-28A745.svg)](https://github.com/github/awesome-copilot/tree/main/plugins/power-bi-development)

---

Delfos provides a structured, agent-driven approach to Power BI development. Instead of relying on generic AI assistance, Delfos equips your coding assistant with **specialized expert modes**, **orchestration agents**, and **prompt-based skills** that follow Microsoft's official best practices.

Think of it as your Power BI oracle — a coordinated squad with an architect for strategic design, a lead for orchestration, and five domain experts ready to execute.

> **New to Delfos?** Jump to the [Quickstart Guide](docs/QUICKSTART.md) — build a complete Sales Order Tracker dashboard in under 30 minutes using the full Architect → Lead Squad → Experts workflow.

## Origin

Delfos started as a set of individual contributions to [**github/awesome-copilot**](https://github.com/github/awesome-copilot) — the official community-driven repository for GitHub Copilot customizations. The four domain experts (Data Modeling, DAX, Performance, Visualization), the five instruction sets, and the four skills were published there as the **power-bi-development** plugin.

What awesome-copilot provides is a catalog of standalone pieces. What was missing was the **orchestration layer** — a way to coordinate those experts into a structured workflow where architecture decisions flow into phased implementation, with human-in-the-loop gates at every boundary. Delfos adds that layer: the **Architect** for unified cross-layer design, the **Lead Squad** for phased orchestration, and the **Quickstart** that ties everything together with a working example.

```
awesome-copilot (FOUNDATION)  →  Delfos (ORCHESTRATION + EXPANSION)
     │                                │
  4 experts (standalone)         Architect + Lead Squad + PBIP Validator
  5 instructions                 7 instructions (+ Power Query)
  4 skills                       21 skills (+ 17 new domains)
  power-bi-development plugin    8 diagnostic prompts, 2 safety hooks, AGENT-TONE
```

## Why Delfos?

Working with Power BI involves deep, interconnected knowledge areas: a DAX formula that looks correct might destroy performance; a beautiful report might collapse under concurrent users; a star schema that seems clean might not scale. Generic AI assistants lack the specialized context to catch these issues.

Delfos solves this by providing a **layered agent architecture** — from strategic design through orchestrated execution — that carries Microsoft's best practices, anti-pattern detection, and optimization strategies directly into your development workflow.

## The Squad

Delfos is organized in three tiers: orchestration agents that plan and coordinate, domain experts that execute, plus instruction sets, reusable skills, diagnostic prompts, and safety hooks.

```
@delfos-architect  (DESIGN)  →  @delfos-lead-squad  (ORCHESTRATE)  →  Experts  (EXECUTE)
       │                                │                                  │
  Full-stack design              Phased workflow                   Domain specialists
  Architecture docs              HITL checkpoints                  Targeted guidance
  Trade-off analysis             Progress tracking                 Implementation
```

### Orchestration Agents

These agents coordinate the squad. They don't implement — they design, plan, delegate, and verify.

| Agent | Role | Key Capabilities |
|-------|------|-----------------|
| **Delfos Architect** | Full-stack design authority | Unified architecture across model + DAX + reports + security + DevOps. Produces architecture documents. Presents trade-offs with cross-layer impact analysis. |
| **Delfos Lead Squad** | Project orchestrator | Decomposes projects into phased plans. Delegates to experts. Enforces HITL gates at every phase boundary. Lightweight checkpoints + final summary document. |

### Domain Experts

Domain experts are specialized AI personas activated in GitHub Copilot Chat. Each carries deep expertise in one Power BI domain and follows a structured response methodology.

| Agent | Domain | Key Capabilities |
|-------|--------|-----------------|
| **Data Modeling Expert** | Schema & Relationships | Star schema design, relationship patterns, composite models, storage mode optimization, SCD handling |
| **DAX Expert** | Formulas & Calculations | Variable-based formulas, time intelligence, context transitions, error handling, performance patterns |
| **Performance Expert** | Optimization & Monitoring | Query diagnostics, model size reduction, DirectQuery tuning, capacity management, KQL monitoring |
| **Visualization Expert** | Reports & UX | Chart selection methodology, layout architecture, accessibility, mobile design, custom themes |
| **PBIP Validator** | Project Validation | 5-stage validation pipeline: project structure, TMDL syntax & encoding, PBIR JSON integrity, cross-reference consistency, post-rename verification |

Each expert follows a consistent response structure: Documentation Lookup → Requirements Analysis → Recommendation → Implementation Guidance → Validation Approach.

### When to Use What

| Scenario | Start With |
|----------|-----------|
| Quick question about one domain | Specialist expert directly |
| New project or major refactoring | `@delfos-architect` → `@delfos-lead-squad` |
| Multi-expert project with known architecture | `@delfos-lead-squad` |
| Architecture review of existing solution | `@delfos-architect` |
| Single optimization pass | Specialist expert directly |

### Instructions

Instructions are always-on guidelines that apply automatically based on file patterns. They inject best practices into every interaction without requiring explicit activation.

| Instruction | Applies To | Coverage |
|-------------|-----------|----------|
| **Data Modeling Best Practices** | `*.pbix, *.md, *.json, *.txt` | Star schema, relationships, storage modes, SCD, incremental refresh |
| **DAX Best Practices** | `*.pbix, *.dax, *.md, *.txt` | Formula structure, variables, reference syntax, error handling, time intelligence |
| **Power Query Best Practices** | `*.m, *.pq, *.pbix, *.json, *.md, *.txt` | Query folding, M performance, data types, parameterization, incremental load patterns |
| **Custom Visuals Development** | `*.ts, *.tsx, *.js, *.jsx, *.json, *.less, *.css` | React/D3.js, TypeScript patterns, testing, formatting model, tooltips |
| **DevOps & ALM** | `*.yml, *.yaml, *.ps1, *.json, *.pbix, *.pbir` | PBIP, Git workflows, CI/CD, Azure DevOps, Fabric REST API |
| **Security & RLS** | `*.pbix, *.dax, *.md, *.txt, *.json, *.csharp, *.powershell` | Row-level security, dynamic RLS, embedded analytics, governance |

### Skills

Skills are on-demand prompt templates designed for specific recurring tasks. Invoke them when you need focused, structured analysis. Each skill includes trigger phrases (`USE WHEN`) and cross-references to related skills (`RELATED SKILLS`) forming a navigable knowledge graph.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **DAX Optimization** | Formula analysis and improvement | Slow, unreadable, or non-compliant DAX |
| **Model Design Review** | Comprehensive model audit | Before production deployment or inheriting a model |
| **Performance Troubleshooting** | Systematic issue diagnosis | Slow reports, query timeouts, capacity stress |
| **Report Design Consultation** | Visualization strategy | Designing new or redesigning existing reports |
| **TMDL Authoring** | Advanced TMDL syntax, encoding, and object reference | Direct TMDL file editing (last resort, prefer MCP) |
| **PBIR Format** | Report metadata structure and visual definitions | Editing PBIR JSON files directly |
| **PBIP Format** | Project structure, Git workflows, conversion | PBIP project management, PBIX→PBIP migration |
| **Deneb Visuals** | Vega/Vega-Lite custom visuals in Power BI | Creating declarative custom charts with Deneb |
| **SVG Visuals** | Inline SVG graphics via DAX measures | KPI indicators, progress bars, sparklines, star ratings |
| **R Visuals** | R script visuals (ggplot2) | Statistical charts: box plots, violin, correlation matrix |
| **Python Visuals** | Python script visuals (matplotlib/seaborn) | Heatmaps, pair plots, density charts, annotations |
| **Theme JSON** | Report theme design, validation, and management | Custom color palettes, dark themes, brand compliance |
| **Tabular Editor BPA** | Best Practice Analyzer rules for TE | Creating/debugging BPA rules with Dynamic LINQ |
| **Fabric CLI** | Remote operations via fab CLI and REST API | Workspace management, deployment pipelines, refresh triggers |
| **Lineage Analysis** | Dependency tracing and impact assessment | Before renaming/deleting objects, change management |
| **Naming Conventions** | Naming standards audit and standardization | Inconsistent names, model cleanup, onboarding standards |
| **Semantic Model Refresh** | Refresh management and troubleshooting | Failed refreshes, incremental setup, scheduling, monitoring |
| **BC Data Source Mapping** | Map star schema to BC APIs, generate ALDC specs | Power BI project sourcing data from Business Central |

### Prompts

Prompts are quick-invoke templates you run with `#prompt-name` in Copilot Chat. They handle session management and quick diagnostic checks.

**Session Management:**

| Prompt | Command | Purpose |
|--------|---------|---------|
| **PBI Init** | `#delfos-pbi-init` | Detect PBI Desktop instances, select a model, connect via MCP |
| **PBI Reconnect** | `#delfos-pbi-reconnect` | Restore the last-used MCP connection or pick from available instances |
| **PBI Preflight Check** | `#delfos-pbi-preflight-check` | Verify PBI Desktop is connected before editing the semantic model |

**Quick Diagnostics:**

| Prompt | Command | Purpose |
|--------|---------|---------|
| **Audit Context** | `#delfos-pbi-audit-context` | Audit project configuration: MCP, PBIP structure, agents, memory |
| **Quick Model Review** | `#delfos-pbi-quick-model-review` | 8-category model health check (schema, relationships, naming, types) |
| **Quick DAX Review** | `#delfos-pbi-quick-dax-review` | 10-check DAX anti-pattern scan (DIVIDE, variables, qualifiers) |
| **Quick Performance Check** | `#delfos-pbi-quick-performance-check` | 6-dimension performance diagnostics with traffic-light scoring |
| **Security Audit** | `#delfos-pbi-security-audit` | RLS/OLS audit: roles, expressions, dynamic RLS, anti-patterns |

Each diagnostic prompt delegates to the relevant domain expert agent when issues require deeper analysis.

Typical workflow: `#delfos-pbi-init` → `#delfos-pbi-audit-context` → `#delfos-pbi-quick-model-review` → work with experts.

### MCP Integration — The Engine Behind Delfos

Delfos is not just prompts and best practices. Its agents operate against **live Power BI models** through two complementary MCP servers provided by Microsoft. This is the core differentiator: every recommendation, validation, and optimization is grounded in the real state of your semantic model.

#### Two MCP Servers, Two Purposes

| Server | Type | Purpose | Used By |
|--------|------|---------|---------|
| **Power BI Remote MCP** | Hosted (Fabric) | Query semantic models — schema discovery, DAX execution, natural language to DAX | DAX Expert, Performance Expert, Visualization Expert, Architect |
| **Power BI Modeling MCP** | Local (VS Code extension) | Modify semantic models — create/edit tables, columns, measures, relationships, TMDL, bulk operations | Data Modeling Expert, DAX Expert, Lead Squad |

**Remote MCP** (`api.fabric.microsoft.com`) is the read path. It connects to any semantic model you have access to in Fabric, learns its schema, and generates DAX queries using the same engine as Copilot for Power BI. When the DAX Expert optimizes a measure or the Performance Expert diagnoses a slow query, they use this server to execute queries and validate results against real data.

**Modeling MCP** (`powerbi-modeling-mcp`) is the write path. It connects to Power BI Desktop instances or Fabric workspaces and exposes the full Tabular Object Model (TOM) — tables, columns, measures, relationships, security roles, TMDL files. When the Data Modeling Expert implements a star schema or the Lead Squad orchestrates a multi-phase build, they use this server to apply changes directly to the model.

#### Configuration

Both servers are preconfigured in `.vscode/mcp.json`:

```json
{
    "servers": {
        "powerbi-remote": {
            "type": "http",
            "url": "https://api.fabric.microsoft.com/v1/mcp/powerbi"
        },
        "powerbi-modeling": {
            "type": "stdio",
            "command": "powerbi-modeling-mcp",
            "args": ["--start"]
        }
    }
}
```

The Remote MCP requires access to a Fabric workspace (F2+ or P1+ capacity). The Modeling MCP requires the [Power BI Modeling MCP VS Code extension](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp).

#### How Agents Use MCP

The interaction model varies by agent role:

**Delfos Architect** uses Remote MCP to inspect an existing model's schema before designing the architecture. It discovers tables, relationships, and measures to understand the current state and identify gaps.

**Data Modeling Expert** uses Modeling MCP to implement schema changes: create tables, define relationships, set storage modes, configure incremental refresh. Write operations require confirmation by default (HITL built into the MCP protocol).

**DAX Expert** uses both: Remote MCP to execute and validate DAX queries, Modeling MCP to create or modify measures in the model. When optimizing a formula, the expert reads the current measure via Remote, rewrites it, and applies via Modeling.

**Performance Expert** uses Remote MCP to execute diagnostic queries, analyze query execution metrics, and validate performance improvements with cleared-cache runs.

**Visualization Expert** uses Remote MCP to understand the model schema and available measures before recommending visual types and report layouts.

**Lead Squad** coordinates MCP usage across phases — ensuring the Data Modeling Expert connects to the right model before the DAX Expert starts writing measures against it.

#### Security and Governance

Both MCP servers use the authenticated user's permissions — they do not bypass Power BI security controls. The Modeling MCP includes a confirmation prompt before write operations (disable with `--skipconfirmation` only when you have backups). Admins can monitor MCP usage via Fabric Workspace Monitoring logs filtering by `ApplicationName == 'MCP-PBIModeling'`.

## Getting Started

### Prerequisites

- **VS Code** with GitHub Copilot extension (agent mode support)
- **Power BI Desktop** for model development
- **GitHub Copilot** subscription (Business or Enterprise recommended for agent modes)
- **Power BI Modeling MCP** — [VS Code extension](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp) for local semantic model operations
- **Fabric workspace** (F2+ or P1+ capacity) for Remote MCP server access

### Installation

1. **Clone the repository** into your Power BI project or as a standalone reference:

```bash
git clone https://github.com/javiarmesto/delfos-powerbi-agentic-squad.git
```

2. **Copy the `.github/` folder** into your Power BI project repository:

```bash
cp -r delfos-powerbi-agentic-squad/.github/ your-powerbi-project/.github/
cp delfos-powerbi-agentic-squad/.vscode/mcp.json your-powerbi-project/.vscode/mcp.json
```

3. **Open your project in VS Code** — instructions apply automatically based on file patterns. Agent modes are available in GitHub Copilot Chat.

4. **Initialize your MCP session** — run `#delfos-pbi-init` in Copilot Chat to detect open PBI Desktop instances and connect.

5. **Follow the [Quickstart Guide](docs/QUICKSTART.md)** to build a complete Sales Order Tracker dashboard using the full workflow.

### Using Agent Modes

In GitHub Copilot Chat, switch to an agent mode by selecting it from the mode picker:

```
# Example: Ask the DAX Expert to optimize a formula
@workspace Optimize this DAX measure for performance:

Sales Growth = ([Total Sales] - CALCULATE([Total Sales], 
    PARALLELPERIOD('Date'[Date], -12, MONTH))) / 
    CALCULATE([Total Sales], PARALLELPERIOD('Date'[Date], -12, MONTH))
```

### Using Skills

Skills are prompt templates — reference the SKILL.md content in your AI assistant:

```
# Example: Request a model design review
Following the Power BI Model Design Review skill, please review my data model.
The model has 3 fact tables (Sales, Inventory, Returns) and 8 dimensions...
```

## Repository Structure

```
delfos-powerbi-agentic-squad/
│
├── .github/
│   ├── agents/                              # Orchestration + Domain expert agents (7)
│   │   ├── delfos-architect.agent.md        #   Full-stack architecture designer
│   │   ├── delfos-lead-squad.agent.md       #   Project orchestrator (HITL, checkpoints)
│   │   ├── power-bi-data-modeling-expert.agent.md
│   │   ├── power-bi-dax-expert.agent.md
│   │   ├── power-bi-pbip-validator.agent.md #   PBIP project validation (5-stage pipeline)
│   │   ├── power-bi-performance-expert.agent.md
│   │   └── power-bi-visualization-expert.agent.md
│   │
│   ├── instructions/                        # Always-on coding guidelines (7)
│   │   ├── power-bi-data-modeling-best-practices.instructions.md
│   │   ├── power-bi-dax-best-practices.instructions.md
│   │   ├── power-bi-power-query-best-practices.instructions.md  # Query folding, M patterns
│   │   ├── power-bi-custom-visuals-development.instructions.md
│   │   ├── power-bi-devops-alm-best-practices.instructions.md
│   │   ├── power-bi-security-rls-best-practices.instructions.md
│   │   └── delfos-tmdl-file-editing.instructions.md
│   │
│   ├── skills/                              # On-demand prompt skills (21)
│   │   ├── bc-data-source-mapping/          #   Delfos → ALDC bridge
│   │   ├── power-bi-dax-optimization/       #   DAX formula analysis
│   │   ├── power-bi-deneb-visuals/          #   Deneb/Vega-Lite custom visuals
│   │   ├── power-bi-fabric-cli/             #   Fabric CLI remote operations
│   │   ├── power-bi-lineage-analysis/       #   Dependency tracing & impact
│   │   ├── power-bi-model-design-review/    #   Semantic model audit
│   │   ├── power-bi-naming-conventions/     #   Naming standards audit
│   │   ├── power-bi-pbip-format/            #   PBIP project structure
│   │   ├── power-bi-pbir-format/            #   PBIR report metadata
│   │   ├── power-bi-performance-troubleshooting/
│   │   ├── power-bi-python-visuals/         #   matplotlib/seaborn visuals
│   │   ├── power-bi-r-visuals/              #   ggplot2 visuals
│   │   ├── power-bi-report-design-consultation/
│   │   ├── power-bi-semantic-model-refresh/ #   Refresh management
│   │   ├── power-bi-svg-visuals/            #   SVG via DAX measures
│   │   ├── power-bi-tabular-editor-bpa/     #   BPA rules (Dynamic LINQ)
│   │   ├── power-bi-theme-json/             #   Report theme management
│   │   ├── power-bi-tmdl-authoring/         #   Advanced TMDL authoring
│   │   ├── markdown-converter/
│   │   ├── markdown-to-html/
│   │   └── markdown-to-word/
│   │
│   ├── hooks/                               # Pre + PostToolUse safety gates
│   │   ├── delfos-pbi-preflight-check.json  #   PreToolUse: TMDL edit gate
│   │   ├── delfos-pbi-post-validation.json  #   PostToolUse: JSON/TMDL validation
│   │   └── scripts/
│   │       ├── delfos-check-pbi-tmdl.ps1    #   Pre-flight gate script
│   │       └── delfos-post-validate.ps1     #   Post-edit validation script
│   │
│   ├── prompts/                             # Session + diagnostic prompts (8)
│   │   ├── delfos-pbi-init.prompt.md
│   │   ├── delfos-pbi-reconnect.prompt.md
│   │   ├── delfos-pbi-preflight-check.prompt.md
│   │   ├── delfos-pbi-audit-context.prompt.md
│   │   ├── delfos-pbi-quick-model-review.prompt.md
│   │   ├── delfos-pbi-quick-dax-review.prompt.md
│   │   ├── delfos-pbi-quick-performance-check.prompt.md
│   │   └── delfos-pbi-security-audit.prompt.md
│   │
│   ├── AGENT-TONE.md                        # Consistent agent behavior guidelines
│   └── memory.md                            # Cross-session decisions (append-only)
│
├── .vscode/
│   └── mcp.json                             # Power BI Remote MCP + Modeling MCP
│
├── docs/
│   ├── QUICKSTART.md                        # 30-min guided walkthrough
│   ├── AGENTS.md                            # Agent reference
│   ├── INSTRUCTIONS.md                      # Instructions guide
│   └── SKILLS.md                            # Skills usage guide
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## How It Works

### Agent Modes vs Instructions vs Skills

| Aspect | Agent Modes | Instructions | Skills | Hooks | Prompts |
|--------|-------------|--------------|--------|-------|----------|
| **Activation** | Manual (mode picker) | Automatic (file patterns) | Manual (prompt reference) | Automatic (tool events) | Manual (`#prompt-name`) |
| **Scope** | Full conversation | Per-file context | Single task | Per tool call | Single task |
| **Depth** | Deep domain expertise | Coding guidelines | Structured analysis | Gate / guard logic | Quick diagnostics |
| **Use Case** | Complex decisions, architecture | Day-to-day coding | Specific audits and reviews | Prevent risky edits | Session init, pre-flight checks |

### Microsoft Documentation Integration

All agents and instructions reference `microsoft.docs.mcp` for live documentation lookups. This ensures recommendations always align with the latest Microsoft guidance rather than relying solely on training data.

### Built on Official Best Practices

Every pattern, anti-pattern, and recommendation in Delfos traces back to official Microsoft documentation:

- [Power BI Guidance](https://learn.microsoft.com/power-bi/guidance/)
- [DAX Reference](https://learn.microsoft.com/dax/)
- [Power BI REST API](https://learn.microsoft.com/rest/api/power-bi/)
- [Fabric Developer Documentation](https://learn.microsoft.com/fabric/)
- [Power BI Embedded](https://learn.microsoft.com/power-bi/developer/embedded/)
- [Power BI MCP Servers](https://learn.microsoft.com/power-bi/developer/mcp/) — Remote and Modeling MCP documentation
- [Power BI Modeling MCP Server](https://github.com/microsoft/powerbi-modeling-mcp) — GitHub repository

## Coverage Matrix

| Topic | Architect | Lead Squad | Modeling | DAX | Perf | Viz | PBIP Val | Instruction | Skill | Hook | Prompt |
|-------|:---------:|:----------:|:--------:|:---:|:----:|:---:|:--------:|:-----------:|:-----:|:----:|:------:|
| Star Schema Design | ✅ | — | ✅ | — | — | — | — | ✅ | ✅ | — | ✅ |
| DAX Formulas | ✅ | — | — | ✅ | — | — | — | ✅ | ✅ | — | ✅ |
| DAX Performance | ✅ | — | — | ✅ | ✅ | — | — | ✅ | ✅ | — | ✅ |
| Power Query / M | ✅ | — | — | — | — | — | — | ✅ | — | — | — |
| Row-Level Security | ✅ | — | — | — | — | — | — | ✅ | — | — | ✅ |
| Custom Visuals | — | — | — | — | — | ✅ | — | ✅ | — | — | — |
| Deneb / Vega-Lite | — | — | — | — | — | ✅ | — | — | ✅ | — | — |
| SVG / R / Python Visuals | — | — | — | — | — | — | — | — | ✅ | — | — |
| Report Themes | — | — | — | — | — | ✅ | — | — | ✅ | — | — |
| DevOps / CI-CD | ✅ | — | — | — | — | — | — | ✅ | ✅ | — | — |
| Report Design | ✅ | — | — | — | — | ✅ | — | — | ✅ | — | — |
| Performance Tuning | ✅ | — | — | — | ✅ | — | — | — | ✅ | — | ✅ |
| Model Review | ✅ | — | ✅ | — | — | — | — | — | ✅ | — | ✅ |
| Naming Conventions | — | — | — | — | — | — | — | — | ✅ | — | — |
| Lineage / Impact | — | — | — | — | — | — | — | — | ✅ | — | — |
| TMDL Authoring | — | — | ✅ | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| PBIP / PBIR Format | — | — | — | — | — | — | ✅ | — | ✅ | ✅ | ✅ |
| Tabular Editor BPA | — | — | — | — | — | — | — | — | ✅ | — | — |
| Fabric CLI / API | — | — | — | — | — | — | — | — | ✅ | — | — |
| Semantic Model Refresh | — | — | — | — | — | — | — | — | ✅ | — | — |
| Composite Models | ✅ | — | ✅ | — | — | — | — | ✅ | — | — | — |
| MCP Remote (query) | ✅ | — | — | ✅ | ✅ | ✅ | — | — | — | — | ✅ |
| MCP Modeling (write) | — | ✅ | ✅ | ✅ | — | — | — | — | — | — | ✅ |
| MCP Connection Mgmt | — | ✅ | — | — | — | — | — | — | — | — | ✅ |
| Multi-phase Projects | ✅ | ✅ | — | — | — | — | — | — | — | — | — |
| BC → PBI Data Mapping | ✅ | ✅ | — | — | — | — | — | — | ✅ | — | — |

## Delfos → ALDC Bridge (Business Central Projects)

When the Power BI data source is Business Central, Delfos doesn't stop at designing the semantic model — it generates the requirements for the BC data layer too. The **BC Data Source Mapping** skill bridges Delfos and [ALDC](https://github.com/javiarmesto/ALDC-AL-Development-Collection-for-GitHub-Copilot) (AL Development Collection for GitHub Copilot):

```
Delfos Architect          BC Data Source Mapping          ALDC
designs star schema  →  maps to BC API v2.0 catalog  →  al-spec.create builds
                        identifies gaps                  custom API Pages in AL
                        generates ALDC spec
```

The skill classifies each star schema table as COVERED (standard API v2.0 works), PARTIAL (standard API missing fields → custom API Page needed), or NOT COVERED (no standard API → full custom API Page). For gaps, it produces an ALDC-compatible `{project}-bc-api.spec.md` that references ALDC's `skill-api` patterns — read-only API Pages with SystemId keys, SetLoadFields optimization, and `powerbi` APIGroup.

This means a BC + Power BI project gets an end-to-end pipeline: Delfos designs what data the model needs, the bridge skill determines how to get it from BC, and ALDC implements the AL code. No manual translation between frameworks.

The skill includes a [BC API v2.0 Catalog](.github/skills/bc-data-source-mapping/references/bc-api-v2-catalog.md) covering Sales, Purchasing, Master Data, Finance, Inventory, and Reference domains — with field-level mapping to typical star schema patterns.

## Compatibility

Delfos is designed for GitHub Copilot agent modes in VS Code but the content is portable:

- **GitHub Copilot Chat** — Full agent mode support with `.agent.md` files
- **Claude (Anthropic)** — Agent and instruction files work as system prompts or project knowledge
- **Other AI Assistants** — Skills work as standalone prompt templates in any LLM
- **Team Knowledge Base** — Instructions serve as living documentation for Power BI standards

## Roadmap

- [x] BC Data Source Mapping skill (Delfos → ALDC bridge)
- [x] TMDL editing safeguards (PreToolUse hook + instruction + prompt)
- [x] MCP session management prompts (init + reconnect)
- [x] Quick diagnostic prompts (model review, DAX review, performance, security audit)
- [x] PostToolUse validation hook (JSON/TMDL integrity after edits)
- [x] AGENT-TONE.md for consistent agent behavior
- [x] PBIP Validator agent (5-stage project validation pipeline)
- [x] Power Query best practices instruction
- [x] Advanced TMDL authoring skill (full syntax reference)
- [x] PBIP + PBIR format skills (project structure + report metadata)
- [x] Visualization skills (Deneb/Vega-Lite, SVG, R, Python)
- [x] Tabular Editor BPA rules skill (Dynamic LINQ expressions)
- [x] Fabric CLI skill (remote operations + REST API)
- [x] Theme JSON management skill
- [x] Lineage analysis + naming conventions skills
- [x] Semantic model refresh management skill
- [ ] Fabric Lakehouse integration patterns
- [ ] Paginated Reports agent mode
- [ ] DAX Studio integration skill
- [ ] Copilot Studio + Power BI agent patterns
- [ ] Real-time analytics instruction set

## Credits

**Delfos Power BI Agentic Squad** is created and maintained by **Javier Armesto González** ([@javiarmesto](https://github.com/javiarmesto)) as part of the [TechSphere Dynamics](https://techspheredynamics.substack.com) initiative.

The domain experts, instructions, and skills that form the foundation of Delfos were originally contributed to [**github/awesome-copilot**](https://github.com/github/awesome-copilot) as the [`power-bi-development`](https://github.com/github/awesome-copilot/tree/main/plugins/power-bi-development) plugin. Delfos extends that foundation with orchestration agents, architecture workflows, and the quickstart guide.

Built on top of Microsoft's official Power BI documentation and best practices. All agent modes reference the [Microsoft Learn Power BI guidance](https://learn.microsoft.com/power-bi/guidance/) as their primary knowledge source.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Delfos** — *Your Power BI oracle. One architect. One lead. Five experts. 21 skills. Zero guesswork.*
