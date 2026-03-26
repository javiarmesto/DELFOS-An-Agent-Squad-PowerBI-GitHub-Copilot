# Changelog

All notable changes to the Delfos Power BI Agentic Squad will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-03-26

### Added

**Orchestration Agents (2)**
- `agents/delfos-lead-squad.agent.md` — Project orchestrator: phased plans, specialist delegation, HITL gates at every checkpoint, lightweight progress tracking, final summary documents, memory management. Inspired by ALDC Conductor and CIRCE Conductor patterns.
- `agents/delfos-architect.agent.md` — Full-stack Power BI architecture designer: unified design across six layers (data model, DAX strategy, report architecture, security, DevOps, performance). Produces architecture documents with cross-layer trade-off analysis. Inspired by ALDC al-architect pattern.

**Project Structure**
- `.github/plans/memory.md` — Cross-session memory file (append-only) for decisions, context, and project state
- Architecture document template (embedded in architect agent)
- Plan and summary document templates (embedded in Lead Squad agent)

### Changed
- Updated `README.md` with three-tier agent architecture (Orchestration → Execution), new coverage matrix, and workflow diagram
- Updated `docs/AGENTS.md` with orchestration agents documentation
- Updated repository structure to include `agents/` top-level directory and `.github/plans/`

## [1.0.0] — 2026-03-26

### Added

**Agent Modes (4)**
- `power-bi-data-modeling-expert.agent.md` — Star schema design, relationship patterns, composite models, storage mode optimization, SCD handling, incremental refresh
- `power-bi-dax-expert.agent.md` — Variable-based formulas, time intelligence with calculation groups, context transitions, error handling, advanced performance patterns
- `power-bi-performance-expert.agent.md` — Query diagnostics, model size reduction, DirectQuery tuning, capacity management, KQL monitoring queries, Azure Monitor integration
- `power-bi-visualization-expert.agent.md` — Chart selection methodology, layout architecture, accessibility, mobile design, custom themes (JSON), embedded layout configuration, Business Central integration

**Instruction Sets (5)**
- `power-bi-data-modeling-best-practices.instructions.md` — Star schema principles, relationship design, storage modes, SCD implementation (Type 1/2), Semantic Link integration, TMSL partitions
- `power-bi-dax-best-practices.instructions.md` — Formula structure, variable usage, reference syntax, error handling, time intelligence, anti-patterns, cohort analysis, market basket patterns
- `power-bi-custom-visuals-development.instructions.md` — React/D3.js integration, TypeScript patterns, testing framework (Jest + webpack), formatting model, tooltips, dialog boxes, performance optimization
- `power-bi-devops-alm-best-practices.instructions.md` — PBIP structure, Git workflows, CI/CD pipelines (Azure DevOps + Fabric REST API), environment management, automated testing, rollback strategies
- `power-bi-security-rls-best-practices.instructions.md` — Row-level security, dynamic RLS with CUSTOMDATA(), embedded analytics security, database-level RLS (SQL Server + Fabric), hierarchical and time-based patterns, governance

**Skills (4)**
- `power-bi-dax-optimization` — DAX formula analysis and improvement with structured 4-step optimization process
- `power-bi-model-design-review` — Comprehensive model audit framework with quick assessment and deep review checklists
- `power-bi-performance-troubleshooting` — Systematic performance diagnosis with quick win, comprehensive, and strategic workflows
- `power-bi-report-design-consultation` — Visualization design consultation with chart selection methodology and UX testing framework

**Infrastructure**
- `.vscode/mcp.json` — Power BI Fabric MCP server configuration
- `README.md` — Full project documentation
- `CONTRIBUTING.md` — Contribution guidelines
- `LICENSE` — MIT license
- `CHANGELOG.md` — This file

**Documentation**
- `docs/AGENTS.md` — Detailed agent mode reference
- `docs/INSTRUCTIONS.md` — Instructions reference guide
- `docs/SKILLS.md` — Skills usage guide
