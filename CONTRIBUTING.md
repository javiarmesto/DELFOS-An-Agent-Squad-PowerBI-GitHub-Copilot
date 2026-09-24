# Contributing to DELFOS

## Sources and generated outputs

Edit shared agents in `core/agents/*.md` and their metadata in `core/agents.json`. Edit the six DELFOS skills in `core/skills/`. Copilot domain instructions remain canonical in `.github/instructions/`; the build copies them as on-demand references for Claude. Session prompts live in `.github/prompts/`.

Run `npm run build` after changes. Do not hand-edit generated `.github/agents/`, generated DELFOS skill folders, plugin files or hook copies. `npm run check` rejects drift and unexpected files in owned output folders. Unrelated Markdown conversion utilities are not generated or included in the Claude plugin.

Use Node.js 18+; DELFOS tooling has no npm dependencies. Run:

```bash
npm run build
npm run validate
```

CI runs on Windows and Linux. Runtime acceptance in VS Code/Copilot, Claude Code and Power BI Desktop is a separate [smoke test](docs/SMOKE-TEST.md). Do not label source/schema checks as host or Power BI execution.

## Contracts

- Keep domain content host-neutral. Put runtime-specific orchestration in the build's surface adapters.
- Read official primary sources and record the reviewed baseline in `docs/dependencies.json` when updating integrations. Upstream `@latest` is not a lock.
- Never add a second default authoring MCP. The Microsoft plugin owns the default registration.
- Test script behavior with real temporary files and recorded payload shapes. Hooks are advisory, not security boundaries or live readiness detectors.
- Preserve user files, identities, report bindings and unsaved Desktop changes. Do not make destructive migration automatic.
- New skills need `name` and `description` frontmatter and portable bundled references. Avoid broad instruction glob patterns that inject Power BI guidance into unrelated files.
- Explain what changed, why, actual validation and remaining limitations in the PR. Keep publication/production changes outside tests unless expressly authorized.

Open issues at https://github.com/javiarmesto/DELFOS-An-Agent-Squad-PowerBI-GitHub-Copilot/issues.
