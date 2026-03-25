# Deck Spec

## Meta
- title: pdf2croissant
- subtitle: Turn academic papers into MLCommons Croissant JSON-LD metadata
- purpose: present a tool that extracts machine-readable dataset metadata from PDFs by treating the paper as the source of truth
- audience: ML engineers, dataset maintainers, and researchers who publish or consume datasets
- tone: precise, grounded, technically honest
- target-length: 12
- notes: yes
- style-preset: croissant-warm
- progress: segment-bar
- project-url: https://github.com/jettyio/pdf2croissant

## Source Materials
- readme: README.md (project overview — what it does, upload-to-outputs flow, benchmark datasets)
- runbook: RUNBOOK.md (system prompt sent with every request — extraction rules, confidence tagging, gap documentation)
- package: package.json (Next.js 15, React 19, Tailwind CSS 4, React Query — frontend stack)
- benchmarks: benchmarks/ (five ground-truth Croissant files from HuggingFace — SQuAD 2.0, GLUE, WikiText, CNN/DailyMail, GSM8K)

## Through-Line
- concept: "The paper is the source of truth"
- type: design-rule
- appears-in:
  - slide 2: center — pose the provocation: metadata standards assume you already have the metadata
  - slide 4: default — the runbook enforces grounding in the paper text, confidence tagging, gap documentation
  - slide 5: two-cols-header — input (PDF) vs output (Croissant JSON-LD) shows the paper drives everything
  - slide 7: default — three-stage validation loops back to what the paper actually said
  - slide 9: center — the runbook is portable because the rules are what matter, not the app
  - slide 11: center — reinforce: silence is data, not a gap to fill
  - slide 12: end — resolve: if the paper does not say it, the metadata does not claim it

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
- kind: center
- layout: center
- title: Metadata Standards Assume You Already Have the Metadata
- body: Croissant defines the schema. But the facts — download URLs, file formats, record counts, licensing — live scattered across academic papers that no schema can parse. Someone has to read the paper and extract the truth.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — project motivation and problem statement

### Slide 3
- kind: default-content
- layout: default
- title: An Agent That Reads Papers
- body: Upload a PDF of a paper that introduces an ML dataset. An AI agent reads it, extracts metadata, builds valid Croissant JSON-LD, validates the result, and delivers three outputs: croissant.json, validation_report.json, and summary.md.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — project overview and output description

### Slide 4
- kind: default-content
- layout: default
- title: The Runbook Is the System Prompt
- body: RUNBOOK.md ships with every API request as the system prompt. It enforces confidence tagging (high/medium/low per field), gap documentation (silence is data, not a gap to fill), and paper grounding (every claim traces to specific text in the PDF). The runbook is embedded at build time and sent verbatim.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — system prompt with extraction rules, confidence tagging, gap documentation

### Slide 5
- kind: two-cols
- layout: two-cols-header
- title: Paper In, Croissant Out
- left:
  - PDF of academic paper
  - Tables, figures, prose
  - Scattered metadata across sections
  - Implicit assumptions, missing URLs
- right:
  - croissant.json (JSON-LD)
  - validation_report.json
  - summary.md
  - Explicit gaps documented
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — three output files
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation rules

### Slide 6
- kind: section
- layout: section
- title: Validation
- subtitle: Three stages, three chances to be wrong

### Slide 7
- kind: default-content
- layout: default
- title: Self-Healing Validation Loop
- body: Three stages catch three classes of error. JSON syntax — is the output valid JSON-LD? Croissant schema — does it conform to the MLCommons spec, validated with mlcroissant? Record set generation — can you actually load the described data? If any stage fails, the agent reads the error, re-reads the paper, and fixes the output. Up to 3 iterations.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — three-stage validation pipeline
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — sandbox constraints (Python 3.12, 4 CPUs, 8GB, 1200s)

### Slide 8
- kind: default-content
- layout: default
- title: The Stack
- body: Upload is three stages — presign a URL, PUT to Vercel Blob storage, POST to /api/run. The frontend (Next.js 15, React Query) polls for completion. The backend is a Jetty API orchestrating a sandboxed Python 3.12 agent (4 CPUs, 8GB RAM, 1200s timeout). Model selector lets you choose Claude Opus, Claude Sonnet, or Gemini Pro per run. Eight React components handle the UI: UploadForm, CroissantViewer, ValidationResults, SummaryReport, RunHistory, StepTimeline, RunStatusBanner, RunbookContent.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/package.json — Next.js 15, React 19, React Query, Tailwind CSS 4
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — upload pipeline, model selector, component architecture

### Slide 9
- kind: center
- layout: center
- title: The Runbook Is the Product
- body: The /runbook page tells users to copy it and run it with any agent — Claude Code, Codex, Gemini CLI. No web app needed. The rules are what matter, not the interface.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — portable runbook designed for use outside the app
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — /runbook page description

### Slide 10
- kind: default-content
- layout: default
- title: Five Benchmarks, Five Ground Truths
- body: The repo ships ground-truth Croissant files for SQuAD 2.0, GLUE, WikiText, CNN/DailyMail, and GSM8K — sourced from HuggingFace. Each pairs the original paper PDF with known-good Croissant output. Test extraction against reality, not synthetic examples.
- sources:
  - https://github.com/jettyio/pdf2croissant/tree/main/benchmarks — five benchmark datasets with ground-truth Croissant files from HuggingFace

### Slide 11
- kind: center
- layout: center
- title: Silence Is Data
- body: When the paper does not mention a download URL, the agent does not guess one. When the paper is ambiguous about record counts, the confidence tag says so. The through-line holds: what the paper does not say is as important as what it does.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation rules and confidence tagging

### Slide 12
- kind: end
- layout: end
- title: If the paper does not say it, the metadata does not claim it.
- subtitle: pdf2mlcroissant.vercel.app
- notes:
  - Resolve the through-line. The design rule — the paper is the source of truth — is what separates extraction from hallucination. Confidence tags, gap documentation, and three-stage validation are all consequences of taking that rule seriously.
