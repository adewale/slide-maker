# Storytelling in Technical Presentations

How we think about narrative structure in project decks. This document is a reference for the compiler — it shapes how through-lines are chosen, how openings create tension, and how closings resolve it.

## Three things that are not the same thing

**Through-line**: The tension that runs from slide 1 to the closing slide. It is the reason the audience keeps listening. It poses a question, a problem, or a paradox early and withholds the resolution until the end. Without a through-line, slides are facts in sequence — informative but not compelling.

**Value proposition**: The answer. What the project does for the user. "We extract dataset metadata from academic papers." It belongs at the resolution, not the opening. A value proposition stated on slide 2 is a brochure, not a story.

**Story**: The journey from tension to resolution. The through-line creates the forward pull. The value proposition resolves it. The story is the path between them — complications, evidence, insights, and the moments where the obvious approach fails.

These three work together but they are not interchangeable. A through-line without a story is a riddle. A value proposition without a through-line is a feature list. A story without a resolution is frustrating.

## Why stories work

A presentation is not a document read aloud. A document can be scanned in any order. A presentation unfolds in time — the audience must be given a reason to start, a reason to continue, and a reason to remember.

**Reason to start**: The opening must create tension — a question, a paradox, a problem the audience recognises. "Metadata standards assume you already have the metadata" works because ML practitioners have felt this friction. "Here's what our tool does" doesn't work because the audience has no reason to care yet.

**Reason to continue**: Each slide must either deepen the problem or move toward the resolution. If a slide does neither, it belongs in an appendix. The audience is tracking the through-line — every slide that doesn't serve it breaks the thread.

**Reason to remember**: The ending must resolve the opening. The last slide is the one they photograph. It should echo the first slide's tension and show how it has been answered. "The metadata was always in the paper. Now it is in the JSON" works because it directly resolves "metadata is trapped in academic papers."

## Kurt Vonnegut's shapes of stories

Vonnegut identified recurring shapes that stories take when you plot the protagonist's fortune over time. These shapes apply to technical presentations:

### Man in Hole (most common for project decks)
Fortune starts OK, drops into a problem, climbs back up through the solution. "Things were fine, then we hit this problem, then we solved it." This is the natural shape for a project that exists because something was broken.

- pdf2croissant: datasets exist → metadata is trapped in prose → the agent extracts it
- olsen: photos exist → indexing tools corrupt files → read-only architecture prevents it
- tasche: articles exist → links die → Tasche archives them

### Boy Meets Girl (discovery story)
Fortune rises when the protagonist finds something wonderful, drops when complications arise, rises again when they're resolved. Good for projects born from a surprising discovery.

- claude-history-explorer: JSONL files exist → they contain personality patterns → deterministic arithmetic reveals them
- geist-fabrik: notes accumulate → they contain forgotten connections → geists surface them as questions

### In Media Res (starting in the middle)
Begin with the crisis already happening. Don't explain the world first — drop the audience into the problem and let context emerge. "480 tests pass. Core workflow broken." — the audience is immediately in tension.

This is powerful for technical talks because it skips the setup that audiences already know. Don't explain what Cloudflare Workers are. Don't explain what ML datasets are. Start with the moment things got interesting.

### Tragedy (the constraint story)
Not every story has a happy ending. Some projects exist because of hard constraints that can never be fully resolved — they can only be managed. The terminal will never have sub-pixel rendering. Pyodide will never run C extensions. The paper will never contain every field Croissant needs.

Tragedy is underused in technical talks. Acknowledging what your project *cannot* do — and showing that you designed around it — is more trustworthy than pretending limitations don't exist. The audience respects a project that knows its boundaries.

- vaders: the terminal can't do smooth animation → embrace chunky movement as the genre
- tasche/planet-cf: Python can't call JS APIs natively → build a boundary layer

### Which shape to use

The shape should match the project's origin story:

| Origin | Shape | Opening |
|--------|-------|---------|
| "Something was broken, we fixed it" | Man in Hole | State the broken thing |
| "We discovered something surprising" | Boy Meets Girl | Show the surprising thing |
| "We were already in trouble" | In Media Res | Drop into the crisis |
| "We hit a wall and designed around it" | Tragedy | State the constraint |

## Through-lines for project decks

A through-line for a project deck should have three properties:

1. **It names the problem** — not the solution, not the architecture, not the design philosophy. The problem. What is broken, missing, or hard?

2. **It sustains across the deck** — it can be referenced on the cover, complicated in the middle, and resolved at the end. If it only works on 2 slides, it's an aside, not a through-line.

3. **It resolves into the value proposition** — the closing slide answers the tension the opening created. The through-line is the question; the value proposition is the answer.

### Anti-patterns

- **Design observation as through-line**: "Constraint as architecture" is an observation about the project, not a tension. It doesn't make the audience lean forward. There's nothing to resolve.
- **Conclusion stated upfront**: "Accept the constraint" reveals the ending on slide 2. The audience has nowhere to go.
- **Curiosity without stakes**: "What happens when Python runs inside JavaScript?" is a curiosity, but the audience doesn't know why they should care. Add stakes: "What happens when Python runs inside JavaScript — and your articles depend on it surviving?"
- **Implementation focus**: "The runbook is the system prompt" describes an architecture decision. The audience cares about what the decision enables, not the decision itself.

