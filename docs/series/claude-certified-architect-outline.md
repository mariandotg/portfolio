
# Claude Certified Architect Notes — Series Outline

Status: **draft for review**. No notes are written yet. This document proposes
the arc; nothing here is committed to `src/content/notes/` or
`src/content/series/*.json`.

Series id in code: `claude-certified-architect` (per MDG-38's rename of
`cloud-certified-architect.json`). `rootLevel: true`, so the series will live
at `/claude-certified-architect`, not `/notes/series/claude-certified-architect`.

---

## 1. Fuentes

All claims about the exam blueprint below trace to Anthropic's own exam guide,
found through the official certification landing pages. Consulted 2026-08-21.

| # | URL | What it is | What I pulled from it |
|---|-----|-----------|------------------------|
| S1 | `https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request` (redirects to S2) | Anthropic's certification enrollment entry point | Confirms the exam name (CCAR-F), links to the exam guide PDF |
| S2 | `https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification` | Anthropic Partner Academy certification page | Fee ($125), the three linked PDFs (exam guide, terms, exam policy) |
| S3 | `https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542750%2FClaude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf` | **The official Exam Guide PDF, v1.0, effective July 2026** — the authoritative reference per Anthropic's own text | Everything in §3 below: domain weights, task statements, in/out-of-scope topics, scenarios, sample questions, scoring, policies |
| S4 | `https://www.pearsonvue.com/us/en/anthropic.html` | Pearson VUE's Anthropic certification hub | Confirms delivery via Pearson VUE, lists the four certifications (CCAR-F, CCAR-P, CCAO-F, CCDV-F) |

S3 is the source for essentially every technical claim in this outline — it is
Anthropic's own exam blueprint, not a third-party summary. I found it by
following the "Exam Guide (PDF)" link on S2, not by trusting search-result
snippets. Everything under "Outline de la serie" and its bullet points below
is grounded in S3's domain weights (§4), task statements (§6), and appendix
scope lists (§17) unless flagged otherwise in §2.

I also ran web searches that surfaced third-party study guides (freeCodeCamp,
Udemy, dev.to, tutorialsdojo, claudecertificationguide.com, and others). I did
not use any of them as a source for this outline — once S3 was found, it
superseded them as the authoritative reference. They're mentioned here only
for transparency about the research path, not as citations.

---

## 2. Huecos

Things I could **not** verify from S1–S4, or that are my inference rather than
sourced fact:

- **Whether Mariano has registered for, scheduled, or sat the exam.** Not
  determinable from public sources — this is personal status only Mariano
  knows. Note 8 (the closing post) assumes he takes the exam during the
  series; if that doesn't happen, Note 8's premise needs to change before
  it's written.
- **The CCAR-P (Professional) tier's content.** S3 covers only CCAR-F
  (Foundations). The Professional exam is named in S4 but I found no public
  blueprint for it. I did not build any note around it.
- **Whether Claude Code CLI details in S3 (flag names, `/memory`, `/compact`,
  `--resume`, `fork_session`) still match the live CLI at the time each note
  is actually written.** S3 states the guide is "subject to change without
  notice" and that Anthropic may require recertification if exam content
  changes significantly — implying the underlying tooling moves faster than
  the exam guide's revision cadence. This is a **known drift risk**, not a
  verified fact: whoever writes Notes 2–6 should spot-check current Claude
  Code docs against the specific CLI/config claims before publishing, rather
  than copying S3 verbatim.
- **Anthropic Partner Network membership as a prerequisite.** S2's page text
  (as fetched) says training is "available to members of the Claude Partner
  Network," but the exam registration flow in S3 §11 does not gate
  registration on partner membership — it only affects the fee tier. I did
  not resolve this ambiguity; if it matters for Note 1 (who can actually sit
  this exam), verify directly at registration time rather than inferring
  from this outline.
