# Migration from 1.1.x

1. Commit/back up the existing project's DELFOS files and any uncommitted report changes. Record which MCP registrations are active at project, user, extension and plugin scopes.
2. Install the official `powerbi-authoring` plugin. Enable one authoring MCP. Remove/disable the old `powerbi-remote` consumption entry for authoring sessions; do not overwrite unrelated servers or credentials.
3. Replace DELFOS-owned agents, session prompts and domain instructions with this branch's generated files. For customized installations, merge local changes into the canonical source first and rebuild. The installer refuses differing files instead of silently replacing them.
4. Remove the duplicated inner directories in the three old skills (`power-bi-dax-optimization`, `power-bi-model-design-review`, `power-bi-performance-troubleshooting`); each now has SKILL.md directly inside its skill folder.
5. Replace the old `.github/hooks/delfos-pbi-preflight-check.json` and PowerShell `delfos-check-pbi-tmdl.ps1` with the new generated configuration and Node script. The new hook is advisory: it does not prove a connection, block offline edits or approve tool use. It covers recognized file/model operations; shell indirection and unrecognized tool shapes may not trigger it. Follow explicit preflight regardless.
6. The BC catalog is bundled under the BC skill's `references/` directory. Treat it as discovery guidance and verify real API metadata before recording coverage.
7. Preserve legacy `.github/plans/` and `.github/memory.md`. Copy/migrate relevant records to `docs/plans/` deliberately, or tell the agent the existing location. Do not automatically move or erase project history.
8. For Claude, install the native DELFOS plugin; `.github/agents` alone is not the Claude distribution. Do not load a local and marketplace copy simultaneously.
9. Run [the smoke test](SMOKE-TEST.md) for each host. Record NOT RUN for unavailable runtime checks. Do not transfer a success from Copilot to Claude by assumption.

## Intentional changes

- No fixed model ID; agents use the user's selected/ inherited model.
- Tool inventory is inherited, avoiding stale server-scoped aliases. User/host permission controls remain authoritative. DELFOS instructions do not sandbox model writes.
- Canonical specialist content is in `core/`; generated distributions must not be hand-edited.
- The local MCP can both mutate and query the same model. The old mandatory local-write/remote-read split is removed.
- Offline PBIP edits are supported. Encoding is checked from bytes, typed Power Query tables remain valid, and unrelated partitions are not forced to Import.
- The visualization expert must deliver actual report definitions and separate structural, engine, rendered and interaction evidence.
