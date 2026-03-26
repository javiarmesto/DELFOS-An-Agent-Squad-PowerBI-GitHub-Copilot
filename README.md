# 🏛️ Delfos — Power BI Agentic Squad

**A curated collection of AI agent modes, coding instructions, and reusable skills for Power BI development with GitHub Copilot and Claude.**

[![License: MIT](https://img.shields.io/badge/License-MIT-818CF8.svg)](LICENSE)
[![Power BI](https://img.shields.io/badge/Power%20BI-Expert%20Framework-F2C811.svg)](https://learn.microsoft.com/power-bi/)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Agent%20Ready-000000.svg)](https://docs.github.com/copilot)
[![MCP](https://img.shields.io/badge/MCP-Power%20BI%20Fabric-0078D4.svg)](https://api.fabric.microsoft.com/v1/mcp/powerbi)

---

Delfos provides a structured, agent-driven approach to Power BI development. Instead of relying on generic AI assistance, Delfos equips your coding assistant with **specialized expert modes**, **orchestration agents**, and **prompt-based skills** that follow Microsoft's official best practices.

Think of it as your Power BI oracle — a coordinated squad with an architect for strategic design, a lead for orchestration, and four domain experts ready to execute.

## Why Delfos?

Working with Power BI involves deep, interconnected knowledge areas: a DAX formula that looks correct might destroy performance; a beautiful report might collapse under concurrent users; a star schema that seems clean might not scale. Generic AI assistants lack the specialized context to catch these issues.

Delfos solves this by providing a **layered agent architecture** — from strategic design through orchestrated execution — that carries Microsoft's best practices, anti-pattern detection, and optimization strategies directly into your development workflow.

## The Squad

Delfos is organized in three tiers: orchestration agents that plan and coordinate, domain experts that execute, plus instruction sets and reusable skills.

```
@delfos-architect  (DESIGN)  →  @delfos-lead-squad  (ORCHESTRATE)  →  Experts  (EXECUTE)
       │                                │                                  │
  Full-stack design              Phased workflow                   Domain specialists
  Architecture docs              HITL checkpoints                  Targeted guidance
  Trade-off analysis             Progress tracking                 Implementation
```

### 🎭 Orchestration Agents (`agents/`)

These agents coordinate the squad. They don't implement — they design, plan, delegate, and verify.

| Agent | Role | Key Capabilities |
|-------|------|-----------------|
| **Delfos Architect** | Full-stack design authority | Unified architecture across model + DAX + reports + security + DevOps. Produces architecture documents. Presents trade-offs with cross-layer impact analysis. |
| **Delfos Lead Squad** | Project orchestrator | Decomposes projects into phased plans. Delegates to experts. Enforces HITL gates at every phase boundary. Lightweight checkpoints + final summary document. |

### 🤖 Domain Experts (`.github/agents/`)

Domain experts are specialized AI personas activated in GitHub Copilot Chat. Each carries deep expertise in one Power BI domain and follows a structured response methodology.

| Agent | Domain | Key Capabilities |
|-------|--------|-----------------|
| **Data Modeling Expert** | Schema & Relationships | Star schema design, relationship patterns, composite models, storage mode optimization, SCD handling |
| **DAX Expert** | Formulas & Calculations | Variable-based formulas, time intelligence, context transitions, error handling, performance patterns |
| **Performance Expert** | Optimization & Monitoring | Query diagnostics, model size reduction, DirectQuery tuning, capacity management, KQL monitoring |
| **Visualization Expert** | Reports & UX | Chart selection methodology, layout architecture, accessibility, mobile design, custom themes |

Each expert follows a consistent response structure: Documentation Lookup → Requirements Analysis → Recommendation → Implementation Guidance → Validation Approach.

### When to Use What

| Scenario | Start With |
|----------|-----------|
| Quick question about one domain | Specialist expert directly |
| New project or major refactoring | `@delfos-architect` → `@delfos-lead-squad` |
| Multi-expert project with known architecture | `@delfos-lead-squad` |
| Architecture review of existing solution | `@delfos-architect` |
| Single optimization pass | Specialist expert directly |

### 📐 Instructions (`.github/instructions/`)

Instructions are always-on guidelines that apply automatically based on file patterns. They inject best practices into every interaction without requiring explicit activation.

| Instruction | Applies To | Coverage |
|-------------|-----------|----------|
| **Data Modeling Best Practices** | `*.pbix, *.md, *.json, *.txt` | Star schema principles, relationship design, storage modes, SCD patterns, incremental refresh |
| **DAX Best Practices** | `*.pbix, *.dax, *.md, *.txt` | Formula structure, variable usage, reference syntax, error handling, time intelligence, anti-patterns |
| **Custom Visuals Development** | `*.ts, *.tsx, *.js, *.jsx, *.json, *.less, *.css` | React/D3.js integration, TypeScript patterns, testing framework, formatting model, tooltips, performance |
| **DevOps & ALM** | `*.yml, *.yaml, *.ps1, *.json, *.pbix, *.pbir` | PBIP structure, Git workflows, CI/CD pipelines, Azure DevOps, Fabric REST API, environment management |
| **Security & RLS** | `*.pbix, *.dax, *.md, *.txt, *.json, *.csharp, *.powershell` | Row-level security, dynamic RLS, embedded analytics, database-level security, governance patterns |

### 🎯 Skills (`.github/skills/`)

Skills are on-demand prompt templates designed for specific recurring tasks. Invoke them when you need focused, structured analysis.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **DAX Optimization** | Formula analysis and improvement | When a DAX measure is slow, hard to read, or doesn't follow best practices |
| **Model Design Review** | Comprehensive model audit | Before production deployment or when inheriting an existing model |
| **Performance Troubleshooting** | Systematic issue diagnosis | When reports are slow, queries timeout, or capacity is stressed |
| **Report Design Consultation** | Visualization strategy | When designing new reports or redesigning existing ones for better UX |

### 🔌 MCP Integration (`.vscode/mcp.json`)

Delfos includes a preconfigured connection to the **Power BI Fabric MCP server**, enabling agents to query live Power BI service metadata, execute DAX queries, and validate models against real data.

```json
{
    "servers": {
        "powerbi-remote": {
            "type": "http",
            "url": "https://api.fabric.microsoft.com/v1/mcp/powerbi"
        }
    }
}
```

## Repository Structure

```
delfos-powerbi-agentic-squad/
│
├── agents/                                  # 🎭 Orchestration agents
│   ├── delfos-lead-squad.agent.md           #    Project orchestrator (HITL, checkpoints)
│   └── delfos-architect.agent.md            #    Full-stack architecture designer
│
├── .github/
│   ├── agents/                              # 🤖 Domain expert agents
│   │   ├── power-bi-data-modeling-expert.agent.md
│   │   ├── power-bi-dax-expert.agent.md
│   │   ├── power-bi-performance-expert.agent.md
│   │   └── power-bi-visualization-expert.agent.md
│   │
│   ├── instructions/                        # 📐 Always-on coding guidelines
│   │   ├── power-bi-data-modeling-best-practices.instructions.md
│   │   ├── power-bi-dax-best-practices.instructions.md
│   │   ├── power-bi-custom-visuals-development.instructions.md
│   │   ├── power-bi-devops-alm-best-practices.instructions.md
│   │   └── power-bi-security-rls-best-practices.instructions.md
│   │
│   ├── skills/                              # 🎯 On-demand prompt skills
│   │   ├── power-bi-dax-optimization/
│   │   │   └── SKILL.md
│   │   ├── power-bi-model-design-review/
│   │   │   └── SKILL.md
│   │   ├── power-bi-performance-troubleshooting/
│   │   │   └── SKILL.md
│   │   └── power-bi-report-design-consultation/
│   │       └── SKILL.md
│   │
│   └── plans/                               # 📋 Project plans and memory
│       └── memory.md                        #    Cross-session decisions and context
│
├── .vscode/
│   └── mcp.json                             # 🔌 Power BI Fabric MCP server
│
├── docs/
│   ├── AGENTS.md                            # Detailed agent documentation
│   ├── INSTRUCTIONS.md                      # Instructions reference guide
│   └── SKILLS.md                            # Skills usage guide
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- **VS Code** with GitHub Copilot extension (agent mode support)
- **Power BI Desktop** for model development
- **GitHub Copilot** subscription (Business or Enterprise recommended for agent modes)

### Installation

1. **Clone the repository** into your Power BI project or as a standalone reference:

```bash
git clone https://github.com/youruser/delfos-powerbi-agentic-squad.git
```

2. **Copy the `.github/` folder** into your Power BI project repository:

```bash
cp -r delfos-powerbi-agentic-squad/.github/ your-powerbi-project/.github/
cp delfos-powerbi-agentic-squad/.vscode/mcp.json your-powerbi-project/.vscode/mcp.json
```

3. **Open your project in VS Code** — instructions will apply automatically based on file patterns. Agent modes will be available in GitHub Copilot Chat.

### Using Agent Modes

In GitHub Copilot Chat, switch to an agent mode by selecting it from the mode picker. Each agent carries its full context and will guide you through structured analysis:

```
# Example: Ask the DAX Expert to optimize a formula
@workspace Optimize this DAX measure for performance:

Sales Growth = ([Total Sales] - CALCULATE([Total Sales], 
    PARALLELPERIOD('Date'[Date], -12, MONTH))) / 
    CALCULATE([Total Sales], PARALLELPERIOD('Date'[Date], -12, MONTH))
```

### Using Skills

Skills are prompt templates — copy the SKILL.md content or reference it in your AI assistant. Each skill includes a structured analysis framework, common patterns, and output templates:

```
# Example: Request a model design review
Following the Power BI Model Design Review skill, please review my data model.
The model has 3 fact tables (Sales, Inventory, Returns) and 8 dimensions...
```

## How It Works

### Agent Modes vs Instructions vs Skills

| Aspect | Agent Modes | Instructions | Skills |
|--------|-------------|--------------|--------|
| **Activation** | Manual (mode picker) | Automatic (file patterns) | Manual (prompt reference) |
| **Scope** | Full conversation | Per-file context | Single task |
| **Depth** | Deep domain expertise | Coding guidelines | Structured analysis |
| **Use Case** | Complex decisions, architecture | Day-to-day coding | Specific audits and reviews |

### Microsoft Documentation Integration

All agents and instructions reference `microsoft.docs.mcp` for live documentation lookups. This ensures recommendations always align with the latest Microsoft guidance rather than relying solely on training data.

### Built on Official Best Practices

Every pattern, anti-pattern, and recommendation in Delfos traces back to official Microsoft documentation:

- [Power BI Guidance](https://learn.microsoft.com/power-bi/guidance/)
- [DAX Reference](https://learn.microsoft.com/dax/)
- [Power BI REST API](https://learn.microsoft.com/rest/api/power-bi/)
- [Fabric Developer Documentation](https://learn.microsoft.com/fabric/)
- [Power BI Embedded](https://learn.microsoft.com/power-bi/developer/embedded/)

## Coverage Matrix

| Topic | Architect | Lead Squad | Modeling Expert | DAX Expert | Perf Expert | Viz Expert | Instruction | Skill |
|-------|:---------:|:----------:|:--------------:|:----------:|:-----------:|:----------:|:-----------:|:-----:|
| Star Schema Design | ✅ | — | ✅ | — | — | — | ✅ | ✅ |
| DAX Formulas | ✅ | — | — | ✅ | — | — | ✅ | ✅ |
| DAX Performance | ✅ | — | — | ✅ | ✅ | — | ✅ | ✅ |
| Time Intelligence | ✅ | — | — | ✅ | — | — | ✅ | — |
| Row-Level Security | ✅ | — | — | — | — | — | ✅ | — |
| Custom Visuals Dev | — | — | — | — | — | ✅ | ✅ | — |
| DevOps / CI-CD | ✅ | — | — | — | — | — | ✅ | — |
| Report Design | ✅ | — | — | — | — | ✅ | — | ✅ |
| Performance Tuning | ✅ | — | — | — | ✅ | — | — | ✅ |
| Model Review | ✅ | — | ✅ | — | — | — | — | ✅ |
| Composite Models | ✅ | — | ✅ | — | — | — | ✅ | — |
| MCP Integration | — | — | ✅ | — | — | — | — | — |
| Multi-phase Projects | ✅ | ✅ | — | — | — | — | — | — |
| Cross-layer Decisions | ✅ | — | — | — | — | — | — | — |
| HITL Orchestration | — | ✅ | — | — | — | — | — | — |

## Compatibility

Delfos is designed for GitHub Copilot agent modes in VS Code but the content is portable:

- **GitHub Copilot Chat** — Full agent mode support with `.agent.md` files
- **Claude (Anthropic)** — Agent and instruction files work as system prompts or project knowledge
- **Other AI Assistants** — Skills work as standalone prompt templates in any LLM
- **Team Knowledge Base** — Instructions serve as living documentation for Power BI standards

## Roadmap

- [ ] Semantic Model validation skill (automated TMDL checks)
- [ ] Power Query / M language agent mode
- [ ] Fabric Lakehouse integration patterns
- [ ] Paginated Reports agent mode
- [ ] DAX Studio integration skill
- [ ] Copilot Studio + Power BI agent patterns
- [ ] Real-time analytics instruction set

## Credits

**Delfos Power BI Agentic Squad** is created and maintained by **Javier Armesto González** ([@javierarmesto](https://github.com/javierarmesto)) as part of the [TechSphere Dynamics](https://techspheredynamics.substack.com) initiative.

Built on top of Microsoft's official Power BI documentation and best practices. All agent modes reference the [Microsoft Learn Power BI guidance](https://learn.microsoft.com/power-bi/guidance/) as their primary knowledge source.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Delfos** — *Your Power BI oracle. One architect. One lead. Four experts. Zero guesswork.*
