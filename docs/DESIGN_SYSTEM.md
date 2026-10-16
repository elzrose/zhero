# ZHERO — Shared Design System Guide

> **Visual Style Reference:** Modern, minimal SaaS aesthetic inspired by clean productivity software (e.g. PostFlow reference style).

---

## 1. Brand Color Palette

ZHERO uses a curated, warm orange palette combined with crisp, modern neutrals to establish a trustworthy, energetic, and premium edtech brand.

| Token Name | Hex Code | Swatch | Intended Role |
| :--- | :--- | :--- | :--- |
| `--zhero-primary-orange` | `#FE6904` | ![#FE6904](https://via.placeholder.com/15/FE6904/000000?text=+) `#FE6904` | Primary brand accent, primary CTA buttons, active tab borders, brand logo |
| `--zhero-warm-orange` | `#FA9B2A` | ![#FA9B2A](https://via.placeholder.com/15/FA9B2A/000000?text=+) `#FA9B2A` | Secondary accents, progress gradients, warning alerts |
| `--zhero-pale-peach` | `#FFE5CE` | ![#FFE5CE](https://via.placeholder.com/15/FFE5CE/000000?text=+) `#FFE5CE` | Selected card highlights, badge backgrounds, subtle active state fills |
| `--zhero-golden-orange` | `#F39E2A` | ![#F39E2A](https://via.placeholder.com/15/F39E2A/000000?text=+) `#F39E2A` | High-emphasis tags, star ratings, milestone highlights |
| `--zhero-white` | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) `#FFFFFF` | Card surfaces, modal backgrounds, input fields, header bars |
| `--zhero-off-white` | `#F8F8F7` | ![#F8F8F7](https://via.placeholder.com/15/F8F8F7/000000?text=+) `#F8F8F7` | Main page background (`--color-bg-base`), secondary pill badges |
| `--zhero-near-black` | `#171717` | ![#171717](https://via.placeholder.com/15/171717/000000?text=+) `#171717` | Primary typography, titles, dark icons, high-contrast elements |
| `--zhero-muted-text` | `#77736F` | ![#77736F](https://via.placeholder.com/15/77736F/000000?text=+) `#77736F` | Secondary descriptions, table column headers, metadata, breadcrumbs |
| `--zhero-borders` | `#EAE7E2` | ![#EAE7E2](https://via.placeholder.com/15/EAE7E2/000000?text=+) `#EAE7E2` | Subtle dividing lines, card strokes, table borders |

---

## 2. Design Principles & Anti-Patterns

### ✅ Do:
- **Clean white & off-white base:** Maintain airy, spacious layouts with `#F8F8F7` body background and pure `#FFFFFF` cards.
- **Restrained orange accents:** Use `#FE6904` strategically for focal points, main action buttons, and active indicators.
- **Pale peach highlights:** Use `#FFE5CE` for badge backgrounds and active selection states.
- **Soft, modern borders:** Keep borders thin and clean (`1px solid #EAE7E2`).
- **Rounded geometry:** Use `border-radius: 12px` to `16px` for cards and `8px` to `10px` for buttons and inputs.
- **High legibility:** Stick with modern sans-serif typography (`Inter`, system fonts) with strong weight hierarchy.

### ❌ Don't:
- Do **not** introduce competing blue, purple, or green primary themes.
- Do **not** use harsh, heavy black box-shadows. Shadows must remain soft (`rgba(23, 23, 23, 0.04 - 0.08)`).
- Do **not** crowd elements; maintain generous padding (`--space-6: 1.5rem`).
- Do **not** use garish rainbow gradients across titles. Keep titles clean near-black (`#171717`).

---

## 3. Typography Scale

Font Family: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Element | CSS Variable | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title (H1)** | `--font-size-4xl` | `2.25rem` (36px) | `800` (Bold) | `1.2` |
| **Section Header (H2)** | `--font-size-2xl` | `1.5rem` (24px) | `700` (Semi-bold) | `1.3` |
| **Card Header (H3)** | `--font-size-xl` | `1.25rem` (20px) | `700` (Semi-bold) | `1.4` |
| **Body Text** | `--font-size-base` | `1rem` (16px) | `400` (Regular) | `1.5` |
| **Secondary / Subtext**| `--font-size-sm` | `0.875rem` (14px) | `500` (Medium) | `1.5` |
| **Badges & Captions** | `--font-size-xs` | `0.75rem` (12px) | `600` (Semi-bold) | `1.4` |

---

## 4. UI Components & Tokens Usage

### Buttons
- **Primary Action:**
  ```css
  background: var(--zhero-primary-orange); /* #FE6904 */
  color: #FFFFFF;
  border-radius: var(--radius-md); /* 12px */
  box-shadow: 0 2px 6px rgba(254, 105, 4, 0.25);
  ```
- **Secondary Action:**
  ```css
  background: #FFFFFF;
  color: var(--zhero-near-black); /* #171717 */
  border: 1px solid var(--zhero-borders); /* #EAE7E2 */
  border-radius: var(--radius-md); /* 12px */
  ```

### Cards
- Standard Card:
  ```css
  background: var(--zhero-white);
  border: 1px solid var(--zhero-borders);
  border-radius: var(--radius-lg); /* 18px */
  padding: var(--space-6); /* 1.5rem */
  box-shadow: 0 1px 3px rgba(23, 23, 23, 0.04);
  ```

### Badges & Pill Tags
- Peach Brand Badge:
  ```css
  background: var(--zhero-pale-peach); /* #FFE5CE */
  color: var(--zhero-primary-orange);   /* #FE6904 */
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
  font-size: 0.75rem;
  ```
