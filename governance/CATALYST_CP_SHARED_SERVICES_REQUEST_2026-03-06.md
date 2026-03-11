# CATALYST COMMAND POST — SHARED SERVICES BUILD REQUEST

**Date:** 2026-03-06
**Requestor:** TechCelerate CP
**Priority:** 🔴 High — blocks TechCelerate May sprint
**Effort:** ~24-32 hrs sequential, ~14-18 hrs with Agent Teams
**Timing:** Can run NOW — parallel to ASRT submission work. Does not touch any live server.

---

## REQUEST

Build 6 new components in `shared-services` repo. These are cross-project utilities that TechCelerate needs for the May-June automation build, CAMEOS benefits from in M9, and Catalyst Website uses for its WordPress conversion.

## WHAT'S BEING BUILT

| # | Component | Primary Consumer | What It Does |
|---|---|---|---|
| 1 | AMA Reference Validator | TechCelerate + CAMEOS | Validates medical citations against AMA 11th Edition. ASRT rejects courses with bad refs — this prevents that. |
| 2 | Batch Content Processor | TechCelerate + CAMEOS | Processes N items through Claude API with checkpointing, resume, and cost control. Powers the 20-course content pipeline. |
| 3 | WordPress REST API Client | TechCelerate + Catalyst Website | Authenticated WP client with rate limiting, batch ops, SSH fallback. Powers all WordPress automation. |
| 4 | Regulatory Compliance Engine | TechCelerate + CAMEOS | Generic rule engine with pluggable rulesets. ASRT ruleset (20 rules) built now. ACCME stub for CAMEOS M9. Future: HIPAA, state CE. |
| 5 | Certificate PDF Generator | TechCelerate | Generates ASRT-compliant CE certificates (11 mandatory elements). Bulk generation, sample submission, backup. |
| 6 | Course HTML Templater | TechCelerate | Converts structured course data to branded LearnDash HTML. Mobile-responsive, ASRT word-count compliant. |

## USAGE PATTERN (NEW DECISION — NEEDS CATALYST APPROVAL)

**Shared source, independent runtime:**
- Catalyst builds and maintains all components in `shared-services` (single source of truth)
- Each project vendor-copies to its own repo (`techcelerate-mono/tools/shared/`, `cameos-mono/tools/shared/`)
- Runtime is firewalled — no cross-repo imports
- Project customizations stay in project copy
- Good changes sync upstream to shared-services periodically

This pattern was chosen because TechCelerate must be fully firewalled from Catalyst/CAMEOS at runtime (decision locked 2026-03-06 in TC Command Post).

## WHAT CHANGES IN SHARED INFRASTRUCTURE

One new section in v2.7 documenting the vendoring pattern + updated Tool Applicability Matrix with all 6 components. MailChimp → FluentCRM migration note also needed.

## EXECUTION

**Session:** "Catalyst Orchestrator — Shared Services Pre-Build (6 Components)"
**Machine:** MAC-MOLT
**Repo:** `~/Projects/shared-services`
**Invocation:** `caffeinate -i tmux new-session -s shared-services-build && cd ~/Projects/shared-services && claude --dangerously-skip-permissions`
**Agent Teams split:** Agent A builds compliance chain (1→4→5), Agent B builds infrastructure chain (2→3→6)

Full handoff with specs, oracles, and build sequence: `HANDOFF_SHARED_SERVICES_PREBUILD_v2_2026-03-06.md`

## POST-BUILD

1. Run vendor_copy.sh to each project repo
2. Update SHARED_INFRASTRUCTURE to v2.7
3. Update CLAUDE.md in techcelerate-mono and cameos-mono with import paths
4. Report results back to TC CP and CAMEOS project

## DECISION NEEDED

- [ ] Approve shared source / independent runtime pattern as standard
- [ ] Approve build timing (this week, parallel to ASRT work)
- [ ] Assign DEC number for the vendoring pattern decision
