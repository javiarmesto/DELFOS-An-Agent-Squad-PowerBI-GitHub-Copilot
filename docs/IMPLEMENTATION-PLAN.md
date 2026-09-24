# DELFOS authoring update plan

Baseline: DELFOS main `203ee5a18d62c119329719df5cd25de0024036cf`.
Scope: VS Code Copilot authoring and native Claude Code distribution. Preserve domain specialists and the BC/ALDC handoff. No Power BI production changes or release publication.

| Stage | Deliverables | Acceptance |
|---|---|---|
| 1. Correct existing contracts | Same-target reads/writes, three target profiles, TMDL rules, links and session prompts | No stale hardcoded tool IDs, invalid M prohibitions or mandatory Desktop for offline work |
| 2. Official report integration | semantic-model-authoring and powerbi-report-cli dispatch, PBIR validation and Desktop review | Explicit artifact/evidence requirements; no fabricated runtime success |
| 3. Portable distribution | Canonical domain content, generated Copilot files and self-contained Claude plugin/catalog | Deterministic build; no broken package references or duplicate MCP registration |
| 4. Verification | Safe installer, file checker, advisory hook tests, Windows/Linux CI, sales smoke data | Static/tests pass; runtime checks recorded independently |
| 5. Delivery | Feature branch and owner-authored PR | Reviewable diff and clear runtime limitations; no automatic merge |

## Decisions

- Depend on Microsoft's separately installed plugin, not copied skills or a custom model MCP. Record reviewed version/commit and resolved runtime versions separately.
- Retain six specialist roles. On Claude, main-conversation workflow owns delegation; Lead Squad subagent is a planner/reviewer.
- Inherit selected model and host-approved tools. Hardcoded extension/plugin tool prefixes are not portable. The host owns permissions.
- Generate both distributions from shared content. Preserve Copilot-only document conversion utilities without shipping them in Claude.
- Replace process-only blocking preflight with an explicit target/source-of-truth workflow and an honest advisory hook. Hook protocol is tested for VS Code Local and Claude; other harnesses need explicit preflight.
- Runtime validation requires the actual user's Windows Desktop/host. Provide deterministic data and negative cases instead of claiming success from file checks.

See [validation](VALIDATION.md), [migration](MIGRATION.md), [installation](INSTALLATION.md) and [sources](SOURCES.md).
