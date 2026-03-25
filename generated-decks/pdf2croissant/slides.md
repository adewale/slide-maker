---
theme: default
title: pdf2croissant
routerMode: hash
selectable: true
colorSchema: light
fonts:
  sans: Source Sans 3
  serif: Young Serif
  mono: JetBrains Mono
  weights: '400,500,600,700'
transition: slide-left
layout: cover
---

# pdf2croissant

Turn academic papers into MLCommons Croissant JSON-LD metadata

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-muted); margin-top: 1.5rem; display: inline-block;">pdf2mlcroissant.vercel.app</span>

<!--
The cover establishes the project identity. The subtitle is the one-line description from the README. The URL points to the live app so the audience can try it immediately. pdf2croissant solves the gap between what Croissant defines as a schema and the messy reality of extracting that metadata from academic papers.

Sources:
- https://github.com/jettyio/pdf2croissant — repository description and live app URL
-->

---
layout: center
transition: fade
---

# Metadata Standards Assume You Already Have the Metadata

<!--
This is the provocation that sets up the through-line. MLCommons Croissant is a well-designed standard, but it solves the representation problem, not the extraction problem. A researcher who publishes a dataset describes it in natural language across 10-20 pages of a paper. The metadata that Croissant needs is in there, but it is buried in prose, tables, footnotes, and appendices. pdf2croissant exists because the hard part was never the schema — it was getting the facts out of the paper.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — project motivation: turning papers into structured metadata
-->

---
transition: slide-left
---

# An Agent That Reads Papers

Upload a PDF of a paper that introduces an ML dataset. An AI agent reads it, extracts metadata, builds valid Croissant JSON-LD, validates the result, and delivers three files:

<v-clicks>

- **croissant.json** — the Croissant JSON-LD metadata file
- **validation_report.json** — what passed, what failed, what could not be verified
- **summary.md** — human-readable extraction summary with confidence levels

</v-clicks>

<!--
The three-output design is deliberate. croissant.json is the machine-readable payload. validation_report.json is the audit trail — it tells you what the agent verified and what it could not. summary.md is for human review, showing each extracted field with its confidence tag. The architecture is a Next.js 15 frontend with React Query polling a Jetty API backend where the selected model does the comprehension work.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — three output files and architecture overview
- https://github.com/jettyio/pdf2croissant/blob/main/package.json — Next.js 15, React 19, React Query, Tailwind CSS 4
-->

---
transition: morph-fade
---

# The Runbook Is the System Prompt

RUNBOOK.md ships with every API request — embedded at build time, sent verbatim. Three rules make extraction honest:

<v-clicks>

- **Confidence tagging** — every extracted field is marked high, medium, or low
- **Gap documentation** — if the paper does not mention a download URL, the agent says so
- **Paper grounding** — every claim must trace to specific text in the PDF, not model knowledge

</v-clicks>

<p v-click style="color: var(--deck-accent); font-size: 0.95rem; margin-top: 1.5rem;">The runbook is a file in the repo. Change the rules, change the agent.</p>

<!--
Sending the runbook as a system prompt rather than fine-tuning it into the model is a key architectural decision. It means the extraction rules are versioned, auditable, and editable without retraining. The embed-runbook.ts build script injects RUNBOOK.md contents at build time so it travels with every request. Confidence tagging is not optional — the runbook requires it on every field. A "high" tag means the paper explicitly states the value. "Medium" means it can be reasonably inferred. "Low" means the agent is guessing. Gap documentation is the most unusual requirement: the agent must explicitly note when information is absent rather than filling the gap with plausible but unsourced data. This is the through-line in action — the paper is the source of truth, and silence is a valid answer.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — system prompt with confidence tagging, gap documentation, paper grounding rules
-->

---
layout: two-cols-header
transition: wipe-right
---

# Paper In, Croissant Out

::left::

**What the agent reads**

<v-clicks>

- PDF of an academic paper
- Tables, figures, prose descriptions
- Scattered metadata across sections
- Implicit assumptions, missing URLs

