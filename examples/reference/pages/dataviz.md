---
layout: section
transition: iris
---

# Data Visualization

Word-sized charts. Inline with prose. No charting library.

---
transition: slide-left
---

# Sparklines and Small Multiples

<div v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }">

<SmallMultiples :cols="4">
<div>
  <Sparkline :data="[10, 15, 12, 18, 22, 19, 25]" :width="90" :height="20" color="#3b5f87" />
  <div><strong>Rising</strong></div>
</div>
<div>
  <Sparkline :data="[25, 22, 18, 15, 12, 10, 8]" :width="90" :height="20" color="#994050" />
  <div><strong>Falling</strong></div>
</div>
<div>
  <Sparkline :data="[15, 18, 14, 19, 13, 17, 16]" :width="90" :height="20" color="#3b5f87" />
  <div><strong>Volatile</strong></div>
</div>
<div>
  <Sparkline :data="[15, 15, 16, 15, 15, 16, 15]" :width="90" :height="20" color="#3b5f87" />
  <div><strong>Stable</strong></div>
</div>
</SmallMultiples>

</div>

Sparkline renders an inline SVG polyline. SmallMultiples arranges children in a CSS grid.

<!-- Sparkline accepts data (array of numbers), width, height, and color props. SmallMultiples accepts a cols prop for grid column count. Both use currentColor by default, overridable with explicit color values.

Sources:
- file:slide-maker/COMPILER_RULES.md — data visualization component catalog -->

---
transition: slide-up
---

# MicroBar, BulletBar, and SlopeChart

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">

<div>

**MicroBar** — categorical comparison

<MicroBar :data="[{label: 'Build', value: 42}, {label: 'Test', value: 78}, {label: 'Deploy', value: 15}]" color="#3b5f87" />

</div>

<div>

**BulletBar** — actual vs target

<BulletBar :value="73" :target="90" :max="100" label="Coverage" />

</div>

</div>

<div style="margin-top: 2rem;">

**SlopeChart** — before and after

<SlopeChart :items="[{label: 'Build', start: 95, end: 20}, {label: 'Test', start: 60, end: 45}, {label: 'Deploy', start: 10, end: 70}]" startLabel="Before" endLabel="After" />

</div>

<!-- MicroBar takes data as [{label, value}]. BulletBar shows actual vs target with a marker line. SlopeChart shows before/after changes with connecting lines. All use currentColor by default.

Sources:
- file:slide-maker/components/MicroBar.vue — horizontal bar component
- file:slide-maker/components/BulletBar.vue — bullet graph component
- file:slide-maker/components/SlopeChart.vue — slope chart component -->

---
transition: glide
---

# WinLoss, DotStrip, and DataTable

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">

<div>

**WinLoss** — binary outcomes

<WinLoss :data="[1, 1, -1, 1, 0, -1, 1, 1, 1, -1, 1, 1]" />

Pass/fail sequences at a glance.

</div>

<div>

**DotStrip** — distribution

<DotStrip :data="[12, 15, 18, 22, 25, 28, 35, 42, 48]" />

Shows spread and clustering.

</div>

</div>

<div style="margin-top: 1.5rem;">

**DataTable** — minimal table

<DataTable :headers="['Feature', 'Type', 'Status']" :rows="[['v-clicks', 'Directive', 'Built-in'], ['v-mark', 'Directive', 'Built-in'], ['Sparkline', 'Component', 'Custom'], ['TufteSlide', 'Layout', 'Custom']]" />

</div>

<!-- WinLoss renders positive values up, negative down, zero as a thin line. DotStrip plots values as dots on a horizontal axis. DataTable renders a minimal table with bottom borders only — no vertical lines, no zebra striping.

Sources:
- file:slide-maker/components/WinLoss.vue — binary outcome visualization
- file:slide-maker/components/DotStrip.vue — dot plot component
- file:slide-maker/components/DataTable.vue — minimal table component -->
