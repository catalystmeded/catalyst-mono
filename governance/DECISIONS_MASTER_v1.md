# DECISIONS — Master Command Post (Cross-Entity)
# Prefix: XDEC-###
# Scope: Decisions affecting 2+ companies
# Home: catalyst-mono/governance/DECISIONS_MASTER_v1.md
# Version: 1.0 | Created: 2026-03-06
# Rules: Append-only. Reversals require new entry. Status: ACTIVE / SUPERSEDED / DEFERRED / REJECTED

---

## XDEC-001 — Canonical File Naming Standard

**Date:** 2026-03-06 | **Status:** ACTIVE | **Decided by:** Lou Settembrino

**Decision:** All operational docs across all projects use ALL_CAPS_UNDERSCORES with dates and version numbers. Pattern: `DESCRIPTIVE_NAME_YYYY-MM-DD_vN.ext`. Closure docs: `CLOSURE_YYYY-MM-DD_TOPIC-SLUG.md`. Handoff docs: `HANDOFF_YYYY-MM-DD_TOPIC-SLUG.md`. Underscores as word separators — never hyphens in new files (hyphens permitted only in frozen pre-existing directory structures where renaming breaks hardcoded paths).

**Rationale:** Two naming patterns were in use across projects (Pattern A: TechCElerate_Topic_Brief.md vs Pattern B: TECHCELERATE_TOPIC_YYYY-MM-DD.md). Inconsistency causes file management overhead and prevents automated tooling. Pattern B is canonical going forward. Existing Pattern A files rename on next update — not immediately.

**Applies to:** All repos, all projects, all new files from 2026-03-06 forward.
**Aligns with:** DEC-074 (CAMEOS underscores decision, 2026-03-03)

---

## XDEC-002 — Two-Tier Decision Numbering Architecture

**Date:** 2026-03-06 | **Status:** ACTIVE | **Decided by:** Lou Settembrino

**Decision:** Formal decision numbering system adopted across all entities:

| Prefix | Scope | Home |
|---|---|---|
| XDEC-### | Cross-entity (2+ companies) | catalyst-mono/governance/ |
| CDEC-### | Catalyst business + website | catalyst-mono/governance/ |
| DEC-### | CAMEOS only | cameos-mono/governance/ (keep existing DEC-001–DEC-077+) |
| TDEC-### | TechCelerate only | techcelerate-mono/governance/ |
| SDEC-### | Shared-services architecture | shared-services/governance/ |

**Rationale:** CAMEOS has a mature DEC sequence (DEC-077 current). TechCelerate and Catalyst had no formal logging. Mixing all decisions into one sequence would pollute the CAMEOS governance log with unrelated items. Separate sequences enable clean handoff to RNA team with uncontaminated CAMEOS history.

**Note:** No WDEC prefix — Catalyst website decisions roll up to CDEC. No standalone website decision prefix needed.

---

## XDEC-003 — Shared Services Vendoring Pattern

**Date:** 2026-03-06 | **Status:** ACTIVE | **Decided by:** Lou Settembrino

**Decision:** Catalyst builds and maintains all shared components in `shared-services` repo (single source of truth). Each consuming project vendor-copies to `[project]/tools/shared/`. Runtime is firewalled — no cross-repo imports at runtime. Project customizations stay in project copy. Good changes sync upstream. Every vendor copy tracked via `_VENDOR_INFO.json` (source commit, copy date, copier).

**Rationale:** TechCelerate must be fully firewalled from Catalyst/CAMEOS at runtime (liability, entity separation). Vendoring provides runtime isolation while maintaining a single maintained source. Avoids each project building divergent implementations of the same utilities.

**Applies to:** All 3 consuming projects (CAMEOS, TechCelerate, Catalyst Website).
**Related:** SDEC-001 (shared-services internal architecture decision)

---

## XDEC-004 — Entity Structure: No Change (Holding)

**Date:** 2026-03-06 | **Status:** DEFERRED | **Decided by:** Lou Settembrino

**Decision:** No entity structure changes at this time. Catalyst Medical Education LLC remains the operating entity. OMEOS LLC formation deferred until after attorney/CPA review. TechCelerate entity structure under review.

**Revisit trigger:** Attorney + CPA meeting (Entity Structure Briefing doc created 2026-03-01, not yet sent).

---

## XDEC-005 — TechCelerate Brand Scope: Open

**Date:** 2026-03-06 | **Status:** DEFERRED | **Decided by:** Lou Settembrino

**Decision:** TechCelerate brand scope (stays "TechCelerate" for non-healthcare compliance verticals vs. new brand/DBA) not yet decided.

**Revisit trigger:** Before Sprint 3 / August 2026. At $100K compliance revenue, re-evaluate DBA or separate brand.

---

## XDEC-006 — Governance Folder Structure

**Date:** 2026-03-06 | **Status:** ACTIVE | **Decided by:** Lou Settembrino

**Decision:** Each repo maintains a `governance/` subfolder containing its decision log and governance artifacts. Structure:

```
cameos-mono/governance/          ← CAMEOS_DECISION_LOG.md + supporting docs (already exists)
techcelerate-mono/governance/    ← DECISIONS_TECHCELERATE_v1.md (create)
catalyst-mono/governance/        ← DECISIONS_MASTER_v1.md + DECISIONS_CATALYST_v1.md (create)
shared-services/governance/      ← DECISIONS_SHARED_SERVICES_v1.md (create)
```

**Rationale:** CAMEOS already has a well-structured governance/ folder. Standardizing across all repos enables consistent tooling and audit patterns.