</v-clicks>

::right::

**What the agent produces**

<v-clicks>

- `croissant.json` — valid JSON-LD
- `validation_report.json` — audit trail
- `summary.md` — confidence per field
- Gaps documented, not filled

</v-clicks>

<!--
This slide makes the transformation concrete. The left column is the messy reality of academic papers — metadata is never in one place. A dataset's record count might be in a table on page 4, the license in a footnote on page 12, and the download URL in an appendix or not mentioned at all. The right column is the structured output. The key insight is the last item on each side: "Implicit assumptions, missing URLs" becomes "Gaps documented, not filled." The agent does not invent what the paper omits.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — three output files
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation and confidence tagging rules
-->

---
layout: section
transition: iris
---

# Validation

Three stages, three chances to be wrong

<!--
Section break for the validation deep-dive. The three-stage validation pipeline is what turns a best-effort extraction into a verified one. Each stage catches a different class of error: malformed JSON, schema violations, and semantic errors that only surface when you try to load the data. The self-healing loop means the agent can fix its own mistakes — but only up to three times, because infinite retries mask fundamental extraction failures.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — three-stage validation: JSON syntax, Croissant schema, record set generation
-->

---
transition: slide-up
---

# Self-Healing Validation Loop

Three stages catch three classes of error:

<v-clicks>

- **JSON syntax** — is the output valid JSON-LD?
- **Croissant schema** — does it conform to the MLCommons spec? Validated with `mlcroissant`
- **Record set generation** — can you actually load the described data?

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem;">If any stage fails, the agent reads the error, re-reads the paper, and fixes the output. Up to 3 iterations.</p>

<!--
The escalation order matters. JSON syntax is cheap to check and catches the most common failure mode — malformed output from the LLM. Croissant schema validation uses the official mlcroissant Python library, which checks field types, required properties, and cross-references between record sets and distributions. Record set generation is the most expensive check: it actually tries to instantiate the dataset from the metadata. This catches semantic errors like incorrect column names or mismatched file formats that pass schema validation but fail at load time. The sandbox runs Python 3.12 with 4 CPUs, 8GB RAM, and a 1200-second timeout — enough for the mlcroissant library to validate complex datasets. Three retry iterations was chosen empirically: most fixable errors resolve in 1-2 attempts, and errors past 3 are usually fundamental extraction failures.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — three-stage validation pipeline and self-healing loop
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — sandbox constraints: Python 3.12, 4 CPUs, 8GB RAM, 1200s timeout
-->

---
transition: slide-left
---

# The Stack

Upload is three stages:

<v-clicks>

- **Presign** — client requests a signed URL from the API
- **Blob storage** — client PUTs the PDF directly to Vercel Blob (15MB limit)
- **Run** — client POSTs to `/api/run` with the blob reference and selected model

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1rem;">Model selector: Claude Opus, Claude Sonnet, or Gemini Pro. Backend is a Jetty API orchestrating sandboxed Python 3.12 (4 CPUs, 8GB RAM, 1200s timeout). Frontend polls with React Query.</p>

<!--
The three-stage upload pipeline is a deliberate design. Presigned URLs keep the API server out of the file transfer path — the client uploads directly to Vercel Blob storage. The 15MB limit is enforced client-side in the UploadForm component via drag-drop validation. The model selector lets users choose between Claude Opus (highest quality), Claude Sonnet (fastest), or Gemini Pro per run — the choice affects comprehension quality and latency. The Jetty API backend handles agent orchestration in a sandboxed environment: each run gets its own Python 3.12 process with 4 CPUs and 8GB RAM. The 1200-second timeout accommodates complex papers that require multiple validation iterations. Eight React components handle the UI: UploadForm, CroissantViewer, ValidationResults, SummaryReport, RunHistory, StepTimeline, RunStatusBanner, and RunbookContent.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — upload pipeline, model selector, sandbox constraints
- https://github.com/jettyio/pdf2croissant/blob/main/package.json — Next.js 15, React 19, React Query, Vercel Blob
-->

