# CLAUDE.md — Catalyst Website Sub-Project
# Inherits: root CLAUDE.md (always read root first)
# Company: Catalyst Medical Education, LLC
# Version: 1.0 | Updated: 2026-02-25

---

## PROJECT STATE

Active file: `catalyst-v6.html` (design locked — "Warm Credibility" v3)
Staging: cata-corp.flywheelsites.com
Production: www.catalystmeded.com
Host: Flywheel managed WordPress
Status: Design locked. Converting HTML → custom WP theme.

---

## BRAND RULES — NON-NEGOTIABLE

Violating these is a Gate 2 failure. No exceptions.

| Element | Spec |
|---------|------|
| H1/H2 font | Georgia (serif) |
| H3 font | Montserrat SemiBold, ALL CAPS |
| Body font | Montserrat Regular |
| Primary color | Per Brand_Guidelines.pdf |
| Logo (dark bg) | Catalyst_Logo_White_Version01.png |
| Logo (light bg) | Catalyst_Logo_Full_Color01.png |
| Logo (accent) | Catalyst_Logo_Cyan.png |

**Never use system fonts. Never use generic sans-serif for headings.**
**Never use placeholder stats — only real Catalyst performance data.**

---

## REAL PERFORMANCE DATA (USE THESE, NEVER PLACEHOLDERS)

- Satisfaction rate: ≥ 97% (verified from program data)
- Intent to change practice: ≥ 90%
- Knowledge improvement range: 37%–93% depending on program
- Partner: University of Tennessee (NOT University of Texas — critical)
- Active learning platforms: mash-ce.com, breastcancer-ce.com, rare-ed.com

---

## WORDPRESS THEME STRUCTURE

Convert `catalyst-v6.html` into this exact file structure:

```
/wp-content/themes/catalyst-custom/
├── style.css          (theme header + base styles)
├── functions.php      (enqueue scripts/styles, register menus)
├── header.php         (nav, logo)
├── footer.php         (footer, scripts)
├── index.php          (home page template)
├── page-about.php     (about page)
├── page-services.php  (services page)
├── page-team.php      (team page)
├── page-contact.php   (contact page)
├── page-activities.php (activities/LMS linking)
└── /assets/
    ├── /css/
    ├── /js/
    └── /images/
```

---

## ORACLE (GATE 2 — WEBSITE BUILD)

A component passes when:
- Brand fonts render correctly (Georgia H1/H2, Montserrat H3/body)
- Mobile render passes at 375px, 768px, 1280px
- Lighthouse score ≥ 90 performance, ≥ 90 accessibility
- No placeholder text (lorem ipsum = automatic fail)
- No placeholder stats (generic numbers = automatic fail)
- All links resolve (no 404s)
- Contact form routes to correct email via WP Fluent Forms
- Logo renders correctly on both dark and light backgrounds

---

## CONTACT & FORMS

- Plugin: WP Fluent Forms (already installed — do not add alternatives)
- Spam: reCAPTCHA v3 + honeypot (enable post-launch)
- Security: Wordfence (enable post-launch)
- SEO: RankMath (enable post-launch)

---

## TEAM (CONFIRMED — USE EXACT TITLES)

| Name | Title |
|------|-------|
| Lou Settembrino | Founder & CEO |
| Reshma Desai Carter | COO |
| Jessica Marshall | VP Medical Strategy |
| Cathy | [confirm title] |
| Megan | [last name + title pending from Lou] |

Photo files in project: Cathy_Catalyst.jpg, Jess_Catalyst.jpg, Lou_Catalyst.jpg, Resh_Catalyst.jpg

---

## 7-PAGE SITE ARCHITECTURE

Home | About | Services | Team | Activities | Outcomes | Contact

Navigation order is fixed. Do not add pages without Lou approval.

---

## OPEN ITEMS (DO NOT BUILD UNTIL RESOLVED)

- Megan's last name and title → Lou pending
- Contact form email routing confirmation → Lou pending  
- Privacy Policy approach (custom vs iubenda) → Lou decision needed
- Activities page LMS linking strategy → Lou decision needed
- Hero video/highlight reel → Jason pending


---

## FILE NAMING CONVENTION (enforced, not suggested)
- All files: YYYY-MM-DD_DESCRIPTIVE-NAME_vN.ext
- All closure/governance docs: CLOSURE_YYYY-MM-DD_TOPIC-SLUG.md
- All build state docs: [PROJECT]_BUILD_STATE_YYYY-MM-DD.md
- All handoff docs: HANDOFF_YYYY-MM-DD_TOPIC-SLUG.md
- Never use: "final", "v2final", "copy", "new", or lowercase-hyphen for governance docs
- Proposals: PROPOSAL_[FUNDER]_[TA]_[FORMAT]_YYYY-MM-DD.docx
- Build outputs: [COMPONENT]_[PASS]_[SCORE]_YYYY-MM-DD.json
- Commits: "[PROJECT] [phase]: [what changed] — [oracle result]"
- Branches: feature/[component-name]-YYYY-MM-DD
- Never commit directly to main without oracle passing

Claude Code and Cowork must follow this convention on every file they create or rename. If a file is found that violates this convention, flag it for rename — do not silently leave it.
