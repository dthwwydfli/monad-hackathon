# commit Brand Kit

## Identity

**Funded GitHub work, visible on-chain** — calm, accountable, inspectable. Not a crypto trading terminal.

Product name: **commit**. On-chain contract: `MergePact.sol`.

## Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#F4F1EA` | Base surface |
| `--ink` | `#172033` | Text, borders |
| `--action` | `#3B5BDB` | Primary CTA, focus |
| `--confirmed` | `#B6E34D` | Released / success |
| `--review` | `#FF6B4A` | Awaiting review |
| `--rule` | `rgba(23,32,51,.16)` | Dividers, grid |
| `--danger` | `#B42318` | Errors |
| `--gradient-start` | `#F4F1EA` | Mesh start |
| `--gradient-mid` | `#E8EDFF` | Soft blue wash |
| `--gradient-end` | `#F0FBE8` | Soft lime wash |

## Typography

- **Display / UI:** Familjen Grotesk
- **Evidence / chain data:** IBM Plex Mono

## Spacing and shape

- 4px base grid
- Card radius: 8px (`rounded-lg`)
- Min touch target: 48px
- Max content width: 1180px

## Component patterns

- **Navigation:** Link rail on paper routes; on home hero the header is fixed and fully transparent (white logo, links, wallet) until scroll, then paper bar returns
- **Hero:** Full-bleed nature photo with ink scrim; oversized headline and CTAs overlaid (light-on-dark text)
- **Try it demo:** Two-panel simulation on `/` and `/how-it-works` — fund → claim → proof → receipt; clearly labeled SIMULATION
- **Cards:** 1px ink border, paper fill, hover lift + soft shadow
- **Buttons:** Action blue primary; outlined secondary
- **Badges:** Status stamps with state-specific fills
- **Background:** Subtle paper-to-blue-to-lime mesh + faint grid + 2% grain

## Rejects

- Dark dashboard hero, purple neon, glassmorphism, token charts, wallet-first hero
- Fake live data on chain-backed routes

## Preview vs live

- `/preview` — labeled product mockups only
- `/`, `/pacts`, `/wall` — contract reads only
