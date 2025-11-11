# Design Document

## Overview

This design document outlines the technical approach for redesigning the Futur-O-Mat avatar generator interface to feature a centered card layout with a purple gradient background. The redesign maintains all existing functionality while providing a more focused, mobile-first user experience that matches the reference design.

The key design principle is to create a contained, card-based interface that feels like a cohesive application rather than a full-page layout, while ensuring all interactive elements remain accessible and functional.

## Architecture

### Component Structure

The redesign will modify the existing component hierarchy to support the new layout:

```
App (purple gradient background)
└── CenteredCard (white rounded card)
    ├── CardHeader
    │   ├── Title ("Futur-O-Mat")
    │   ├── Tagline ("Mach dir die Zukunft...")
    │   └── InfoButton (top-right)
    ├── AvatarDisplay
    │   ├── AvatarCanvas (large, centered)
    │   └── ValuesBadges (floating above avatar)
    ├── ModeTabs
    │   ├── "Wer bist du?" button
    │   └── "Wie bist du?" button
    ├── EditorSection
    │   ├── CategoryTabs (horizontal scrollable)
    │   ├── ColorSelector (when applicable)
    │   └── OptionsRow (horizontal scrollable thumbnails)
    ├── PresetAvatars (small thumbnails)
    ├── SurpriseButton (prominent orange/yellow)
    └── ActionButtons
        ├── Download button
        └── Share button
```

### Layout Strategy

1. **Desktop (>768px)**: Centered card with max-width of 480-520px, purple gradient background fills viewport
2. **Mobile (<768px)**: Card expands to full width with minimal margins (8-16px), maintains scrollability
3. **Tablet (768-1024px)**: Card width adapts between mobile and desktop sizes

## Components and Interfaces

### 1. App Component Modifications

**Purpose**: Transform the root component to support the centered card layout

**Changes**:

- Remove the full-width header
- Replace the two-column grid layout with a single-column card layout
- Add purple gradient background
- Remove fixed bottom action buttons (move inside card)
- Simplify the layout structure

**New Structure**:

```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700">
  <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
    <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Card content */}
    </div>
  </div>
</div>
```

### 2. CardHeader Component (New)

**Purpose**: Display the application title, tagline, and info button

**Props**:

```tsx
interface CardHeaderProps {
  onInfoClick?: () => void;
}
```

**Layout**:

- Title centered, large font (24-28px)
- Tagline below title, smaller font (14-16px), muted color
- Info button positioned absolutely in top-right corner
- Padding: 24px top, 16px sides

### 3. AvatarDisplay Component (Modified)

**Purpose**: Display the avatar canvas prominently in the center

**Changes**:

- Remove the white card wrapper (already inside main card)
- Increase avatar size for prominence
- Add floating values/strengths badges above avatar head
- Center the avatar with appropriate padding

**Layout**:

- Avatar canvas: 400x480px on desktop, scales down on mobile
- Values badges: Positioned absolutely above avatar, small circular icons
- Background: Transparent or subtle gradient

### 4. ModeTabs Component (New)

**Purpose**: Replace StepNavigation with inline tab buttons

**Props**:

```tsx
interface ModeTabsProps {
  currentMode: "body" | "values";
  onModeChange: (mode: "body" | "values") => void;
}
```

**Layout**:

- Two buttons side-by-side, equal width
- Active button: Purple background, white text
- Inactive button: White background, purple border, purple text
- Height: 48px
- Border radius: 12px
- Gap between buttons: 8px
- Margin: 16px horizontal

### 5. CategoryTabs Component (Modified)

**Purpose**: Display category tabs in a horizontal scrollable row

**Changes**:

- Reduce tab height for more compact design
- Use underline indicator for active tab instead of background color
- Improve horizontal scroll behavior on mobile
- Add subtle scroll indicators (fade at edges)

**Layout**:

- Tab height: 40px
- Active indicator: 3px bottom border in purple
- Font size: 14px
- Horizontal padding: 12px per tab
- Scrollable with hidden scrollbar (custom styling)

### 6. OptionsRow Component (Modified PartsGrid)

**Purpose**: Display avatar part options as horizontal scrollable thumbnails

**Changes**:

- Transform from grid to horizontal row
- Circular or rounded-square thumbnails
- Larger thumbnails for better touch targets
- Horizontal scroll with momentum

**Layout**:

- Thumbnail size: 64x64px on mobile, 72x72px on desktop
- Border radius: 50% (circular) or 12px (rounded square)
- Gap between items: 12px
- Selected state: 3px purple border + subtle shadow
- Hover state: Scale 1.05 + shadow
- Container: Horizontal scroll, padding 16px

### 7. PresetAvatars Component (New)

**Purpose**: Display small preset avatar thumbnails for quick selection

**Props**:

```tsx
interface PresetAvatarsProps {
  presets: AvatarConfig[];
  currentConfig: AvatarConfig;
  onPresetSelect: (config: AvatarConfig) => void;
}
```

**Layout**:

- 4-5 small thumbnails in a row
- Thumbnail size: 48x48px
- Border radius: 8px
- Selected state: Purple border
- Horizontal scroll if needed
- Margin: 16px top and bottom

### 8. SurpriseButton Component (Modified)

**Purpose**: Prominent button for random avatar generation

**Changes**:

- Move from bottom action bar to inside card
- Use bright orange/yellow gradient background
- Add star icon
- Make it full-width and prominent

**Layout**:

