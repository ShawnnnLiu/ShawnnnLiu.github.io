# Portfolio site brief for a Claude Code session

Repo: the source of shawnnnliu.github.io (not in this folder; open it in the site repo). Written 2026-09-07 from the
job-scrape folder. Paste this file as the first message, or copy it in as CLAUDE.md in the site repo.

## What this is and who reads it

A recruiter or engineer lands here from a resume or a referral message, usually after the resume already told them the
role family. The site's job is to back the resume up in thirty seconds and to make the person want to talk, not to
repeat the resume or re-pitch a job title. Two audiences, in this order of volume: big-tech / finance / hardware SWE
intern screens (17 of the last 30 applications), then AI / ML engineer and research intern screens (the other 13).

Shawn is a first-year M.S. CS student at Columbia (entered Fall 2026, expected January 2028), UC Irvine B.S. CS 2026,
applying for Summer 2027 internships. That is the frame: an aspiring intern with two live products and four
publications, not a senior engineer being recruited.

## The positioning decision (decided, do not reopen)

Drop "Applied AI engineer" as the identity. The applications moved: the resume's neutral headline is now
"ML / Research Engineer · published AI researcher · two production LLM systems live", and the SWE variants say
"Software Engineer · ...". The site should carry the differentiator the resume cannot fit, which is one idea:

    Software around language models, with the checks that run before a person sees the output.
    Two of those systems are live. Four published papers behind them.

Every section either supports that idea or is trimmed. "LLM agents", "high-stakes workflows", "production-grade
failure handling" are lab vocabulary and go.

## Sources of truth (read before touching a number)

All paths relative to the job-scrape folder.

- project/facts-digest.md: every number that may appear, with wording rules and a Never-claim list per project.
  If a number is not in it, it does not go on the site. Round down, never up.
- project/unverified-ledger.md: claims with no repo behind them (Navy, AdamsFoods, GPA). The Navy entry is fixed at
  its current level of detail (CUI rule, no exceptions, no visuals).
- project/humanizing-ai-writing.md: binding on every sentence. Read it in full first.
- project/resume-master.md: the current resume, with the reasoning in comments. The site must not contradict it.
- project/Shawn_Liu_Resume_21.pdf and project/Shawn_Liu_CV_Research_18.pdf: current renders for the download links.
- tailored/2026-09-04/google_swe-intern-ms-summer-2027/cover-letter.md and
  tailored/2026-09-07/scaleai_software-engineering-intern/cover-letter.md: the voice samples. Read both.

## Fact corrections (must land; each has a source)

1. Bio: "undergraduate at UC Irvine (graduating 2026) and incoming M.S. student at Columbia" is stale. Now a first-year
   M.S. student at Columbia, expected January 2028; UCI B.S. CS 2026. (resume-master.md EDUCATION)
2. Loop: "4,822 backend tests + 313 frontend tests" and "4 LLM nodes" are superseded. 5,152 tests across backend and
   frontend (4,826 + 326); five LLM nodes. Never "gate every push" for the frontend tests. (facts-digest.md Loop)
3. Loop retrieval: "242 curated source documents (7,776 retrieval chunks)" is fine for the corpus size, but the graded
   snapshot is 188 docs; if a retrieval number is shown, it is recall@5 0.76 and MRR 0.71 on 75 queries, described as
   pinned floors, never CI floors. (facts-digest.md Loop)
4. Loop cost: "$1.70 expected monthly cost per user" may stay only as a design baseline; the $8 cap is policy, not
   enforced in code, so no line may imply an enforced cap or any spend figure. (facts-digest.md Loop)
5. Arrhythmia: remove "Manuscript in preparation" (none exists, never-claim). Replace with the finding: the same
   CNN scores 98.36% on a beat-wise split and 83.88% on a random patient-wise split; a split search over 50,000 sampled
   patient assignments keeps all six classes in the test set. Say "many published MIT-BIH results", never "all".
   (facts-digest.md Arrhythmia)
6. BioIntelligence Lab: add the result now on the resume, 22% F1 over QSAR descriptors at the chosen threshold.
   (unverified-ledger.md item 16; resume-master.md)
