# Source material extraction (project decks only)

When `project-url` is declared in the spec, read the project's source documents before compiling. Each source type contributes differently:

| Source | What it provides | Deck contribution |
|--------|-----------------|-------------------|
| README | Factual backbone — what, why, how | Accurate claims, correct terminology, feature inventory |
| CHANGELOG | Temporal narrative — what evolved | Story arc, "before/after" moments, version milestones |
| ARCHITECTURE | Structural understanding — how pieces connect | Diagrams, code examples, system-level slides |
| LESSONS_LEARNED | Storytelling gold — what surprised, what broke | War stories, counterintuitive findings, design insights |
| Project identity | What makes THIS project unique — name, description, differentiators, visual brand | Cover subtitle, "what is this" slide, accent color override |
| Screenshots | Visual evidence — proof it works | `visual-evidence` slides, hero images |
| Specs (feature/API/design) | Scope boundaries — inclusions and exclusions | Constraint slides, "what we chose NOT to build" |
| Research docs | Decision archaeology — why X not Y | Comparison slides, "we tried three approaches" |
| `wrangler.jsonc` | Infrastructure topology — bindings, services, routes | Architecture diagrams, binding maps |
| `package.json` | Dependency map, script surface area | Tech stack slides, integration points |
| Config files (CI, build, deploy) | Operational posture — how the project ships | Pipeline diagrams, deployment slides |

## Extraction heuristics

| Source | Extract | Becomes slides | Becomes notes | Priority |
|--------|---------|----------------|---------------|----------|
| Code | Function signatures, types, constants, error messages | Architecture, API surface, code walkthrough | Implementation detail, edge cases | Highest for facts |
| LESSONS_LEARNED | Surprises, failures, metrics, quotes | War stories, insight slides, counterintuitive findings | Context, timeline, attribution | Highest for narrative |
| ARCHITECTURE | System diagrams, component relationships, data flow | Mermaid diagrams, topology slides | Design rationale, alternatives considered | High |
| Specs | Scope, constraints, non-goals | Constraint slides, design decision slides | Full requirements, acceptance criteria | High for scope |
| Research docs | Comparisons, benchmarks, decision matrices | Comparison slides, evidence slides | Methodology, raw data | Medium |
| README | Setup, features, usage examples, first-paragraph description | Feature inventory, getting started, project identity slide | Installation, contributing guide | Highest for identity, medium for facts |
| Config files | Bindings, routes, build steps, deploy targets | Pipeline diagrams, infrastructure slides | Full config, environment variables | Low (supporting) |
| `package.json` | Dependencies, scripts, versions | Tech stack slides | Exact versions, dev dependencies | Low (supporting) |

Rules: code > prose for facts, LESSONS_LEARNED > ARCHITECTURE for narrative, specs > README for scope.

Rules:
- Read at least 2 sources before writing any slides.
- Extract the through-line from the source material — it should emerge naturally from the project's own story.
- Note specific numbers, code snippets, and quotes for later use — vague paraphrases are weaker than exact project data.
- Note source file + section for each extracted fact or story — the provenance chain must survive into the final `Sources:` citations on each slide.
- If a claim can't be traced to a source, don't include it. Prefer a narrative gap over a fabricated anecdote.

## Find what's surprising

The best project decks surface what's novel, counterintuitive, or unexpected about the project. After reading the source material, actively look for these patterns:

**Ecosystem mismatch — the project uses a language, tool, or pattern that's unusual for its platform:**
- A Python project on a platform where JavaScript is the norm (e.g., Cloudflare Workers)
- A CLI tool for a task that's usually a web app
- A functional approach in an OOP ecosystem, or vice versa
- Using SQLite where most people would reach for Postgres
- To detect this: check what language/framework the platform documentation defaults to, then compare with what the project actually uses