- Full width with 16px horizontal margin
- Height: 52px
- Background: Orange to yellow gradient (#FF9500 to #FFB800)
- Border radius: 12px
- Font weight: 600
- Star icon on left side
- Margin: 16px top and bottom

### 9. ActionButtons Component (Modified)

**Purpose**: Download and Share buttons at bottom of card

**Changes**:

- Remove from fixed bottom position
- Place inside card at bottom
- Side-by-side layout
- White background with borders

**Layout**:

- Two buttons side-by-side, equal width
- Height: 48px
- Background: White
- Border: 2px solid light gray
- Border radius: 12px
- Gap: 12px
- Margin: 16px all sides
- Icons on left side of text

## Data Models

### AvatarConfig (No changes)

The existing `AvatarConfig` interface remains unchanged as the data structure is sound.

### New Preset System

```tsx
interface PresetConfig {
  id: string;
  name: string;
  config: AvatarConfig;
  thumbnail?: string; // Optional pre-rendered thumbnail
}

// Predefined presets
const DEFAULT_PRESETS: PresetConfig[] = [
  {
    id: "preset-1",
    name: "Casual",
    config: {
      /* specific avatar configuration */
    },
  },
  // ... more presets
];
```

## Styling and Theming

### Color Palette

**Background Gradient**:

- Primary: `#7C3AED` (purple-600)
- Secondary: `#8B5CF6` (purple-500)
- Tertiary: `#6D28D9` (purple-700)
- Gradient: `bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700`

**Card**:

- Background: `#FFFFFF` (white)
- Border radius: `24px` (rounded-3xl)
- Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)` (shadow-2xl)

**Buttons**:

- Primary (Mode tabs active): `#7C3AED` (purple-600)
- Surprise button: `linear-gradient(135deg, #FF9500 0%, #FFB800 100%)`
- Action buttons: `#FFFFFF` with `#E5E7EB` border

**Text**:

- Title: `#1F2937` (gray-800)
- Tagline: `#6B7280` (gray-500)
- Body: `#374151` (gray-700)

### Typography

- Font family: Poppins (existing)
- Title: 28px, font-weight 700
- Tagline: 16px, font-weight 400
- Button text: 16px, font-weight 600
- Category tabs: 14px, font-weight 500
- Helper text: 13px, font-weight 400

### Spacing

- Card padding: 24px on desktop, 16px on mobile
- Section gaps: 20px
- Element gaps: 12px
- Button heights: 48-52px
- Thumbnail sizes: 64-72px

## Responsive Design

### Breakpoints

- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Mobile Optimizations

1. **Card Layout**:

   - Full width with 16px margins
   - Reduce padding to 16px
   - Maintain scrollability

2. **Avatar Size**:

   - Scale down to 320x384px
   - Maintain aspect ratio

3. **Thumbnails**:

   - Reduce to 56px
   - Increase touch targets with padding

4. **Typography**:

   - Title: 24px
   - Tagline: 14px
   - Buttons: 15px

5. **Spacing**:
   - Reduce gaps to 16px
   - Compact category tabs

### Desktop Enhancements

1. **Card**:

   - Max width: 520px
   - Centered with flexbox
   - Larger shadows for depth

2. **Hover States**:

   - Thumbnail scale on hover
   - Button color transitions
   - Cursor pointer

3. **Scrolling**:
   - Custom scrollbar styling
   - Smooth scroll behavior

## Error Handling

### Render Errors

- Display error message inside card (not as separate overlay)
- Use subtle red background with icon
- Provide retry button
- Maintain card layout integrity

### Loading States

- Show loading spinner centered in card
- Skeleton loaders for thumbnails
- Progressive image loading for avatar parts

### Network Errors

- Graceful fallback to cached data
- Retry mechanism with exponential backoff
- User-friendly error messages in German

## Performance Considerations

### Image Optimization

1. **Lazy Loading**:

   - Load thumbnails only when visible
   - Use Intersection Observer API
   - Prioritize visible category

2. **Caching**:

   - Maintain existing image cache
   - Pre-load adjacent categories
   - Cache preset thumbnails

3. **Rendering**:
   - Debounce avatar updates
   - Use React.memo for thumbnails
   - Optimize canvas rendering

### Scroll Performance

1. **Virtual Scrolling**:

   - Consider for large option lists
   - Render only visible items + buffer

2. **Smooth Scrolling**:
   - Use CSS `scroll-behavior: smooth`
   - Hardware acceleration with `transform`
   - Momentum scrolling on iOS

## Accessibility

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to select options
- Arrow keys for category navigation
- Escape to close modals

### Screen Readers

- Proper ARIA labels for all buttons
- Announce avatar changes
- Describe selected options
- Label color selectors

### Touch Targets

- Minimum 44x44px touch targets
- Adequate spacing between elements
- Visual feedback on touch

### Color Contrast

- Ensure WCAG AA compliance
- Test with color blindness simulators
- Provide alternative indicators beyond color

## Testing Strategy

### Unit Tests

- Component rendering
- State management
- Event handlers
- Utility functions

### Integration Tests

- Mode switching
- Category navigation
- Part selection
- Download/Share functionality

### Visual Regression Tests

- Screenshot comparison
- Layout consistency
- Responsive breakpoints

### Manual Testing

- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS, Android)
- Touch interactions
- Accessibility tools (screen readers, keyboard only)

## Migration Strategy

### Phase 1: Layout Structure

- Create new card-based layout
- Implement purple gradient background
- Add CardHeader component
- Test responsive behavior

### Phase 2: Component Modifications

- Update ModeTabs component
- Modify CategoryTabs for horizontal layout
- Transform PartsGrid to OptionsRow
- Test interactions

### Phase 3: New Components

- Implement PresetAvatars
- Update SurpriseButton styling
- Modify ActionButtons placement
- Test all functionality

### Phase 4: Polish and Optimization

- Fine-tune spacing and sizing
- Optimize performance
- Add animations and transitions
- Conduct accessibility audit

### Phase 5: Testing and Deployment

- Comprehensive testing
- Fix bugs and issues
- Deploy to production
- Monitor user feedback
