# Quickstart: Sales Order Tracker Dashboard

> Build a complete Power BI dashboard from scratch using the full Delfos workflow.
> Time: ~30 minutes. Result: a star schema model, 6 DAX measures, 2 report pages, and RLS — all following Microsoft best practices.

This guide walks you through a real scenario using every tier of the Delfos squad. By the end, you'll have a working Sales Order Tracker dashboard and a clear understanding of how Architect, Lead Squad, and Experts coordinate.

## What You'll Build

A Power BI dashboard that tracks sales order status across customers, dates, and fulfillment stages. The model includes:

- **3 dimension tables**: DimCustomer, DimDate, DimOrderStatus
- **1 fact table**: FactSalesOrder (order number, customer, date, status, amount, shipment date)
- **6 DAX measures**: Total Orders, Total Amount, Average Order Value, Orders by Status, YTD Orders, Order Fulfillment Rate
- **2 report pages**: Executive Overview + Order Detail (drillthrough)
- **Row-Level Security**: Regional salesperson filtering
- **PBIP structure**: Ready for Git version control

## Prerequisites

- VS Code with GitHub Copilot (agent mode enabled)
- Delfos `.github/` folder copied into your project (see [Installation](../README.md#installation))
- [Power BI Modeling MCP](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp) VS Code extension installed
- A Fabric workspace (F2+ or P1+) for Remote MCP access — or Power BI Desktop open locally for Modeling MCP
- A data source with sales order data (or use the sample CSV below)

### Sample Data

If you don't have a data source ready, create `data/sales-orders.csv`:

```csv
OrderNo,CustomerName,Region,OrderDate,Status,Amount,ShipmentDate
SO-1001,Adatum Corporation,West,2026-01-15,Shipped,12500.00,2026-01-22
SO-1002,Contoso Ltd,East,2026-01-18,Open,8300.00,
SO-1003,Fabrikam Inc,West,2026-02-01,Released,22000.00,2026-02-10
SO-1004,Northwind Traders,Central,2026-02-05,Shipped,5600.00,2026-02-12
SO-1005,Adatum Corporation,West,2026-02-14,Pending Approval,15000.00,
SO-1006,Contoso Ltd,East,2026-03-01,Open,9200.00,
SO-1007,Fabrikam Inc,West,2026-03-10,Shipped,18500.00,2026-03-17
SO-1008,Trey Research,Central,2026-03-15,Released,7800.00,2026-03-22
```

---

## Phase 0 — MCP Connection Setup

**Time:** ~3 minutes

Before the agents can work against a real model, both MCP servers need to be connected. This step is not orchestrated by Delfos — it's infrastructure setup you do once.

### Remote MCP (query path)

Verify that `.vscode/mcp.json` includes the Remote MCP server. This is preconfigured by Delfos:

```json
{
    "servers": {
        "powerbi-remote": {
            "type": "http",
            "url": "https://api.fabric.microsoft.com/v1/mcp/powerbi"
        }
    }
}
```

When an agent queries the Remote MCP for the first time, VS Code will prompt you to authenticate with your Fabric credentials. The server uses your permissions — no extra configuration needed.

### Modeling MCP (write path)

Install the [Power BI Modeling MCP extension](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp) in VS Code. Then either:

- **Option A — Fabric workspace:** The Modeling MCP connects to a published semantic model in your workspace. The Data Modeling Expert will use `connect_to_fabric_workspace` to establish the connection during Phase 2.
- **Option B — Power BI Desktop:** Open your `.pbix` file in Power BI Desktop. The Modeling MCP auto-discovers local instances. The expert will use `connect_to_desktop` to attach.
- **Option C — PBIP/TMDL files:** Point the Modeling MCP at a folder of TMDL files for headless editing without Power BI Desktop.

For this quickstart, **Option A or B both work**. If you're using the sample CSV, start with a blank `.pbix` in Power BI Desktop (Option B).

### How Each Phase Uses MCP

```
Phase 1 (Architect)     → Remote MCP   — inspect existing schema if migrating
Phase 2 (Modeling)       → Modeling MCP — create tables, relationships, storage modes
Phase 3 (DAX)            → Both        — Modeling to create measures, Remote to validate queries
Phase 4 (RLS)            → Modeling MCP — create security roles
Phase 5 (Visualization)  → Remote MCP  — discover available measures for visual mapping
Phase 6 (Performance)    → Remote MCP  — execute diagnostic queries with cache clearing
```

---

## Phase 1 — Architecture Design

**Agent:** `@delfos-architect`
**Time:** ~10 minutes

Start with the Architect to design a unified architecture across all layers.

### Prompt

```
@delfos-architect

I need to build a Sales Order Tracker dashboard for Power BI.

Business context:
- Users: Sales managers and regional salespeople
- Purpose: Track order status, identify bottlenecks, monitor fulfillment rates
- Data: Sales orders from Business Central (order number, customer, date, 
  status, amount, shipment date)
- Capacity: Power BI Pro
- Access: Regional salespeople see only their region; managers see all

If there is an existing semantic model in the connected workspace, 
use the Remote MCP to inspect its schema before designing.

Design the full architecture covering:
1. Star schema (fact + dimensions)
2. DAX strategy (base measures + time intelligence)
3. Report layout (executive overview + order detail drillthrough)
4. Row-Level Security (regional filtering)
5. PBIP structure for Git version control

Keep it simple — this is a single-fact-table model with 3-4 dimensions.
```

### What Happens

The Architect will:

1. **Query Remote MCP** to check if there's an existing semantic model in the connected workspace — if found, it inspects the schema to understand current state and identify reusable elements
2. **Ask clarifying questions** about capacity tier, data volume, and refresh frequency
3. **Present the architecture** layer by layer, starting with the star schema
4. **Show trade-offs** for key decisions (e.g., Import vs DirectQuery, calculation groups vs standard time intelligence)
5. **Wait for your approval** before creating the architecture document

### Expected Output

After you approve, the Architect creates `.github/plans/order-tracker/architecture.md` with:

- Star schema design (FactSalesOrder + DimCustomer + DimDate + DimOrderStatus)
- Storage mode decision (Import for Pro capacity)
- DAX measure hierarchy (base → derived → time intelligence)
- Report page structure with visual recommendations
- RLS design (DimCustomer filtered by salesperson region)
- PBIP folder layout

### Approval Gate

The Architect will present the complete design and ask:

> "Does this architecture meet your requirements? Should I create the documentation?"

**Review the design, then confirm.** This is a mandatory HITL gate — nothing proceeds until you approve.

---

## Phase 1.5 — BC Data Source Mapping (Delfos → ALDC Bridge)

**Skill:** `bc-data-source-mapping`
**Time:** ~3 minutes

With the architecture approved, map the star schema tables to BC data sources before building the Power BI model.

### Prompt

```
@delfos-architect

Run the bc-data-source-mapping skill against the approved architecture.

Architecture: .github/plans/order-tracker/architecture.md
BC Environment: SANDBOX
Company: CRONUS USA, Inc.
ALDC Publisher: vssistemas
```

### What Happens

The skill reads the architecture, matches each table against the BC API v2.0 catalog, and classifies:

```
┌─────────────────────┬────────────┬──────────────────────────────────┐
│ Star Schema Table   │ Status     │ BC API Source                    │
├─────────────────────┼────────────┼──────────────────────────────────┤
│ DimCustomer         │ COVERED    │ customers (v2.0) — standard      │
│ DimDate             │ N/A        │ Generated in Power BI            │
│ DimOrderStatus      │ N/A        │ Enum mapping in Power BI         │
│ FactSalesOrder      │ PARTIAL    │ salesOrders (v2.0) — missing:    │
│                     │            │   SalespersonCode, DaysToShip    │
└─────────────────────┴────────────┴──────────────────────────────────┘
```

### Expected Output

**For COVERED tables** (DimCustomer): No action needed. The skill confirms which standard API to use and recommends a `$select` clause to optimize the Power BI connector query.

**For PARTIAL tables** (FactSalesOrder): The skill generates `.github/plans/order-tracker/order-tracker-bc-api.spec.md` — an ALDC-compatible spec for a custom API Page:

```
Requirement: PBI Sales Order Extended API
Source Table: Sales Header (36), filtered by Document Type = Order
Read-only: true
APIGroup: powerbi
APIPublisher: vssistemas

Fields: id, number, orderDate, customerNumber, customerName, status,
        totalAmountIncludingTax, requestedDeliveryDate,
        salespersonCode (MISSING from standard),
        daysToShip (CALCULATED: ShipmentDate - OrderDate)

SetLoadFields: No., Order Date, Sell-to Customer No.,
               Sell-to Customer Name, Status, Amount Including VAT,
               Requested Delivery Date, Salesperson Code
```

**For N/A tables** (DimDate, DimOrderStatus): The skill confirms these are generated in Power BI, not sourced from BC.

### What To Do With the Output

If all tables are COVERED → proceed directly to Phase 2 (Lead Squad).

If PARTIAL or NOT COVERED tables exist → feed the generated spec to ALDC:

```
# In your BC AL project (not the Power BI project):
@workspace use al-spec.create

Read .github/plans/order-tracker/order-tracker-bc-api.spec.md
and create the API Page following skill-api patterns.
```

ALDC builds the custom API Page, you deploy to BC, and then Phase 2 of the Power BI project can connect to all data sources.

For this quickstart with sample CSV data, all tables are either COVERED or N/A — so you can proceed directly to Phase 2. The ALDC handoff becomes relevant in real projects where BC is the live data source.

---

## Phase 2 — Orchestrated Implementation

**Agent:** `@delfos-lead-squad`
**Time:** ~15 minutes

With the architecture approved, hand off to the Lead Squad for phased implementation.

### Prompt

```
@delfos-lead-squad

Implement the approved architecture for the Sales Order Tracker dashboard.

Architecture document: .github/plans/order-tracker/architecture.md

Please create a phased plan and execute through specialists.
```

### What Happens

The Lead Squad will:

1. **Read the architecture document** produced by the Architect
2. **Present a phased plan** with expert assignments
3. **Wait for your approval** of the plan
4. **Execute phase by phase**, presenting a checkpoint after each one

### Expected Plan

```
═══════════════════════════════════════════════════════════
  🏛️ DELFOS LEAD SQUAD — PROJECT PLAN
═══════════════════════════════════════════════════════════

Project: Sales Order Tracker Dashboard
Complexity: MEDIUM
Experts needed: Data Modeling, DAX, Visualization

Phases:
  1. 📐 Star Schema Implementation    → Data Modeling Expert   ← HITL
  2. 📊 DAX Measures                  → DAX Expert             ← HITL
  3. 🔒 Row-Level Security            → Data Modeling Expert   ← HITL
  4. 📈 Report Pages                  → Visualization Expert   ← HITL
  5. ⚡ Performance Validation         → Performance Expert     ← HITL

═══════════════════════════════════════════════════════════
Proceed with this plan? [Yes / No / Modify]
═══════════════════════════════════════════════════════════
```

### Phase-by-Phase Execution

#### Phase 1: Star Schema (Data Modeling Expert)

**MCP:** Modeling MCP (write path)

The Data Modeling Expert connects to your semantic model via the Modeling MCP and implements the schema:

- **FactSalesOrder**: OrderKey, CustomerKey, DateKey, StatusKey, OrderNo, Amount, ShipmentDate
- **DimCustomer**: CustomerKey, CustomerName, Region, SalespersonEmail
- **DimDate**: Standard date dimension with Year > Quarter > Month > Day hierarchy
- **DimOrderStatus**: StatusKey, StatusName, StatusCategory (Open/InProgress/Complete)
- **Relationships**: One-to-many from each dimension to the fact table, single-direction filtering

The expert uses `create_or_update_table`, `create_or_update_column`, and `create_or_update_relationship` tools from the Modeling MCP. Each write operation triggers a confirmation prompt (HITL built into the MCP protocol).

**Checkpoint:** Lead Squad presents the model structure and asks you to confirm.

#### Phase 2: DAX Measures (DAX Expert)

**MCP:** Modeling MCP (create measures) + Remote MCP (validate queries)

The DAX Expert creates measures via the Modeling MCP and validates each one by executing a test query through the Remote MCP:

```dax
-- Base measures
Total Orders = COUNTROWS(FactSalesOrder)
Total Amount = SUM(FactSalesOrder[Amount])
Average Order Value = DIVIDE([Total Amount], [Total Orders])

-- Status analysis
Orders by Status =
VAR CurrentStatus = SELECTEDVALUE(DimOrderStatus[StatusName])
RETURN
    CALCULATE([Total Orders], DimOrderStatus[StatusName] = CurrentStatus)

-- Time intelligence
YTD Orders = CALCULATE([Total Orders], DATESYTD(DimDate[Date]))

-- Fulfillment KPI
Order Fulfillment Rate =
VAR ShippedOrders =
    CALCULATE(
        [Total Orders],
        DimOrderStatus[StatusCategory] = "Complete"
    )
RETURN
    DIVIDE(ShippedOrders, [Total Orders])
```

After creating each measure via `create_or_update_measure` (Modeling MCP), the expert runs `execute_dax_query` (Remote MCP) to verify the measure returns expected results against the sample data.

**Checkpoint:** Lead Squad presents the measures with naming conventions, variable usage, and validation results.

#### Phase 3: Row-Level Security (Data Modeling Expert)

**MCP:** Modeling MCP (write path)

The expert creates the RLS role via the Modeling MCP:

```dax
-- RLS role: Regional Salesperson
[SalespersonEmail] = USERPRINCIPALNAME()
```

Applied to DimCustomer, which filters FactSalesOrder through the relationship. The Modeling MCP's `create_or_update_role` tool creates the role and assigns the filter expression in a single operation.

**Checkpoint:** Lead Squad confirms the RLS design and testing approach.

#### Phase 4: Report Pages (Visualization Expert)

**MCP:** Remote MCP (read path — discover measures and schema for visual mapping)

The expert queries the Remote MCP to discover available measures, dimensions, and hierarchies, then designs two pages:

**Page 1 — Executive Overview:**
- KPI cards: Total Orders, Total Amount, Avg Order Value, Fulfillment Rate
- Bar chart: Orders by Status (color-coded: Open=blue, Released=green, Pending=amber, Shipped=teal)
- Line chart: YTD Orders trend by month
- Slicer: Region, Date range

**Page 2 — Order Detail (Drillthrough):**
- Table: OrderNo, CustomerName, OrderDate, Status, Amount, ShipmentDate
- Drillthrough from Executive Overview bar chart
- Back button for navigation

The Remote MCP ensures the expert maps visuals to actual model objects rather than guessing field names — reducing errors and iterations.

**Checkpoint:** Lead Squad presents the layout with visual types and interaction design.

#### Phase 5: Performance Validation (Performance Expert)

**MCP:** Remote MCP (execute diagnostic queries with cache clearing)

The Performance Expert uses the Remote MCP's `execute_dax_query` with cache-clear option to run diagnostic queries and measure real execution times:

- Model size check via metadata query (target: <50 MB for this dataset)
- DAX query performance per measure with cleared cache (target: <3s per visual)
- Relationship efficiency validation — checks for missing or misconfigured joins
- Recommendation: disable Auto Date/Time, verify custom DimDate covers continuous range

The expert uses `analyze_dax_query_performance` to get detailed execution metrics (formula engine time, storage engine time, scan count) for any measure that exceeds the 3s threshold.

**Checkpoint:** Lead Squad presents performance results and any optimization suggestions.

### Completion

After all phases pass:

```
═══════════════════════════════════════════════════════════
  🏛️ DELFOS LEAD SQUAD — PROJECT COMPLETE
═══════════════════════════════════════════════════════════

Project: Sales Order Tracker Dashboard
Phases completed: 5/5 ✅

── Deliverables ──────────────────────────────────────────
  Phase 1: Star schema (1 fact + 3 dimensions + 4 relationships)
  Phase 2: 6 DAX measures (base + time intel + KPI)
  Phase 3: RLS role (regional salesperson filtering)
  Phase 4: 2 report pages (overview + drillthrough)
  Phase 5: Performance validated (<3s load, <50MB model)

── Key Decisions ─────────────────────────────────────────
  • Import mode — Pro capacity, small dataset, no real-time need
  • Standard time intelligence — no calculation groups needed
  • Single RLS role — regional filter on DimCustomer

═══════════════════════════════════════════════════════════
```

The Lead Squad creates `.github/plans/order-tracker/order-tracker-complete.md` and updates `.github/plans/memory.md`.

---

## Phase 3 — Verification and Iteration

**Agent:** Any specialist directly
**Time:** ~5 minutes

With the project complete, you can go directly to any expert for targeted adjustments:

```
# Optimize a specific measure
@power-bi-dax-expert
The Order Fulfillment Rate measure is slow when filtering by date range. 
Can you optimize it?

# Improve a specific visual
@power-bi-visualization-expert
The bar chart on the Executive Overview page feels crowded with 5 status 
categories. What's a better approach?

# Check a specific performance concern
@power-bi-performance-expert
The drillthrough page loads slowly when drilling from the status bar chart.
What should I investigate?
```

---

## What You Just Learned

This quickstart demonstrated the core Delfos workflow:

| Step | Agent | MCP Used | What It Did |
|------|-------|----------|-------------|
| Setup | — | Both | Connected Remote + Modeling MCP to your workspace |
| Architecture | `@delfos-architect` | Remote | Inspected existing schema, designed 6-layer architecture |
| BC Mapping | bc-data-source-mapping skill | — | Mapped star schema to BC APIs, identified gaps for ALDC |
| Planning | `@delfos-lead-squad` | — | Decomposed into phased plan with expert assignments |
| Star Schema | Data Modeling Expert | Modeling | Created tables, columns, relationships in the model |
| DAX | DAX Expert | Both | Created measures (Modeling) + validated queries (Remote) |
| RLS | Data Modeling Expert | Modeling | Created security roles and filter expressions |
| Reports | Visualization Expert | Remote | Discovered schema for accurate visual mapping |
| Performance | Performance Expert | Remote | Ran diagnostic queries with cache clearing |
| Verification | Specialist directly | Either | Targeted adjustments with live model access |

### Key Principles in Action

- **Architecture before implementation** — The Architect's design document became the blueprint for all experts
- **HITL at every phase boundary** — You approved the architecture, the plan, and each phase checkpoint
- **Context flows forward** — Each expert received the outputs of previous phases through the Lead Squad
- **Decisions get recorded** — Key choices (Import mode, standard time intelligence, single RLS role) are documented
- **MCP-grounded, not guesswork** — Every schema change went through Modeling MCP, every validation through Remote MCP. Agents worked against the real model, not assumptions
- **Framework interop** — When BC is the data source, the bc-data-source-mapping skill generates ALDC-compatible specs. Delfos designs what Power BI needs, ALDC builds what BC must expose. No manual translation

### Delfos vs Working Without It

| Without Delfos | With Delfos |
|----------------|-------------|
| "Build me a Power BI dashboard" → generic response | Architect designs a unified architecture with trade-offs |
| No structure → random order of decisions | Lead Squad plans phases with dependencies and gates |
| One-shot generation → missed cross-layer impacts | Each expert handles their domain, informed by the others |
| No documentation → decisions lost | Architecture doc + completion summary + memory updated |
| Blind prompting → agents guess field names | MCP-connected → agents read and write the real model |

---

## Next Steps

Now that you've completed the quickstart:

1. **Try a real project** — Use `@delfos-architect` for your next Power BI initiative
2. **Use experts directly** — For single-domain questions, skip the orchestration
3. **Explore skills** — Run a [Model Design Review](../.github/skills/power-bi-model-design-review/power-bi-model-design-review/SKILL.md) on an existing model
4. **Customize** — Add your own instructions or skills to the `.github/` structure
5. **Go deeper with MCP** — Try multi-model orchestration (connect to two semantic models simultaneously) or headless TMDL editing for CI/CD pipelines

---

## Validation Checklist

After completing the quickstart, verify:

- [ ] Remote MCP authenticated and responding to schema queries
- [ ] Modeling MCP connected to semantic model (Fabric workspace or Desktop)
- [ ] BC Data Source Mapping completed: tables classified as COVERED / PARTIAL / N/A
- [ ] ALDC spec generated for any PARTIAL or NOT COVERED tables (if applicable)
- [ ] `.github/plans/order-tracker/architecture.md` exists with approved design
- [ ] `.github/plans/order-tracker/order-tracker-complete.md` exists with delivery summary
- [ ] `.github/plans/memory.md` updated with project context
- [ ] Star schema implemented via Modeling MCP: 1 fact + 3 dimensions
- [ ] 6 DAX measures created and validated via Remote MCP query execution
- [ ] RLS role defined via Modeling MCP and tested
- [ ] 2 report pages with proper layout, interactions, and drillthrough
- [ ] Performance validated via Remote MCP: <3s visual load, model size within budget

---

*This quickstart is part of the [Delfos Power BI Agentic Squad](../README.md).*
*Created by Javier Armesto González — [TechSphere Dynamics](https://techspheredynamics.substack.com)*