- **Practical study-time estimate.** S3 recommends hands-on exercises (§8)
  but states no expected prep hours. Any claim in a future note like "budget
  N weeks for this" would be my invention, not Anthropic's — flagged here so
  it isn't slipped into a note as if sourced.

---

## 3. Outline de la serie

Eight notes. The first and last are `building-in-public` (personal framing —
deciding to sit the exam, then reporting the outcome); the five domain notes
and one bridging note in between are `engineering-notes` (durable technical
reference, matching the series' own stated purpose).

### 1 — Why I'm Taking Anthropic's Architect Exam

- **Title:** "Why I'm Taking Anthropic's Claude Certified Architect Exam"
- **Description:** Anthropic shipped a certification for people building production Claude systems — what it actually tests, and why I'm sitting it.
- **Slug:** `why-im-taking-claude-certified-architect`
- **Covers:**
  - What CCAR-F is and who it's for: a solution architect with 6+ months building with the Agent SDK, Claude Code, MCP, and the API (per S3 §2)
  - The five content domains and their exact weights: Agentic Architecture & Orchestration 27%, Tool Design & MCP Integration 18%, Claude Code Configuration & Workflows 20%, Prompt Engineering & Structured Output 20%, Context Management & Reliability 15% (S3 §4)
  - The exam's shape: 60 items, 4 of 6 possible scenarios, 120 minutes, scaled score cut at 720/1000 (S3 §3, §10)
  - Why I'm writing up each domain as I study instead of just sitting the exam cold
  - What this series will and won't do — no verbatim exam content (I signed the same NDA every candidate signs, S3 §14), just my own notes on the underlying material
- **Collection:** `building-in-public`

### 2 — The Agentic Loop, Without the Framework Ceremony

- **Title:** "stop_reason Is the Whole Interface: Building an Agentic Loop That Doesn't Cheat"
- **Description:** The agentic loop lifecycle, task decomposition, and session management — the mechanics every Agent SDK build depends on.
- **Slug:** `agentic-loop-fundamentals`
- **Covers:**
  - The loop lifecycle: send, inspect `stop_reason` (`tool_use` vs `end_turn`), execute, return results for the next turn (S3 Task 1.1)
  - Why parsing assistant text, or capping iterations, as the primary termination signal is an anti-pattern (S3 Task 1.1)
  - Prompt chaining (fixed sequential steps) vs dynamic decomposition (adaptive, discovery-driven) — and when each fits (S3 Task 1.6)
  - Splitting large reviews into per-file passes plus a separate cross-file integration pass, to avoid attention dilution (S3 Task 1.6)
  - Session management: named `--resume`, `fork_session` for divergent branches, and why a fresh session with an injected summary beats resuming with stale tool results (S3 Task 1.7)
- **Collection:** `engineering-notes`

### 3 — Coordinators, Subagents, and Hooks That Don't Ask Nicely

- **Title:** "Coordinators, Subagents, and the Hooks That Make Compliance Non-Negotiable"
- **Description:** Hub-and-spoke multi-agent patterns, explicit context passing via the Task tool, and why some rules belong in hooks, not prompts.
- **Slug:** `coordinator-subagent-hooks`
- **Covers:**
  - Hub-and-spoke architecture: the coordinator owns all inter-subagent communication, error handling, and routing (S3 Task 1.2)
  - Subagents don't inherit context automatically — what has to be passed explicitly, and the `AgentDefinition` config that scopes each subagent (S3 Task 1.3)
  - Parallel subagent execution (multiple `Task` calls in one response) vs sequential turns, and why `allowedTools` must include `"Task"` for a coordinator to delegate at all (S3 Task 1.3)
  - Programmatic prerequisites vs prompt-based guidance — blocking `process_refund` until `get_customer` returns a verified ID, because prompt instructions alone have a non-zero failure rate (S3 Task 1.4)
  - `PostToolUse` hooks for normalizing heterogeneous tool output, and tool-call interception hooks for enforcing hard limits (e.g., blocking refunds over a threshold) (S3 Task 1.5)
- **Collection:** `engineering-notes`

### 4 — Your Tool Descriptions Are the API

- **Title:** "Your Tool Descriptions Are the API — Most Are Underwritten"
- **Description:** Designing MCP tools Claude can actually reason about: descriptions, structured errors, tool_choice, and scoped access per agent.
- **Slug:** `mcp-tool-design`
- **Covers:**
  - Tool descriptions as the primary signal for tool selection — how minimal or overlapping descriptions cause misrouting between similar tools (S3 Task 2.1)
  - Structured error responses: `errorCategory` (transient/validation/permission), `isRetryable`, and why a generic "operation failed" blocks the agent from making a sound recovery decision (S3 Task 2.2)
  - `tool_choice`: `"auto"` vs `"any"` vs forcing a specific tool, and when forcing order actually matters (S3 Task 2.3)
  - Why an agent with 18 tools selects worse than one scoped to 4–5, and how to give narrow cross-role tools instead of blanket access (S3 Task 2.3)
  - MCP server scoping — project `.mcp.json` (shared, env-var credentials) vs user `~/.claude.json` (personal) — and MCP resources as content catalogs vs tools as actions (S3 Task 2.4)
- **Collection:** `engineering-notes`

### 5 — CLAUDE.md Has a Hierarchy Most Teams Don't Use

- **Title:** "CLAUDE.md Has a Hierarchy, and Most Teams Only Use One Layer of It"
- **Description:** Configuring Claude Code for a team: CLAUDE.md scoping, path-specific rules, skills, plan mode, and shipping it inside CI.
- **Slug:** `claude-code-configuration-workflows`
- **Covers:**
  - User vs project vs directory-level `CLAUDE.md`, why user-level settings never reach teammates, and the `@import` pattern for modular config (S3 Task 3.1)
  - `.claude/rules/` with YAML-frontmatter glob paths, for conventions that span directories (e.g. all `*.test.tsx` files) rather than living in one subdirectory (S3 Task 3.3)
  - Slash commands and skills: project-scoped (`.claude/commands/`, version-controlled) vs personal, plus skill frontmatter (`context: fork`, `allowed-tools`, `argument-hint`) (S3 Task 3.2)
  - Plan mode vs direct execution — the actual decision criteria (architectural scope, multi-file blast radius) rather than a gut call (S3 Task 3.4)
  - Running Claude Code in CI with `-p`, `--output-format json`, and feeding prior review findings back in to avoid duplicate PR comments (S3 Task 3.6)
- **Collection:** `engineering-notes`

### 6 — tool_use Kills the Syntax Bugs, Not the Semantic Ones

- **Title:** "tool_use Kills the JSON Parsing Bugs. It Doesn't Kill the Semantic Ones."
- **Description:** Structured output that survives production: explicit criteria, few-shot examples, schema design, validation-retry loops, and batch tradeoffs.
- **Slug:** `prompt-engineering-structured-output`
- **Covers:**
  - Explicit categorical criteria beats vague instructions like "be conservative" for cutting false positives (S3 Task 4.1)
  - Few-shot examples for ambiguous cases — why 2–4 targeted examples generalize better than more prose instructions (S3 Task 4.2)
  - `tool_use` + JSON schema eliminates syntax errors but not semantic ones — line items that don't sum, values in the wrong field (S3 Task 4.3)
  - Retry-with-error-feedback loops, and knowing when a retry can't succeed because the information simply isn't in the source document (S3 Task 4.4)
  - The Message Batches API: 50% cheaper, up to 24h processing, no multi-turn tool calling — right for overnight audits, wrong for anything blocking a merge (S3 Task 4.5)
- **Collection:** `engineering-notes`

### 7 — Context Doesn't Run Out Quietly

- **Title:** "Context Doesn't Run Out Quietly — It Degrades First"
- **Description:** Keeping long-running agents reliable: context extraction, escalation triggers, error propagation, and confidence calibration for human review.
- **Slug:** `context-management-reliability`
- **Covers:**
  - Progressive summarization risk: numeric values, dates, and stated expectations are the first casualties of condensing history (S3 Task 5.1)
  - The "lost in the middle" effect, and why key findings belong at the start of an aggregated input, not buried in it (S3 Task 5.1)
  - Escalation triggers that actually track complexity — explicit customer requests and policy gaps, not sentiment or self-reported confidence (S3 Task 5.2)
  - Structured error propagation across agents: distinguishing an access failure that needs a retry decision from a valid empty result (S3 Task 5.3)
  - Confidence calibration and stratified sampling for routing extractions to human review, because aggregate accuracy can hide poor performance on one document type (S3 Task 5.5)
- **Collection:** `engineering-notes`

### 8 — Exam Day and the Verdict

- **Title:** "I Sat the Claude Certified Architect Exam. Here's What Actually Mattered."
- **Description:** Five domains of notes later, the actual exam experience — what the scenario format rewards, and what I'd study differently.
- **Slug:** `claude-certified-architect-exam-result`
- **Covers:**
  - The scenario format in practice: which of the 6 possible scenarios came up, and how much scenario framing mattered vs raw domain recall (S3 §5)
  - Where the scaled score landed against the 720 cut, and what the per-domain percent-correct breakdown showed (S3 §10)
  - Which domain I under-prepared for relative to its exam weight
  - What I'd tell someone starting this series today, before they open the exam guide
  - The renewal path: a free non-proctored assessment within 12 months, vs a full retake at full fee if the credential lapses (S3 §15)
- **Collection:** `building-in-public`

---

## 4. Por qué ese orden

- **Note 1 before anything technical.** It sets the frame — the five domains
  and their weights — that every later note refers back to. Without it, a
  reader landing on Note 4 has no reason to know why MCP tool design is 18%
  of the exam rather than an aside.
- **Notes 2 and 3 split Domain 1 instead of merging it.** Domain 1 is the
  heaviest domain (27%) and its seven task statements split cleanly into two
  concerns: single-agent loop mechanics (1.1, 1.6, 1.7 — how one agent
  decides when to stop and how it carries state across turns) and
  multi-agent coordination (1.2, 1.3, 1.4, 1.5 — how several agents split
  work and where enforcement has to be deterministic). Cramming both into
  one note would either run long or shortchange the domain worth more than
  a quarter of the exam.
- **Note 4 (tool design) follows the agent notes, not the reverse.** Tool
  descriptions and MCP scoping only matter once there's a loop and a
  coordinator deciding *when* to call a tool — Note 4 assumes the reader
  already has Notes 2–3's mental model of the loop and subagent boundaries.
- **Note 5 (Claude Code config) comes after tool design, not before.**
  `.mcp.json` scoping (Note 4) and CLAUDE.md/skills scoping (Note 5) are
  siblings — both are "where does this live and who does it apply to"
  questions — but MCP is the more foundational integration point (it's how
  an agent reaches anything outside itself), so it's addressed first.
- **Note 6 (structured output) sits after the Claude Code note.** It reuses
  concepts introduced there — CI integration (`-p`, `--output-format json`)
  from Note 5 is the delivery mechanism for the structured output Note 6
  actually designs.
- **Note 7 (context & reliability) is last of the technical domains on
  purpose.** Every failure mode it covers — summarization loss, escalation
  miscalibration, error propagation — is a cross-cutting concern that only
  makes sense once the reader has seen the agent loop (Note 2), the
  multi-agent handoffs (Note 3), and the tool boundaries (Note 4) that
  generate the context being managed. It's the domain about *everything
  going wrong across the other four*, so it has to come after them.
- **Note 8 depends on all five domain notes existing.** It's the only note
  that can't be written independently — it reports against a blueprint the
  reader has already seen argued out in Notes 2–7, and its "what I'd study
  differently" section only has content once those study notes exist to be
  second-guessed.
