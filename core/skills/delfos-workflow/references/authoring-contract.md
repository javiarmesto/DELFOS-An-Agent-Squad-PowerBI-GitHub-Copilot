# Power BI authoring contract

## Capability routing

| Target/task | Route | Boundary |
|---|---|---|
| Desktop model | Local Authoring MCP + semantic-model-authoring | Verify instance/model; never validate local edits against a separate cloud model. |
| PBIP/TMDL on disk | Local MCP or official file workflow | Desktop not required for offline edits; engine/refresh/DAX checks remain separate. |
| Fabric model | Hosted Authoring MCP, or local when required | Hosted cannot access local files/Desktop or provide local-only transactions/traces. |
| Report pages/visuals | powerbi-report-cli authoring mode | PBIP/PBIR files, not model MCP operations. |
| Rendering | Desktop Bridge on Windows | Select PID/file, check unsaved changes, reload and inspect screenshots. |
| Publish/rebind | powerbi-report-cli management mode | Requires authorized target, credentials and publish scope; verify the result. |
| Business questions | Optional Fabric IQ | Consumption is separate from authoring. |

The official plugin owns MCP registration by default. Do not also enable an extension-provided, project-local or user-level copy. Select local **or** hosted authoring. Discover host-scoped tool names; do not guess aliases.

## File/engine consistency

- Inspect Git status and preserve existing user edits.
- Pick the source of truth for each stage: files, live Desktop model, or Fabric model. Do not concurrently edit a live model and its on-disk definition.
- Export the intended live model to the correct PBIP before file review. Read back the export. Do not reload older TMDL over newer MCP changes.
- Before Bridge reload, inspect that instance's unsaved state. Resolve unsaved edits with the user; do not discard them. Check current command help/manifest and reload model definitions only when intended.
- Preserve UTF-8 without BOM for TMDL. Inspect bytes instead of assuming an editor writes BOM. Preserve meaningful multiline M/DAX indentation.
- Typed Power Query tables (`#table(type table [...], {...})`) are valid M. Diagnose errors in their actual TMDL/M context; do not ban valid language constructs.
- Preserve identities, lineage tags, report IDs, schema versions and bindings unless migration requires changes. Do not force every partition to Import.
- Use official report CLI metadata/catalog for visual types, roles and formatting. Do not author PBIR from guessed schemas.

## Verification ladder

1. Repository/package checks validate delivery structure, not Power BI execution.
2. DELFOS file validation checks UTF-8, nonempty TMDL, JSON syntax and basic PBIP/PBIR references. It is not a TMDL parser or PBIR schema validator.
3. Use the official report validator; fix errors before reload.
4. Execute DAX, refresh and security tests against the intended running model. Test RLS as an appropriate role/user, not just an unrestricted author.
5. Inspect rendered pages and test slicers, interactions, drillthrough and accessibility. Screenshots alone cannot prove interactions or security.

Report unavailable stages as NOT RUN or BLOCKED. A process check or advisory hook cannot prove the correct MCP connection.

## References

- [Agentic overview](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-agentic-overview)
- [Authoring MCP](https://learn.microsoft.com/en-us/power-bi/developer/mcp/power-bi-authoring-mcp)
- [Report authoring](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview)
- [Desktop Bridge](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview)
- [Power Query #table](https://learn.microsoft.com/en-us/powerquery-m/sharptable)
