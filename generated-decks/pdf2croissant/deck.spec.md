# Deck Spec

## Meta
- title: pdf2croissant
- subtitle: Turn academic papers into MLCommons Croissant JSON-LD metadata
- purpose: present a tool that extracts machine-readable dataset metadata from PDFs by treating the paper as the source of truth — and treating silence as data
- audience: ML engineers, dataset maintainers, and researchers who publish or consume datasets
- tone: precise, grounded, technically honest
- target-length: 25
- notes: yes
- style-preset: croissant-warm
- progress: segment-bar
- project-url: https://github.com/jettyio/pdf2croissant

## Source Materials
- readme: README.md (project overview — what it does, upload-to-outputs flow, benchmark datasets)
- runbook: RUNBOOK.md (system prompt sent with every request — extraction rules, confidence tagging, gap documentation, 8-step procedure)
- package: package.json (Next.js 15, React 19, Tailwind CSS 4, React Query — frontend stack)
- benchmarks: benchmarks/ (five ground-truth Croissant files from HuggingFace — SQuAD 2.0, GLUE, WikiText, CNN/DailyMail, GSM8K)
- types: types.ts (Trajectory, TrajectoryStep, ValidationStage, ValidationReport type definitions)

## Through-Line
- concept: "Dataset metadata is trapped in academic papers. pdf2croissant extracts it."
- type: in-media-res
- appears-in:
  - slide 2: default — in media res: show the extracted JSON-LD output before explaining the system
  - slide 3: default — context: Croissant is the standard, but papers don't come with Croissant files
  - slide 4: default — the extraction gap: someone must distinguish explicit from inferred
  - slide 13: default — confidence tracking: high/medium/low with examples
  - slide 14: default — gap documentation: silence is data, not a gap to fill
  - slide 17: center — the runbook is portable because the rules are what matter
  - slide 24: center — compressed: millions of datasets, metadata trapped in prose, pdf2croissant extracts it
  - slide 25: end — resolved: "The metadata was always in the paper. Now it is in the JSON." — connects back to slide 2's JSON fragment

## Design Tokens
- colors:
  - bg: "#fffbf5"
  - fg: "#2c1810"
  - accent: "#c8860a"
  - accent-alt: "#8b5e34"
  - muted: "rgba(44, 24, 16, 0.45)"
- typography:
  - display: Young Serif
  - body: Source Sans 3
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols-header
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Transition Grammar
- slide-left: global default, content progression
- fade: reflection/pause — center slides, end slide
- iris: new chapter — section dividers only (3 uses: slides 5, 11, 18)
- morph-fade: conceptual shift — confidence tracking, runbook portability
- wipe-right: comparison/juxtaposition — paper in vs croissant out
- slide-up: reveal — validation pipeline

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: pdf2croissant
- subtitle: Turn academic papers into MLCommons Croissant JSON-LD metadata
- notes:
  - Open with the project identity. The subtitle is the one-line description.
  - The live app URL appears below the subtitle in mono.

### Slide 2
- kind: default-content
- layout: default
- transition: fade
- title: This Was Extracted From a PDF
- body: In media res opening. Show a 5-line JSON-LD snippet (dataset name, description, license, creator from SQuAD 2.0). Then the tension: "The paper never had structured metadata. An agent read 20 pages of prose and produced this."
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — project overview
  - https://github.com/jettyio/pdf2croissant/tree/main/benchmarks — SQuAD 2.0 benchmark

### Slide 3
- kind: default-content
- layout: default
- title: The Standard That Needs Filling
- body: Croissant is the MLCommons standard for dataset metadata. HuggingFace, Kaggle, and OpenML adopted it. 16 fields in JSON-LD, validated by mlcroissant. Well-designed, widely adopted — but papers don't come with Croissant files. Someone has to read them and extract the fields.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — 16 field mappings, mlcroissant validation
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — MLCommons standard context, adoption

