# 🎨 Figma Import Guide

## 📋 Preparation Steps

### 1. Take Screenshots
Visit each page in your browser and take full-page screenshots:

**Desktop Screenshots (1440px width)**:
- Homepage: `http://localhost:8080/`
- Onboarding Step 1: `http://localhost:8080/onboarding`
- Onboarding Step 2: `http://localhost:8080/onboarding/time`
- Onboarding Step 3: `http://localhost:8080/onboarding/experience`
- Learning Path: `http://localhost:8080/learning-path/coding/minimal/novice`
- Authentication: `http://localhost:8080/signin`

**Mobile Screenshots (375px width)**:
- Use browser dev tools to resize and capture mobile versions
- Same pages as desktop but at mobile breakpoint

### 2. Browser Tools for Screenshots
**Chrome/Edge**:
1. Press F12 to open Dev Tools
2. Click device toolbar icon (mobile/tablet icon)
3. Set dimensions: Desktop (1440x900), Mobile (375x812)
4. Right-click → "Capture full size screenshot"

**Firefox**:
1. Press F12 → Click responsive design mode
2. Set viewport size
3. Use screenshot tool in developer tools

---

## 🎯 Setting Up Figma

### 1. Create New Figma File
- File name: "Learning Platform Design System"
- Create pages: "Design System", "Homepage", "Onboarding", "Learning Path", "Mobile Versions"

### 2. Import Design Tokens

**Create Color Styles**:
```
Primary/Blue-500: #3b82f6
Primary/Blue-600: #2563eb
Purple/Purple-500: #8b5cf6
Slate/Slate-100: #f1f5f9
Slate/Slate-900: #0f172a
```

**Create Text Styles**:
```
Display/Large: Lexend, 60px, Bold
Heading/H1: Lexend, 48px, Bold
Heading/H2: Inter, 36px, Bold
Heading/H3: Inter, 24px, Semibold
Body/Large: Inter, 20px, Regular
Body/Base: Inter, 16px, Regular
Body/Small: Inter, 14px, Regular
```

**Create Effect Styles**:
```
Shadow/Small: 0 1px 2px rgba(0,0,0,0.05)
Shadow/Medium: 0 4px 6px rgba(0,0,0,0.1)
Shadow/Large: 0 10px 15px rgba(0,0,0,0.1)
```

### 3. Set Up Grid System
- **Desktop**: 12-column grid, 80px margins, 20px gutters
- **Mobile**: 4-column grid, 16px margins, 16px gutters

---

## 🔧 Component Creation

### 1. Create Button Components

**Primary Button**:
1. Draw rectangle: 200x48px
2. Fill: Linear gradient (Blue-500 to Cyan-500)
3. Corner radius: 8px
4. Text: "Button Text", Inter Medium 16px, White
5. Create component (Cmd/Ctrl + Alt + K)
6. Add variants: Default, Hover, Pressed, Disabled

**Secondary Button**:
1. Rectangle: 200x48px, White fill
2. Stroke: 1px, Slate-300
3. Text: Inter Medium 16px, Slate-700
4. Create component with variants

### 2. Create Card Components

**Feature Card (Onboarding)**:
1. Frame: 400x200px
2. Fill: White
3. Stroke: 2px, Slate-200
4. Corner radius: 16px
5. Add shadow effect: Large
6. Add icon placeholder (24x24px)
7. Add title text: Inter Semibold 18px
8. Add description: Inter Regular 14px
9. Create component with Selected/Unselected variants

**Course Card**:
1. Frame: 380x280px
2. White background, 1px border
3. 12px corner radius
4. Internal padding: 24px
5. Header section with title and badge
6. Content section with topics
7. Footer with button

### 3. Create Layout Components

**Section Container**:
1. Frame: 1440px width (auto height)
2. Padding: 80px top/bottom, 32px left/right
3. Center content with max-width constraint

---

## 📱 Building Pages

### 1. Homepage Recreation
1. Import screenshot as reference (set to 20% opacity)
2. Create new frame: 1440x auto
3. Build header component
4. Create hero section with:
   - Background blobs (use ellipses with blur effect)
   - Gradient text (use color styles)
   - CTA buttons (use button components)
5. Features grid using auto-layout
6. Comparison table with badges
7. Footer component

### 2. Onboarding Flow
1. Create master onboarding layout frame
2. Add progress indicator component
3. Build selection cards grid using auto-layout
4. Create variants for each step
5. Add navigation components

### 3. Learning Path Page
1. Hero section with gradient background
2. Timeline layout using auto-layout
3. Course cards in nested auto-layout frames
4. Time calculator tabs component
5. Career info two-column layout
6. CTA section with gradient background

---

## 🔄 Making Components Interactive

### 1. Create Component Variants
**Button States**:
- Default, Hover, Pressed, Disabled
- Use component properties for different variants

**Card States**:
- Default, Hover, Selected
- Change background colors and borders for states

### 2. Add Prototyping
**Onboarding Flow**:
1. Connect "Continue" buttons between steps
2. Add overlay transitions
3. Set interaction triggers (On Click)
4. Use "Smart Animate" for smooth transitions

**Learning Path**:
1. Link course cards to course detail overlays
2. Add hover effects with "While Hovering" trigger
3. Create time calculator tab switching

---

## 📊 Design System Organization

### 1. Design System Page Structure
```
📁 Design System
  📁 Colors
    - Primary Colors
    - Secondary Colors  
    - Gradients
    - Semantic Colors
  📁 Typography
    - Text Styles
    - Font Scales
  📁 Components
    - Buttons
    - Cards
    - Forms
    - Navigation
  📁 Layouts
    - Grids
    - Containers
    - Spacing
```

### 2. Component Library
- Create all components in Design System page
- Publish as team library for reuse
- Document usage guidelines for each component

---

## ✅ Quality Checklist

### Before Export/Handoff:
- [ ] All colors match design tokens
- [ ] Typography uses consistent text styles
- [ ] Components have proper naming
- [ ] Responsive layouts work at different sizes
- [ ] Hover states are defined
- [ ] Components are organized in design system
- [ ] Spacing follows 8px grid system
- [ ] All images are properly embedded
- [ ] Prototype flows work correctly

### For Developer Handoff:
- [ ] Use Figma Dev Mode
- [ ] Add component descriptions
- [ ] Specify animation durations
- [ ] Note any special interactions
- [ ] Include design tokens documentation

---

## 🛠 Recommended Figma Plugins

**For Design Systems**:
- **Design Tokens**: Import/export design tokens
- **Figma to Code**: Generate CSS from designs
- **Auto Layout**: Better auto-layout controls

**For Screenshots**:
- **Image Tracer**: Convert screenshots to vectors
- **Remove BG**: Clean up screenshot backgrounds
- **Figma to HTML**: Export designs as HTML

**For Prototyping**:
- **Smart Animate**: Enhanced transitions
- **Figmotion**: Advanced animations
- **ProtoPie**: Complex interactions

This guide should help you systematically recreate your beautiful learning platform design in Figma! 🎨