## How this affects the compiler

The compiler should evaluate through-lines against these criteria during Phase 3 (Intake):

1. Does the through-line name a problem the audience recognises?
2. Can it sustain across the full deck (cover → middle → closing)?
3. Does the closing slide resolve the opening tension?
4. Is the story shape appropriate to the project's origin?

During Phase 7 (Validate), check:
- Does the opening create tension (not state the solution)?
- Does the closing resolve the opening (not introduce new ideas)?
- Can you trace the through-line across at least 5 slides?

## Deck inventory

### Speakerdeck talks (speakerdeck.com/adewale)

| Deck | Shape | Through-line (tension) | Resolution |
|------|-------|----------------------|------------|
| Tools For Thought: From the Memex to Index Cards | Man in Hole | How do we improve thinking and manage cognitive decline? | Build personal systems — "bicycles for the mind" over "spaceships for the mind" |
| I Never Metaphor I Didn't Like | Man in Hole | Skeuomorphism vs flat design: how should designers use metaphor? | Restrained metaphors (the card interface) balance usability with digital authenticity |
| Why Is an API Like a Puppy? | Tragedy | APIs look free but demand long-term commitment | "APIs, like puppies, are an expensive long-term commitment. But sometimes they're worth it." |
| DevRel Leadership: All the Pieces Matter | Man in Hole | What does effective DevRel leadership actually require? | A cycle: purpose → goals → metrics → activities → people → new leaders |
| The True Nature of the Singleton Pattern | Boy Meets Girl | Is the Singleton really a class? | It's a pattern of four separable concerns: policy, environment, mechanism, subject |
| Semantic Image Search | Man in Hole | How do you teach machines to understand images without hand-coding rules? | Deep learning discovers patterns from data, but this power requires ethical responsibility |
| A Web of Identity | Man in Hole | How does identity persist across devices and contexts? | "There isn't a mobile web. There's one web that understands the user, their context, and their journey." |
| Software Craftsmanship Meets UX | Man in Hole | Why do developers tolerate terrible tools? | Developer Experience: apply UX principles to developer-facing products |
| GeistFabrik and AI-Augmented Development | Boy Meets Girl | What does AI-assisted software development actually look like? | Practical insights from building a generative text tool with AI |
| Creating Successful Apps in 2017 | Man in Hole | What distinguishes successful apps? | Evidence-based patterns from app market analysis |
| What Makes a Popular Android App? | Man in Hole | What separates popular Android apps from the rest? | Data-driven quality signals |
| A Mobile Web of Apps and Documents | Man in Hole | The web is fragmenting across apps and contexts | Design for the document web, not just the app web |
| The State of Social | In Media Res | Social platforms are changing faster than our understanding of them | Map the landscape as it shifts |
| Cross-Context User Journeys | Man in Hole | Users move between devices but products don't follow | Design for journeys, not screens |
| Introduction to Software Craftsmanship | Boy Meets Girl | What if we treated software development as a craft? | Apprenticeship patterns as a path to mastery |
| 10 Themes in Social Login | Man in Hole | Social login is full of hidden complexity | Ten patterns that separate good implementations from broken ones |

### Generated project decks (slides-oshineye-dev.adewale-883.workers.dev)

| Deck | Shape | Through-line (tension) | Resolution | Through-line works? |
|------|-------|----------------------|------------|-------------------|
| pdf2croissant | Man in Hole | ML dataset metadata is trapped in academic papers that no platform can parse | "The metadata was always in the paper. Now it is in the JSON." | Yes — problem + solution, sustained across 25 slides |
| claude-history-explorer | Boy Meets Girl | Your Claude conversations contain patterns — can you see them without AI? | Deterministic arithmetic on timestamps reveals personality | Partially — the paradox is strong but "personality without AI" is a curiosity, not a problem the audience has |
| geist-fabrik | Boy Meets Girl | Your Obsidian notes know things you've forgotten | Geists surface them as questions you wouldn't ask yourself | No — "muses not oracles" is a design principle, not a tension |
| olsen | Man in Hole | Photo libraries are fragile — every indexer that touches your files risks corrupting them | Read-only architecture makes corruption structurally impossible | No — "constraint as architecture" is an observation, not the problem |
| tasche | Man in Hole | Links die. Paywalls appear. The article you saved is gone | Tasche archives it before it disappears | No — "Python where JavaScript goes" is an architecture curiosity, not the user's problem |
| planet-cf | Man in Hole | RSS is dying but developer communities still need aggregated content | A Python feed aggregator on Cloudflare's edge | No — "Python inside JavaScript's house" is the same curiosity framing as tasche |
| vaders | Tragedy | Terminals can't do smooth animation, sub-pixel rendering, or GPU acceleration | Embrace the constraint: chunky movement IS Space Invaders | Partially — "accept the constraint" is the right conclusion but stated too early |
