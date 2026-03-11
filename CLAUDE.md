# CLAUDE.md — Catalyst Medical Education
# Inherits: ~/.claude/CLAUDE.md (global rules always loaded — do not duplicate here)
# Company: Catalyst Medical Education, LLC
# Scope: Catalyst business + website build
# Version: 2.0 | Updated: 2026-03-06

---

## CATALYST IDENTITY

- **What:** CME/IME grant-funded medical education company
- **Revenue:** ~$6.5M | Grant win rate: ~17.5%
- **Accredited provider partner:** University of Tennessee (NOT University of Texas)
- **Address:** 55 Madison Ave, Suite 400, Morristown, NJ 07960
- **Hosting:** Flywheel managed WordPress
- **Staging:** cata-corp.flywheelsites.com
- **Production:** www.catalystmeded.com

---

## CURRENT WEBSITE STATE

- **Active file:** `catalyst-v6.html` (design locked — "Warm Credibility" v3)
- **Status:** Design locked. Converting HTML → custom WordPress theme.
- **Blocker:** Asset upload to project files pending

---

## BRAND RULES — NON-NEGOTIABLE (Gate 2 failure if violated)

| Element | Spec |
|---|---|
| H1/H2 font | Georgia (serif) |
| H3 font | Montserrat SemiBold, ALL CAPS |
| Body font | Montserrat Regular |
| Primary color | Cyan #42A4D9 |
| Secondary color | Navy #121531 |
| Logo (dark bg) | Catalyst_Logo_White_Version01.png |
| Logo (light bg) | Catalyst_Logo_Full_Color01.png |
| Logo (accent) | Catalyst_Logo_Cyan.png |

**Never use system fonts. Never use generic sans-serif for headings.**
**Never use placeholder stats — only real Catalyst performance data.**

---

## REAL PERFORMANCE DATA (USE THESE ONLY)

- Satisfaction rate: ≥97%
- Intent to change practice: ≥90%
- Knowledge improvement: 37%–93% depending on program
- Active learning platforms: mash-ce.com, breastcancer-ce.com, rare-ed.com

---

## WORDPRESS THEME STRUCTURE

Convert `catalyst-v6.html` into:

```
/wp-content/themes/catalyst-custom/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── index.php
├── page-about.php
├── page-services.php
├── page-team.php
├── page-contact.php
├── page-activities.php
└── /assets/css/ /js/ /images/
```

---

## ORACLE (GATE 2 — WEBSITE BUILD)

Passes when ALL true:
- Brand fonts render correctly (Georgia H1/H2, Montserrat H3/body)
- Mobile render passes at 375px, 768px, 1280px
- Lighthouse score ≥90 performance, ≥90 accessibility
- No placeholder text or stats
- All links resolve (no 404s)
- Contact form routes correctly via WP Fluent Forms
- Logo renders correctly on both dark and light backgrounds

---

## PLUGINS (APPROVED — DO NOT ADD WITHOUT LOU APPROVAL)

- WP Fluent Forms — contact forms
- reCAPTCHA v3 + honeypot — post-launch
- Wordfence — post-launch
- RankMath — post-launch

---

## TEAM (CONFIRMED)

| Name | Title |
|---|---|
| Lou Settembrino | Founder & CEO |
| Reshma Desai Carter | COO |
| Jessica Marshall | VP Medical Strategy |
| Cathy | [confirm title] |
| Megan | [last name + title pending from Lou] |

Photos: Cathy_Catalyst.jpg, Jess_Catalyst.jpg, Lou_Catalyst.jpg, Resh_Catalyst.jpg

---

## 7-PAGE SITE ARCHITECTURE

Home | About | Services | Team | Activities | Outcomes | Contact
Navigation order is fixed. Do not add pages without Lou approval.

---

## CATALYST INTERACTIVE

- **URL:** https://interactive.catalystmeded.com (LIVE)
- **Hosting:** Vercel, deployed from catalyst-mono repo
- **Deploy:** Use `deploy-interactive` alias on MAC-MOLT (resolves GitHub two-identity issue)

---

## OPEN ITEMS (DO NOT BUILD UNTIL RESOLVED)

- Megan's last name and title → Lou pending
- Contact form email routing → Lou pending
- Privacy Policy approach (custom vs iubenda) → Lou decision needed
- Activities page LMS linking strategy → Lou decision needed
- Hero video/highlight reel → Jason pending

---

## GOVERNANCE REFERENCE

| Document | Location |
|---|---|
| Cross-entity decisions (XDEC-###) | `governance/DECISIONS_MASTER_v1.md` |
| Catalyst decisions (CDEC-###) | `governance/DECISIONS_CATALYST_v1.md` |

**Note:** Catalyst website build decisions use CDEC prefix. Cross-entity decisions (affecting TechCelerate or CAMEOS) use XDEC and live in Master CP.
