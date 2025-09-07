# 🧩 Component Library

## Buttons

### Primary Button
- **Background**: Blue to cyan gradient (`linear-gradient(to right, #3b82f6, #06b6d4)`)
- **Text**: White, 16px, Inter medium (500)
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Shadow**: Medium shadow on hover
- **States**: Default, Hover (scale 1.05), Active, Disabled (opacity 0.5)

### Secondary Button
- **Background**: White
- **Border**: 1px solid #e2e8f0
- **Text**: #334155, 16px, Inter medium (500)
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **States**: Default, Hover (background #f8fafc), Active, Disabled

### Outline Button
- **Background**: Transparent
- **Border**: 1px solid current color
- **Text**: Inherits color, 16px, Inter medium (500)
- **Padding**: 12px 24px
- **Border Radius**: 8px

## Cards

### Standard Card
- **Background**: White
- **Border**: 1px solid #e2e8f0
- **Border Radius**: 16px
- **Shadow**: Large shadow
- **Padding**: 24px
- **Hover**: Lift effect (translateY -2px), enhanced shadow

### Feature Card (Onboarding)
- **Background**: White
- **Border**: 2px solid #e2e8f0
- **Border Radius**: 16px
- **Padding**: 16px
- **Hover**: Scale 1.01, lift effect
- **Selected State**: Colored background, colored border, ring effect

### Course Card
- **Background**: White
- **Border**: 1px solid #e2e8f0
- **Border Radius**: 12px
- **Padding**: 24px
- **Header Padding**: 12px (bottom)
- **Content Padding**: 0 (top)

## Badges

### Level Badge
- **Beginner**: Green - background #f0fdf4, text #15803d, border #bbf7d0
- **Intermediate**: Blue - background #eff6ff, text #1d4ed8, border #bfdbfe
- **Advanced**: Red - background #fef2f2, text #dc2626, border #fecaca

### Recommended Badge
- **Background**: #fef3c7
- **Text**: #92400e
- **Border**: #fde68a
- **Icon**: Star icon, 12px

### Topic Badge
- **Background**: #f1f5f9
- **Text**: #64748b
- **Border Radius**: 4px
- **Padding**: 4px 8px
- **Font Size**: 12px

## Form Elements

### Input Field
- **Background**: White
- **Border**: 1px solid #d1d5db
- **Border Radius**: 6px
- **Padding**: 12px 16px
- **Font**: 16px Inter
- **Focus State**: Border #3b82f6, ring 2px #bfdbfe

### Radio Group (Custom)
- **Hidden Input**: sr-only class
- **Label**: Full click area
- **Card Style**: Same as feature card
- **Selection**: Visual feedback through background and border colors

## Layout

### Container
- **Max Width**: 1152px (6xl)
- **Horizontal Padding**: 32px (lg:px-8), 24px (sm:px-6), 16px (px-4)
- **Margin**: Auto centered

### Section Spacing
- **Vertical Padding**: 80px (py-20), 64px (py-16), 48px (py-12)
- **Margin Bottom**: 48px (mb-12), 32px (mb-8), 24px (mb-6)

### Grid Systems
- **Two Column**: grid-cols-1 md:grid-cols-2
- **Course Grid**: grid-cols-1 md:grid-cols-2, gap-24px
- **Responsive Gaps**: gap-12px (sm), gap-16px (md), gap-20px (lg)

## Typography Scale

### Headings
- **H1 (Hero)**: 60px/60px, bold (700), gradient text
- **H2 (Section)**: 36px/46.8px, bold (700)
- **H3 (Card Title)**: 24px/28.8px, semibold (600)
- **H4 (Subsection)**: 20px/24px, semibold (600)

### Body Text
- **Large**: 20px/28px, normal (400)
- **Base**: 16px/24px, normal (400)
- **Small**: 14px/20px, normal (400)
- **Extra Small**: 12px/16px, normal (400)

## Interactive States

### Hover Effects
- **Scale**: transform scale(1.01) - subtle
- **Scale Enhanced**: transform scale(1.02) - moderate
- **Lift**: transform translateY(-2px)
- **Shadow Enhancement**: Increase shadow intensity
- **Color Shifts**: Subtle background color changes

### Active States
- **Pressed**: transform scale(0.98)
- **Focus**: Ring outline 2px, ring offset 2px

### Loading States
- **Shimmer Effect**: Background position animation
- **Spinner**: Rotate animation, 1.5s linear infinite
- **Skeleton**: Pulse animation, 2s ease-in-out infinite

## Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px
