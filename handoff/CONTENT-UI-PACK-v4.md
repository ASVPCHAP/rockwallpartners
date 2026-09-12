# Rockwall Partners — Content & UI Pack v4

**Purpose:** Hand this to the site builder. It contains the review findings, the strategic spine, cited research, ready-to-paste copy, and buildable UI specs.
**Written:** 12 Sep 2026
**Supersedes:** nothing. It *builds on* `Mock v3.1` (locked hero + locked bridge survive untouched) and on the live site as of commit `87318f2`.
**Status:** Draft for Anthony's sign. Ship held until signed.

---

## 0. How to use this document

Read sections in this order:

| If you are… | Read |
| --- | --- |
| Deciding whether to approve this | §1 (what's wrong), §3 (the argument), §13 (open items) |
| Writing the copy | §5–§9 (page by page, paste-ready) |
| Building the front end | §10 (diagnostic spec), §11 (UI upgrades), §12 (technical fixes) |
| Checking nothing broke a rule | §2 (decisions), §14 (guardrails) |

**Three rules for whoever builds this:**

1. **Locked copy is locked.** The headline, subhead, the two AI-native lines, and the v3.1 bridge paragraph are reproduced verbatim in §5. Do not reword them, do not "improve" them, do not merge them.
2. **Every number on the site must trace to a source in §4.** If a figure isn't in the research pack with a live link, it does not go on the page. This is the rule that has kept the site honest; adding content is not a reason to relax it.
3. **Copy marked `[ILLUSTRATIVE]` must ship with its label visible.** These are composites written to explain the work. They are not clients and they claim no results. If the label gets designed away, the content becomes a fabricated case study — delete it rather than ship it unlabeled.

---

## 1. What I found

I read all seven HTML pages, `styles.css`, `script.js`, the five `.md` twins, `llms.txt`, `_redirects`, `robots.txt`, and the git history back to the first upload.

### 1.1 The site is bare because it asserts and never explains

This is the core diagnosis, and it is not a word-count problem.

Every page states a conclusion — "we find the bottlenecks," "we help you get found," "seven places the numbers move" — and then moves to a CTA. Nowhere does the site show its reasoning. A visitor arrives not knowing why an operating partner is different from a consultant or a software vendor, and leaves not knowing either. There is no moment on the site where the reader learns something they didn't know.

That absence is what "bare" feels like. The fix is not more adjectives on the same claims. The fix is to put the argument on the page — §3.

### 1.2 The measured content volume

Visible words inside `<main>`, tags stripped:

| Page | Words |
| --- | --- |
| `index.html` | 375 |
| `how-it-works.html` | 373 |
| `marketing.html` | 356 |
| `contact.html` | 365 |
| **Four customer pages, total** | **1,469** |
| `vendor-savings.html` | 876 |
| `teardown.html` (noindexed, off nav) | 535 |
| `agents.html` (off nav, for machines) | 195 |

Average customer-facing page: **367 words.** That is one brochure panel. A page a prospect is meant to *study* before handing over their business runs 800–1,500.

### 1.3 The most urgent consequence of removing GPO

`vendor-savings.html` is 876 words — **37% of all body content on the site** (876 of 2,345 across every public page). It is also the only page with real interactive depth: twelve accordion categories, a four-step accordion, a five-question FAQ accordion, and a fine-print block.

Removing it is the right call if the GPO offer is gone. But understand what it does to the site: **it removes more than a third of the content and all of the interaction, and drops the nav from four items to three.** Deleting it without building §7 first would leave the site materially barer than it is today.

Sequence matters: **build "What we install" before deleting "Vendor savings."**

### 1.4 The homepage hero has a visible empty column

`index.html` hero uses `.hero-grid`, which CSS defines as `repeat(auto-fit, minmax(min(100%, 380px), 1fr))` — a two-column grid at desktop width. It contains exactly one child, `.hero-copy`. The right column is empty.

It wasn't always. `styles.css` still carries ~60 lines of live CSS for a hero card that no page uses any more: `.scorecard`, `.scorecard-label`, `.scorecard-title`, `.scorecard-sub`, `.scorecard-list`, plus `.scorecard-sheet`, `.keep-sheet`, and the whole `.sheet-*` family. These are orphans from the public scorecard, removed in commit `643b042`.

So the single most conspicuous piece of emptiness on the site is a hole where a card used to be, and **the styling for that card is still in the stylesheet.** Filling that column is the highest-impact visual fix available, and it costs almost no new CSS. §11.1.

### 1.5 Proof is an empty state by design, so the entire trust burden sits on one paragraph

The locked pack specifies Proof as "Empty state only: Real before / after lands here · no fake charts/numbers." That is the honest choice and I am not arguing against it.

But trace the consequence: with no case studies, no logos, no metrics, and no testimonials, everything a skeptical owner uses to decide "can this person actually do it" reduces to the single bio paragraph in the owner section. One paragraph is carrying the whole close.

Two lanes are open and neither breaks the rule:
- **Cited third-party research** (§4) — borrowed credibility, fully sourced.
- **Labeled illustrative walkthroughs** (§9) — demonstrated competence. Showing you understand a shop's Tuesday in specific detail is itself evidence, and it claims nothing.

### 1.6 The site has almost no interaction, and what it has is on the page being deleted

`script.js` is 110 lines: hash redirects, a nav toggle, a phone reveal, a calendar reveal, and a mailto form handler. That is the entire interactive surface.

The `.accordion-*` CSS — about 40 well-written lines with `[open]` states, a `+`/`–` marker swap, and a responsive grid — is used by **exactly one file: `vendor-savings.html`**. Delete that page and the site's only real interaction pattern becomes dead code.

**Do not delete that CSS.** §7 and §8 reuse it directly. Same for `.proof-strip`, currently used only by `vendor-savings.html` and the noindexed `teardown.html`.

### 1.7 The booking button has never worked

`contact.html` and `vendor-savings.html` both carry `#open-calendar` with `data-booking-url=""`. `script.js` hides the element unless that attribute holds a real URL. It is empty, so the button has never rendered.

The entire offer is "book twenty minutes." **There is no way to book on the site.** Every path is "email us and we'll write back and set it" — a minimum two-touch, asynchronous handoff on an offer whose whole promise is speed. This is the largest conversion gap on the site, and §3 makes it awkward in a new way: the site is about to argue, citing research, that slow response loses business.

### 1.8 The form posts nowhere and can fail silently

Both forms are `action="mailto:…" method="get"`, intercepted by JS that builds a `mailto:` href and sets `window.location`. Consequences:

- On mobile and on any desktop without a configured mail client, a long `mailto:` body frequently does nothing at all. No error, no fallback. The visitor fills six fields, taps **Email us**, and watches nothing happen.
- If JS fails, the raw form submits as a GET to a `mailto:` action, which is not a valid form target.
- Nothing is logged. There is no record of an attempted submission, so a lost lead is invisible.

`.form-note` frames "Nothing is posted to a server" as a privacy feature. It's defensible positioning, but it is currently also a silent-failure mode on the only conversion path.

### 1.9 Two broken internal links

Both confirmed against the filesystem and `_redirects`:

| Where | Points to | Reality |
| --- | --- | --- |
| `agents.html:103` | `scorecard.html` | File does not exist. `_redirects` sends `/scorecard.html → / 301`. A link labelled "Scorecard" bounces the reader to the homepage. |
| `script.js:12–13` | `how.html`, `how.html#bottlenecks` | File does not exist. Survives only via `_redirects` `/how.html → /how-it-works 301`. Fragile double-hop, and the hash is likely dropped. |

Fix both (§12). Note also that the word "scorecard" still appears as a *concept* in nine places across `index.html`, `how-it-works.html`, and its JSON-LD. That is fine — it is the live artifact you fill on the call, not a page — but the copy should never again link it as a destination.

### 1.10 The stripe pattern will break the moment you add sections

`styles.css` has `.section:nth-of-type(even) { background: var(--paper-deep); }`. This counts `.section` elements among their siblings, so **inserting or reordering any section silently inverts the light/dark banding for the rest of the page.**

This pack adds a lot of sections. Left as-is, the builder will chase background bugs across every page. Replace it with an explicit class (§12.4) before writing any new markup.

### 1.11 The v3.1 off-list bans something the live site uses everywhere

`Mock v3.1` §Off bans "kicker eyebrows." The live site uses `.kicker` — a small mono uppercase label above nearly every heading — on **every page, roughly 25 times**, and `styles.css` styles it as a first-class element.

One of the two is wrong and I can't resolve it from the documents. Flagged in §13. I have **kept** `.kicker` in the copy below, because removing it would mean restyling every page and it is doing real navigational work. If Anthony meant that ban literally, say so and I will strip them.

### 1.12 There is one unsourced metric inside the locked pack itself

The locked seven-layer grid contains: *"Cut time on simple repeat work ~40–50% (sometimes ~90%)."*

The same document's rule line reads: *"No invented metrics, case studies, prices, or off-list claims."* Those two statements are in tension. A range with a parenthetical outlier is a performance claim, and nothing in the pack sources it.

I have **not** put that figure on any page in this document. §13 gives three ways to resolve it. This is a compliance question, not a copy preference — an unsourced performance range is the kind of claim that draws an FTC substantiation problem, and it is the one number on the site a competitor would screenshot.

---

## 2. Decisions recorded in this pass

These came from Anthony via the review conversation and are now binding on the copy below.

| # | Decision | Consequence |
| --- | --- | --- |
| 1 | **Two audiences, split by audience.** Live site's frame (owners still in the work) *and* v3.1's frame (established companies going AI-focused) both survive. | Neither positioning is discarded. §5.3 is the new fork. |
| 2 | **One homepage, fork directly under the hero.** | Shared locked hero, then an explicit "which one are you." One brand, one URL set, no duplicate-content risk. |
| 3 | **Allowed new content: labeled illustrative walkthroughs + cited third-party research with links.** | §4 and §9. |
| 4 | **Not approved this pass:** publishing the HVAC teardown; expanding Anthony's career into narrative proof. | `teardown.html` stays noindexed and off-nav, untouched. Owner section keeps its current length. Research goes *inline on the relevant pages*, not into a separate blog — which also honours "don't overcomplicate it." |
| 5 | **Interactivity: medium.** One real diagnostic self-check, client-side only. | §10. Still no chatbot, still no calculator. |
| 6 | **All GPO / vendor-savings material comes off the site.** | Delete `vendor-savings.html`; strip GPO from `_redirects`, `llms.txt`, `README.md`, footer legal. §12.1. |
| 7 | **Paid audit is public on both doors, with no price.** | Free and paid shown as parallel routes. Explicit line that free never requires buying paid. |
| 8 | **Nav: How it works · What we install · Marketing · Request.** | "What we install" takes the slot vendor savings vacates. Marketing survives standalone as the deep version of the go-to-market layer. |
| 9 | **Vocabulary: "audit" everywhere.** | Replaces "assessment" site-wide, including titles, meta, JSON-LD, mailto subjects, and `llms.txt`. §12.2 lists every occurrence. |

**One consequence of #9 to go in with eyes open:** "free 20-minute assessment" is currently in page titles, meta descriptions, JSON-LD, `llms.txt`, and both mailto subject lines. It is the indexed phrase. Switching to "audit" is right for consistency with the paid route — "paid assessment" reads oddly — but it *is* a rename of the thing people may already have searched. Keep the mailto subject lines stable for one cycle if inbox filters depend on them (§13).

---

## 3. The argument the site should make

This is the most valuable thing in this document, so it gets its own section.

Right now the locked bridge paragraph — *"We build around your current ecosystem and plug into the tools you already use every day. The goal is a company that flows — teams connected, same picture, not stuck in silos"* — reads as a preference. A nice thing Rockwall happens to believe. A visitor has no reason to think it's more true than a vendor saying the opposite.

**It is not a preference. It is the finding of the largest public study of enterprise AI results, and the site can say so with a link.**

Here is the chain, in order. Every link is sourced in §4.

> **1. Whether to use AI is a settled question.** 58% of US small businesses self-report using generative AI, up from 23% in 2023 — more than double in two years. Nobody needs convincing any more.
>
> **2. Using it and getting paid for it are different questions.** MIT's *State of AI in Business 2025* reviewed 300+ deployments and found roughly **95% of generative-AI pilots produced no measurable P&L impact.** 80% of firms had tried it. About 5% got real value.
>
> **3. The reason is not the models.** In the report's own words: *"Tools fail not because of poor models, but because they don't learn, adapt, or integrate. The lack of memory and feedback loops keeps GenAI stuck as a productivity enhancer, not a workflow transformer."*
>
> **4. So the thing that has to get installed is not a tool. It's a layer.** Something that sits in the work you already do, in the systems you already own, and keeps context between the people who need it.
>
> **5. Which is why we audit before we install, and why we stay until the numbers move.** You cannot integrate into an ecosystem you haven't mapped, and a pilot nobody keeps tuning is exactly the 95%.

**What this does for the brand:** it converts the locked copy from an assertion into a conclusion. The same words, now with a reason in front of them. It also separates Rockwall from both competitor types in one move — the software vendor is selling the tool that the research says fails, and the consultant is selling the report that doesn't get installed. Rockwall is selling the integration and the staying, which is the part the 5% actually did.

And it gives the seven layers a reason to exist. Seven tabs of outcomes is a menu. Seven layers presented as *"the places context breaks, which is where the 95% dies"* is a thesis.

**Where it goes:** a band on the homepage between the fork and the layer preview (§5.5), restated in one line at the top of "What we install" (§7.1), and as the framing of the "why an audit first" block on How it works (§6.4).

**How to write it without overclaiming.** Two disciplines:
- MIT studied enterprises, not four-truck HVAC shops. Do not imply the 95% figure was measured on small businesses. The copy in §5.5 says "companies of every size have learned this the expensive way" and attributes the study plainly. Don't tighten that into "95% of businesses like yours fail."
- Never pair the statistic with an implied Rockwall success rate. "95% fail, we're the 5%" is an invented claim about Rockwall. The honest form is "*here is what the 5% did differently, and it's the thing we install.*"

---

## 4. Research pack — cited, with source confidence

Every figure the site is allowed to use. **Nothing outside this table goes on a page.**

The confidence column is not decoration. I verified some of these against the publisher's own page and some I could not, because the publisher blocks automated fetching. Treat anything below "Verified" as needing a human to open the link and confirm the number before it ships.

| # | Claim as the site may state it | Source | Date | Confidence |
| --- | --- | --- | --- | --- |
| R1 | 58% of US small businesses say they use generative AI, up from 40% in 2024 and 23% in 2023. | [U.S. Chamber of Commerce, *Empowering Small Business: The Impact of Technology on U.S. Small Business*, 4th ed.](https://www.uschamber.com/technology/empowering-small-business-the-impact-of-technology-on-u-s-small-business) | Aug 2025, survey fielded Jun 2025 | **Verified** on publisher page. 3,870 US businesses under 250 employees. |
| R2 | Roughly 95% of generative-AI pilots produced no measurable P&L impact; about 5% captured real value. 80% of firms had tried GenAI. | MIT NANDA / MIT Media Lab, *The GenAI Divide: State of AI in Business 2025* | Jul 2025 | **Verified via secondary** — publisher PDF returns 403. Method: 52 executive interviews, 153 surveys, 300+ deployment reviews. Confirm wording before publishing. |
| R3 | *"Tools fail not because of poor models, but because they don't learn, adapt, or integrate. The lack of memory and feedback loops keeps GenAI stuck as a productivity enhancer, not a workflow transformer."* | Same as R2 | Jul 2025 | **Verified via secondary.** This is a direct quotation — it must be exact or not used. Confirm against the PDF. |
| R4 | Firms that contacted an inbound lead within an hour were nearly 7× more likely to qualify it than those who waited one more hour, and 60× more likely than those who waited 24 hours. Average response time among responders: 42 hours. 23% never responded at all. | [Harvard Business Review, "The Short Life of Online Sales Leads"](https://hbr.org/2011/03/the-short-life-of-online-sales-leads) — Oldroyd, McElheran, Elkington | Mar 2011 | **Partially verified** — authors and date confirmed; body is paywalled. Figures are consistently reported across the literature. **2011 data — state the year on the page.** |
| R5 | Nearly 3 in 5 small businesses (59%) have invoices overdue by 30+ days, up from 47% a year earlier. Businesses with unpaid invoices are owed $17.7K on average. 39% say a single late payment made it hard to cover payroll or bills in the past year. | [Intuit QuickBooks, *2026 Small Business Late Payments Report*](https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2026/) | Jul 2026 | **Verified** on publisher page. ~5,000 quarterly respondents; 1,305 US owners surveyed Dec 2025; businesses 0–250 employees. |
| R6 | Only 12% of employees strongly agree their organization does a great job of onboarding new people. | [Gallup, "Why the Onboarding Experience Is Key for Retention"](https://www.gallup.com/workplace/235121/why-onboarding-experience-key-retention.aspx) | Gallup workplace research | **Verified** on publisher page. |
| R7 | The average interaction worker spends nearly 20% of the workweek looking for internal information or tracking down colleagues who can help with a task. | [McKinsey Global Institute, *The social economy: Unlocking value and productivity through social technologies*](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy) | Jul 2012 | **Verified via search of publisher PDF.** 2012 data, and "interaction worker" is the report's term — do not silently restate as "your team." Frame as the classic finding it is. |
| R8 | 71% of consumers read online reviews regularly while browsing local businesses; 83% use Google to read them. | BrightLocal, *Local Consumer Review Survey 2025* | 2025 | **Unverified** — publisher returns 403 to automated fetch. **A human must confirm both numbers on the page before this ships,** or drop R8. |

### Rejected during research — do not use

I checked these and they did not survive. Listing them so nobody re-adds them from a blog post later.

| Claim seen in the wild | Why it's out |
| --- | --- |
| "89% of small businesses use AI" (attributed to U.S. Chamber) | **Wrong.** The Chamber's own page says *almost 60%* / 58% generative AI. The 89% figure circulating on aggregator sites does not match the publisher. This is exactly the error the no-invented-metrics rule exists to prevent. |
| "76% of people who search for something nearby visit a business within 24 hours" (Think with Google) | Real but **~2016 vintage**, and the original Think with Google URL now 301s to a different page. A decade-old mobile-behaviour stat is not worth the exposure. Use R8 for the local-intent point instead. |
| "Gallup: new hires take 12 months to reach full performance" | Widely attributed to Gallup but **not present on the Gallup page that supposedly contains it.** Only R6 (the 12% figure) is on that page. Do not use the 12-month claim. |
| SHRM "$40,000 per hire in lost ramp productivity"; "Gallup 8.2 months median time to productivity" | Traceable only to content-marketing aggregators, not to SHRM or Gallup primary sources. Out. |
| Any "average client saves $X" figure | Banned by the locked pack, and there is no dataset behind it. |

### Citation format on the page

Every statistic renders with its source visible and linked. Not a superscript, not a hover — a readable line under the claim:

> **59% of small businesses have invoices more than 30 days overdue.**
> Intuit QuickBooks, 2026 Small Business Late Payments Report · [source](https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2026/)

`rel="noopener"` and `target="_blank"` on every outbound source link. Reuse `.legal-note` sizing for the attribution line; add `.source-line` (§11.9).

This visible-source pattern is itself a trust signal on a site that has no case studies. It says: we show our work, and we don't make numbers up. That is the same promise as "you keep the findings," expressed in the furniture.

---

## 5. Home — paste-ready

Section order top to bottom. Each block gives the heading, the copy, and a build note.

### 5.1 Hero — LOCKED, DO NOT REWRITE

**Kicker:** `The AI operating partner`

**H1 (locked, verbatim):**
> Rockwall Partners is the AI operating partner for growing and established businesses that want to become more AI-focused.

**Subhead (locked, verbatim):**
> We help you get more customers, keep them longer, and run the business with less wasted time — and we show the numbers moving.

**Then the two AI-native lines (locked, keep, do not remove, in this order):**
> We help companies become more AI-native.
>
> We help companies move off outdated systems into processes that save time, save resources, and increase revenue.

**Then the v3.1 bridge paragraph (locked, verbatim, as a paragraph under the two lines):**
> We build around your current ecosystem and plug into the tools you already use every day. The goal is a company that flows — teams connected, same picture, not stuck in silos.

**Hero actions:**
- Primary: `Book the free 20-minute audit` → `/contact`
- Ghost: `Two ways to start` → `/how-it-works`

**Build note:** the hero's second grid column is empty today (§1.4). Put the two-route card there — §11.1. The `.scorecard*` CSS already in `styles.css` styles it with no new rules needed.

### 5.2 Hero side card — "Two ways to start"

Sits in the empty hero column. Reuses `.scorecard`, `.scorecard-label`, `.scorecard-title`, `.scorecard-list`.

**Label:** `Two ways to start`
**Title:** `You pick the route.`
**Sub:** `Not a funnel. Either one can lead to an install.`

**List:**
- `Free · 20 minutes` — Kick the tires. You keep the findings.
- `Paid · 1–2 hours` — For teams who already know the problem.

**Footer line:** `The free route never requires buying the paid one.`

### 5.3 The fork — NEW, the structural centrepiece

Directly under the hero. This is where the two audiences split (decision #2).

**Kicker:** `Start where you are`
**H2:** `Two companies read that paragraph differently. Pick the one that sounds like yours.`
**Lead:** `Same operating layer underneath. Different first move, because the bottleneck is in a different place.`

**Two cards, side by side:**

**Card A**
> ### You are still in the work
> You are the one answering, quoting, chasing, and doing the admin that shouldn't need you. The business can't take on more without you working later. Growth currently means another hire.
>
> **The first move:** find the one bottleneck that pays back fastest, and take it off your desk.
>
> `See how a first install works →` → `/how-it-works`

**Card B**
> ### You are established and going AI-focused
> The company runs. The problem is that it runs in pieces — teams with different pictures of the same customer, work re-entered between systems, and answers that live in one person's head. You've likely already tried a tool that didn't stick.
>
> **The first move:** map the ecosystem, then install the layer that connects it.
>
> `See the operating layer →` → `/what-we-install`

**Build note:** two cards in `.trade-grid` with `.cta-grid` treatment. At mobile they stack; Card A first. Do **not** persist the choice in `localStorage` or fork the whole site — both doors lead into the same pages, and the cards are a routing aid, not a mode. Keeping it stateless avoids a whole class of bugs and keeps one URL per page for search.

### 5.4 What "operating partner" actually means — NEW

The site has never defined its own category noun. Three cards, plain language.

**Kicker:** `The difference`
**H2:** `Not software. Not a consultant. Not a retainer.`
**Lead:** `Those three all exist and all have their place. None of them is this. Here is the distinction, because it changes what you should expect from us.`

| | What they hand you | What's left to you |
| --- | --- | --- |
| **Software** | A login and a feature list. | Making it fit the way you actually work — and the adoption. |
| **A consultant** | A report and a recommendation. | The install. Which is the part that was hard. |
| **An operating partner** | The install, in your systems, plus the numbers that say whether it worked. | Running your business. |

**Closing line under the table:**
> An operating partnership is not a retainer. A retainer bills for time. We stay until the numbers move.

**Build note:** render as three cards on desktop, and as a table only if the table stays readable at 400px — otherwise cards. Put it inside `.trade-grid`.

### 5.5 Why most AI work produces nothing — NEW, the argument (§3)

**Kicker:** `Why the audit comes first`
**H2:** `Most AI projects produce nothing. The reason is boring, and it is fixable.`

**Body:**
> Whether to use AI is a settled question. Nearly six in ten US small businesses already say they use generative AI — more than double the share two years ago.
>
> Getting paid for it is a different question. When MIT reviewed more than 300 enterprise AI deployments in 2025, it found that around 95% of generative-AI pilots produced no measurable impact on the P&L. Four in five companies had tried. About one in twenty got real value out of it.
>
> The interesting part is why. It was not the models.

**Pull quote — must be exact (R3):**
> "Tools fail not because of poor models, but because they don't learn, adapt, or integrate. The lack of memory and feedback loops keeps GenAI stuck as a productivity enhancer, not a workflow transformer."
>
> *— MIT, State of AI in Business 2025*

**Body continues:**
> Read that again as a shopping list. The tools that failed didn't connect to anything, didn't remember anything, and didn't improve. Companies of every size have learned this the expensive way.
>
> That is the whole reason we work the way we do. We build around the ecosystem you already have, because a tool that doesn't integrate is the 95%. We install memory — a place where context about a customer or a job actually persists — because a tool that forgets is the 95%. And we stay until the numbers move, because a pilot nobody keeps tuning is, again, the 95%.
>
> The audit comes first for the same reason. You cannot integrate into an ecosystem you haven't mapped.

**Source lines (visible, per §4):**
- U.S. Chamber of Commerce, *Empowering Small Business*, 4th ed., Aug 2025 · [source](https://www.uschamber.com/technology/empowering-small-business-the-impact-of-technology-on-u-s-small-business)
- MIT NANDA, *The GenAI Divide: State of AI in Business 2025*, Jul 2025

**Build note:** this is the one section on the homepage that should read like an argument rather than a card grid. Give it `.wrap.narrow` (860px) and let it be prose. The contrast against the card grids above and below is what makes it land.

### 5.6 The operating layer — preview

**Kicker:** `What we install`
**H2:** `The operating layer — seven places the numbers move.`
**Lead:** `Go-to-market (GTM), operations, the second brain, people, finance, compliance, vendors. Most companies are leaking in two or three of them and can name only one.`

**Seven chips:** `Go-to-market / sales` · `Operations` · `Second brain` · `People / training` · `Finance` · `Compliance` · `Vendors / partners`

**Supporting bullets (from the locked pack, keep):**
- We build around your current ecosystem.
- We integrate with the tools you already use every day.

**CTA:** `See all seven layers →` → `/what-we-install`

**Build note:** chips reuse `.sheet-chips` — already in `styles.css`, currently unused. Make each chip a link to its panel on the install page (`/what-we-install#second-brain`). That turns a decorative row into navigation.

### 5.7 The self-check — NEW, entry point to the diagnostic

**Kicker:** `Before you book anything`
**H2:** `Eight questions. Find out which layer is costing you most.`
**Lead:** `Answer honestly and the page will tell you where we would look first. Nothing is sent anywhere, nothing is stored, and there is no email gate — the result appears on this page and it is yours.`
**CTA:** `Start the self-check →` → `/how-it-works#self-check`

Full spec in §10. **It must work exactly as described above** — no email capture, no data leaving the browser. If that changes, this copy becomes a false statement.

### 5.8 Who this is for — keep, lightly revised

Keep all four existing photo cards and their images. One change: the current lead implies only owners stuck in the work, which now contradicts the fork.

**Revised lead:**
> Home services, retail, offices, clinics — and the established companies above them that have outgrown the way they were run. HVAC is one example, not the fence.

Card copy stays as live, including the clinics BAA line, which is correct and should not be softened.

### 5.9 Proof — keep as empty state

Unchanged from the locked pack. Suggested copy so it reads as a deliberate choice rather than an oversight:

**Kicker:** `Proof`
**H2:** `Real before and after lands here.`
**Body:**
> There are no case studies on this page yet, and no charts. When an install has a real before and after we can show, it goes here with the client's permission and the actual numbers.
>
> Until then: the research on this site is cited and linked, the walkthroughs are labelled as examples, and the audit findings are yours to keep whether or not you hire us. We would rather have an empty shelf than a made-up one.

That last line does more for trust than a fabricated chart would, and it is true.

### 5.10 Meet the Owner — keep as live

No changes (decision #4). Keep the bio paragraph, the LinkedIn and email links, the `Fate, TX` badge, and the "AI is the back office" paragraph.

### 5.11 Closing CTA

**Kicker:** `Next`
**H2:** `Two ways to start. You pick the route.`
**Lead:** `The free 20-minute audit, or a paid working session if you already know the problem. You keep the findings either way, and the free route never requires buying the paid one.`
**Primary:** `Book the free audit` → `/contact` · **Ghost:** `Compare the two routes` → `/how-it-works`

---

## 6. How it works — paste-ready

Current page is 373 words and four steps. It needs to carry the two-route structure, and it needs to answer the questions an owner actually has before giving a stranger twenty minutes.

### 6.1 Hero

**Kicker:** `How it works`
**H1:** `Two ways to start. You pick the route.`
**Lead:** `A free 20-minute audit, or a paid working session. They are parallel entry points, not step one and step two. Either one can lead to an install, and neither one obligates you to anything.`
**Primary:** `Book the free audit` → `/contact`

### 6.2 The two routes — side by side

**Kicker:** `Two audit routes`
**H2:** `Free to kick the tires. Paid when you already know the problem.`
**Lead:** `Pick by how much certainty you already have, not by budget. Both are real work.`

**Route A card**
> ### Route A — Free 20-minute audit
> **For:** kicking the tires.
>
> A focused conversation on where customers, retention, and wasted time are getting stuck. We fill the scorecard with you while we talk, so you watch the bottlenecks get ranked rather than waiting for a document.
>
> **You leave with:** the ranked findings, in writing. Yours to keep and act on with or without us.
>
> **Costs:** nothing. **Obligates:** nothing.
>
> `Book the free audit →` → `/contact`

**Route B card**
> ### Route B — Paid audit
> **For:** teams who already know the problem and want a serious working session.
>
> One to two hours across one or two sessions. We go deeper than a single conversation allows: a real map of the ecosystem, where the work actually breaks between systems, and a clear next install.
>
> **You leave with:** the map and a defined first install.
>
> **Price:** we scope it in conversation. There is no public price on this site.
>
> `Talk it through →` → `/contact`

**Line directly under both cards — required, must be visible, not in fine print:**
> These are two doors, not two steps. The free audit is not a sales call for the paid one, and taking it never requires buying anything.

### 6.3 What actually happens in the twenty minutes — NEW

This is the single highest-value content addition on this page. The offer is "give a stranger twenty minutes," and nothing on the live site says what happens in them. Removing that uncertainty removes the main reason people don't book.

**Kicker:** `The twenty minutes`
**H2:** `No deck. No discovery questionnaire. We fill the page while you talk.`

**Four steps (reuse `.steps`):**

1. **Minutes 0–3 — What you actually do**
   The business, the crew size, who does what. We are listening for where decisions queue up, not building a CRM record.

2. **Minutes 3–12 — Where the week goes**
   The specific work that eats time or sits until it costs money. Leads that wait. Quotes that go out late. The thing three people ask you every day. We are mapping it to the seven layers as you describe it.

3. **Minutes 12–18 — Ranking it, live, with you watching**
   We put effort against impact on the scorecard in front of you and rank the bottlenecks. You will disagree with some of the ranking. That is the useful part of the call.

4. **Minutes 18–20 — What we'd do first, and what it would take**
   The one bottleneck that pays back fastest, and honestly whether it's worth doing at all. If the answer is that you don't need us yet, you get told that.

**Closing:** `Nothing is sold while we write. If a first install is worth doing, we price it after you have the findings in front of you — not before.`

### 6.4 What to bring — NEW

**Kicker:** `Before the call`
**H2:** `Bring nothing. Or bring these three things and we'll get further.`
**Lead:** `There is no prep requirement. But if you want the twenty minutes to go deep instead of broad:`

- **A rough number of leads last month, and what happened to them.** Even "about thirty, I think we quoted twenty" is enough to work with.
- **The list of systems you actually use.** Including the spreadsheet and the group text. Especially those.
- **The thing that made you look at this page.** There is usually one specific recent incident. That is the most useful sentence of the call.

### 6.5 Why an audit before an install — NEW, short version of §3

**Kicker:** `Why not just start building`
**H2:** `Because the thing that kills AI projects is installing before you've mapped.`
**Body:**
> MIT reviewed more than 300 enterprise AI deployments in 2025 and found roughly 95% produced no measurable P&L impact. Not because the models were bad — because the tools didn't integrate with anything, didn't remember anything, and never improved.
>
> An audit is how you avoid buying that outcome. Twenty minutes of mapping is cheaper than a pilot that technically works and changes nothing.

*Source: MIT NANDA, State of AI in Business 2025, Jul 2025.*

### 6.6 After the audit — separate path, NOT steps 3 and 4

Locked structure. Must read as a *separate* block, visually distinct from the two route cards, so it cannot be misread as a funnel.

**Kicker:** `After the audit`
**H2:** `Either route can lead here. Neither one has to.`

**Two cards:**

> ### Focused install
> We ship the one bottleneck that pays back first. Scoped, in your systems, with a number attached so you can tell whether it worked.

> ### Operating partnership
> The ongoing version: we are your AI operating partner across the layers. Not a retainer — a retainer bills for time. We stay until the numbers move.

**Line under:** `Either audit route can lead to either of these. Many audits lead to neither, and that is a legitimate outcome.`

### 6.7 The self-check — the diagnostic lives here

Section id `#self-check`. Full spec in §10.

**Kicker:** `Self-check`
**H2:** `Eight questions. Which layer is costing you most?`
**Lead:** `This is not the audit — the audit is where we put numbers on it. But it will tell you which of the seven layers to look at first, and it takes about ninety seconds. Nothing is sent anywhere and nothing is stored.`

### 6.8 FAQ — expanded

Keep the six live answers, updated to "audit" (§12.2), and add these. Mark the whole list up as `FAQPage` JSON-LD (§12.6).

> **Do I have to use ChatGPT?**
> No. You keep running the business the way you do now. We set up the quiet parts in the back. This is not ChatGPT training.

> **Is this software?**
> No. There is no login and no seat. The audit is a conversation; an install is work we do in the systems you already own.

> **What's the difference between the free and paid audit, really?**
> Certainty. The free one finds out where you're leaking. The paid one is for when you already know and want to map it properly and leave with a defined install. The free route is not a trial of the paid route.

> **Do I have to buy anything after either call?**
> No. You keep the findings either way.

> **What does an install cost?**
> We don't publish install prices, because the honest answer depends on which bottleneck it is and what you already own. We price it after you have the findings in front of you, so you can judge the number against a ranked list rather than a pitch.

> **What if you look and decide I don't need you?**
> You get told that on the call. It happens. You keep the findings and we have both saved a month.

> **Which of my systems do you need access to?**
> None for an audit. For an install, only the systems that specific install touches, at the access level it needs. We scope that in writing before anything is connected.

> **Are you going to rip out the tools we already use?**
> That is the opposite of the approach. Tools that don't integrate with what you already run are the reason most AI projects produce nothing. We build around your ecosystem.

> **We're a clinic. Can you work with us?**
> We can audit. We will not install on patient texts or patient records without a BAA in place. That is a hard line, not a negotiation.

> **How do I start?**
> Email anthony@rockwallpartners.com or call (806) 433-2461. Tell us the business and which route you want.

---

## 7. What we install — paste-ready, NEW PAGE

This is the largest new build and the page that replaces vendor savings in the nav. Target 1,100–1,500 words. **Build this before deleting `vendor-savings.html`** (§1.3).

### 7.1 Hero

**Kicker:** `What we install`
**H1:** `The operating layer — seven places the numbers move.`
**Lead:** `Go-to-market (GTM), operations, the second brain, people and training, finance, compliance, and vendors. Most companies are leaking in two or three of these and can only name one. The audit is how you find out which.`

**Supporting bullets (locked pack):**
- We build around your current ecosystem.
- We integrate with the tools you already use every day.

### 7.2 One-line framing of the argument

Directly under the hero, one short paragraph:

> These are not seven products. They are the seven places where context breaks between people and systems — and broken context is why most AI work produces nothing. Each panel below says what breaks, what we install, and what you would see change.

### 7.3 The seven layers

Build as tabs on desktop, accordions on mobile (§11.3). Each panel follows the same four-part shape so they are scannable and comparable. Every panel has a stable id for deep links.

---

#### Layer 1 · Go-to-market / sales — `#gtm`

**Outcome (locked):** More meetings and revenue, clearer pipeline.

**What breaks:**
- A lead comes in after hours and waits until tomorrow. By then they've booked someone else.
- Nobody can say how many leads last month turned into quotes, or where the rest went.
- Follow-up depends on whoever remembers. The quote that needed one more nudge never got it.

**Why it costs more than it looks:** Harvard Business Review's study of inbound lead handling found firms that made contact within an hour were nearly **7× more likely to qualify the lead** than those who waited one additional hour — and **60× more likely** than those who waited a day. Among companies that responded at all, the average response took 42 hours. **23% never responded.** The research is from 2011; the behaviour has not improved since, and your customer's patience has not increased.
*Source: Harvard Business Review, "The Short Life of Online Sales Leads," Mar 2011.*

**What we install:** Capture on every channel you actually get leads on, including after hours. Response that doesn't wait for a person to be free. One pipeline view where a lead's state is visible without asking anyone. Follow-up that continues on its own until someone answers or the lead is closed.

**What you'd see change:** Time-to-first-response, measured rather than estimated. Leads per month and what happened to each. Quote-to-close, visible without a meeting about it.

**Deeper:** this layer has its own page — [Marketing](/marketing) covers getting found in the first place.

---

#### Layer 2 · Operations — `#operations`

**Outcome (locked):** Cut time on simple repeat work.

**What breaks:**
- The same information gets typed into a second system because the two don't talk.
- Scheduling, reminders, and status updates each need a person to push them.
- Work sits in a queue whose only index is one person's memory.
- Every exception routes to the owner, so the owner is the ceiling.

**What we install:** The handoffs between systems you already own, so information is entered once. Scheduling, reminders, and status updates that fire without being chased. A visible queue with an owner and a state, so nothing lives only in someone's head. Exceptions routed by rule, so only the genuine ones reach you.

**What you'd see change:** Hours per week on repeat work, counted before and after. How many things wait on you specifically. How long a typical job sits between steps.

**Note for the builder:** the locked grid carries a percentage range for this layer. It is deliberately omitted here pending §13 item 3. **Do not restore a number to this panel until it has a source.**

---

#### Layer 3 · Second brain — `#second-brain`

**Outcome (locked):** Adaptive AI agent CRM + knowledge base — context for the team and the customer.

**What breaks:**
- A customer explains their situation again because the person who knew it isn't there.
- "How do we handle this?" is answered by asking whoever did it last.
- The answer exists — in an email, a text thread, or someone's head — and cannot be found.
- When someone leaves, a working part of the business leaves with them.

**Why this is the layer that decides whether the rest works:** This is exactly what MIT identified as the failure point. *"The lack of memory and feedback loops keeps GenAI stuck as a productivity enhancer, not a workflow transformer."* A tool that can't remember your customer is a faster way to start from scratch. Separately, McKinsey's classic finding put nearly **20% of the workweek** on looking for internal information or tracking down the colleague who knows.
*Sources: MIT NANDA, State of AI in Business 2025, Jul 2025. McKinsey Global Institute, The social economy, Jul 2012.*

**What we install:** One customer record with the history attached, so context survives the person. A knowledge base built from how your business actually answers things, not a generic template. An agent layer over both, so the answer arrives in the workflow instead of requiring a search. Feedback, so corrections make it better rather than being repeated.

**What you'd see change:** How long it takes a new person to answer a customer question correctly. How often a customer has to repeat themselves. How much of the business is recoverable when someone is out.

---

#### Layer 4 · People / training — `#people`

**Outcome (locked):** Faster ramp, consistent playbooks.

**What breaks:**
- Training is shadowing, so quality depends on who trained them.
- The playbook is out of date, or was never written, or exists as a folder nobody opens.
- Your best person is also your trainer, so growth costs you your best person's output.

**Why it's worth installing:** Gallup found only **12% of employees strongly agree their organization does a great job of onboarding.** Almost nobody is good at this, which means it is available as an advantage.
*Source: Gallup, "Why the Onboarding Experience Is Key for Retention."*

**What we install:** Playbooks generated from how your team actually does the work, kept current because they're wired to the second brain rather than maintained by hand. Onboarding that doesn't consume your best person. Answers available to a new hire at the moment they need them.

**What you'd see change:** Days until a new hire works unsupervised. Consistency between people doing the same job. How much of your best person's week is spent teaching.

---

#### Layer 5 · Finance — `#finance`

**Outcome (locked):** On-time invoices; booked vs collected clear.

**What breaks:**
- Invoices go out late because invoicing waits on someone finishing something else.
- Nobody chases an overdue invoice until it's badly overdue.
- Booked and collected are different numbers and you only have one of them.
- The month is understood in arrears.

**Why it's usually worse than owners think:** Intuit QuickBooks' 2026 report found nearly **3 in 5 small businesses (59%) have invoices more than 30 days overdue** — up from 47% the year before — with **$17.7K** outstanding on average, and **39% said a single late payment made it hard to cover payroll or bills** in the past year. This is a cash-timing problem, not a sales problem, and it is fixable with sequencing rather than selling more.
*Source: Intuit QuickBooks, 2026 Small Business Late Payments Report, Jul 2026.*

**What we install:** Invoicing triggered by the work being done rather than by someone remembering. Follow-up on overdue invoices that runs without a person deciding to be the bad guy. Booked versus collected, both current, in one view.

**What you'd see change:** Days from work complete to invoice sent. Days from invoice to payment. The gap between booked and collected, visible weekly.

---

#### Layer 6 · Compliance — `#compliance`

**Outcome (locked):** Audit trail and access in the workflow.

**What breaks:**
- Proving who did what and when means reconstructing it from texts and memory.
- Access is whatever accumulated — including for people who left.
- The compliance step is a separate chore, so it gets skipped under pressure.
- Regulated data lives in whatever channel was convenient.

**What we install:** The record produced as a by-product of the work, rather than as a second task. Access by role, reviewed, and actually revoked on exit. Required steps in the workflow, so compliance is the default path. For clinics and regulated work: **we audit, and we do not install on patient texts or patient records without a BAA.** That is a hard line.

**What you'd see change:** How long it takes to answer "show me what happened on this job." Whether access matches the current roster. Whether the required step is skippable under pressure.

---

#### Layer 7 · Vendors / partners — `#vendors`

**Outcome (locked):** Tracked referrals, consistent briefings.

**Scope note for the builder — important:** this layer is about **coordination with the vendors, subcontractors, and referral partners you work with.** It is **not** procurement, not sourcing, not group purchasing, and not spend analysis. All of that has come off the site (§12.1). Nothing in this panel may imply Rockwall negotiates vendor pricing.

**What breaks:**
- A referral goes out to a partner and nobody ever learns what happened to it.
- Referrals coming in get handled inconsistently, so the partner stops sending them.
- Every subcontractor gets briefed from scratch, differently each time.
- You can't tell which partner relationships actually produce work.

**What we install:** Referrals tracked both directions, with the loop closed so partners hear back. A consistent briefing package so subs and partners get the same information every time. A view of which relationships produce work and which are ceremonial.

**What you'd see change:** Referrals sent and received, with outcomes. Whether partners get closure. Which relationships are worth your time.

### 7.4 Closing CTA

**Kicker:** `Where to start`
**H2:** `You don't install seven layers. You install one.`
**Lead:** `The audit ranks them for your business and names the one that pays back first. Most companies are leaking in two or three and can only name one — which is usually not the expensive one.`
**Primary:** `Book the free 20-minute audit` → `/contact` · **Ghost:** `Take the self-check first` → `/how-it-works#self-check`

---

## 8. Marketing — paste-ready revision

Keep the page (decision #8). Two problems to fix: at 356 words it is the thinnest page on the site, and it currently floats free of the seven-layer model. Position it as the deep version of Layer 1.

### 8.1 Hero — keep, with one added line

**Kicker:** `Marketing` · **H1 (keep):** `We help you get found.`
**Lead (keep):** `Google, the page, the follow-up. No menu of packages. No partner names.`
**New line under the lead:**
> This is the go-to-market layer, from the outside in. Getting found is the front half; what happens when they reach you is the back half, and both have to hold.

### 8.2 Intro — keep as live

Keep the existing "Most shops don't need a marketing department…" paragraph verbatim. It is the best-written paragraph on the site.

### 8.3 What we look at — keep four items, add substance

Keep all four steps and their copy. Add a cited band under the four.

**Kicker:** `Why the order matters`
**H2:** `Found, then answered. In that order, and the second one is where it usually breaks.`
**Body:**
> Most local marketing spend goes into the first half of the problem and assumes the second half is fine. It usually isn't — and traffic into a broken follow-up is more expensive than no traffic, because you paid for the lead and then lost it.
>
> Harvard Business Review's study of inbound lead handling found that among companies that responded at all, the average reply took **42 hours** — and **23% never responded.** Firms that made contact within the first hour were nearly **7× more likely** to qualify the lead than those who waited even one hour longer.
>
> That's why "the follow-up" is one of the four things we look at, and not an afterthought. Getting found and then not answering is the most expensive configuration available.

*Source: Harvard Business Review, "The Short Life of Online Sales Leads," Mar 2011.*

**If R8 clears human verification (§4), add:**
> And the shop is being judged before the call. BrightLocal's 2025 survey found 71% of consumers read reviews regularly while browsing local businesses, and 83% read them on Google — which is the same profile that decides whether you appear at all.

### 8.4 If you sell online — keep as live

Keep all four items verbatim, including the line about not putting a calculator or widget on this site. That line stays accurate under this pack: the self-check (§10) is a diagnostic, not a calculator, and it returns no dollar figures.

### 8.5 New closing block

**Kicker:** `What this is not`
**H2:** `No packages. No retainer for "visibility." No partner names.`
**Body:**
> There is no tier list on this page because the honest answer to "what does marketing cost" depends on which of the four things is broken. If your Google profile is wrong, that is a short conversation. If you are found fine and losing every after-hours lead, that is a different install.
>
> The audit tells you which. Then we install only what pays back.

**Primary:** `Book the free 20-minute audit` → `/contact` · **Ghost:** `See all seven layers` → `/what-we-install`

---

## 9. Illustrative walkthroughs — the examples you asked for

Four composites. These are where the site stops describing and starts showing, and they are the main answer to "add more examples."

### The labelling rule — non-negotiable

Every walkthrough ships inside a container carrying this exact line, visible, not in fine print, not behind a disclosure:

> **Illustrative example.** A composite written to show how the work goes. Not a client, and no results claimed.

**If that label is removed, the content becomes a fabricated case study.** Any builder who can't keep the label should delete the walkthrough instead. Suggested implementation: `.illustrative` wrapper with a clay left border and the label as the first child — reuse `.scorecard`'s `border-left: 4px solid var(--clay)` treatment so it reads as a distinct kind of block on sight.

Recommended placement: one on the homepage (Home services), the rest on `/what-we-install` under the layer each one leads with.

---

### 9.1 Home services — a Tuesday, before and after · leads with Layer 1

**Setup:** Four trucks, one owner, one office manager. Repair and replacement. The owner still quotes everything.

**Tuesday now**
> 7:10am — Three voicemails and two web forms from overnight. The office manager starts at 8.
> 8:20am — She works the list. Two of the five have already booked someone else.
> 11:00am — A homeowner calls for a quote on a replacement. It goes on the owner's list. The owner is under a house.
> 2:30pm — A tech needs a part number and calls the owner, who is with a customer.
> 4:45pm — Two quotes from last week haven't been followed up. Nobody is sure whether anyone called.
> 6:00pm — Phones roll to the form that says "we'll reach out next business day."
> 9:30pm — The owner writes three quotes at the kitchen table.

**What the audit would rank first:** not the quoting. The overnight leads. Five inbound, two gone before anyone picked up the phone — a loss that never appears in any report, because a lead that was never answered doesn't become a record of anything.

**Tuesday after a focused install**
> Overnight — Each inbound gets an immediate acknowledgement with a real next step, on whichever channel it came in on. Nothing sits until 8am.
> 8:00am — The office manager opens one list, already ordered by urgency and value, with history attached.
> 11:00am — The replacement request gets a same-morning site visit booked. The owner still writes the quote; he just isn't the bottleneck for scheduling it.
> 2:30pm — The tech gets the part number from the second brain instead of the owner's phone.
> 4:45pm — Last week's open quotes have each had two automatic touches. Two replied.
> 6:00pm — After-hours capture on the number they already have, with a path that matches what the site promises.
> 9:30pm — The owner writes quotes. Fewer of them, and none of them were the first contact.

**What gets measured:** time to first response. Leads answered versus leads received. Quotes followed up. Hours after 6pm.

**The honest part:** the owner still quotes. That was never the first install, because it pays back slower than the thing that was losing two leads a night.

---

### 9.2 Retail showroom — the floor and the web leads · leads with Layer 3

**Setup:** One furniture showroom. Six on the floor, commission. Web leads and walk-ins.

**What breaks:** A web lead arrives and lands in a shared inbox that belongs to everyone, which means it belongs to nobody. A customer who spent forty minutes with someone on Saturday comes back Wednesday and has to start over with a different salesperson, who doesn't know what they looked at or what was quoted. Whether anyone follows up depends on who's slow that afternoon.

**What the audit would rank first:** the second brain, not the lead routing. Routing a lead to a person who can't see the history just moves the restart.

**What gets installed:** one customer record the floor can see, with what they looked at, what was quoted, and what was promised. Web leads assigned by rule with a clock on them. Follow-up that continues on its own until someone answers.

**What gets measured:** how often a returning customer repeats themselves. Web leads with an owner and a response inside the hour. Close rate on returning visits versus first visits.

---

### 9.3 Professional office — the person with a client is the person who follows up · leads with Layer 2

**Setup:** An insurance office. Owner plus three. Renewals, new policies, service requests.

**What breaks:** The same person who is with a client is the person responsible for following up with the last one. So follow-up happens in the gaps, and the gaps are where renewals get missed. Renewal dates live in a spreadsheet someone remembers to open. When someone is out, their book is effectively unattended.

**What the audit would rank first:** the renewal calendar, because the money is already won and being lost through timing — the cheapest revenue in the building.

**What gets installed:** renewals that surface themselves on a schedule rather than being looked up. Service requests with a state and an owner instead of living in an inbox. Enough shared context that someone else can cover a book for a week.

**What gets measured:** renewals contacted before the deadline. Service requests older than 48 hours. What happens to the queue when one person is out for a week.

---

### 9.4 Established multi-location company — the second door · leads with Layers 3 and 6

**Setup:** Three locations, around sixty people, a real management layer. This is the company in Card B of the fork. It is not stuck — it is running in pieces.

**What breaks:** Each location has evolved its own version of the same process, so the same question gets three answers. Reporting is assembled by hand every month, which means the number arrives too late to act on and nobody fully trusts it. Two AI tools were bought last year; one gets used by the team that championed it and the other quietly lapsed. Nobody can show who did what on a job from six months ago without a hunt.

**Why the tools didn't stick:** they didn't connect to the systems people already lived in, and they didn't remember anything between sessions — which is the failure mode MIT identified in 95% of the pilots it reviewed. It was not a training problem, and buying a third tool would produce the same result.

**What the audit would rank first:** the second brain and the audit trail together, because everything else is downstream of three locations not sharing a picture.

**What gets installed:** one customer and job record across all three locations. One definition of each core process, with the variations that are genuinely local kept deliberately and the rest converged. Reporting produced as a by-product of the work instead of assembled monthly. The record generated as work happens, so "show me what happened" is a query and not a project.

**What gets measured:** how long the monthly number takes to produce and whether anyone overrides it. Process variance between locations. Time to answer an audit request. Adoption of what got installed, which is the number that predicts whether any of it lasts.

*Sources for the MIT reference: MIT NANDA, State of AI in Business 2025, Jul 2025.*

---

## 10. The self-check — full build spec

The one piece of real interactivity (decision #5). Lives at `/how-it-works#self-check`, linked from the homepage.

### 10.1 What it is and is not

| It is | It is not |
| --- | --- |
| Eight questions, ~90 seconds | A lead-capture form |
| Ranks the seven layers for this visitor | A score gated behind an email address |
| Runs entirely in the browser | A calculator — it outputs **no dollar figures, ever** |
| A preview of how the audit works | A chatbot, or anything conversational |
| Honest that it is not the audit | A replacement for the audit |

**Three hard constraints.** §5.7 and §6.7 promise these in writing, so breaking one makes the site's own copy false:
1. **No email gate.** Results appear immediately on the page. No address is requested before, during, or to see results.
2. **Nothing leaves the browser.** No network call, no analytics event carrying answers, no `localStorage`. State lives in a JS variable and dies on refresh.
3. **No dollar outputs.** This is what keeps it a diagnostic rather than the banned calculator. It never estimates savings, ROI, or revenue.

### 10.2 The eight questions

Each answer scores 0, 1, or 2 against one layer. Present one question at a time with a progress indicator.

**Q1 → Go-to-market.** When a new lead comes in — a form, a missed call, a DM — how long before someone actually responds?
- Within minutes, every time `0`
- Same day, usually `1`
- Next business day, or whenever someone gets to it `2`

**Q2 → Go-to-market.** Could you say right now how many leads you got last month and what happened to each one?
- Yes — it's in one place I can pull up `0`
- Roughly, if I went digging `1`
- No `2`

**Q3 → Operations.** Think about the work that repeats every week — scheduling, reminders, status updates, re-entering the same information. How much of it still needs a person to push it along?
- Very little. It runs on its own `0`
- Some of it `1`
- Most of it `2`

**Q4 → Second brain.** When someone needs a customer's history, or needs to know how you handle something, where do they look?
- One system everyone trusts `0`
- A few places — depends who you ask `1`
- They ask me, or whoever did it last `2`

**Q5 → People / training.** A new hire starts Monday. How long before they can do the job without someone shadowing them?
- Days — the playbook does the work `0`
- A few weeks `1`
- Months, and it depends who trains them `2`

**Q6 → Finance.** Without asking anyone, do you know what you booked last month versus what you actually collected?
- Yes — both numbers, current `0`
- One of them, or both but out of date `1`
- No `2`

**Q7 → Compliance.** If a customer, an insurer, or an auditor asked you to show who did what and when on a job from six months ago, how long would that take?
- Minutes. It's in the record `0`
- A day of digging `1`
- I'm not sure we could `2`

**Q8 → Vendors / partners.** When a referral comes in from a partner, or goes out to one, does anyone track what happened to it?
- Yes, and the partner hears back `0`
- Sometimes `1`
- No `2`

### 10.3 Scoring

- Go-to-market: Q1 + Q2, max 4. Every other layer: one question, max 2.
- **Normalise before ranking** — GTM has two questions, so compare percentages, not raw totals: `score / maxForThatLayer`.
- Rank descending. Ties broken by this fixed order, which reflects what usually pays back first: Go-to-market → Operations → Second brain → Finance → People → Compliance → Vendors.
- Show the **top three**.

### 10.4 Result copy

**Heading:** `Where we would look first`

**Intro:**
> Based on your answers, these are the three layers we'd start with. This is a self-check, not the audit — the audit is where we put your actual numbers against it, and where you might disagree with the ranking. That disagreement is usually the useful part.

Then, for each of the top three, a card: the layer name, its position (1/2/3), one line on what your answers suggest, and a link to that layer's panel on `/what-we-install#<id>`.

**Per-layer result lines:**

- **Go-to-market** — "Leads are arriving and not being answered fast enough, or you can't see what happened to them. This is usually the cheapest thing on the list to fix and the most expensive to leave."
- **Operations** — "Repeat work still needs a person to push it. That's the layer where hours come back, and it's usually the one people underestimate."
- **Second brain** — "Context lives in people rather than in the business. Everything else is downstream of this — it's the layer that decides whether the others hold."
- **People / training** — "Ramp depends on who trains them, which caps how fast you can add anyone. Almost nobody is good at this, which makes it available as an advantage."
- **Finance** — "Money you've already earned is arriving late or isn't visible. This is a timing problem, not a sales problem, and it's fixable without selling more."
- **Compliance** — "The record is reconstructed after the fact rather than produced by the work. Fine until someone asks."
- **Vendors / partners** — "Referrals and partner work aren't tracked, so you can't tell which relationships actually produce anything."

**If all eight answers score 0** — show this instead of a ranking:
> **Nothing obvious is broken.**
> On these eight questions you look better than most. Either you've already done this work, or the bottleneck is somewhere eight questions can't reach. Both are worth twenty minutes, but neither is urgent — and if we look and find you don't need us, we'll tell you that.

**Footer under results:**
> `Copy my results` — puts the ranking on your clipboard so you can paste it into an email if you want to. Nothing was sent anywhere.
>
> **CTA:** `Book the free 20-minute audit` → `/contact` · `Restart the self-check`

The **Copy my results** button is how this converts without a gate: it hands the visitor something portable and lets *them* choose to send it. Do not replace it with a "email me my results" field.

### 10.5 Build notes

- **Vanilla JS in `script.js`.** No framework, no dependency. Roughly 120 lines. Keep the existing IIFE and add a guarded block so other pages are unaffected: `var sc = document.getElementById('self-check'); if (!sc) return;`
- **No-JS fallback:** render all eight questions as plain static content inside a `<noscript>` block, with the note: *"With JavaScript off, here are the eight questions. Answer them on paper — it works the same, and it's the same list we walk on the call."* Never a blank space.
- **Markup:** a `<form>` wrapper so radios group and keyboard behaviour is native. Prevent default on submit. `<fieldset>` + `<legend>` per question.
- **Accessibility:**
  - Radios, real `<label>`s, arrow-key navigation for free.
  - Progress as `<progress>` or `role="progressbar"` with `aria-valuenow`.
  - Result region `aria-live="polite"` and move focus to the result heading on reveal.
  - Back button between questions; answers stay selected when you go back.
  - No timing, no auto-advance. Auto-advance on radio select is hostile to screen readers and to anyone who misclicks.
- **Mobile:** one question per screen, tap targets ≥44px, no horizontal scroll at 400px.
- **Motion:** cross-fade between questions at ~150ms, wrapped in `@media (prefers-reduced-motion: reduce)` to disable.
- **Styling:** reuse `.scorecard` for the question card, `.btn-primary` / `.btn-ghost` for navigation, `.sheet-ranks` for the result ranking — all three already exist in `styles.css` and are currently unused.
- **Analytics, if any is ever added:** you may count *starts* and *completions*. You may **not** send answers or results. That distinction is the promise in §5.7.

---

## 11. UI upgrades — prioritised

Ordered by impact per unit of effort. Everything here works with existing design tokens — no new colour, no new font, no new dependency.

### 11.1 Fill the empty hero column · highest impact, lowest effort

The homepage hero is a two-column grid with one child (§1.4). Drop the "Two ways to start" card (§5.2) into the second column. `.scorecard` and `.scorecard-list` already style it. This is the biggest visible change on the site for roughly twenty lines of markup and no new CSS.

### 11.2 Revive the orphaned CSS instead of deleting it

`styles.css` carries ~60 lines of live rules no page uses: `.scorecard*`, `.scorecard-sheet`, `.keep-sheet`, `.sheet-head`, `.sheet-meta`, `.sheet-chips`, `.sheet-qs`, `.sheet-ranks`, `.sheet-close`, `.keep-matrix`, `.keep-days`. This pack reuses them:

| Orphan | Reused for |
| --- | --- |
| `.scorecard`, `.scorecard-list` | hero side card (§5.2), self-check question card |
| `.sheet-chips` | seven-layer chip row (§5.6) |
| `.sheet-ranks` | self-check results (§10.4) |
| `.accordion-*` (dies with vendor savings) | seven-layer panels on mobile (§11.3), FAQ (§6.8) |
| `.proof-strip` | cited research bands (§4) |

**Do not run a CSS purge before this is built** — it will delete exactly the rules the new pages need. Audit unused CSS *after* §5–§8 ship, not before.

### 11.3 Seven-layer tabs — the main interactive element

Desktop: real tabs. Mobile (<820px): accordions, using `.accordion-item` as-is.

- `role="tablist"` / `role="tab"` / `role="tabpanel"`; `aria-selected`; `aria-controls` / `aria-labelledby`.
- **Roving tabindex:** active tab `tabindex="0"`, others `-1`. Left/Right arrows move, Home/End jump to first/last.
- Each panel keeps a stable id (`#gtm`, `#operations`, `#second-brain`, `#people`, `#finance`, `#compliance`, `#vendors`) so the homepage chips and the self-check results can deep-link. **On load, read `location.hash` and open that panel.** Without this, every deep link in this pack lands on the wrong tab.
- Update the hash on tab change via `history.replaceState` — shareable, and no scroll jump.
- Active tab: 3px `--clay` bottom border, matching `.site-nav a[aria-current]`.
- **No-JS:** all seven panels render open and stacked. Never seven headings with hidden content.

### 11.4 Sticky in-page sub-nav on long pages

`/what-we-install` will be long. Under the main header, a second sticky bar with the seven layer names, highlighting the one in view.

- `position: sticky` at the header's height. Header is `z-index: 40`; give this `30`.
- Scroll-spy via `IntersectionObserver` (not a scroll listener) with `rootMargin` accounting for both sticky bars.
- Horizontally scrollable on mobile, with `overflow-x: auto` and no page-level horizontal scroll.
- Hide it entirely under 640px if it competes with the nav toggle — the accordions are their own navigation there.

### 11.5 Before/after toggle on the walkthroughs

The Tuesday walkthroughs (§9.1) are the most engaging content in this pack, and a toggle makes the comparison the interaction instead of a wall of text.

- Two buttons — `Tuesday now` / `Tuesday after` — as a real tab pair, same a11y as §11.3.
- **Both panels must be in the DOM and readable with JS off.** Render stacked with visible headings as the fallback.
- Keep the timestamps aligned between states so the eye can compare rows. This is where the content does its work.
- No slider, no drag, no auto-play.

### 11.6 Scroll reveal — restrained

Sections fade up ~12px over ~400ms as they enter. `IntersectionObserver`, one-shot, `unobserve` after firing.

Non-negotiable:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```
And set the visible state as the default in CSS, adding the hidden state with JS — so a JS failure leaves content visible rather than a permanently blank page. This is the single most common way scroll-reveal breaks a site.

### 11.7 Industry filter on the walkthroughs

Four chips — `Home services` · `Retail` · `Office` · `Established` — filtering which walkthrough shows. Use `el.hidden`, not `style.display`. Default: all visible, no filter applied. `aria-pressed` on each chip.

### 11.8 Cited research bands

Reuse `.proof-strip` for the stat, and add `.source-line` beneath:

```css
.source-line {
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-mute);
  margin-top: 10px;
}
.source-line a { border-bottom: 1px solid currentColor; }
```

Every source link gets `target="_blank" rel="noopener"`.

### 11.9 Deliberately not recommended

| Idea | Why not |
| --- | --- |
| Count-up animated numbers | The only numbers on the site are other people's research. Animating a cited statistic reads as showmanship and undercuts the sourcing. |
| A savings / ROI calculator | Banned, and it would require invented multipliers. The self-check is the honest version. |
| Chatbot or "ask our AI" | Banned. Also directly contradicts "AI is the back office. It is not the person you talk to." |
| Dark mode | The site is deliberately warm paper and navy. Doubles the QA surface for no gain. |
| Testimonial carousel | There are no testimonials. An empty carousel is worse than an empty shelf. |
| Animated gradient / glow in the hero | "Purple AI glow" is banned and the ban is correct — it's the visual cliché of the category Rockwall is arguing against. |
| Video background | Weight, motion-sickness risk, and nothing to show. |
| Page-load spinner or preloader | Static HTML. Adding a loader makes a fast site feel slow. |

---

## 12. Technical fixes and cleanup

### 12.1 Removing all GPO / vendor-savings material (decision #6)

Not just deleting a file. Every one of these touches it:

| File | Action |
| --- | --- |
| `vendor-savings.html` | Delete — **after** `/what-we-install` is live (§1.3). |
| `_redirects` | Remove `/savings /vendor-savings 301`. Add `/vendor-savings / 301` and `/vendor-savings.html / 301` so existing links and any indexed URL don't 404. |
| `index.html` | Remove the "Vendor savings" card from the four-card CTA grid; replace with "What we install" (§5.6). Remove `vendor-savings` from the nav. |
| `how-it-works.html` | Remove the `Vendor savings` ghost button in the closing CTA. Remove the "Vendor savings is a separate conversation" line. |
| `contact.html` | Remove the vendor-savings mailto link, the `savings` option from the `#interest` select, and the "What about vendor savings?" FAQ entry. |
| `marketing.html`, `agents.html`, `teardown.html` | Remove `vendor-savings.html` from the nav in each. |
| `script.js` | Remove the `isSavings` branch and the `"Vendor savings analysis"` subject. Remove `"#savings": "vendor-savings.html"` from `homeHashMap`. |
| `styles.css` | Nothing to remove — `.accordion-*` and `.proof-strip` are reused (§11.2). |
| `llms.txt` | Remove the "Vendor savings analysis" subject line. Update the page list. |
| `README.md` | Remove `vendor-savings.html` from Files. |
| Footer on every page | `vendor-savings.html`'s footer carries the GPO legal disclaimer. Make sure the shared footer keeps only the privacy line — **check that the GPO disclaimer wasn't copied into other pages' footers.** |
| `contact.html` + all pages | `.privacy` reads "…handle the assessment request or start a spend analysis." Change to "…handle your audit request." |

**Grep to confirm nothing survives:**
```
grep -rin 'vendor\|gpo\|savings\|invoice\|spend analysis\|procurement' --include='*.html' --include='*.md' --include='*.txt' --include='*.js' --include='_redirects' .
```
Expected remaining hits after cleanup: the word "invoice" in Layer 5 (§7.3, finance — legitimate), and the QuickBooks citation. Nothing else.

### 12.2 "Assessment" → "audit" (decision #9)

Every occurrence, including places that are easy to miss:

- `<title>` and `<meta name="description">` on all pages
- `og:title`, `og:description`, `twitter:title`, `twitter:description`
- JSON-LD `description` on `index.html` and `agents.html`; the `HowTo` name and step text on `how-it-works.html`
- Nav link label: `Request an assessment` → `Request an audit`
- Every button: `Request the free assessment` → `Book the free 20-minute audit`
- `mailto:` subject params in `contact.html` — **see the caveat below**
- `script.js`: the `subject` and `ask` strings
- `llms.txt` and all five `.md` twins
- `#interest` select option text

**Caveat worth one decision (§13):** the mailto subject `Free 20-minute assessment` may be wired into inbox filters or labels. Changing it silently breaks that routing. Either update the filters at the same time, or keep the subject string for one cycle while the visible copy changes. Don't discover this after the fact.

### 12.3 Fix the two broken links

- `agents.html:103` — remove the `<a href="scorecard.html">Scorecard</a>` link. The scorecard is not a page; it is the artifact filled on the call. Rewrite as "…after the scorecard we fill on the call." Keep the `how-it-works.html` link.
- `script.js:12–13` — change `"how.html"` → `"how-it-works.html"` and `"how.html#bottlenecks"` → `"how-it-works.html#bottlenecks"`. Removes a double-redirect and stops the hash being dropped.

### 12.4 Replace the fragile stripe selector

Before writing any new markup, replace:
```css
.section:nth-of-type(even) { background: var(--paper-deep); }
```
with an explicit class:
```css
.section-alt { background: var(--paper-deep); }
```
and apply `class="section section-alt"` deliberately. Otherwise every inserted section flips the banding for everything below it (§1.10) and the builder will spend a day chasing it.

### 12.5 Make the contact form actually work

Current state fails silently on mobile and when JS is off (§1.8). Pick one:

- **Option A — Cloudflare Pages Function.** Already on Cloudflare. A function at `functions/api/audit.js` accepting a POST, emailing via a provider, returning a real success page. Progressive enhancement: `<form method="post" action="/api/audit">` works with JS off. **Recommended.**
- **Option B — hosted form service** (Formspree, Basin, Web3Forms). Fastest; adds a third party and a privacy-policy line.
- **Option C — keep mailto, but fix the failure mode.** Keep the current behaviour and add: a visible fallback block showing the email address and a **Copy the details** button, revealed a second or two after submit — *"If your email app didn't open, copy the details and send them to anthony@rockwallpartners.com."* Cheapest honest fix. Do this even if A or B ships later, as the belt-and-braces path.

Also: add a `<label>`-associated honeypot field, and keep `autocomplete` attributes as-is (they're already correct).

### 12.6 Add the booking link

`#open-calendar` has never rendered because `data-booking-url` is empty (§1.7). Put a real Cal.com or Calendly URL in it and the existing JS reveals the button with no code change. **This is the highest-value single change on the site** — it takes the primary CTA from a two-touch email exchange to a booked slot.

If there will be no booking URL, remove the button and the JS branch rather than shipping permanently dead markup.

### 12.7 Schema and machine readability

- **`FAQPage` JSON-LD** on `how-it-works.html` for §6.8 — the FAQ block is the strongest structured-data opportunity on the site and it currently has none.
- **Update the `HowTo`** on `how-it-works.html`: it describes the old four steps. Either rewrite it for the two routes or replace it with `FAQPage` + `Service`. Leaving a stale `HowTo` is worse than having none.
- **`llms.txt`:** add `/what-we-install`, remove vendor savings, update the offer line to the two audit routes, and keep the guardrail block — it's genuinely useful and ahead of the curve.
- **Create `what-we-install.md`** as the twin for the new page, matching the existing pattern.
- **`_redirects`:** add `/what-we-install.html /what-we-install 301` for consistency with the others.
- **Keep `teardown.html` disallowed in `robots.txt`** (decision #4).

### 12.8 Performance and housekeeping

- Google Fonts loads Archivo at **six weights** plus IBM Plex Mono at three. Audit which are actually used; each unused weight is a wasted download on a render-blocking request. `700` and `900` plus `400`/`500` likely cover it.
- Add `width` and `height` to the four `photo-*.jpg` cards (`owner.jpg` already has them) to stop layout shift.
- Consider `font-display: swap` — already implied by `&display=swap`, so this is fine as-is.

---

## 13. Open items — need Anthony's decision

I could not resolve these from the documents or the code. Each one changes what ships.

**1. `.kicker` versus the "kicker eyebrows" ban.** The v3.1 off-list bans them; the live site uses them ~25 times and `styles.css` styles them as a first-class element (§1.11). I have kept them. If the ban is literal, say so — it means restyling every page, and the copy above needs its kickers folded into headings.

**2. Is there a booking URL?** §12.6 is the highest-value change available and it is blocked on one string. Cal.com or Calendly, either is fine. If the answer is no, I'll remove the dead button.

**3. The unsourced percentage range in the locked grid.** *"Cut time on simple repeat work ~40–50% (sometimes ~90%)"* (§1.12). Three options:
   - **(a) Source it.** If it came from real delivered work, say which engagements and over what period, and it can ship as "on the work we've done" with that scope stated.
   - **(b) Reframe as a target, not a result.** "We scope installs to take 40–50% of the time out of simple repeat work" is a statement of intent, not a performance claim. Defensible.
   - **(c) Remove the number.** What the panel loses in punch it gains in not being the one claim on the site a competitor can screenshot.
   **My recommendation: (b),** unless (a) has real data behind it. What ships today: nothing, until you choose.

**4. Mailto subject strings.** Do any inbox filters or labels depend on `Free 20-minute assessment` / `Vendor savings analysis`? If yes, update the filters in the same pass as §12.2, or hold the subject strings for a cycle.

**5. Form backend.** A, B, or C in §12.5. This needs a decision because C alone leaves a known silent-failure path on the only conversion route.

**6. Does the paid audit need a name?** Calling both routes "audit" and distinguishing them by price works, but "Route B" is not a name a customer repeats. Something like "working session" would be more memorable. Not blocking — flagging because naming is cheap now and expensive later.

**7. Two things declined this pass, worth revisiting.** `teardown.html` is 535 words of real desk research on 12 shops, currently noindexed and off-nav — the only genuine primary research the site owns, and it is hidden. And the owner section is one paragraph carrying the entire trust burden (§1.5). Both stay as they are per decision #4. Both remain the two largest untapped assets on the site.

**8. Does `/agents` stay?** It is off the customer nav by design, and `llms.txt` plus the `.md` twins now cover the same ground more cleanly. It also contains the broken scorecard link. Keeping it is fine; just noting it is now the third mechanism for the same job.

---

## 14. Guardrails — updated

The locked banned list, carried forward with additions from this pass. **Still banned:**

Meeting Engine lead · prices or dollar figures for Rockwall's own services · invented metrics, case studies, or client results · "ops." as an abbreviation · any implication that the free audit requires buying the paid one · the word "dysfunctional" · purple AI glow · brochure-only feel · street address · Paraclete · Rampart · chatbot or "ask our AI" · calculator · fake or borrowed logos · testimonials that don't exist.

**Added by this pack:**

- **No GPO, procurement, sourcing, or spend-analysis language anywhere**, including inside Layer 7 (§7.3). Layer 7 is partner coordination, not purchasing.
- **No statistic that isn't in §4**, with its source visible and linked on the page.
- **No `[ILLUSTRATIVE]` content without its visible label** (§9). Delete rather than ship unlabelled.
- **No email gate, no stored answers, and no dollar output on the self-check** (§10.1). The site promises this in writing.
- **No implied Rockwall success rate.** The 95% statistic describes other people's pilots. "We're the 5%" is an invented claim.
- **Don't imply the MIT figure was measured on small businesses.** It was enterprise deployments. Attribute it plainly.
- **Don't restate the McKinsey 20% as "your team."** It is a 2012 finding about "interaction workers." Frame it as the classic finding it is.
- **Date any statistic older than two years on the page itself** (R4 2011, R7 2012). Undated old data reads as deception when someone checks.

---

## 15. Build order

Sequenced so the site is never worse than it is today.

**Phase 1 — fix what's broken. No new content. Half a day.**
1. §12.4 stripe selector — do this first, everything else writes markup on top of it.
2. §12.3 both broken links.
3. §12.5 option C at minimum, so the form stops failing silently.
4. §12.6 booking URL, if item 2 in §13 has an answer.

**Phase 2 — build the replacement before the removal. The main content lift.**
5. `/what-we-install` (§7), with §11.3 tabs.
6. Home: hero side card (§5.2), the fork (§5.3), the argument (§5.5), layer preview (§5.6).
7. `/how-it-works` rewrite (§6) including the two routes and the twenty-minute breakdown.
8. Two walkthroughs (§9.1, §9.4) with their labels.

**Phase 3 — remove GPO. Only once Phase 2 is live.**
9. All of §12.1.
10. All of §12.2 vocabulary.
11. §12.7 schema, `llms.txt`, the new `.md` twin.

**Phase 4 — the interaction layer.**
12. The self-check (§10).
13. §11.5 before/after toggles, §11.4 sticky sub-nav, §11.6 scroll reveal, §11.7 industry filter.
14. Remaining walkthroughs (§9.2, §9.3), §8 Marketing revision.

**Phase 5 — polish.**
15. §12.8 fonts and image dimensions.
16. CSS audit — **after** everything above, never before (§11.2).
17. Check every page at 400px. Check the whole site with JS disabled: every tab panel open, every walkthrough readable, the self-check showing its eight questions, no blank sections.

### What this does to the numbers

| | Now | After |
| --- | --- | --- |
| Customer-facing pages | 4 | 4 (one swapped) |
| Body words across them | 1,469 | ~4,500–5,000 |
| Pages over 800 words | 0 | 3 |
| Interactive elements off the deleted page | 0 | tabs, self-check, before/after toggles, filter, FAQ |
| Cited sources | 0 | 6–8, all linked |
| Worked examples | 0 | 4, labelled |
| Ways to book | 0 | 1 real booking link + a form that doesn't fail silently |

The site stops being a brochure and becomes something a prospect can actually study — without a single invented number, client, or logo.

---

*Prepared 12 Sep 2026 against commit `87318f2`. Locked hero, subhead, AI-native lines, and v3.1 bridge paragraph reproduced verbatim and unchanged.*
