# Bargad: design principles

Status: draft from the 2026-10-29 reference study. Applies to `apps/web` first, then the Expo app and landing page.

## References and what we take from each

Read from the live login pages, in the browser, on 2026-10-29. We take principles. We don't copy their brand, copy, art or licensed fonts.

| Reference | Takes |
|---|---|
| **Sarvam** (indus.sarvam.ai login, sarvam.ai) | A soft serif for headings with a plain grotesque for everything else. Warm off-white ground (`#f7f5f3`), near-black ink (`#141414`), pill buttons, hairline borders, no shadows. A rounded panel on a pale ground. Short declarative copy. |
| **ElevenLabs** (sign-in) | One narrow centred column (360px), 12px radius controls, 46px control height, 14px medium labels, hairline `rgba(0,0,0,.1)` borders. Almost no chrome. |
| **1% Club** (onepercentclub.io, app auth) | A serif display against a sans body (Season Mix with Manrope). Money in large serif numerals (`₹18.35L`). A card split into a statement side and a form side. |

What we leave out: Sarvam's orange and blue hero gradient, 1% Club's photography and glass cubes, any pixel art.

## Principles

1. **Monochrome.** Ink on warm paper. No accent hue anywhere. Hierarchy comes from size, weight, fill and contrast.
2. **One bold thing per screen.** Everything else stays quiet. On the login page it is the inverted panel. On the dashboard it is the number or the item that needs the head.
3. **Serif for voice, sans for work, mono for money.** Headings and large figures are serif. Controls and labels are sans. Prices, quantities and timestamps are mono with tabular numerals.
4. **State is never colour alone.** With no colour, state is carried by fill (solid, outlined, soft), a glyph and a word. An error is an `!` glyph, a sentence and an underline, never just red.
5. **Hairlines, not shadows.** Separation comes from 1px borders and tonal steps. Shadow is allowed only on floating layers.
6. **Pills for actions, soft rectangles for containers.** Buttons are fully rounded. Panels are 20px. Inputs are 12px.
7. **Short, plain copy.** Say what happens ("Log in with passkey"). No "empower", no "seamless".
8. **Legible first.** Real users include a parent. Body text is 16px or more, controls are 44px or taller, and contrast is at least 4.5:1.
9. **Consent is visible.** Anything touching who can act on whose money is stated in plain words next to the control it affects.

## Tokens

| Token | Light | Dark |
|---|---|---|
| `bg` (ground) | `#f7f5f3` | `#0f0f0e` |
| `surface` | `#ffffff` | `#171716` |
| `surface-2` (soft fill) | `#efedea` | `#1f1f1d` |
| `line` | `#e3e0dc` | `#2b2b29` |
| `ink` | `#141414` | `#f2f0ed` |
| `ink-2` | `#3d3d3d` | `#c9c6c1` |
| `ink-3` (muted, 4.6:1 on `bg`) | `#6f6c68` | `#9a9792` |
| `inverse-bg` (the bold panel) | `#141414` | `#f2f0ed` |
| `inverse-ink` | `#f7f5f3` | `#141414` |

## Type

| Role | Face | Notes |
|---|---|---|
| Display and headings | **Instrument Serif** | Regular, tight tracking (−0.02em), line height 1.05–1.15 |
| UI and body | **Hanken Grotesk** | 400 and 500, 16px body, 14px controls |
| Money and data | **Geist Mono** | Tabular numerals, never bold |

Sarvam and 1% Club use licensed faces (Season Mix, Matter). These are free stand-ins with the same roles. Swap them in one place (`app/layout.tsx`) if a licence is bought.

Scale: 14 / 16 / 20 / 32 / 48 / 64px.

## Shape

- Controls: 46px high. Buttons are pills. Inputs have a 12px radius and a 1px `line` border.
- Panels: 20px radius, 8px gutter against the ground.
- Focus: a 2px `ink` ring with a 2px offset, visible on every control.
- Motion: 150ms ease-out for state changes only, and none under `prefers-reduced-motion`.

## Screens

1. **Login** (`/login`): done first. Passkey is the main path, password is the fallback, per section 2 of the design doc.
2. Household home, members, holdings, baskets and activity come after, built on these tokens.
