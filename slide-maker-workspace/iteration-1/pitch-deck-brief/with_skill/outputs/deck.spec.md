# Deck Spec

## Meta
- title: The Breaking Point
- subtitle: API monitoring that catches breaking changes before production does
- purpose: pitch deck for API monitoring startup targeting VP Engineering buyers
- audience: VPs of engineering evaluating developer infrastructure investments
- tone: authoritative, specific, high-trust
- target-length: 7
- notes: yes
- style-preset: editorial-dark
- progress: segment-bar

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#e8e6e1"
  - accent: "#38bdf8"
  - accent-alt: "#f59e0b"
  - muted: "rgba(232, 230, 225, 0.45)"
- typography:
  - display: Playfair Display
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
  - end
- custom-layouts: []
- components:
  - KeyboardHelp
  - ProgressSegmentBar
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: The Breaking Point
- subtitle: Your API contract broke at 2 AM. Your customers found it first.
- notes:
  - Open with the scenario every VP has lived through. Pause after the subtitle.
  - The phrase "breaking point" does double duty: the literal API break, and the organizational pain threshold.

### Slide 2
- kind: fact
- layout: fact
- title: 73%
- body: of production incidents originate from API contract mismatches between services that passed all their unit tests.
- transition: fade
- notes:
  - This is not about test coverage. It is about the gap between what a service promises and what it delivers. Unit tests verify internal behavior. Nobody verifies the seam.

### Slide 3
- kind: section
- layout: section
- title: THE SEAM BETWEEN SERVICES
- subtitle: Where contracts live and where they break
- transition: iris
- notes:
  - Section break. Transition from the problem statement to the architectural explanation. "The seam" is the through-line concept. Every interface between two services is a seam, and seams are where things tear.

### Slide 4
- kind: default-content
- layout: default
- title: What we monitor
- body: |
  - Schema drift between documented and actual API responses
  - Payload shape changes across deployment boundaries
  - Latency regressions that breach SLA thresholds
  - Deprecation signals in upstream dependencies
- transition: slide-left
- notes:
  - Walk through each bullet deliberately. These are not features; they are failure modes that VPs recognize from their own incident retrospectives.
  - The audience should be nodding. If they are not, they have never run a microservices platform.

### Slide 5
- kind: center-statement
- layout: center
- title: Every breaking change was detectable 48 hours before it shipped.
- body: The signal was in the diff. The contract was in the schema. Nobody was watching the seam.
- transition: morph-fade
- notes:
  - This is the thesis. The problem is not detection difficulty. It is observability absence. Pause after "nobody was watching the seam." Let that land before advancing.
  - The through-line returns: the seam is where value leaks and where monitoring belongs.

### Slide 6
- kind: default-content
- layout: default
- title: How it works
- body: |
  - One agent, one YAML file, deployed at your gateway
  - Real-time diff against OpenAPI, gRPC, or GraphQL
  - Alerts in Slack, PagerDuty, or CI before merge
- transition: slide-left
- notes:
  - Three sentences. Agent, diff, alert. The VP does not need the technical architecture. They need to know: how much work to adopt, what it compares against, where the alert goes.

### Slide 7
- kind: end
- layout: end
- title: Stop finding breaks in production.
- subtitle: Start watching the seam.
- transition: fade
- notes:
  - Echo the opening. Slide 1 was the pain. Slide 7 is the resolution. "The seam" ties back to slide 3 and slide 5.
  - Do not say thank you. Do not show a URL. Let the sentence hang.
