# MergePact — Design System

## Visual concept

**The open engineering ledger.** Tactile craft: ruled baselines, margin notes, status stamps, one highlighter line from open commitment to released reward. Light mode only.

## Palette

See [`docs/BRAND.md`](BRAND.md) for the full brand kit.

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#F4F1EA` | Page background |
| `--ink` | `#172033` | Text, borders |
| `--action` | `#3B5BDB` | Primary CTA, focus |
| `--confirmed` | `#B6E34D` | Confirmed funding, release |
| `--review` | `#FF6B4A` | Awaiting review, deadlines |
| `--rule` | `rgba(23,32,51,.16)` | Ledger lines |
| `--danger` | `#B42318` | Errors only |
| `--gradient-start` | `#F4F1EA` | Mesh background start |
| `--gradient-mid` | `#E8EDFF` | Soft ledger-blue wash |
| `--gradient-end` | `#F0FBE8` | Soft lime wash |

## Backgrounds

- `.mp-gradient-bg` — paper mesh with action blue + confirmed lime radial blobs
- `.mp-grid-overlay` — faint ledger grid at ~40% opacity
- `.grain` — 2% texture overlay
- `LedgerBackground` component wraps gradient + grid for shell, preview, and wall

## Typography

- Display/UI: **Familjen Grotesk**
- Mono: **IBM Plex Mono** for IDs, amounts, deadlines, receipts

## Layout

- 4px spacing base
- Mobile gutter: 20px
- Max width: 1180px
- Card radius: 8px
- Min touch target: 48px

## Status stamps

| State | Label | Style |
| --- | --- | --- |
| Open | OPEN / FUNDED | Blue border, paper fill |
| Claimed | IN PROGRESS | Navy fill, paper label |
| Submitted | AWAITING REVIEW | Coral, navy text |
| Released | RELEASED | Lime, navy stamp |
| Cancelled | CANCELLED | Neutral outline |
| Reclaimed | RECLAIMED | Neutral outline |

## Motion

- Status stamp press: 180ms scale pulse after receipt
- Board highlight: 450ms
- Respect `prefers-reduced-motion`

## Rejected patterns

No dark crypto dashboard, purple gradients, glassmorphism, token charts, giant CONNECT WALLET hero.
