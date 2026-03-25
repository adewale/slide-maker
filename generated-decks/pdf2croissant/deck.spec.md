# Deck Spec

## Meta
- title: pdf2croissant
- subtitle: Turn academic papers into MLCommons Croissant JSON-LD metadata
- purpose: present a tool that extracts machine-readable dataset metadata from PDFs by treating the paper as the source of truth
- audience: ML engineers, dataset maintainers, and researchers who publish or consume datasets
- tone: precise, grounded, technically honest
- target-length: 9
- notes: yes
- style-preset: swiss-minimal
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
  - slide 9: end — resolve: if the paper does not say it, the metadata does not claim it

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#2563eb"
  - muted: "rgba(26, 26, 46, 0.5)"
- typography:
  - display: DM Sans
  - body: Figtree
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
  - The live app URL appears below the subtitle.

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
- body: Upload a PDF of a paper that introduces an ML dataset. An AI agent reads it, extracts metadata, builds valid Croissant JSON-LD, validates the result, and delivers three outputs: croissant.json, validation_report.json, and summary.md. The architecture is a Next.js 15 frontend polling a Jetty API backend where Claude Sonnet does the comprehension work.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — project overview and output description
  - https://github.com/jettyio/pdf2croissant/blob/main/package.json — Next.js 15, React 19, TypeScript stack

### Slide 4
- kind: default-content
- layout: default
- title: The Runbook Is the System Prompt
- body: RUNBOOK.md ships with every request as the system prompt — not baked into the model. It enforces three rules that make extraction honest. Confidence tagging marks each field high, medium, or low. Gap documentation requires the agent to say "the paper does not mention this" rather than guess. Paper grounding means every claim must trace to specific text in the PDF.
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
- body: Validation happens in three stages — JSON syntax check, Croissant schema validation using the mlcroissant Python library, and record set generation. If any stage fails, the agent gets the error, reads the paper again, and fixes the output. Up to three iterations. The sandbox runs Python 3.12 with 4 CPUs, 8GB RAM, and a 1200-second timeout.
- sources:
  - https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — three-stage validation pipeline
  - https://github.com/jettyio/pdf2croissant/blob/main/README.md — sandbox constraints (Python 3.12, 4 CPUs, 8GB, 1200s)

### Slide 8
- kind: default-content
- layout: default
- title: Five Benchmarks, Five Ground Truths
- body: The repo ships with ground-truth Croissant files for SQuAD 2.0, GLUE, WikiText, CNN/DailyMail, and GSM8K — sourced from HuggingFace. Each benchmark has the original paper PDF alongside its known-good Croissant output. This is how you test an extraction agent: not with synthetic examples but with real papers and real metadata that already exists independently.
- sources:
  - https://github.com/jettyio/pdf2croissant/tree/main/benchmarks — five benchmark datasets with ground-truth Croissant files from HuggingFace

### Slide 9
- kind: end
- layout: end
- title: If the paper does not say it, the metadata does not claim it.
- subtitle: pdf2mlcroissant.vercel.app
- notes:
  - Resolve the through-line. The design rule — the paper is the source of truth — is what separates extraction from hallucination. Confidence tags, gap documentation, and three-stage validation are all consequences of taking that rule seriously. The project URL is the live app, not the repo, because this is the thing you use.