7. Crash Anticipation: keep 2.95M parameters, 408 fps, 3.05 s mean lead time, each bound to a tracked vehicle.
   Ego-motion and bird's-eye-view state are future work with no code; the site may list them as future, never as
   built. No TensorRT, Jetson, or CARLA claims. (facts-digest.md Crash)
8. Foothold: 352,024 articulation rows, 31,236 agreements, 115 colleges with agreements, 15 campuses, solo, July 31 to
   August 21 2026. Keep "$15,686" only if the site can say what it is (an example tuition cost from one demo case, not a
   measured saving). No usage numbers for Loop or Foothold anywhere. (facts-digest.md Foothold)
9. Download links: point Resume to Shawn_Liu_Resume_21.pdf and CV to Shawn_Liu_CV_Research_18.pdf.
10. Never a user count, a "serving users" phrase, a preprint that does not exist, or a planned PR or post as if done.

## Voice: what the letters sound like, and why the site should match

The cover letters are the register. Read the two samples before writing a word. What they do:

- First person, plain. "I built", "I did not expect the boring parts to be the job." Not "Shawn is a passionate..."
- A number does the persuading and no adjective helps it. "5,152 tests sit behind that." Then it moves on.
- Every project opens with what it does for a person, in one sentence a non-engineer could follow. Mechanism second,
  number third. "You give it a career goal and the hours you have free, and it puts a study plan on your Google Calendar."
- Says what went wrong or what is still wrong. "The retrieval floors are pinned, but the command checking them still
  runs by hand." That sentence is worth more than any claim of rigor.
- Sentences end flat. No button, no payoff, no swell. Paragraphs do not end on their number.
- One opinion per piece, stated as an opinion. "I'd rather report the 83.88." "I would still start with the notebook."
- Wants are concrete and small. The Honeywell line is the model: one failure mode that is mine, a mentor who has seen
  it fail before, enough of the summer left to make it fail less.
- Mixed sentence length. A long one with a comma clause, then a short one. Occasionally a fragment.

What they never do, and the site must not either:

- Em dashes. Commas, parentheses, or a period.
- Tricolons and echo triplets ("Deterministic. Validated. Shipped.").
- "Not just X, it's Y" and every negative parallelism.
- Banned words (full list in humanizing-ai-writing.md): robust, seamless, leverage, harness, cutting-edge, innovative,
  comprehensive, elevate, empower, unlock, streamline, foster, delve, navigate (figurative), landscape (figurative),
  testament, pivotal, transformative. Copula dodges: "serves as", "boasts", "features".
- Hype nouns from AI job postings used as seasoning: agentic, frontier, alignment, mission-critical, production-grade,
  high-stakes, battle-tested, enterprise-grade.
- Significance inflation ("plays a crucial role"). Replace with the fact and the number.
- Manufactured sincerity ("honestly", "genuinely", "truly", "passionate about").
- Hinge phrases more than once per page ("Here's the thing", "Which brings us to").
- Emoji, exclamation points, and inspirational closers.
- Marketing-card layout copy: three-word feature titles with an icon each. If a card needs a title, the title is
  a plain noun phrase ("Approval gate before calendar writes"), not a slogan.

## Cadence for the site specifically

The site is read, not skimmed like a resume and not read end to end like a letter. So:

- Hero: one short line, then two or three plain sentences. Under 60 words total. No bullets.
- Project cards: one sentence of what it does, one or two of how, one line of numbers, one line of what is unfinished
  or what broke. Under 90 words. The "what is unfinished" line is the one that separates this site from the template
  flood; keep it on Loop, Foothold, Crash and Arrhythmia.
- Stat rows are fine, but no more than four numbers per project, and each number has a noun a stranger understands
  ("5,152 tests", not "5,152").
- Research: one line per paper, venue, one result number, link. No abstract paraphrase.
- About: four to six sentences. Keep the cats, the reading, the music; that paragraph is the one place the site is
  allowed to be personal, and it reads as a person because the details are specific and undramatic.
