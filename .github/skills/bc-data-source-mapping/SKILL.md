---
name: bc-data-source-mapping
description: 'Map Power BI star schema designs to Business Central data sources. Analyzes a Delfos architecture document, matches tables against BC API v2.0 standard entities, identifies coverage gaps, and generates ALDC-compatible requirement specs for custom API Pages. Use when a Power BI project needs data from Business Central and you need to determine which APIs exist and which must be built.'
---

# Skill: BC Data Source Mapping (Delfos → ALDC Bridge)

## Purpose

Translate a Power BI semantic model design into Business Central data source requirements. This skill bridges two frameworks: **Delfos** (Power BI agentic squad) designs the star schema, this skill maps it to BC data sources, and **ALDC** (AL Development Collection) implements any custom API Pages needed.

## When to Load

Load this skill when:
- A Delfos Architect has produced an `architecture.md` with a star schema design
- A Power BI project needs data from Business Central via the BC connector or OData
- You need to determine which BC API v2.0 standard entities cover the model's requirements
- You need to generate ALDC specs for custom API Pages where standard APIs fall short
- You are planning a BC + Power BI project and want to map data dependencies upfront

## Input

The skill expects one of:
- A Delfos `architecture.md` document (preferred — contains the full star schema with tables, fields, relationships, and storage modes)
- A star schema description in any format (table names, field lists, relationships)
- A list of Power BI measures that reference specific BC data

## Output

The skill produces a **BC Data Source Mapping Report** with three sections:
1. **Covered** — Tables fully served by standard BC API v2.0 entities (no AL code needed)
2. **Partially covered** — Tables mostly served by standard APIs but missing specific fields (custom API Page needed for the missing fields)
3. **Not covered** — Tables with no standard API equivalent (full custom API Page needed)

For sections 2 and 3, the skill generates an **ALDC-compatible requirement spec** (`{project}-bc-api.spec.md`) that ALDC's `al-spec.create` can consume directly.

---

## Mapping Process

### Step 1: Extract Star Schema Tables

Read the architecture document and extract every table with its fields:

```
For each table in the star schema:
  - Table name (e.g., FactSalesOrder, DimCustomer)
  - Table type (fact or dimension)
  - Fields with data types
  - Source description (what BC data this represents)
  - Relationships to other tables
  - Estimated row volume
  - Refresh pattern (full, incremental, real-time)
```

### Step 2: Match Against BC API v2.0 Catalog

For each extracted table, search the BC API v2.0 catalog for a matching standard entity:

**Matching rules (in order of priority):**

1. **Entity name match** — The star schema table maps directly to a standard entity.
   Example: `DimCustomer` → `customers`, `FactSalesOrder` → `salesOrders`

2. **Source table match** — The star schema references a BC source table that has a standard API.
   Example: "Sales Header where Document Type = Order" → `salesOrders`

3. **Field coverage check** — For each matched entity, verify that every field in the star schema table exists in the standard API. Fields that don't exist are "gaps."

4. **No match** — No standard API covers this entity. Full custom API Page needed.

**Standard API v2.0 reference catalog:**

| BC Domain | Standard APIs | Typical Star Schema Mapping |
|-----------|--------------|---------------------------|
| **Sales** | salesOrders, salesOrderLines, salesInvoices, salesInvoiceLines, salesQuotes, salesQuoteLines, salesCreditMemos, salesCreditMemoLines, salesShipments, salesShipmentLines | FactSalesOrder, FactSalesInvoice, FactSalesQuote |
| **Purchasing** | purchaseOrders, purchaseOrderLines, purchaseInvoices, purchaseInvoiceLines, purchaseReceipts, purchaseReceiptLines | FactPurchaseOrder, FactPurchaseInvoice |
| **Master Data** | customers, vendors, items, employees, locations | DimCustomer, DimVendor, DimProduct/DimItem, DimEmployee, DimLocation |
| **Finance** | generalLedgerEntries, accounts, customerLedgerEntries, vendorLedgerEntries, journals, journalLines | FactGLEntry, FactCustomerLedger, FactVendorLedger, DimAccount |
| **Inventory** | itemLedgerEntries | FactItemLedger |
| **Reference** | dimensions, dimensionValues, paymentTerms, currencies, unitsOfMeasure, countriesRegions, taxAreas, taxGroups, shipmentMethods | DimDepartment, DimCurrency, DimGeography, DimPaymentTerms |
| **Company** | companies, companyInformation | DimCompany (multi-company reports) |

### Step 3: Classify Each Table

For each star schema table, assign one of three statuses:

**COVERED** — All required fields exist in the standard API.
```
Table: DimCustomer
Status: COVERED
Standard API: customers (v2.0)
Endpoint: /api/v2.0/companies({companyId})/customers
Field mapping:
  CustomerKey     → id (SystemId)
  CustomerNumber  → number
  CustomerName    → displayName
  Region          → state (or country)
  Email           → email
  CreditLimit     → creditLimit
Notes: No custom API needed. Use standard connector in Power BI.
```