**Cross-boundary architecture — the project bridges systems that don't normally talk:**
- A Python service calling a JavaScript service on the same platform
- An AI service (TTS, embeddings) integrated into a non-AI pipeline
- A local tool that reads cloud-generated data, or vice versa
- To detect this: look at the dependency list, config files, and architecture docs for multiple runtimes, services, or APIs that interact

**Surprising constraints adopted by choice:**
- Read-only access as an architectural decision, not a limitation
- Zero dependencies when the ecosystem expects many
- Single-threaded when multi-threaded is the "obvious" choice
- No network calls in a world that assumes cloud-first

**Counterintuitive results from the project's own experience:**
- A simpler approach outperforming the "proper" one
- A constraint that turned out to be a feature
- A debugging strategy that contradicted standard practice

**What is NOT surprising (don't present these as novel):**
- Standard platform pricing or billing models
- Using a framework for its intended purpose
- Having tests, CI, or documentation
- Feature lists that match the README description
- Anything that someone familiar with the platform would expect

**Where to find these:**
1. The language/framework vs the platform's default — compare README with platform docs
2. Config files (wrangler.jsonc, Dockerfile, etc.) — multiple runtimes or service bindings signal cross-boundary architecture
3. LESSONS_LEARNED — explicitly documents surprises and failures
4. README "Why" or "Philosophy" sections — reveals intentional constraints
5. The dependency list — package.json, pyproject.toml, go.mod
6. Architecture decisions — especially "why NOT" sections

**How to use them:**
- At least one slide should feature a genuinely surprising element of the project
- Frame surprises as insight slides (`center` or `statement` layout) — they earn the pause
- Connect the surprise to the through-line when possible — "we expected X but found Y, which is why Z"
- Don't manufacture surprises. If the project is straightforward, say so. Forced novelty reads as dishonest.

## Extract the through-line

The through-line is the conceptual thread that runs through every section of the deck. It must come from the source material, not be imposed on it.

**Through-line types:**

| Type | Shape | Example |
|------|-------|---------|
| `question` | A question posed early, answered repeatedly | "What happens when you give a function a name, a memory, and a mailbox?" |
| `metaphor` | A concrete image that maps to the abstract concept | "The garden grows itself" (for emergent systems) |
| `concept` | A technical idea that connects all sections | "Single-threaded guarantee" (connecting state, sync, coordination) |
| `provocation` | A bold claim the deck proves or disproves | "The agent is the application" |
| `design-rule` | A constraint that shaped every decision | "Read-only to sources" |

**Through-line IS:**
- Present in at least 3 slides, ideally 5-6, across the deck
- Gaining new meaning with each appearance
- Resolved or answered in the closing slides

**Through-line IS NOT:**
- A tagline that appears only on the cover and closing (bookend syndrome)
- A decorative metaphor with no analytical function
- Multiple competing threads (one deck, one through-line)

## Surface project identity

Every project deck must communicate what the project actually IS before diving into how it works. Generic decks happen when the compiler skips this step.

**Rules:**
- The cover slide MUST use the project's one-line description as the subtitle — not the through-line. The through-line belongs in section breaks and the closing, not the cover.
- Slide 2 should explain what the project IS and WHY it exists before diving into architecture or internals. The audience needs context before complexity.
- If the project has a color identity (from its logo, UI palette, terminal output, or branding), those colors MUST override the preset's accent color via `--deck-accent` and related tokens.
- If screenshots or demo output images exist in the repo (README images, `docs/` screenshots, example output), at least one must appear in the deck as a `visual-evidence` slide or hero image.
- The project's README description should appear on the cover subtitle. Beyond that, don't recite the README — synthesize across all sources.
- The project's GitHub URL MUST appear in the deck — on the cover slide, the end slide, or both. The audience needs to know where to find the project. Use the `project-url` from the spec.

**Where to find project identity:**
1. README first paragraph or repo description (one-line summary)
2. README "Features" or "Why" section (differentiators from alternatives)
3. Logo file, favicon, or UI screenshots (visual identity / brand colors)
4. Demo output, terminal screenshots, or example renders (what it looks like in action)