- No section may end on a line that sounds like a closing swell. If the last sentence of a section could be a poster,
  cut it.

## Draft copy (use as the starting point, edit freely inside the rules)

Title tag: Shawn Liu · software engineer and published AI researcher · two LLM systems live

Hero line (pick one, or keep "Reliable AI that ships." if Shawn prefers it):
  A. The checks run before the user sees the answer.
  B. Software around language models, and the code that checks them.

Hero paragraph:
  I'm a first-year M.S. student in computer science at Columbia. I build software around language models, and the
  part I care about most is what checks the model's output before a person sees it. Two of those systems are live:
  Loop plans study time onto your calendar, and Foothold tells California community college students which courses
  will transfer. Before that, two years of research at UC Irvine, with papers at WACV, a NeurIPS workshop, ISLPED,
  and Frontiers in AI. Looking for a Summer 2027 software or ML engineering internship.

Loop card:
  Give Loop a career goal and your free hours and it builds a study plan on your Google Calendar. Five language-model
  nodes draft the plan; ordinary code validates and schedules it, and nothing reaches the calendar until you approve.
  Every prompt is pinned by hash and CI re-grades recorded model outputs on each push, so a prompt change nobody
  measured fails the build. 5,152 tests across backend and frontend. Still by hand: the retrieval floors (recall@5
  0.76, MRR 0.71) are pinned in the repo, but the command that checks them is not in CI yet.

Foothold card:
  A California community college student enters their courses and a target UC or CSU and learns which will transfer.
  The verdict is deterministic over 352,024 ASSIST articulation rows and every finding cites its agreement; one Claude
  node drafts the appeal letter for at-risk courses and every course code in it is checked against the findings.
  Built solo in three weeks for Stellic Pathfinders 2026. The agreements cover 2025-26 and there is no refresh yet.

Arrhythmia card:
  A course project that found the usual MIT-BIH train/test split leaks patient identity. The same 64,966-parameter
  CNN scores 98.36% beat-wise and 83.88% on a random patient-wise split. A search over 50,000 sampled patient
  assignments keeps all six beat classes in the honest test set. Many published MIT-BIH numbers use the leaky split.

Bio:
  Xiangjian (Shawn) Liu is a first-year M.S. student in computer science at Columbia, expected January 2028, and a
  2026 UC Irvine computer science graduate. At UCI he worked in BiasLab with Prof. Mohsen Imani on neuro-symbolic AI,
  hyperdimensional computing, multimodal models, and encrypted inference, and in the BioIntelligence Lab with
  Dr. Haleh Alimohamadi on structure-aware peptide prediction. He lives with two cats, Coconut and Kumquat.

## Structure to add

A "Writing" section in the nav, empty is fine for now, with a placeholder route. Two posts are planned on this site
(tracker/legibility.md): the Loop eval-harness post (draft by 2026-09-20) and the MIT-BIH leakage post (by
2026-10-11). Each is one URL so a resume line can link it. Do not write the posts; build the section.

Reorder skills so the first group is not "LLM Engineering". Suggested order: Languages, Systems (FastAPI, Pydantic v2,
SQLite / FTS5, PostgreSQL, React, Node / Express, OAuth / JWT), ML (PyTorch, scikit-learn, CLIP / ViT / VideoMAE,
knowledge distillation, GNNs, hyperdimensional computing, CKKS-FHE), LLM systems (Anthropic API, retrieval evaluation,
structured outputs, LLM evaluation), Infra (Docker, Fly.io, AWS S3, CI/CD, Linux). Drop "CUDA" (banned string on
every variant, resume rule).

## Done means

- Every number on the page traces to facts-digest.md or unverified-ledger.md; list the trace in the PR description.
- grep the built site for each banned word and for the em dash character; zero hits.
- Read the hero and one project card aloud. If a sentence would sound rehearsed said across a table to a friend, rewrite it.
- The bio says Columbia, present tense. The download links resolve to Resume_21 and CV_18.
- "Applied AI engineer" appears nowhere.
- Nothing claims a user count, a manuscript, or work that is planned.
