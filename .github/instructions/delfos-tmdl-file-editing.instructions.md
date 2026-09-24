---
description: Edit TMDL with explicit target identity, source-of-truth control and measured validation.
applyTo: '**/*.tmdl'
---

# TMDL editing

Read `delfos-workflow` and its authoring contract before changing a model.

- Choose Desktop, PBIP files or Fabric. Offline PBIP editing does not require Desktop.
- Use the official `semantic-model-authoring` workflow and discover actual MCP operations/schemas. A last-used connection does not prove target identity.
- Preserve unsaved/user changes. Do not concurrently mutate a live model and its exported files. Export/reload deliberately and check the destination.
- Use UTF-8 without BOM. Validate bytes; do not prohibit editors based on unverified BOM assumptions.
- Preserve TMDL structure and embedded multiline M/DAX. Typed `#table(type table [...], ...)` is valid Power Query M. Diagnose parse errors in context.
- Preserve lineage tags, names and storage modes unless the change requires migration.
- Run the DELFOS file checker when available, then official parser/model tooling. File lint cannot prove DAX execution, refresh or Desktop loading.

Reference: https://learn.microsoft.com/en-us/powerquery-m/sharptable
