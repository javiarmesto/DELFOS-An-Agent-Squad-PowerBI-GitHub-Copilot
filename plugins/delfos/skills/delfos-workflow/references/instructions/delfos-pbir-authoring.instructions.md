
# PBIR report authoring

Use `delfos-workflow` and the official `powerbi-report-cli` skill. Select authoring mode for file edits and read its reference. Model/DAX changes use `semantic-model-authoring`.

Inspect the actual model before binding fields. Read the report CLI catalog/metadata for visual roles and formatting. Preserve identities and schema versions. Run `powerbi-report-author validate "<report.Report>"` after each logical batch.

Before reloading Desktop, verify file/PID and unsaved state. Do not reload stale definitions over MCP changes. Review screenshots and test interactions. If Desktop is unavailable, mark visual verification NOT RUN. Model MCP calls cannot create report pages; valid JSON does not prove a working report.
