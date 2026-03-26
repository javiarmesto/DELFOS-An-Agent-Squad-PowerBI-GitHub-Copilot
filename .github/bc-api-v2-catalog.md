# Business Central API v2.0 — Catalog for Power BI Data Source Mapping

> Reference catalog of standard BC API v2.0 entities organized by functional area.
> Used by the Delfos `bc-data-source-mapping` skill to map star schema designs to BC data sources.
> When a standard API covers the need, no custom API Page is required.
> When fields or entities are missing, the skill generates ALDC-compatible specs for custom API Pages.

## How This Catalog Works

The Delfos Architect designs a star schema with fact and dimension tables. Each table needs data from Business Central. This catalog helps the `bc-data-source-mapping` skill determine:

1. **Standard API available** — use it directly as Power BI data source (no AL code needed)
2. **Standard API partially covers** — use it + flag missing fields for custom API Page
3. **No standard API** — generate full ALDC spec for custom API Page

## API v2.0 Endpoint Pattern

```
GET https://api.businesscentral.dynamics.com/v2.0/{environment}/api/v2.0/companies({companyId})/{entity}
```

All v2.0 entities use `SystemId` (GUID) as primary key. All support OData `$filter`, `$select`, `$expand`, `$top`, `$skip`.

---

## Sales Domain

### salesOrders

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `salesOrders` | Header level |
| Source Table | Sales Header (36) | Where Document Type = Order |
| Key | id (SystemId) | |
| Key Fields | number, orderDate, postingDate, customerId, customerNumber, customerName | |
| Amount Fields | discountAmount, totalAmountExcludingTax, totalTaxAmount, totalAmountIncludingTax | |
| Address Fields | sellToAddressLine1/2, sellToCity, sellToCountry, sellToState, sellToPostCode | Sell-to |
| | billToAddressLine1/2, billToCity, billToCountry, billToState, billToPostCode | Bill-to |
| | shipToAddressLine1/2, shipToCity, shipToCountry, shipToState, shipToPostCode | Ship-to |
| Other Fields | externalDocumentNumber, salesperson, currencyCode, paymentTermsId, shipmentMethodId, requestedDeliveryDate, partialShipping, status | |
| Navigation | salesOrderLines (expand) | Line detail |
| Bound Actions | shipAndInvoice | POST .../Microsoft.NAV.shipAndInvoice |
| Power BI Use | FactSalesOrder, order status tracking, fulfillment analysis | |

### salesOrderLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `salesOrders({id})/salesOrderLines` | Nested under salesOrders |
| Source Table | Sales Line (37) | |
| Key Fields | sequence, itemId, lineObjectNumber, description | |
| Amount Fields | unitPrice, quantity, discountAmount, discountPercent, amountExcludingTax, amountIncludingTax, netAmount | |
| Shipping Fields | shipmentDate, shippedQuantity, invoicedQuantity, shipQuantity, invoiceQuantity | |
| Other | lineType (Item/Account/Resource/...), unitOfMeasureCode, taxCode, taxPercent | |
| Power BI Use | FactSalesOrderLine (line-level grain), product mix analysis | |

### salesInvoices / salesInvoiceLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `salesInvoices`, `salesInvoices({id})/salesInvoiceLines` | Posted documents |
| Key Fields | number, invoiceDate, dueDate, customerId, customerNumber, customerName | |
| Amount Fields | totalAmountExcludingTax, totalTaxAmount, totalAmountIncludingTax, remainingAmount | |
| Status Fields | status (Draft/Open/Paid/Canceled/Corrective) | |
| Bound Actions | post, postAndSend, send, cancel, makeCorrectiveCreditMemo | |
| Power BI Use | FactSalesInvoice, revenue analysis, aged receivables, cash flow | |

### salesQuotes / salesQuoteLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `salesQuotes`, `salesQuotes({id})/salesQuoteLines` | |
| Key Fields | number, documentDate, customerId, customerNumber, customerName, salesperson | |
| Amount Fields | totalAmountExcludingTax, totalAmountIncludingTax | |
| Bound Actions | makeInvoice, makeOrder, send | |
| Power BI Use | FactSalesQuote, pipeline analysis, quote-to-order conversion | |

### salesCreditMemos / salesCreditMemoLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `salesCreditMemos`, `salesCreditMemos({id})/salesCreditMemoLines` | |
| Power BI Use | Returns analysis, credit tracking | |

---

## Purchasing Domain

### purchaseOrders / purchaseOrderLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `purchaseOrders`, `purchaseOrders({id})/purchaseOrderLines` | |
| Source Table | Purchase Header (38), Purchase Line (39) | |
| Key Fields | number, orderDate, postingDate, vendorId, vendorNumber, vendorName | |
| Amount Fields | totalAmountExcludingTax, totalTaxAmount, totalAmountIncludingTax | |
| Line Fields | quantity, directUnitCost, expectedReceiptDate, receivedQuantity, invoicedQuantity | |
| Bound Actions | receiveAndInvoice | |
| Power BI Use | FactPurchaseOrder, procurement analysis, vendor performance | |

