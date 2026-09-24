---
name: delfos-workflow
description: Coordinate DELFOS specialists to build or update Power BI semantic models and PBIP reports with the official powerbi-authoring plugin. Use for end-to-end projects, session initialization, reconnection, preflight, and report validation across Copilot and Claude Code.
---

# DELFOS authoring workflow

Read [the authoring contract](references/authoring-contract.md) before model or report changes. Use the installed Microsoft `semantic-model-authoring` skill for model/DAX work and `powerbi-report-cli` for report planning, design, authoring or management. Read the selected official mode reference before using its commands. Do not reproduce its implementation from memory.

## Start and reconnect

1. Identify the requested deliverable: model, PBIP report, published report, or service dashboard. PBIR authoring does not create service dashboard tiles.
2. Discover installed skills and active MCP tools. Confirm **one** authoring server. If a dependency is missing, report the missing capability and installation needed; do not silently substitute fabricated calls.
3. Select the target: Desktop model, PBIP/TMDL folder, or Fabric workspace/model. Carry the exact target and connection identifier through every specialist handoff. A last-used connection is a hint, never proof of identity.
4. Read model metadata through that connection. For Desktop also identify the intended process/file and unsaved state through the Bridge if available. Resolve ambiguity before writing.
5. Record target, profile, tool inventory and verification limits in `docs/plans/<project>/session.md`. Do not store tokens, secrets, credentials or business row data. Revalidate after restarts and reconnects.

## Coordinate the work

Use the architect for cross-domain design; model, DAX, performance and visualization specialists for their respective outputs. Use existing project context and ask only for unresolved business decisions. A single-domain edit does not need the whole squad.

On **Copilot**, the Lead Squad can coordinate specialists using the host's native agent tool. On **Claude Code**, run this skill in the main conversation: the main agent delegates to the DELFOS specialist subagents. The Claude Lead Squad subagent returns a plan/checkpoint review; it does not spawn subagents. If delegation is unavailable, perform the specialist stages sequentially and state that no subagent execution occurred.

Pass each specialist: authorized scope, target, design/spec paths, preceding results, permitted operations, and completion evidence. Serialize writes to the same model, report or Desktop instance. Do not infer shared MCP session state across subagents: each verifies its own connection before use.

1. Produce scope/architecture and measurable acceptance criteria. Reuse the official report planner's spec rather than creating a competing spec.
2. Apply the applicable plan approval gate, then execute authorized stages. Preserve approvals already given for unchanged scope. Ask again for material scope changes, destructive operations or publication not already authorized.
3. Ensure model objects exist, and run DAX validation against that same model. Offline file work is not a successful refresh or DAX execution.
4. Hand the visualization specialist the approved report brief and verified bindings. Use `powerbi-report-cli` design/authoring modes to create real PBIR files.
5. Run the official report validator; check Desktop state, reload the intended instance and review screenshots. Fix errors and repeat affected checks.
6. Publish only within explicit publication authorization, using the official management workflow. Read back the resulting workspace item and binding.
7. Report files changed, tests actually run, results and limitations. Use PASSED / FAILED / NOT RUN / BLOCKED per check. Never turn an unavailable runtime test into a pass.

## Completion evidence

Persist `docs/plans/<project>/validation.md` with target identity, host/version, installed plugin/MCP/CLI versions, model/DAX results, PBIR validator output location, screenshot locations and interaction/RLS checks. Summarize metadata; keep sensitive outputs out of Git. A generated report without rendered verification is **implemented, visual verification pending**.

## Domain guidance

In Copilot, matching instructions live in `.github/instructions/`. In the Claude plugin, read the relevant bundled file under `references/instructions/`: data modeling, DAX, security/RLS, DevOps/ALM, custom visuals, TMDL editing or PBIR authoring. Load only the guidance relevant to the assigned stage. The authoring contract controls target and validation decisions.