### Slide 4
- kind: default-content
- layout: default
- title: The Extraction Gap
- body: A paper scatters metadata across 20+ pages. Dataset name on page 1, license in a footnote on page 12, column types in a table on page 4, download URL maybe in an appendix or missing entirely. Croissant needs structured fields. Papers contain scattered prose. Someone must distinguish explicit from inferred.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — "Distinguish between what is explicitly stated vs what you are inferring"

### Slide 5
- kind: section
- layout: section
- transition: iris
- title: An Agent That Reads Papers

### Slide 6
- kind: default-content
- layout: default
- title: Three Outputs From Every Run
- body: Upload a PDF, get three files: croissant.json (the metadata), validation_report.json (the audit trail), summary.md (human-readable confidence report). The validation report and summary exist because the Croissant file alone does not tell you how much to trust it.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — three output files and their purposes

### Slide 7
- kind: default-content
- layout: default
- title: The Upload Pipeline
- body: Three stages keep the API server out of the file transfer path. Presign (signed URL from /api/presign), Blob (PUT to Vercel Blob, 15MB limit, drag-drop with progress), Run (POST to /api/run with blob reference and selected model). React Query polls for completion.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — upload pipeline: presign, blob, run
  - https://github.com/jettyio/pdf2croissant/blob/main/package.json — React Query, Vercel Blob

### Slide 8
- kind: default-content
- layout: default
- title: Architecture
- body: Mermaid diagram showing User to Next.js 15 Frontend to Vercel Blob and Jetty API to Sandbox with Agent + mlcroissant to three outputs. One env var (JETTY_API_TOKEN) connects everything. 8 React components handle the UI.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — architecture overview, Jetty API, sandbox constraints
  - https://github.com/jettyio/pdf2croissant/blob/main/package.json — Next.js 15, React 19, Tailwind CSS 4

### Slide 9
- kind: center
- layout: center
- transition: fade
- title: The agent runs in a sandbox. 4 CPUs. 8 GB RAM. 20 minutes. No escape.
- body: Isolated Python 3.12 process per run. Network access for pip and optional HuggingFace queries. 1200-second timeout accommodates complex papers with multiple validation iterations.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — sandbox: Python 3.12, 4 CPUs, 8GB RAM, 1200s timeout

### Slide 10
- kind: default-content
- layout: default
- title: Choose Your Extraction Engine
- body: Model selector per run: Claude Opus (highest quality), Claude Sonnet (fastest), Gemini Pro (default, balanced). Same runbook, same validation pipeline, different reading engine. The rules stay constant; the model varies.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — model selector: Claude Opus, Claude Sonnet, Gemini Pro

### Slide 11
- kind: section
- layout: section
- transition: iris
- title: The Runbook Is the System Prompt

### Slide 12
- kind: default-content
- layout: default
- title: Eight Steps, One Procedure
- body: The runbook defines the complete workflow. 1. Environment Setup, 2. Read and Analyze, 3. Cross-Reference (optional HuggingFace), 4. Build Croissant JSON-LD (16 field mappings), 5. Validate (3-stage pipeline). Steps 6-8: iterate on errors (max 3), write executive summary, run final checklist.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — 8-step extraction procedure

### Slide 13
- kind: default-content
- layout: default
- transition: morph-fade
- title: Confidence Is a First-Class Output
- body: Every field gets a confidence tag. HIGH: explicitly stated (dataset name, authors, license). MEDIUM: inferred from context (column types, data splits). LOW: not in the paper (download URLs, file sizes). GAPS: documented explicitly, never filled. A Croissant file with documented gaps is more useful than one with confident-looking hallucinations.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — confidence tracking: HIGH, MEDIUM, LOW definitions

### Slide 14
- kind: default-content
- layout: default
- title: Gap Documentation
- body: The executive summary includes a mandatory gaps table. Examples: download URL not in paper, file sizes not mentioned, update frequency unknown, data split ratios implied but not stated. The agent is required to note absence rather than fabricate presence. Silence is data.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation requirements, executive summary template

