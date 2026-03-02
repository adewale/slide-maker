# presentation philosophy

Rhetorical principles derived from [speakerdeck.com/adewale](https://speakerdeck.com/adewale). These shape how decks are structured, not just how they look.

## 14 principles

### 1. One idea per slide
1-3 lines of text maximum. If you're scrolling, split it. The slide is a frame for a single thought, not a container for paragraphs.

### 2. Sustained metaphor as structural spine
A metaphor is not decoration — it does analytical work. "The garden grows itself" isn't a pretty image; it's a claim about emergent systems that structures every section of the deck. Choose a metaphor that can bear weight across 30+ slides.

### 3. Historical grounding before contemporary analysis
Establish roots before making claims about the present. Show that the idea has a lineage — it isn't a product launch disguised as insight.

### 4. Named frameworks and laws as anchors
Give your concepts handles: "The Toothbrush Test", "McKellar's Law", "The Napkin Threshold". Named ideas stick. Unnamed ideas drift.

### 5. ALL CAPS for strategic emphasis
ALL CAPS is a rhetorical device, not a formatting default. Used on one slide per section, it signals: this is the thesis. Overused, it becomes noise.

### 6. Text-dominant, image-sparse
Images only when demonstrative — a screenshot that proves, a diagram that explains. Never decorative. If the audience remembers the stock photo instead of the argument, the slide failed.

### 7. Decks are arguments, not outlines
Structure follows dialectical progression: thesis, complication, synthesis. The deck builds a case, not a table of contents. Every slide either advances the argument or provides evidence for it.

### 8. Provocative titles with colon structure
"Hook: Clarifier" — the title before the colon provokes, the subtitle after it frames. "The Toothbrush Test: Why Most Software Isn't Worth Using Twice" is better than "Software Quality Metrics Overview".

### 9. Cross-disciplinary references
Draw from philosophy, sociology, design history, economics, biology. A deck about APIs that references Jane Jacobs on neighborhood design is more memorable than one that only references API documentation.

### 10. Slides scaffold the speaker, not replace them
The slide provides the frame; the speaker provides the content. If the deck works without a presenter, it's a document, not a presentation. Trust the audience to listen.

### 11. No decorative imagery, ever
Every visual element earns its pixels. A border exists because it separates content areas. A color exists because it signals semantic meaning. A diagram exists because the relationship can't be expressed in prose. Nothing exists because it "looks nice."

### 12. Data as bold text assertions, not charts
"147 plant species. Zero dependencies." is more powerful than a bar chart showing the same data. When the data point is the argument, state it directly. Charts are for when the shape of the data matters more than any single number.

### 13. Openings: provocation, not agenda
Never open with an agenda slide or table of contents. Open with a question, an epigraph, or a bold declaration that creates tension. The audience should lean forward, not settle in.

### 14. Closings: resonance, not courtesy
Never close with "Thank you", "Questions?", or a URL. Circle back to the opening provocation. Let the final slide linger. Declare something worth remembering. The last slide is the one they photograph.

### 15. Rules produce structure, not substance
A deck that passes every structural check can still say nothing. The checklist catches missing pieces; only the presenter's genuine insight makes the deck worth giving. Structure without substance is a skeleton — anatomically correct and entirely lifeless.

## How these affect compilation

These principles influence the compiler at several points:
- **Phase 1** (source material): Look for the sustained metaphor and named frameworks in project docs
- **Phase 3** (implementation level): Text-dominant means most slides are pure Markdown, not component-heavy
- **Phase 5** (writing slides): One idea per slide, dialectical progression, provocative openings
- **Storytelling section**: Narrative arc maps to thesis → complication → synthesis
- **Closing slides rule**: "Resonance, not courtesy" reinforces the existing no-"Questions?" rule
