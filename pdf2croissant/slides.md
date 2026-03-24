---
theme: default
title: pdf2croissant
routerMode: hash
selectable: true
colorSchema: light
fonts:
  sans: Inter
  serif: EB Garamond
  mono: JetBrains Mono
  weights: '400,500,600,700'
transition: fade
layout: cover
---

# pdf2croissant

Turn academic papers into ML dataset metadata — automatically.

---
layout: statement
transition: morph-fade
---

# ML datasets are everywhere. Standardized metadata is not.

---
transition: slide-left
---

# Croissant: a common language for ML datasets

<v-clicks>

- **MLCommons standard** — JSON-LD metadata format adopted by HuggingFace, Kaggle, and OpenML
- Describes structure, provenance, licensing, and access patterns
- Machine-readable, web-native, built on Schema.org vocabulary
- Without it, every platform invents its own metadata — and none of them talk to each other

</v-clicks>

---
transition: slide-left
---

# The workflow: PDF in, Croissant out

```mermaid {scale: 0.72}
graph LR
  A["Upload PDF"]
  B["AI Agent reads paper"]
  C["Extract metadata"]
  D["Build JSON-LD"]
  E["Validate"]
  F["Download Croissant"]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  style A fill:#fffff8,stroke:#2d5f8a,color:#1a1a1a
  style B fill:#2d5f8a,stroke:#2d5f8a,color:#fffff8
  style C fill:#2d5f8a,stroke:#2d5f8a,color:#fffff8
  style D fill:#fffff8,stroke:#2d5f8a,color:#1a1a1a
  style E fill:#fffff8,stroke:#2d5f8a,color:#1a1a1a
  style F fill:#2d5f8a,stroke:#2d5f8a,color:#fffff8
  linkStyle default stroke:#2d5f8a,stroke-width:2px
```

Upload a PDF of any academic paper that introduces an ML dataset. The agent reads it, extracts metadata, builds valid Croissant JSON-LD, and validates the output.

---
layout: SplitInsight
transition: wipe-right
---

# What goes in, what comes out

::left::

### Input

<v-clicks>

- **Academic paper** as PDF — the paper that introduces the dataset
- **Optional** HuggingFace URL for cross-referencing
- **Optional** dataset name override

</v-clicks>

::right::

### Output

- **croissant.json** — valid Croissant JSON-LD metadata
- **summary.md** — executive report with confidence levels
- **validation_report.json** — three-stage validation results

---
layout: section
transition: iris
---

# Under the hood

An AI agent with a runbook, a sandbox, and a self-healing loop.

---
transition: slide-left
---

# The agent architecture

<v-clicks>

1. **Runbook-driven** — a multi-page standard operating procedure is sent as the system prompt
2. **Claude Sonnet** powers the extraction — reading PDFs, mapping fields, building JSON-LD
3. **Sandboxed execution** — Python 3.12, 4 CPUs, 8GB RAM, 1200s timeout
4. **Three-stage validation** — JSON validity, Croissant schema compliance, record set generation
5. **Self-healing loop** — up to 3 iterations to fix validation errors automatically

</v-clicks>

---
transition: morph-fade
---

# Confidence tracking

The agent distinguishes what it knows from what it guesses.

<div class="grid grid-cols-3 gap-6 mt-8">
<div>

### High confidence

Extracted directly from the paper — dataset name, authors, license, task type

</div>
<div>

### Medium confidence

Inferred from context — column types, data splits, file formats

</div>
<div>

### Low / gaps

Not in the paper — download URLs, exact file sizes, update frequency

</div>
</div>

---
transition: slide-up
---

# The stack

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

### Frontend

- **Next.js 15** with App Router
- **React 19** + Tailwind CSS 4
- Real-time status polling with **React Query**
- Deployed on **Vercel**

</div>
<div>

### Backend

- **Jetty API** for agent orchestration
- **Claude Sonnet** for PDF comprehension
- **mlcroissant** Python library for validation
- Sandboxed execution with network access

</div>
</div>

---
layout: quote
transition: fade
---

# Five benchmark datasets ship with the repo

SQuAD 2.0, GLUE, WikiText, CNN/DailyMail, and GSM8K — each with the original paper PDF and a reference Croissant file from HuggingFace for output comparison.

---
layout: end
transition: iris
---

# From papers to metadata, without the manual work.

Open source under MIT. github.com/jettyio/pdf2croissant