**PARTIAL** — Most fields exist but some are missing or the API lacks a needed calculated field.
```
Table: FactSalesOrder
Status: PARTIAL
Standard API: salesOrders (v2.0)
Endpoint: /api/v2.0/companies({companyId})/salesOrders
Covered fields:
  OrderNo         → number
  OrderDate       → orderDate
  CustomerNumber  → customerNumber
  CustomerName    → customerName
  Status          → status
  TotalAmount     → totalAmountIncludingTax
  ShipmentDate    → requestedDeliveryDate
Missing fields:
  - SalespersonCode (exists in Sales Header but not exposed in standard salesOrders API)
  - FulfillmentStatus (custom enum, not in standard BC)
  - DaysToShip (calculated: ShipmentDate - OrderDate)
Action: Generate ALDC spec for custom API Page "PBI Sales Order Extended"
```

**NOT COVERED** — No standard API exists for this entity.
```
Table: FactProductionOrder
Status: NOT COVERED
Standard API: none
BC Source: Production Order (table 5405)
Required fields:
  ProductionOrderNo, ItemNo, Quantity, Status, StartingDate,
  EndingDate, CostAmount, RoutingNo
Action: Generate ALDC spec for custom API Page "PBI Production Order"
```

### Step 4: Generate ALDC Requirement Spec

For each PARTIAL or NOT COVERED table, generate an ALDC-compatible spec. The spec follows the ALDC Core v1.0 contract and references the `skill-api` patterns.

**Spec structure:**

```markdown
# BC API Requirements: {project-name}

> Generated by Delfos bc-data-source-mapping skill
> Source: .github/plans/{project}/architecture.md
> Target: ALDC al-spec.create → al-conductor

## Context

This spec defines the custom API Pages required to feed the Power BI semantic
model designed by the Delfos Architect. Standard BC API v2.0 entities cover
{N} of {M} star schema tables. This spec addresses the remaining {M-N} tables.

## API Design Principles (Power BI Specific)

- All API Pages are **read-only** (Editable = false, InsertAllowed = false,
  ModifyAllowed = false, DeleteAllowed = false)
- All use **ODataKeyFields = SystemId** for stable GUID keys
- All include **SetLoadFields** in OnOpenPage for performance
- All are grouped under **APIGroup = 'powerbi'** with
  **APIPublisher = '{publisher}'**
- Naming convention: "PBI {Entity} Extended API" for pages that extend
  standard entities, "PBI {Entity} API" for new entities

## Requirement 1: {API Page Name}

### Business Context
{Why this API Page is needed — what gap it fills vs the standard API}

### Source Table
- **Table**: {BC table name} ({table number})
- **Filter**: {SourceTableView if applicable}
- **Estimated rows**: {volume}

### Fields

| API Field Name | BC Field | Type | Notes |
|----------------|----------|------|-------|
| id | SystemId | GUID | Key, Editable = false |
| {camelCase} | {BC Field Name} | {Type} | {Notes} |
| ... | ... | ... | ... |

### Calculated Fields (if any)

| API Field Name | Calculation | Type | Notes |
|----------------|-------------|------|-------|
| {camelCase} | {DAX/AL expression} | {Type} | {How computed} |

### Navigation Properties (if any)

| Property | Target API Page | Relationship | Multiplicity |
|----------|----------------|--------------|-------------|
| {name} | {target page} | {SubPageLink} | {1:N or 0..1} |

### Performance

- SetLoadFields: {comma-separated list of BC fields to load}
- Recommended keys: {fields for OData $filter optimization}

### OData Endpoint

```
GET /api/{publisher}/powerbi/v1.0/companies({companyId})/{entitySetName}
GET /api/{publisher}/powerbi/v1.0/companies({companyId})/{entitySetName}({id})
```

### Acceptance Criteria

- [ ] API Page compiles and deploys without errors
- [ ] GET returns correct data with expected fields
- [ ] $filter works on key fields: {list filterable fields}
- [ ] $select reduces payload to requested fields only
- [ ] SetLoadFields verified via AL profiler (only specified fields loaded)
- [ ] Power BI connector can discover and connect to the endpoint
```

### Step 5: Generate Mapping Summary

Produce a summary table for the project:

