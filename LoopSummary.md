All facts verified. Here's the Loop context brief for your portfolio agent: copy-paste the block below. Everything in it is checked against the repo as of today (branch ux-quality-pass, commit history through 2026-07-04), and I've marked what's real, what's pending, and what must not be claimed.

# Loop - source-of-truth brief for the portfolio case study
Verified against the repo 2026-07-04. Use these facts as written; anything marked
PENDING or DO NOT CLAIM is a hard constraint; the site's brand is skeptical honesty.

## Naming and one-liners
- Product name: **Loop**. Repo/engine name: **Agentic Calendar**.
- Landing page title (live copy): "Loop — interview prep, scheduled around your real life"
- Landing H1 (live copy): "Your prep plan, on your calendar — never written without your say-so."
- Thesis line (use verbatim): **"LLMs propose. Deterministic infrastructure disposes."**
- What it does: turns a user's career goal, weekly availability, and progress signals
  into a validated study plan, schedules it as a draft week, and, only after explicit
  human approval, writes it to Google Calendar with verification and rollback. Tracks
  completion/drift, adapts replans, and runs an accountability loop (check-ins,
  recommitment), with LLM-written reflections and plain-language explanations.

## Hard numbers (all verified; as-of 2026-07-04)
- 135 commits; first commit 2026-05-01 (docs-first), first code 2026-05-21 → ~6 weeks of engineering.
- **2,691 backend tests + 81 frontend tests**, all green (`make check` + vitest).
- **23 written axioms** (numbered 00–22; the earlier draft said 22, the correct count is 23) + **8 ADRs**.
- 4 LLM nodes, 5 deterministic validation categories, repair bounded at ≤2 attempts.
- Cost engineering: expected **~$1.70/month per user** (sensitivity $0.85–$3.40),
  **hard monthly cap $8**, all derived in a written cost axiom, re-derived when models changed.
- Models (axiom-governed tiering): Strategist on Opus 4.8; Planner, Reflection,
  Explanation on Sonnet 5 (a deliberate, cost-modeled tier decision, amended via axiom change-log).
- Stack: Python 3.11 modular monolith (Pydantic v2, FastAPI, SQLite+WAL), React 18 +
  TypeScript + Vite SPA, Anthropic Messages API, Google Calendar API + OAuth, Fly.io.

## Architecture diagram spec (the "four nodes vs. deterministic everything-else" picture)
Propose side (LLM, isolated to one package by import-linter): Strategist (syllabus with
source-claim citations) → Planner (task plan) → also Reflection + Explanation (prose only,
never parsed). Dispose side (deterministic): validation layer (schema / graph / coverage /
user-fit / scheduling preconditions, with a bounded typed-violation repair loop back to the
LLM) → pure greedy scheduler (**draft-only, cannot write**) → human approval gate →
Calendar Write Manager (the ONLY writer: approval ID + payload-hash recheck, dry-run,
duplicate detection, verify-after-write, rollback mapping) → Google Calendar. Feedback
loops: telemetry → deterministic drift classifier → accountability → replan. Annotate:
every failure is a typed reason_code; a supervisor state machine owns all transitions;
LLM SDK imports are mechanically forbidden outside the LLM package (CI-enforced).

## Four-discipline framing, honest status (say exactly this, no rounding up)
1. **Loop engineering: DONE.** Closed the control-loop dead-ends users feel: failed
   calendar writes now get a 3-option recovery flow (rollback / retry / keep), silent
   "replan required" states are surfaced with a recovery-mode picker, and the
   accountability loop is answerable in the UI (recommitment, first check-in producer).
2. **Harness engineering: DONE except one step.** Adapter resilience (timeouts, backoff,
   typed provider-error taxonomy), live-capture tool, CI eval gate, call-log readers all
   shipped. The real-prompt baseline recording is PENDING (a guarded <$1 capture run).
3. **Prompt engineering: IN PROGRESS.** Few-shot exemplars, unified typed repair
   messages, and voice specs for user-facing prose are specified, not yet shipped.