### Slide 15
- kind: two-cols
- layout: two-cols-header
- transition: wipe-right
- title: Paper In, Croissant Out
- left:
  - PDF of academic paper
  - Tables, figures, prose descriptions
  - Scattered metadata across sections
  - Implicit assumptions, missing URLs
- right:
  - croissant.json (valid JSON-LD)
  - validation_report.json (audit trail)
  - summary.md (confidence per field)
  - Gaps documented, not filled
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — three output files
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation rules

### Slide 16
- kind: default-content
- layout: default
- title: Field Mapping
- body: The runbook defines 16 specific mappings from paper concepts to Croissant JSON-LD. Identity (name, version, description, URL, DOI), Provenance (creators, date, citation, license), Structure (distributions, record sets, fields), Data types (7 mappings: text, integer, float, boolean, date, URL, enum). Each mapping has a source and target; gaps are documented.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — field mapping table (16 mappings), data type mapping (7 types)

### Slide 17
- kind: center
- layout: center
- transition: morph-fade
- title: The runbook is a file in the repo. Copy it. Use it with Claude Code, Codex, or Gemini CLI. The web app is optional.
- body: The /runbook page invites users to take the runbook and use it with whatever agent they already have. The rules are what matter, not the interface.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — portable runbook
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — /runbook page

### Slide 18
- kind: section
- layout: section
- transition: iris
- title: Three Stages, Three Chances to Be Wrong

### Slide 19
- kind: default-content
- layout: default
- transition: slide-up
- title: The Validation Pipeline
- body: Three stages catch three classes of error. JSON syntax (valid JSON-LD?), Croissant schema (conforms to MLCommons spec via mlcroissant?), Record set generation (can you actually load the data?). Escalation order matters — each stage is more expensive and catches a different failure mode.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — three-stage validation pipeline

### Slide 20
- kind: default-content
- layout: default
- title: Self-Healing: Read the Error, Fix the Output
- body: 8 common error patterns documented in the runbook with known fixes. Max 3 iterations — most fixable errors resolve in 1-2 attempts. Errors past 3 are fundamental extraction failures, not fixable by retry. Each iteration produces an updated validation_report.json.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — common error table (8 patterns), max 3 iterations

### Slide 21
- kind: default-content
- layout: default
- title: The Executive Summary
- body: Every run produces a structured summary: high confidence table (explicit, with page references), medium confidence table (inferred, with reasoning), low confidence table (guessed, flagged for review), gaps table (not addressed). The summary is what a maintainer reads to decide whether to accept or verify.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — executive summary template with confidence tables

### Slide 22
- kind: default-content
- layout: default
- title: Five Benchmarks, Five Ground Truths
- body: SQuAD 2.0, GLUE (9 tasks, distinct schemas), WikiText, CNN/DailyMail, GSM8K. Each pairs the original arXiv paper PDF with known-good Croissant output from HuggingFace. Test extraction against reality, not synthetic examples.
- sources:
  - https://github.com/jettyio/pdf2croissant/tree/main/benchmarks — five benchmark datasets with ground-truth Croissant from HuggingFace

### Slide 23
- kind: default-content
- layout: default
- title: Intentional V1 Constraints
- body: No batch processing (each extraction needs full attention). No direct HuggingFace analysis (the paper is the source). No metadata editing UI (review in your own tools). No auth system (one env var deployment). Scope decisions, not missing features.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — V1 limitations and scope decisions

### Slide 24
- kind: center
- layout: center
- transition: fade
- title: Millions of datasets. Metadata trapped in prose. pdf2croissant reads the paper and extracts it.
- body: One sentence landing the through-line. Connects the in media res opening (slide 2's JSON fragment) to the full system the deck has explained.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — project description

### Slide 25
- kind: end
- layout: end
- transition: fade
- title: The metadata was always in the paper. Now it is in the JSON.
- subtitle: github.com/jettyio/pdf2croissant
- notes:
  - Resolve the in media res opening. Slide 2 showed a JSON-LD fragment extracted from a PDF. The audience spent 23 slides learning how the system works. This closing connects back: the metadata was always there, now it is structured. The JSON on slide 2 is this sentence made concrete.
