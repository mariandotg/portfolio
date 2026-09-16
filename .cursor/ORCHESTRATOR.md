# Orchestrator brief — design system batch (MDG-123 … MDG-137)

Paste the section below into a fresh agent in Cursor's Agents Window. The wave
table after it is the plan that brief refers to.

**Base:** `cursor-dispatch-setup`, branched from `main` after the CCA series
merged (PR #7). That merge matters — `src/components/notes/agent-loop` did not
exist on `main` before it, and MDG-130, MDG-131 and MDG-132 all operate on it.

Two other branches landed first so the batch starts on final ground:
`content/cca-series` (PR #7) and `worktree-skills-badges-sober` (PR #5, the
skill-badge palette). Nothing is in flight against `global.css` any more.

**One consequence to know:** PR #5 switched `Skills.astro` off
`PUBLIC_RESUME_DATA` and onto a fixed `WEB_SKILL_GROUPS` list. The site's Skills
section no longer follows the CV variant system, so MDG-136 must not try to
re-wire it.

---

## The prompt

> You are orchestrating a 15-ticket design-system refactor of this repo. You do
> not write code. You delegate each ticket to a `ticket-implementer` subagent,
> then to a `ui-reviewer` subagent, and you decide what merges.
>
> **Read first:** `docs/design/design-system.md` in full, then `.cursor/rules/`.
> The spec is the contract; the tickets are slices of it.
>
> **The tickets** are MDG-123 through MDG-137 in the Linear project `portfolio`.
> Each one carries a `Dispatch contract` block naming the directories it may
> touch. Read a ticket before dispatching it — do not work from its title.
>
> **The integration branch is `cursor-dispatch-setup`.** Every ticket branches
> from it and merges back into it. `main` stays untouched until the whole batch
> is verified; that final merge is mine, not yours.
>
> **Run the waves in `.cursor/ORCHESTRATOR.md`, in order.** Inside a wave, run
> the tickets in parallel, each in its own git worktree. Never start a wave
> until every ticket in the previous one is merged into the integration branch.
> The waves encode
> two constraints at once: the blocker graph in Linear, and which tickets write
> to the same directories. Reordering them will make two agents fight over
> `src/styles`.
>
> **Per ticket:**
> 1. Dispatch a `ticket-implementer` with the ticket body and its scope.
> 2. When it reports, dispatch a `ui-reviewer` on the resulting diff.
> 3. Read both reports. If the reviewer found something that blocks, send it
>    back to the implementer with the specific finding — do not fix it yourself
>    and do not merge past it.
> 4. When it is clean, merge it into `cursor-dispatch-setup`.
> 5. Move the Linear ticket to Done and comment the merge commit on it.
>
> **Between waves**, pull `cursor-dispatch-setup` into every live worktree
> before starting the next one. Wave N+1 assumes wave N's tokens exist.
>
> **Stop and ask me** — do not decide alone — when:
> - a ticket's premise is wrong, or the fix would break something it did not
>   anticipate;
> - two tickets in the same wave produce conflicting edits to one file;
> - MDG-127 is ready to merge (raising note prose to 16px in a 66ch column
>   changes the feel of every note — I approve that one by eye);
> - you reach MDG-135. It is HITL by design: four product decisions, no dispatch
>   contract. Do not implement it. Summarise the four questions and hand them
>   to me.
>
> **Report after each wave**: which tickets merged, which findings came back,
> and anything broken you found and left alone. Keep it short — I read diffs.

---

## Waves

Six waves. Never more than three agents at once, well under Cursor's cap of
eight. The bottleneck is not the cap, it is `global.css`.

### Wave 1 — substrate. Serial, one at a time.

| Order | Ticket | What | Why serial |
|---|---|---|---|
| 1 | **MDG-123** | Purge legacy crimson from notes | All three rewrite `src/styles/global.css` |
| 2 | **MDG-125** | Type scale + radius collapse | " |
| 3 | **MDG-124** | Semantic data palette | " |

All three are unblocked in Linear, which makes them look parallel. They are not.
123 first because it only deletes, leaving a cleaner file for 125 to restructure.

### Wave 2 — two in parallel

| Ticket | Scope | Needs |
|---|---|---|
| **MDG-126** | `src/components/notes` | 125 |
| **MDG-127** | `src/layouts`, `src/styles` | 125 |

**MDG-127 is the one to look at yourself.** It is the biggest perceptual change
in the batch.

### Wave 3 — three in parallel

| Ticket | Scope | Needs |
|---|---|---|
| **MDG-130** | `src/components/notes/agent-loop`, `src/lib/sim/agent-loop` | 124, 126 |
| **MDG-129** | `src/components/notes`, `src/components`, `docs` | 124 |
| **MDG-136** | `src/components/cv`, `src/styles` | 125 |

MDG-130 is the centre of the batch — the figure kit everything downstream uses.

*Soft edge:* 129 and 130 both sit under `src/components/notes`, but on disjoint
files (129 on the callout and comparison components, 130 on `agent-loop/`). If
you would rather not risk it, run 129 alone in wave 4 instead.

### Wave 4 — three in parallel

| Ticket | Scope | Needs |
|---|---|---|
| **MDG-131** | `src/components/notes` | 130 |
| **MDG-133** | `src/pages`, `src/components`, `src/lib` | 125 |
| **MDG-137** | `src/components/cv/ui`, `src/components/ui` | 136 |

*Soft edge:* same shape as wave 3 — 131 works in `agent-loop/`, 133 in the
series components. Disjoint files, overlapping declared scope.

### Wave 5 — three in parallel

| Ticket | Scope | Needs |
|---|---|---|
| **MDG-132** | `src/components/notes/agent-loop`, `src/content/notes` | 130 |
| **MDG-134** | `src/components`, `src/pages`, `src/i18n` | 125 |
| **MDG-128** | `src/styles` | 127 |

### Wave 6 — human

| Ticket | Why |
|---|---|
| **MDG-135** | Four product decisions about the series model. No dispatch contract on purpose. |

---

## Models

| Role | Model | Why |
|---|---|---|
| Orchestrator | **Claude Opus (top tier)** | Holds the 15-ticket graph, reads two reports per ticket, decides what goes back. Planning, not throughput. Alternate: GPT-5.5. |
| Implementer — the 11 mechanical tickets | **Composer 2.5** | Ties the frontier on coding benchmarks at roughly a tenth of the cost, and it is editor-native. These tickets have closed specs; this is the right call. |
| Implementer — **MDG-130** | **Claude Opus (top tier)** | Designs the API of eight primitives that thirteen files then depend on. Architecture-level, not mechanical. Do not run this one on Composer. |
| Implementer — **MDG-132** | **Claude Opus** or **Gemini 3.1 Pro** | Classifies each figure as measured / calculated / assumed by reading the prose and the simulation engine. Judgment over long context. |
| Reviewer | **Claude Opus 5** (pinned in `ui-reviewer.md`) | Strongest at catching what a cheaper implementer glossed over. GPT-5.5 is the alternate if terminal work turns out to be the bottleneck — it leads Terminal-Bench by a wide margin. |

**The catch with Composer 2.5.** Its one clear weakness against the frontier is
terminal and shell workflow — roughly thirteen points behind GPT-5.5 on
Terminal-Bench 2.0. That is exactly what these acceptance criteria lean on:
start the dev server, drive `screenshot.mjs` through the DevTools Protocol, read
the overflow warnings.

So **move the visual burden to the reviewer.** Let the Composer implementers
write the code and attempt the captures; treat the reviewer's screenshots as the
ones that count. Do not accept an implementer's "looks right" without them.

## Why this order and not the Linear graph

Linear's blockers are necessary but not sufficient. Three tickets show as
unblocked in wave 1 and would fan out happily — straight into the same file.

The scope lines catch that. They are deliberately coarse, at directory level,
because exact file paths go stale between the day a ticket is written and the
day it runs. Coarse scope over-reports collisions, which is the safe direction:
the cost is a serialised pair that could have run together, not two agents
silently overwriting each other.

The critical path runs 123 → 125 → 126 → 130 → 131, five deep. Everything else
hangs off it. If you only have appetite for part of the batch, that chain plus
127 is what unlocks writing new note components against a kit.
