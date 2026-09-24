# Quickstart — a verifiable sales report

Follow [installation](docs/INSTALLATION.md) first. This is a development smoke scenario with **synthetic** data, not a Business Central export. It requires Windows Desktop for the full rendered loop; offline work can stop with explicit verification limits. No Fabric publication is required.

## Input and expected result

Use CSVs in `examples/sales/`. Model FactSales at one row per order line; use DimCustomer, DimProduct and a date table. Define one-to-many, single-direction relationships from dimensions to the fact table. Use exact decimal/currency types for monetary values.

| Measure | Definition | Expected unfiltered result |
|---|---|---:|
| Sales | SUMX(FactSales, FactSales[Quantity] * FactSales[UnitPrice]) | 600 |
| Cost | SUMX(FactSales, FactSales[Quantity] * FactSales[UnitCost]) | 360 |
| Margin | [Sales] - [Cost] | 240 |
| Margin % | DIVIDE([Margin], [Sales]) | 40% |
| Orders | DISTINCTCOUNT(FactSales[OrderId]) | 4 |
| Quantity | SUM(FactSales[Quantity]) | 7 |

Build two pages: **Sales Overview** (cards, sales by product, date/customer slicers) and **Order Detail** (order-line table, drillthrough on customer). Check RLS with DimCustomer[UserPrincipalName] = USERPRINCIPALNAME(): Alice sees sales 350, Bob sees 250. Use Desktop's role/user simulation; these example identities are not actual tenant users.

## Prompt

In Copilot select **Delfos Lead Squad**; in Claude start `/delfos:delfos-workflow` and provide:

```text
Build a local Power BI PBIP sales report from examples/sales/ using DELFOS
and the installed Microsoft powerbi-authoring skills. Use the six measures
and two-page acceptance criteria in QUICKSTART.md. Do not publish.

Inspect dependencies and propose the report spec before construction. After
approval, create the model and PBIR report, validate DAX against the same
model, run the official PBIR validator, and use the Desktop Bridge to reload
and review screenshots. Check interactions and the Alice/Bob RLS cases.
Record host/tool versions, artifacts, evidence and unavailable checks.
Never overwrite unsaved Desktop changes or assume another connection is
this project's model. If Desktop is unavailable, do the supported offline
work and mark engine/rendering/RLS verification NOT RUN.
```

After approving the concrete spec, proceed through the workflow. Output the PBIP project under a user-selected project folder. Do not put business artifacts inside an installed plugin's cache.

## Verification

Use `node scripts/validate-project.mjs "<project-folder>"` for preliminary file checks, then `powerbi-report-author validate "<report.Report>"` for official report validation. Inspect Desktop status and current help before reload/capture; keep the same PID throughout. DAX results, role tests, screenshots and interactions are separate checks.

Complete the evidence record in [SMOKE-TEST.md](docs/SMOKE-TEST.md). A successful packaging check alone does not complete this scenario.
