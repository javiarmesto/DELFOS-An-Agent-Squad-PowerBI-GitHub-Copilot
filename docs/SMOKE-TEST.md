# Runtime acceptance — run separately per host

Use [QUICKSTART.md](../QUICKSTART.md). For Copilot, record the actual session harness (Local or Agent Host); changing only the model does not test another harness. For Claude, use the native plugin and verify MCP visibility from a specialist's own context.

| Check | Expected evidence |
|---|---|
| Installation | Six DELFOS agents, six DELFOS skills, both official skills visible |
| MCP inventory | Exactly one authoring server; real tool names and versions |
| Target identity | Correct Desktop PID/file or PBIP path or workspace/model; read-only metadata |
| Delegation | Copilot Lead or Claude main conversation invokes the intended specialist; specialist verifies connection itself |
| Model | 1 fact + customer/product/date dimensions, valid relationships and refresh |
| DAX | Sales 600, Cost 360, Margin 240, Margin % 0.4, Orders 4, Quantity 7 on that model |
| Report files | Two PBIR pages, actual field bindings and official validator success |
| Desktop | No unsaved changes discarded; same PID reload and screenshots reviewed |
| Interactions | Date/customer slicers, cross-filtering, drillthrough and navigation checked |
| RLS | Alice sales 350; Bob sales 250 using role/user simulation |
| Persistence | Reopen PBIP and confirm model and report changes remain |
| Reconnect | Restart Desktop; reject old port/PID, resolve correct target again |
| Offline mode | Without Desktop, file work remains possible; engine/render/RLS explicitly NOT RUN |
| Ambiguity | Two open models: no writes until intended target is identified |
| Duplicate MCP | Flag overlapping authoring registrations before proceeding |
| Unsaved changes | Detect and preserve unsaved edits before any reload |
| Hook adapter | Real host hook invocation recorded; unsupported harness uses explicit workflow preflight |

Do not expose credentials or real row data in evidence. Screenshots need visual review; their existence is not sufficient. Publication is not part of this test. Test it separately in a named sandbox workspace only if authorized, with item/binding readback.

## Copyable evidence record

```markdown
# DELFOS runtime evidence
Date:
DELFOS commit/version:
Host and session harness/version:
Official plugin version:
Resolved MCP package/version:
Report CLI / Desktop Bridge CLI versions:
Power BI Desktop version:
Profile and target (non-secret identifiers):

| Check | PASSED / FAILED / NOT RUN / BLOCKED | Evidence / reason |
|---|---|---|
| Installation and MCP inventory | NOT RUN | |
| Target and specialist connection | NOT RUN | |
| Model and DAX | NOT RUN | |
| PBIR validator | NOT RUN | |
| Rendered review and interactions | NOT RUN | |
| RLS | NOT RUN | |
| Reopen/reconnect | NOT RUN | |
| Negative scenarios | NOT RUN | |
| Host hook invocation | NOT RUN | |

Changed artifacts:
Remaining limitations:
Publication: NOT REQUESTED
```
