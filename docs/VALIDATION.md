# Validation status

Candidate: DELFOS 1.2.0. Status is per capability, not a blanket compatibility claim.

| Check | Status | Evidence / limitation |
|---|---|---|
| Deterministic generated distributions | PASSED | 44 generated files checked by npm run check on Linux |
| Package metadata and relative references | PASSED | npm run check; YAML frontmatter parsed separately |
| Hook, file checker, safe installer and sample calculations | PASSED | 15 Node tests on Linux; includes packaged scripts outside checkout |
| Windows/Linux CI | NOT RUN | Workflow added; GitHub execution pending |
| Claude native plugin validator and host discovery | NOT RUN | Claude CLI unavailable in implementation environment |
| VS Code/Copilot host discovery and hooks | NOT RUN | No interactive VS Code host in implementation environment |
| Actual MCP connection and same-model DAX | NOT RUN | No Power BI runtime connected |
| Official PBIR CLI, Desktop Bridge, rendered pages and interactions | NOT RUN | No generated report or Windows Desktop in implementation environment |
| RLS, refresh and reopen | NOT RUN | Requires runtime smoke scenario |
| Fabric publication | NOT REQUESTED | No workspace changed |

Hook unit/CLI fixtures validate the supported payload shapes and advisory output only; they do not prove the host loaded the hook. File checks do not validate TMDL grammar or PBIR schemas. Synthetic CSV arithmetic tests do not execute DAX or RLS.

Use [SMOKE-TEST.md](SMOKE-TEST.md) to complete runtime acceptance independently for Copilot and Claude. See [dependencies.json](dependencies.json) for the source-review baseline; upstream package versions are not frozen by DELFOS.

A separate read-only workflow exercise used the packaged skill for an approved two-page offline PBIP request in Claude on Linux. It correctly retained approval, routed to report authoring, kept publication out of scope, resolved bundled references and distinguished file validation from unavailable runtime checks. This evaluates instruction behavior, not host integration.
