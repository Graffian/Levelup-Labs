# 📄 Page Specifications

## 🏠 Homepage / Landing Page

### Layout Structure
- **Header**: Fixed navigation with logo, menu items, sign-in button
- **Hero Section**: Large title with gradient text, subtitle, CTA buttons
- **Features Grid**: 3-column grid with icon, title, description
- **Comparison Table**: Feature comparison with checkmarks and badges
- **Footer**: Multi-column footer with links and social media

### Key Elements
- **Animated Background**: Floating colored blobs with blur effect
- **Gradient Text**: "Learn anything. Track your progress." with blue-cyan gradient
- **Feature Cards**: Glass-morphism effect with backdrop blur
- **Free Badge**: Highlighted "Free" badge replacing checkmark icon

### Responsive Behavior
- **Desktop**: Full 3-column layout
- **Tablet**: 2-column grid, reduced spacing
- **Mobile**: Single column, stacked layout

---

## 🚀 Onboarding Flow (3 Pages)

### Common Layout
- **Progress Steps**: Numbered circles with connecting lines
- **Header**: Step counter, title, description
- **Content Area**: Selection cards in grid layout
- **Navigation**: Back/Continue buttons with validation

### Page 1: Learning Goals
- **Layout**: 2-column grid (desktop), 1-column (mobile)
- **Cards**: 6 learning paths with icons and descriptions
- **Icons**: Code2, Palette, Brain, Gamepad2, Video, Heart
- **Selection State**: Colored background, border, checkmark indicator

### Page 2: Time Commitment
- **Layout**: Single column with 4 time options
- **Cards**: Icon + title + description + badge
- **Time Badges**: "Casual Explorer", "Consistent Learner", etc.
- **Icons**: Coffee, Clock, Calendar, Zap

### Page 3: Experience Level
- **Layout**: Single column with 4 experience levels
- **Cards**: Icon + title + description + skills tags + time estimate
- **Skill Tags**: Small rounded badges with skills
- **Icons**: Sprout, Compass, Rocket, Crown

---

## 🎓 Learning Path Page

### Hero Section
- **Background**: Animated blob background
- **Title**: Large gradient text matching selected path
- **Metadata**: Duration, course count, certificate info
- **CTA**: Primary gradient button "Start Learning Path"

### Timeline Section
- **Layout**: Vertical timeline with numbered sections
- **Section Headers**: Numbered circle + title + course count
- **Course Cards**: 2-column grid within each section
  - Title with optional "Recommended" badge
  - Duration and difficulty level
  - Topic tags
  - Start/Complete button
  - Completion status icon

### Time Calculator
- **Tabs**: 4 time options (1h, 2h, 4h, 8h daily)
- **Result**: Large estimated completion time
- **Background**: Light gray section

### Career Information
- **Two-column layout**: Daily tasks + Salary info
- **Bullet Points**: Colored dots + descriptions
- **Salary Card**: Large salary figure + range breakdown + growth indicator

### Call to Action
- **Full-width gradient background**: Matches learning path theme
- **Centered content**: Title, description, two buttons
- **Buttons**: Primary (white background) + Secondary (outline)

---

## 📊 Dashboard (Referenced)

### Header
- **User greeting**: "Welcome back, [Name]"
- **Stats Cards**: Progress, streaks, achievements
- **Quick Actions**: Continue learning, browse courses

### Main Content
- **Current Courses**: Horizontal scrolling cards
- **Progress Tracking**: Visual progress bars
- **Recommendations**: Personalized course suggestions

---

## 🔐 Authentication Pages

### Layout
- **Split Screen**: Left side form, right side branding/image
- **Form Container**: Centered card with rounded corners
- **Social Login**: OAuth buttons for Google, GitHub, etc.
- **Form Fields**: Email, password with validation states

### Sign In
- **Title**: "Welcome back"
- **Fields**: Email, Password
- **Actions**: Sign in button, forgot password link, sign up link

### Sign Up
- **Title**: "Create your account"
- **Fields**: Name, Email, Password, Confirm Password
- **Actions**: Sign up button, terms checkbox, sign in link

---

## 🎨 Design System Usage

### Color Application
- **Primary Actions**: Blue-cyan gradient
- **Secondary Actions**: White with gray border
- **Success States**: Green colors (#22c55e)
- **Warning/Info**: Amber colors
- **Error States**: Red colors

### Typography Hierarchy
- **Page Titles**: 48-60px, gradient text, bold
- **Section Headers**: 36px, bold, dark gray
- **Card Titles**: 18-24px, semibold
- **Body Text**: 16px, normal weight
- **Small Text**: 14px for metadata, descriptions

### Spacing Patterns
- **Section Padding**: 80px top/bottom
- **Card Padding**: 24px internal
- **Element Margins**: 24px between major elements
- **Text Spacing**: 16px between paragraphs

### Interactive Elements
- **Hover States**: Scale 1.01-1.02, shadow enhancement
- **Active States**: Scale 0.98, deeper shadows
- **Focus States**: Blue ring, 2px offset
- **Disabled States**: 50% opacity, no interactions

## 📱 Responsive Guidelines

### Breakpoint Strategy
- **Mobile First**: Design for 375px width first
- **Tablet**: 768px - 2-column grids become 1-column
- **Desktop**: 1024px+ - Full multi-column layouts
- **Large Desktop**: 1440px+ - Max container width with centering

### Content Adaptation
- **Text Scaling**: Reduce font sizes by 25% on mobile
- **Spacing Reduction**: Halve padding/margins on smaller screens
- **Grid Collapsing**: Multi-column grids become single column
- **Navigation**: Hamburger menu on mobile, full nav on desktop
