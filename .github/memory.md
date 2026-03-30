# Delfos Memory

> **Append-only**. Never delete entries. Newest entries at the bottom.
> This file maintains cross-session context for the Delfos Architect and Lead Squad.

---

<!-- Entries will be appended below this line by Delfos agents -->

<!-- ============================================================
     ENTRY FORMAT — copy this template for each new entry:

     ## YYYY-MM-DD — [Decision Title]
     **Context:** Why this decision was needed.
     **Decision:** What was decided.
     **Rationale:** Why this option was chosen over alternatives.
     **Impact:** Which agents/layers/files are affected.
     **Status:** Active | Superseded by [link]

     CATEGORIES (use as prefix in title):
     - [ARCH]    Architecture decisions (model design, layer choices)
     - [DAX]     DAX strategy decisions (calculation patterns, optimization)
     - [SEC]     Security decisions (RLS strategy, OLS, governance)
     - [DEVOPS]  DevOps decisions (deployment, branching, CI/CD)
     - [VIZ]     Visualization decisions (report layout, UX patterns)
     - [DATA]    Data source decisions (connectivity, refresh strategy)
     ============================================================ -->

## 2026-03-26 — [ARCH] Delfos Framework v1.1.0 Established

**Context:** Initial architecture for the Delfos agentic framework.
**Decision:** Three-tier agent architecture adopted: Orchestration (Architect + Lead Squad) → Domain Experts (4 specialists) → Enablers (instructions, skills, prompts, hooks).
**Rationale:** Separation of strategic design, phased execution, and domain expertise prevents context overload and enables targeted agent selection.
**Impact:** All agents, instructions, skills, and prompts follow this hierarchy.
**Status:** Active