### purchaseInvoices / purchaseInvoiceLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `purchaseInvoices`, `purchaseInvoices({id})/purchaseInvoiceLines` | |
| Power BI Use | FactPurchaseInvoice, spend analysis, aged payables | |

---

## Master Data (Dimensions)

### customers

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `customers` | |
| Source Table | Customer (18) | |
| Key Fields | id, number, displayName, type (Person/Company) | |
| Contact Fields | email, phoneNumber, website | |
| Address Fields | addressLine1/2, city, state, country, postalCode | |
| Financial Fields | currencyCode, paymentTermsId, paymentMethodId, taxLiable, taxAreaId, creditLimit, balance, overdueAmount | |
| Navigation | customerFinancialDetails (expand), picture, defaultDimensions | |
| Power BI Use | DimCustomer — primary customer dimension | |
| RLS Candidate | Yes — filter by salesperson, region, or customer group | |

### vendors

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `vendors` | |
| Source Table | Vendor (23) | |
| Key Fields | id, number, displayName | |
| Financial Fields | currencyCode, balance, paymentTermsId, paymentMethodId | |
| Navigation | picture, defaultDimensions | |
| Power BI Use | DimVendor — vendor dimension for purchasing reports | |

### items

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `items` | |
| Source Table | Item (27) | |
| Key Fields | id, number, displayName, type (Inventory/Service/NonInventory) | |
| Pricing Fields | unitPrice, unitCost, lastModifiedDateTime | |
| Classification | itemCategoryCode, gtin, blocked | |
| Inventory | inventory (qty on hand) | |
| Navigation | unitOfMeasure (expand), itemCategory, picture, defaultDimensions | |
| Power BI Use | DimProduct/DimItem — product dimension | |

### employees

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `employees` | |
| Source Table | Employee (5200) | |
| Key Fields | id, number, displayName, givenName, surname | |
| Other Fields | email, phoneNumber, employmentDate, jobTitle, status | |
| Power BI Use | DimEmployee — for HR, timesheet, or resource reports | |

### locations

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `locations` | |
| Source Table | Location (14) | |
| Key Fields | id, code, displayName | |
| Address Fields | addressLine1/2, city, state, country, postalCode | |
| Other | contact, phoneNumber | |
| Power BI Use | DimLocation — warehouse/location dimension | |

---

## Finance Domain

### generalLedgerEntries

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `generalLedgerEntries` | Read-only |
| Source Table | G/L Entry (17) | |
| Key Fields | id, entryNumber, postingDate, documentNumber, documentType | |
| Amount Fields | amount, debitAmount, creditAmount | |
| Other | accountId, accountNumber, description, dimensions | |
| Power BI Use | FactGLEntry — financial analysis, trial balance, P&L | |

### accounts (Chart of Accounts)

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `accounts` | |
| Source Table | G/L Account (15) | |
| Key Fields | id, number, displayName, category, subCategory | |
| Other | accountType, blocked, directPosting | |
| Power BI Use | DimAccount — chart of accounts dimension | |

### customerLedgerEntries / vendorLedgerEntries

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `customerLedgerEntries`, `vendorLedgerEntries` | Read-only |
| Power BI Use | FactCustomerLedger, FactVendorLedger — aged receivables/payables, payment analysis | |

### journals / journalLines

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `journals`, `journals({id})/journalLines` | |
| Power BI Use | Rarely used directly in Power BI — operational, not analytical | |

---

## Inventory Domain

### itemLedgerEntries

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `itemLedgerEntries` | Read-only |
| Source Table | Item Ledger Entry (32) | |
| Key Fields | entryNumber, itemNumber, postingDate, entryType, documentNumber | |
| Amount Fields | quantity, costAmount, salesAmount | |
| Other | locationCode, remainingQuantity, open | |
| Power BI Use | FactItemLedger — inventory movement, consumption, stock analysis | |

---

## Reference / Shared Dimensions

### dimensions / dimensionValues

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `dimensions`, `dimensions({id})/dimensionValues` | |
| Power BI Use | DimDepartment, DimProject, DimCostCenter — any BC dimension as Power BI dimension | |

### paymentTerms

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `paymentTerms` | |
| Power BI Use | DimPaymentTerms — rarely a standalone dimension, usually denormalized into customer/vendor | |

### currencies

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `currencies` | |
| Power BI Use | DimCurrency — for multi-currency models | |

### unitsOfMeasure

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `unitsOfMeasure` | |
| Power BI Use | Reference lookup, rarely a dimension | |

### countriesRegions

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `countriesRegions` | |
| Power BI Use | DimGeography — country/region dimension | |

