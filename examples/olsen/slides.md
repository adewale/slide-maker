---
theme: apple-basic
title: Olsen
colorSchema: light
transition: slide-left
layout: cover
---

# Olsen

Local-first photo indexing and faceted browsing.

---
layout: statement
---

# Your photos. Your database. Guaranteed read-only.

---
transition: slide-up
---

# The indexing pipeline

```mermaid {theme: 'neutral', scale: 0.85}
graph LR
  P["Photo Files"] --> E["EXIF Extract"]
  E --> T["Thumbnails"]
  T --> C["Color Analysis"]
  C --> H["Perceptual Hash"]
  H --> DB["SQLite"]
  style P fill:#ca8a04,stroke:#ca8a04,color:#fff
  style DB fill:#fef3c7,stroke:#ca8a04,color:#713f12
```

Metadata, thumbnails, color palette, and perceptual hash — all in one pass per photo.

---
layout: two-cols
---

# What it extracts

<v-clicks>

- **EXIF metadata** — camera, lens, exposure, GPS
- **Thumbnails** at 4 sizes, aspect-preserving
- **Dominant colors** via k-means clustering
- **Perceptual hashes** for duplicate detection

</v-clicks>

::right::

# Faceted search

<v-clicks>

- Users **never hit zero results**
- SQL computes valid facet values
- **11 Berlin-Kay** color categories
- Temporal, visual, equipment facets

</v-clicks>

---

# The state machine guarantee

```mermaid {theme: 'neutral', scale: 0.85}
graph TD
  A["All Photos"] -->|"filter: camera"| B["Canon photos"]
  B -->|"filter: color"| C["Canon + blue"]
  C -->|"filter: year"| D["Canon + blue + 2024"]
  style A fill:#fef3c7,stroke:#ca8a04,color:#713f12
  style B fill:#fef3c7,stroke:#ca8a04,color:#713f12
  style C fill:#fef3c7,stroke:#ca8a04,color:#713f12
  style D fill:#ca8a04,stroke:#ca8a04,color:#fff
```

Every filter combination is pre-validated. The UI only shows options that lead to results.

---
layout: section
---

# Built for scale

100K+ photos. 500MB constant memory. Hash-based resume.

---
layout: fact
transition: fade
---

# 62ms

Per photo

Metadata, thumbnails, color palette, and perceptual hash — all in one pass

---
layout: end
transition: fade
---

# Index your photos

`./bin/olsen index ~/Pictures --db photos.db`
