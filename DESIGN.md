---
name: Luminous Precision
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f1ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f3'
  surface-container-highest: '#e5e0ed'
  on-surface: '#1c1b24'
  on-surface-variant: '#474555'
  inverse-surface: '#312f39'
  inverse-on-surface: '#f3effc'
  outline: '#787586'
  outline-variant: '#c8c4d7'
  surface-tint: '#5643de'
  primary: '#5441dc'
  on-primary: '#ffffff'
  primary-container: '#6d5df6'
  on-primary-container: '#fffcff'
  inverse-primary: '#c6c0ff'
  secondary: '#516072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1f7'
  on-secondary-container: '#556477'
  tertiary: '#924800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75c00'
  on-tertiary-container: '#fffcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6c0ff'
  on-primary-fixed: '#150066'
  on-primary-fixed-variant: '#3d22c6'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb785'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#fcf8ff'
  on-background: '#1c1b24'
  surface-variant: '#e5e0ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 32px
  gutter: 24px
  card-padding: 24px
  section-gap: 64px
---

## Brand & Style
The design system focuses on "Luminous Precision"—a synthesis of high-performance utility and approachable intelligence. The target audience includes developers, product managers, and creative professionals who require an interface that feels both powerful and effortless.

The visual direction blends the technical rigor of a developer tool with the polished aesthetics of a premium consumer app. This is achieved through:
- **Minimalist rigor:** High functional density without visual clutter, inspired by professional productivity tools.
- **Glassmorphism:** Strategic use of background blurs on floating elements to provide depth and maintain context.
- **Atmospheric Depth:** A light, airy color palette that uses subtle gradients and soft shadows to create a multi-layered workspace.

## Colors
The palette is anchored by a vibrant, "Electric Indigo" primary color that signifies intelligence and action. 

- **Primary (#6D5DF6):** Used for primary actions, active states, and brand-critical highlights.
- **Background (#F8F9FE):** A cool-toned off-white that reduces eye strain and distinguishes the UI from pure white canvas elements.
- **Surface (#FFFFFF):** Used for cards, containers, and interactive components to create "lift" against the background.
- **Neutral/Secondary (#94A3B8):** Used for secondary text, borders, and icon states to provide hierarchy without competition.
- **Success/Accent (#10B981):** A vibrant green for positive feedback and AI-completion states.

## Typography
This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. 

Typography is treated with a tight tracking (letter-spacing) on larger headlines to replicate the "Linear" and "Stripe" editorial feel. Body text maintains standard spacing for readability. Use `Font Weight 600` (Semi-bold) for emphasis and navigation, while reserving `700` (Bold) for display hero text.

## Layout & Spacing
The layout follows a fluid 12-column grid for desktop, transitioning to 1 column for mobile. 

- **Generous Breathing Room:** Elements are never cramped. Use a base 8px scale.
- **Horizontal Centering:** On desktop, main content containers should be capped at 1280px to maintain focus.
- **Dynamic Padding:** Use larger padding (24px - 32px) for main containers to emphasize the spacious, airy brand personality.
- **Mobile Reflow:** Margins drop to 16px on mobile, with full-width cards often bleeding to the edge or maintaining a consistent 8px radius to save horizontal space.

## Elevation & Depth
Elevation is handled through a combination of tonal layering and soft, ambient shadows.

- **Level 0 (Background):** #F8F9FE. No shadow.
- **Level 1 (Cards/Main UI):** Surface White, 24px corner radius. Shadow: `0 4px 12px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Overlays/Modals):** Glassmorphism effect. Surface White at 80% opacity with a `20px backdrop-blur`. Shadow: `0 20px 40px rgba(0, 0, 0, 0.08)`.
- **Borders:** Use a subtle 1px stroke (`#E2E8F0`) on all cards to maintain definition against the light background, even when shadows are soft.

## Shapes
The design system uses a large-scale geometry to convey friendliness and modernity.

- **Main Containers & Cards:** Always use 24px (`rounded-xl` variant).
- **Interactive Elements:** Buttons and Input fields use 8px - 12px for a balanced, professional look.
- **AI-Driven Components:** Elements specifically related to "Buddy AI" features may use fully rounded (pill-shaped) aesthetics to differentiate "smart" UI from "structural" UI.

## Components
- **Buttons:** Primary buttons use a solid indigo background with white text. Secondary buttons use a transparent background with a subtle border and indigo text. 
- **Input Fields:** Large 12px border-radius, #FFFFFF background, and a 1px border. Focus state should include a subtle 3px indigo outer glow (box-shadow).
- **Cards:** 24px border-radius. Use white backgrounds with 1px light-gray borders. Include `card-padding` of 24px.
- **Chips/Badges:** Small, pill-shaped tags with low-opacity indigo backgrounds (#6D5DF6 at 10% opacity) and dark indigo text.
- **AI Command Bar:** Inspired by Notion AI; a floating glassmorphic input centered at the bottom or middle of the screen with a wide 32px border-radius and heavy backdrop-blur.
- **Icons:** Use **Lucide** icons with a 1.5px or 2px stroke weight. Icons should be monochrome (secondary color) unless they are active, where they inherit the primary indigo.
- **Glass Overlays:** Used for dropdowns and navigation sidebars to maintain a sense of space and context.