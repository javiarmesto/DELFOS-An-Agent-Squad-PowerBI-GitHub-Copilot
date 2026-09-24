# DELFOS — Power BI Agent Squad

DELFOS brings architecture, specialist review and Business Central context to Power BI development with AI agents. It coordinates the official Microsoft **powerbi-authoring** plugin to build semantic models and real PBIP/PBIR reports, then records what was actually verified.

This branch introduces the **1.2.0 development candidate** for **VS Code + GitHub Copilot** and a native **Claude Code plugin**. Packaging checks are automated; live host, MCP and Windows Desktop tests must pass before a surface is declared runtime-validated. See [validation status](docs/VALIDATION.md).

## What DELFOS adds

| Specialist | Responsibility |
|---|---|
| Delfos Architect | Model, DAX, report, security and deployment architecture |
| Delfos Lead Squad | Stage planning, coordination and evidence review |
| Data Modeling Expert | Model design, relationships and storage modes |
| DAX Expert | Measures and same-model validation |
| Visualization Expert | Design brief, actual PBIR implementation and visual checks |
| Performance Expert | Measured diagnostics and before/after comparisons |

The BC data-source mapping skill identifies API coverage and produces a handoff for [ALDC](https://github.com/javiarmesto/ALDC-AL-Development-Collection). Verify the actual BC environment and installed ALDC contract before claiming coverage or compatibility.

## Official tools and skills

Install `powerbi-authoring` from [Microsoft Skills for Fabric](https://github.com/microsoft/skills-for-fabric). The reviewed 0.3.17 package exposes `semantic-model-authoring` and `powerbi-report-cli` (planning, design, authoring and management modes). The latter consolidates capabilities previously described as separate report skills. DELFOS adds its own workflow and domain expertise; it does not vendor Microsoft's implementation.

| Work | Tooling |
|---|---|
| Desktop/PBIP models | Local Power BI Authoring MCP and semantic-model-authoring |
| Fabric models | Hosted Authoring MCP, or local for required local-only capabilities |
| Report pages, visuals, filters and themes | powerbi-report-cli on PBIP/PBIR |
| Rendered verification | Desktop Bridge on Windows |
| Business questions | Optional Fabric IQ, separate from authoring |

**One authoring MCP registration per session.** The official plugin owns it by default; `.vscode/mcp.json` deliberately adds none. Do not also enable an extension or manual copy. The old consumption endpoint is not the authoring endpoint. See [profiles and limitations](docs/INSTALLATION.md).

Authoring MCP alone cannot create report pages. PBIR report authoring does not create Power BI service dashboard tiles. Offline file edits do not prove successful refresh, DAX execution, RLS or rendering.

## Start

1. Follow [installation](docs/INSTALLATION.md) for your host and select a target profile.
2. Run the [quickstart](QUICKSTART.md), with deterministic sample data and expected results.
3. Use the [smoke test](docs/SMOKE-TEST.md) to verify your host and record evidence.

In VS Code, select **Delfos Lead Squad** for a multi-stage project or a specialist for a focused task. Local-harness session prompts are `/delfos-pbi-init`, `/delfos-pbi-reconnect`, and `/delfos-pbi-preflight-check`. If prompt files are unavailable in the selected harness, invoke the `delfos-workflow` skill with the same request.

In Claude Code, invoke `/delfos:delfos-workflow` in the main conversation. The main agent coordinates the six packaged specialist subagents; the Lead Squad subagent provides planning/checkpoint review rather than nested delegation.

## Repository layout

| Path | Purpose |
|---|---|
| `core/agents/`, `core/agents.json` | Shared specialist content and metadata |
| `core/skills/` | Six shared DELFOS skills, including the workflow and BC mapping |
| `.github/agents/`, selected `.github/skills/` | Generated Copilot distribution |
| `.github/instructions/` | Canonical Copilot guidance; also bundled as Claude references |
| `.github/prompts/`, `.github/hooks/` | Copilot session helpers and Local-harness advisory hook |
| `plugins/delfos/` | Generated, self-contained Claude Code plugin |
| `.claude-plugin/marketplace.json` | DELFOS marketplace catalog |
| `config/mcp/` | Opt-in manual profile examples; never auto-merged |
| `scripts/`, `tests/` | Build, checks, safe installer and file validation |
| `examples/sales/` | Synthetic smoke-test CSVs |
| `docs/` | Installation, migration, plan, sources and validation |

Existing Markdown conversion utilities remain Copilot-only and are not required or installed by the new installer. Project output belongs in `docs/plans/<project>/`, not in plugin caches. Legacy `.github/plans/` records can be retained; see [migration](docs/MIGRATION.md).

## Development

Node.js 18+; no package dependencies are required for DELFOS checks.

```bash
npm run build
npm run validate
node scripts/validate-project.mjs path/to/pbip-project
```

The file checker is deliberately limited: encoding, empty definitions, JSON and basic references. Use Microsoft's report validator and live Power BI for semantic and rendered verification. See [contributing](CONTRIBUTING.md) and [the implementation plan](docs/IMPLEMENTATION-PLAN.md).

## Credits and license

Created by **Javier Armesto González**. The original Power BI domain experts, instructions and skills were based on the [github/awesome-copilot power-bi-development plugin](https://github.com/github/awesome-copilot/tree/main/plugins/power-bi-development). DELFOS adds orchestration, architecture, BC mapping and host adapters. Microsoft tooling remains a separately installed dependency. [MIT license](LICENSE).