4. **Context engineering: PARTIAL.** Prompt caching shipped; source-claim curation,
   reflection-history injection, and prior-plan-aware replans are specified, not yet shipped.

## Eval-harness story in three sentences (usable nearly verbatim)
"Every LLM call lands in a SQLite call log with tokens, cost, and latency. A capture tool
records real model outputs into committed recordings that are re-graded deterministically
in CI (schema validity, repair recovery, plan-quality metrics, plus an offline LLM judge
for prose), so prompt and model changes ship with before/after deltas in the commit
message. Live API calls never run in CI; prompt bytes are version-pinned by hash, so an
unmeasured prompt change fails the build."
Honest caveat if space allows: the gate currently runs on fixture recordings (one of which
deliberately fails, proving the harness detects failures); the first real-prompt baseline
capture is the next step.

## Claims to AVOID (each burned us or is simply false)
- **Never say "auto-rollback."** The engine does NOT roll back automatically on a failed
  verification; it presents a user-driven rollback/retry/keep choice. (An earlier UI copy
  line claiming auto-rollback was flagged as the project's worst audit finding and removed.)
- **No real users yet.** Self-dogfooding; the hosted design targets ≤100 testers. Say
  "built for daily self-use, deployed live", not "users."
- **No demo video exists yet** (the case study can ship without it, per your plan).
- Thresholds (validation, drift, source confidence) are **heuristic priors until
  calibrated** (the axioms say so explicitly); don't present them as tuned.
- Avoid "100%"-style metric claims anywhere near this project; the brand is measurement.
- Privacy detail worth stating positively: the system never stores raw calendar event
  titles or descriptions.

## Links and assets
- Live deploy: Fly.io, landing at `/`, SPA at `/app`. **ASK SHAWN for the real URL**;
  the committed fly.toml uses a placeholder app name, so do not derive a URL from the repo.
- Repo: https://github.com/ShawnnnLiu/Agentic-Calendar; **confirm visibility with Shawn
  before linking** (if it's going public, the repo root currently contains a stray
  `Admissions Agentic Scheduler.zip` and generated `graphify-out/` worth pruning first).
- "How it's built" page: does not exist yet; the 23 axioms + 8 ADRs in `docs/` are the
  raw material; nearly every case-study claim above maps to a specific axiom file.

## Skills-column keywords that are TRUE today
Anthropic API (Messages, prompt caching, model tiering) · structured outputs with bounded
validation-repair loops · eval harness design (recordings, deterministic graders, offline
LLM-as-judge, CI gating) · LLM observability (per-call cost/latency log + stats tooling) ·
prompt versioning with pinned byte hashes · typed provider-error taxonomy + exponential
backoff · Pydantic v2 contracts + generated JSON Schema · FastAPI · SQLite · architecture
enforcement via import-linter · mypy --strict · pytest at 2.7k-test scale (golden
scenarios, fixture harnesses) · React + TypeScript + Vite + vitest · Google Calendar
API/OAuth · Fly.io.
NOT yet true (per the roadmap, add only when those projects land): vLLM, LoRA/fine-tuning,
embeddings/vector retrieval.

## Material for the two Writing posts
1. **"LLMs propose, deterministic infrastructure disposes."** Anchors: the approval-gate
   + payload-hash-recheck write path; typed reason codes everywhere; mechanical SDK
   isolation; ADR "the LLM never touches the calendar"; why the scheduler is draft-only.
2. **"A recordings-based eval harness."** Anchors: live-capture → committed recording →
   deterministic re-grade → CI gate with measured floors; two-tier grading (deterministic
   metrics + offline judge); prompt-bytes hash pinning; the war story that sampling
   parameters are API-rejected on current model tiers, so comparability rests on pinned
   prompts rather than pinned temperature.
Strong third candidates from real incidents: the timezone bug (provider UTC reads drew
events +7h off wall-clock), the write-failure dead-end and how loop engineering fixed it,
and the custom "bs-detector" audit subagent that reviews every branch for
claims-vs-reality gaps.