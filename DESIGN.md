# Design System — AssemblyAI-Inspired Voice Capture UI

## 1. Visual Theme & Atmosphere

AssemblyAI's design system embodies a modern, technical aesthetic that balances enterprise sophistication with approachable clarity. The visual language emphasizes precision and intelligence, reflecting the brand's leadership in Speech AI. Dark, neutral foundations create a professional baseline, while bold accent colors (deep blue and warm coral) inject energy and guide user attention.

**Key Characteristics**
- Modern, tech-forward aesthetic with enterprise credibility
- Balanced neutral and accent color palette with deliberate contrast
- Clean, legible typography using Monument Grotesk at generous sizes
- Strategic use of whitespace to reduce cognitive load
- Subtle depth through layering and gradient overlays
- Warm accent colors (coral, gold) humanize technical products

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2545D3` | CTAs, active states, brand moments |
| Secondary | `#0067CE` | Secondary actions |
| Accent Coral | `#F18345` | Warnings, highlights, energy |
| Accent Gold | `#FFA800` | Tertiary accent, warnings |
| Heading Text | `#1C2024` | Headings and primary text |
| Body Text | `#000000` | Body copy |
| Muted Text | `#697586` | Secondary/tertiary text |
| Disabled | `#CCCCCC` | Disabled backgrounds |
| Surface | `#FFFFFF` | Cards, backgrounds |
| Surface Warm | `#F5F3EB` | Warm tertiary background |
| Border | `#E0E0E0` | Dividers and borders |

## 3. Typography

**Font:** Monument Grotesk (fallback: -apple-system, BlinkMacSystemFont, sans-serif)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display H1 | 64px | 400 | 64px |
| Heading H2 | 56px | 400 | 56px |
| Subheading H3 | 48px | 400 | 52.8px |
| Body | 18px | 400 | 27px |
| Body Small | 12px | 400 | 18px |
| Button | 12px | 600 | 18px |
| Label | 14.08px | 600 | 21.12px |

## 4. Buttons

**Primary:** `#2545D3` bg, white text, 8px radius, 12px 24px padding, hover darkens to `#1C3BB8`
**Secondary:** white bg, `#2545D3` border/text, 8px radius
**Ghost:** transparent, `#697586` text, 4px radius

## 5. Spacing (4px base)

- `4px` — Micro
- `8px` — Tight
- `16px` — Standard
- `24px` — Medium
- `32px` — Large
- `48px` — Section
- `60px` — Hero
- `64px` — Max

## 6. Elevation

- **Flat:** no shadow
- **Raised:** `0px 2px 4px rgba(0,0,0,0.04)`
- **Elevated:** `0px 4px 12px rgba(0,0,0,0.08)` — cards on hover
- **Floating:** `0px 8px 24px rgba(0,0,0,0.12)` — modals
- **Maximum:** `0px 12px 32px rgba(0,0,0,0.16)` — large overlays

## 7. Border Radius Scale

- `0px` — Technical content
- `4px` — Small interactive (tags)
- `8px` — Cards, containers, modals
- `12px` — Large feature cards, overlays
- `50px` — Pill inputs, full-round buttons