```markdown
## Data Source Mapping Summary

| Star Schema Table | Type | Status | BC API Source | Custom API Needed |
|-------------------|------|--------|---------------|-------------------|
| DimCustomer | Dimension | COVERED | customers (v2.0) | No |
| DimDate | Dimension | N/A | Generated in Power BI | No |
| DimOrderStatus | Dimension | N/A | Enum mapping in Power BI | No |
| FactSalesOrder | Fact | PARTIAL | salesOrders (v2.0) | Yes — PBI Sales Order Extended |
| ... | ... | ... | ... | ... |

### Standard API Connections (Power BI Connector)

For COVERED tables, configure in Power BI using:
- **Data Source**: Business Central connector (or OData feed)
- **Environment**: {environment name}
- **Company**: {company name}
- **Entity**: {API entity name}
- **Recommended $select**: {field list to reduce payload}

### ALDC Handoff

For PARTIAL and NOT COVERED tables:
- Spec file: `.github/plans/{project}/{project}-bc-api.spec.md`
- Feed to ALDC: `@workspace use al-spec.create` with the spec file
- ALDC skill reference: `skill-api` (Pattern 1 for CRUD, Pattern 7 for error handling)
- After ALDC builds the API Pages, return to Power BI to add the custom connector
```

---

## Decision Rules

### When to recommend a STANDARD API
- All required fields exist in the v2.0 entity
- No custom calculations are needed
- Performance is acceptable (standard API returns a manageable number of fields)

### When to recommend a CUSTOM API (PARTIAL)
- Most fields exist but 1-3 critical fields are missing
- A calculated field is needed that BC doesn't expose (e.g., aging bucket, margin %)
- The standard API returns too many fields and SetLoadFields optimization is needed
- A SourceTableView filter is needed that the standard API doesn't apply

### When to recommend a CUSTOM API (NOT COVERED)
- No standard API exists for the BC source table
- The data comes from a custom table added by an extension
- The data requires a cross-table join that no single standard API provides

### When to recommend a BC API Query instead of API Page
- The Power BI model needs pre-aggregated data from BC (e.g., monthly totals)
- The data comes from joining multiple BC tables with no parent-child relationship
- Read-only reporting scenarios where no CRUD operations are needed

### When to flag "Not a BC data source"
- DimDate → typically generated in Power BI using DAX or Power Query (not from BC)
- Enum/status mapping tables → created in Power BI as disconnected tables
- External data → from sources outside BC (e.g., web analytics, CRM, weather)

---

## Integration with Delfos Workflow

This skill fits into the Delfos quickstart workflow as an optional step between Phase 1 (Architecture) and Phase 2 (Implementation):

```
Phase 1: @delfos-architect designs star schema
                ↓
Phase 1.5: bc-data-source-mapping skill (THIS SKILL)
  - Reads architecture.md
  - Maps to BC API v2.0 catalog
  - Generates ALDC spec for gaps
                ↓
Phase 2: @delfos-lead-squad orchestrates Power BI implementation
         (using standard APIs for covered tables)
                ↓
         ALDC al-spec.create → al-conductor
         (builds custom API Pages from the generated spec)
                ↓
Phase 2 continues: Power BI connects to all data sources
```

The skill can be invoked by the Delfos Architect directly:

```
@delfos-architect

The architecture for the Sales Order Tracker is approved.
Now run the bc-data-source-mapping skill against the architecture
to determine which BC APIs we need and generate specs for any
custom API Pages.

Architecture: .github/plans/order-tracker/architecture.md
BC Environment: SANDBOX
Company: CRONUS USA, Inc.
ALDC Publisher: vssistemas
```

Or by the Lead Squad as part of the orchestrated plan:

```
@delfos-lead-squad

Add a Phase 0.5 to the plan: run bc-data-source-mapping
before the Data Modeling Expert starts building the semantic model.
We need to confirm all data sources are available first.
```

---

## Constraints

- This skill produces **requirement specs**, not AL code. Code generation is ALDC's job.
- This skill assumes the star schema design is **already approved** by the Delfos Architect.
- Standard API field availability is based on BC v2.0 (version 27+). Earlier versions may differ.
- **Extending standard API Pages is not possible in BC** — if fields are missing, a new custom API Page must be created based on the same source table.
- The skill does not validate whether the BC environment actually has the standard APIs enabled — that is a deployment concern.
- For custom tables (added by extensions), the skill cannot know the table structure. It will flag them as NOT COVERED and ask the user to provide the table definition.
- The ALDC spec output follows ALDC Core v1.0 contract (`{req_name}.spec.md` format).

## References

- [BC API v2.0 Catalog](../references/bc-api-v2-catalog.md) — Standard entity reference
- [ALDC skill-api](https://github.com/javiarmesto/ALDC-AL-Development-Collection-for-GitHub-Copilot) — API Page implementation patterns
- [Delfos Architect](../../agents/delfos-architect.agent.md) — Star schema design source
- [Power BI BC Connector](https://learn.microsoft.com/dynamics365/business-central/admin-powerbi-setup) — Standard connector configuration
- [Developing Custom APIs](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/developer/devenv-develop-custom-api) — Microsoft guidance
