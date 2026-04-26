# Apsara Pencil Product Page Specification

## Project Overview
- **Project name**: Apsara Pencil Landing Page
- **Type**: Single-page product website
- **Core functionality**: Showcase Apsara pencils with product information, features, and call-to-action
- **Target users**: Students, artists, professionals looking for quality pencils

## UI/UX Specification

### Layout Structure
- **Header**: Fixed navigation with logo and nav links
- **Hero**: Full-width hero section with product image and tagline
- **Features**: 3-column grid showcasing key features
- **Product Range**: Grid of pencil variants
- **About**: Brand story section
- **Footer**: Contact and copyright

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full layout)

### Visual Design

#### Color Palette
- Primary: `#E85D04` (Vibrant orange - brand color)
- Secondary: `#1A1A1A` (Deep black)
- Accent: `#F4A261` (Warm gold)
- Background: `#FFFBF5` (Warm cream)
- Text: `#2D2D2D` (Dark gray)
- Light text: `#666666`

#### Typography
- Headings: "Playfair Display", serif
- Body: "DM Sans", sans-serif
- Logo: "Playfair Display" italic

#### Spacing
- Section padding: 80px vertical
- Container max-width: 1200px
- Grid gap: 32px

#### Visual Effects
- Subtle shadows on cards
- Hover transitions on buttons and cards
- Smooth scroll behavior
- Fade-in animations on scroll

### Components

#### Navigation
- Logo (Apsara text logo)
- Links: Home, Features, Products, About
- CTA button: "Buy Now"

#### Hero Section
- Large heading: "The Perfect Pencil for Every Stroke"
- Subheading: "Apsara - Crafted for excellence since 1950s"
- CTA button: "Explore Collection"
- Decorative pencil illustration (CSS-generated)

#### Features Section (3 cards)
1. Smooth Writing - "Glide effortlessly with our precision-ground graphite"
2. Durable Build - "Break-resistant leads that last longer"
3. Eco-Friendly - "Sustainably sourced cedar wood"

#### Product Range
- 4 pencil variants displayed in cards:
  - Apsara Dark (2B)
  - Apsara Classic (HB)
  - Apsara Gold (4B)
  - Apsara Artist (6B)
- Each card: image placeholder, name, description, price

#### About Section
- Brief brand story
- Historical context

#### Footer
- Copyright text
- Social links placeholder

## Functionality Specification

### Core Features
- Responsive navigation
- Smooth scrolling to sections
- Interactive product cards with hover effects
- Mobile hamburger menu

### User Interactions
- Click nav links → smooth scroll to section
- Hover product cards → subtle lift effect
- Click CTA buttons → visual feedback

## Acceptance Criteria
- Page loads without errors
- All sections are visible and properly styled
- Navigation links scroll to correct sections
- Product cards display with hover effects
- Responsive layout works on mobile/tablet/desktop
- All fonts load correctly
- Animations are smooth
