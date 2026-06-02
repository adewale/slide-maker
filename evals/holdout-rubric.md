# Held-out judging criteria

> **DO NOT reference this file from generation.** It must never be loaded by
> SKILL.md, COMPILER_RULES.md, STYLE_PRESETS.md, or any path the deck generator
> reads. It exists only for the eval judge. If a deck is optimized against these
> criteria, they stop measuring anything — that is the whole point of holding
> them out (Goodhart's law). The public rubric (DECK_RUBRIC.md / LLM_TELLS.md)
> drives generation; this file grades from criteria the author never saw.

Score the deck 0–10 on the holdout dimensions below, then write one or two
sentences of notes. Judge from first principles — do not infer these from the
public rubric.

- **Memorability** — Is there a single specific image, number, or sentence a
  viewer would repeat to a colleague the next day? A competent-but-forgettable
  deck scores low here even if it nails every public-rubric axis.
- **The skeptic test** — Would a hostile domain expert be convinced, or would
  they find the argument hand-wavy? Look for claims that sound insightful but
  survive no scrutiny.
- **Numerical integrity** — Are numbers specific and sourced, or suspiciously
  round / asserted without provenance ("10x faster", "millions of users")?
- **Earned ending** — Does the closing land because the deck built to it, or is
  it a tacked-on flourish disconnected from what came before?
- **Compression** — Could any slide be cut entirely with no loss to the
  argument? Padding and restatement lower the score.
- **Voice** — Does it read like a specific person with a point of view, or like
  committee output that could belong to any project?

A deck that aces the public rubric but scores low here is the signal to watch:
it means the generator is satisfying the measured axes without producing
something actually good. Report the divergence honestly.