---
layout: center
transition: morph-fade
---

# The Runbook Is the Product

The `/runbook` page tells users to copy it and run it with any agent — Claude Code, Codex, Gemini CLI. No web app needed. The rules are what matter, not the interface.

<!--
This is the insight most people miss about the project. The web app is a convenient wrapper, but the runbook — RUNBOOK.md — is the actual intellectual contribution. It encodes the extraction discipline: what to look for, how to tag confidence, when to document gaps, how to validate. The /runbook page in the app makes this explicit by inviting users to take the runbook and use it with whatever agent they already have. This portability is by design. If the rules are right, any sufficiently capable agent can follow them. The web app is one instantiation; the runbook works anywhere.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — portable runbook designed for use outside the app
- https://github.com/jettyio/pdf2croissant/blob/main/README.md — /runbook page and portability description
-->

---
transition: slide-left
---

# Five Benchmarks, Five Ground Truths

The repo ships ground-truth Croissant files for five datasets — sourced from HuggingFace:

<v-clicks>

- **SQuAD 2.0** — reading comprehension with unanswerable questions
- **GLUE** — natural language understanding benchmark suite
- **WikiText** — language modeling on Wikipedia articles
- **CNN/DailyMail** — abstractive text summarization
- **GSM8K** — grade school math word problems

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem;">Each pairs the original paper PDF with its known-good Croissant output. Test extraction against reality, not synthetic examples.</p>

<!--
The benchmark suite is how you test an extraction agent honestly. Each entry has the original academic paper as a PDF and a ground-truth Croissant file from HuggingFace — metadata that was created by humans who actually read the paper and understood the dataset. When pdf2croissant processes the SQuAD 2.0 paper, you can diff the output against HuggingFace's canonical Croissant file to see what the agent got right, what it missed, and what it tagged as low-confidence. This is more rigorous than synthetic test cases because real papers have real ambiguities: SQuAD 2.0 describes multiple data splits across different sections, GLUE is a suite of nine tasks with distinct schemas, and GSM8K focuses on methodology more than dataset format.

Sources:
- https://github.com/jettyio/pdf2croissant/tree/main/benchmarks — five benchmark datasets with PDFs and ground-truth Croissant JSON-LD from HuggingFace
-->

---
layout: center
transition: fade
---

# Silence Is Data

When the paper does not mention a download URL, the agent does not guess one. When the paper is ambiguous about record counts, the confidence tag says so. What the paper does not say is as important as what it does.

<!--
This slide reinforces the through-line before the closing. Most extraction tools optimize for completeness — fill every field, guess if you have to. pdf2croissant inverts this. The runbook's gap documentation rule means the agent is required to note absence rather than fabricate presence. A Croissant file with documented gaps is more useful than one with confident-looking hallucinations, because downstream consumers can trust the fields that are present and know exactly what needs manual verification. This is the philosophical core: treating the paper as the source of truth means respecting its limits.

Sources:
- https://github.com/jettyio/pdf2croissant/blob/main/RUNBOOK.md — gap documentation rules and confidence tagging
-->

---
layout: end
transition: fade
---

# If the paper does not say it, the metadata does not claim it.

<span style="font-family: var(--deck-font-mono); font-size: 0.95rem;">pdf2mlcroissant.vercel.app</span>

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-muted); display: inline-block; margin-top: 0.5rem;">github.com/jettyio/pdf2croissant</span>

<!--
Resolve the through-line. "The paper is the source of truth" is not a tagline — it is the design rule that shaped every decision in this project. Confidence tagging exists because the paper's authority varies by field. Gap documentation exists because the paper's silence is data. Three-stage validation exists because the paper's claims must survive mechanical verification. The runbook is portable because the rules transcend any single interface. The live app URL and repo URL are both here — use the tool, or take the runbook and run it yourself.

Sources:
- https://github.com/jettyio/pdf2croissant — project repository
- https://pdf2mlcroissant.vercel.app — live application
-->