### taxAreas / taxGroups

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `taxAreas`, `taxGroups` | |
| Power BI Use | DimTax — tax classification dimension | |

---

## Company Information

### companyInformation

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `companyInformation` | |
| Power BI Use | Report header metadata, multi-company filtering | |

### companies

| Property | Type | Notes |
|----------|------|-------|
| Endpoint | `companies` (top-level, no company context) | |
| Power BI Use | DimCompany — for multi-company consolidated reporting | |

---

## Coverage Summary by Power BI Scenario

| Power BI Scenario | Standard APIs Available | Typical Custom API Needs |
|-------------------|----------------------|--------------------------|
| Sales order tracking | salesOrders, salesOrderLines, customers | Order status enum mapping, custom status fields |
| Revenue analysis | salesInvoices, salesInvoiceLines, customers | Posted sales by salesperson if not in standard |
| Aged receivables | customerLedgerEntries, customers | Aging buckets (pre-calculated), custom groupings |
| Procurement | purchaseOrders, purchaseOrderLines, vendors | Vendor evaluation scores, custom approval status |
| Inventory analysis | items, itemLedgerEntries, locations | Stock valuation, reorder point analysis |
| Financial reporting | generalLedgerEntries, accounts, dimensions | Budget entries, consolidated P&L, custom KPIs |
| Pipeline / CRM | salesQuotes, customers | Lead data (custom), opportunity (custom or D365 Sales) |
| HR / Resources | employees | Timesheets, absences (custom or HR module APIs) |

---

## When Custom API Pages Are Needed

The standard v2.0 APIs cover a broad set of entities but have limitations for Power BI:

1. **Missing fields** — The standard API may not expose all fields the model needs (e.g., custom fields added by extensions). Solution: custom API Page based on the same source table.
2. **Missing entities** — No standard API for the source data (e.g., production orders, service orders, custom tables). Solution: new custom API Page.
3. **Performance** — The standard API returns too many fields for a Power BI connector that needs only 5. Solution: custom API Page with `SetLoadFields` optimization.
4. **Calculated fields** — The Power BI model needs a pre-calculated field that doesn't exist in BC (e.g., aging bucket, margin percentage). Solution: custom API Page with FlowFields or computed columns.
5. **Cross-table joins** — The Power BI model needs data from multiple BC tables combined (e.g., Sales Header + Salesperson + Customer). Solution: custom API Query or API Page with joined source.

**Important:** Extending standard API Pages with additional fields is NOT currently possible in BC. If you need extra fields, you must create a new custom API Page based on the same source table.

---

## Custom API Page Template (for ALDC specs)

When the skill determines a custom API Page is needed, it generates an ALDC spec referencing this pattern:

```al
page 50100 "PBI Sales Order Extended API"
{
    PageType = API;
    APIPublisher = '{publisher}';     // From ALDC project config
    APIGroup = '{group}';             // e.g., 'powerbi'
    APIVersion = 'v1.0';
    EntityName = 'salesOrderExtended';
    EntitySetName = 'salesOrdersExtended';
    SourceTable = "Sales Header";
    SourceTableView = where("Document Type" = const(Order));
    Editable = false;                 // Read-only for Power BI
    InsertAllowed = false;
    ModifyAllowed = false;
    DeleteAllowed = false;
    ODataKeyFields = SystemId;

    layout
    {
        area(Content)
        {
            repeater(Group)
            {
                // Fields mapped from star schema requirement
            }
        }
    }

    trigger OnOpenPage()
    begin
        // SetLoadFields optimization for Power BI performance
        Rec.SetLoadFields(/* only fields used by the model */);
    end;
}
```

Key rules for Power BI API Pages:
- Always `Editable = false` + `InsertAllowed = false` + `ModifyAllowed = false` + `DeleteAllowed = false`
- Always use `ODataKeyFields = SystemId`
- Always include `SetLoadFields` in OnOpenPage for performance
- Group under a `powerbi` APIGroup to keep Power BI endpoints organized
- Follow naming convention: `PBI {Entity} Extended API` for the page name

---

## References

- [API (v2.0) Documentation](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/api-reference/v2.0/)
- [Developing a Custom API](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/developer/devenv-develop-custom-api)
- [Enabling Power BI Integration with BC](https://learn.microsoft.com/dynamics365/business-central/admin-powerbi-setup)
- [Transition from API v1.0 to v2.0](https://learn.microsoft.com/dynamics365/business-central/dev-itpro/api-reference/v2.0/transition-to-api-v2.0)
- [ALAppExtensions — APIV2 Source](https://github.com/microsoft/ALAppExtensions/tree/main/Apps/W1/APIV2/app/src/pages)

---

*This catalog is part of the [Delfos Power BI Agentic Squad](../README.md).*
*Maintained by Javier Armesto González — [TechSphere Dynamics](https://techspheredynamics.substack.com)*
