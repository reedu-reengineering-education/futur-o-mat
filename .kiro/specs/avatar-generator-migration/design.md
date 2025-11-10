# Design Document

## Overview

The avatar generator migration will transform the existing vanilla JavaScript/PHP application into a modern React TypeScript application using Vite as the build tool and shadcn/ui for consistent UI components. The design preserves all existing functionality while improving code organization, type safety, and maintainability.

## Architecture

### Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized builds
- **UI Components:** shadcn/ui for consistent, accessible components
- **Styling:** Tailwind CSS (integrated with shadcn/ui) with custom CSS variables for theme
- **State Management:** React hooks (useState, useReducer) for local state
- **Canvas Rendering:** HTML5 Canvas API for avatar composition
- **Asset Management:** Static assets served through Vite

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── avatar/          # Avatar-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── data/                # Static data and configurations
├── assets/              # Images and other static assets
└── styles/              # Global styles and theme
```

## Components and Interfaces

### Core Components

#### 1. App Component

- **Purpose:** Root application component managing global state and routing between steps
- **Props:** None (root component)
- **State:** Current step, avatar configuration, loading states
- **Responsibilities:**
  - Initialize avatar parts manifest
  - Manage step navigation (body editor vs values editor)
  - Provide global avatar state context

#### 2. AvatarCanvas Component

- **Purpose:** Renders the composed avatar using HTML5 Canvas
- **Props:** `avatarConfig: AvatarConfig`, `width: number`, `height: number`
- **State:** Canvas context, loading state, cached images
- **Responsibilities:**
  - Load and cache avatar part images
  - Compose avatar layers in correct order
  - Handle canvas rendering and updates
  - Provide download functionality

#### 3. StepNavigation Component

- **Purpose:** Navigation between "Who are you?" and "How are you?" steps
- **Props:** `currentStep: Step`, `onStepChange: (step: Step) => void`
- **State:** None (controlled component)
- **Responsibilities:**
  - Display step navigation buttons
  - Highlight active step
  - Trigger step changes

#### 4. CategoryTabs Component

- **Purpose:** Category selection for avatar customization
- **Props:** `categories: Category[]`, `activeCategory: string`, `onCategoryChange: (category: string) => void`, `visitedCategories: Set<string>`
- **State:** None (controlled component)
- **Responsibilities:**
  - Display scrollable category tabs
  - Show progress indication
  - Handle category selection

#### 5. PartsGrid Component

- **Purpose:** Display and select avatar parts for current category
- **Props:** `parts: AvatarPart[]`, `selectedParts: SelectedParts`, `onPartSelect: (part: AvatarPart) => void`, `multiSelect: boolean`
- **State:** None (controlled component)
- **Responsibilities:**
  - Render grid of avatar parts with thumbnails
  - Handle part selection (single or multi-select)
  - Show selection states
  - Auto-crop thumbnails for better display

#### 6. ColorSelector Component

- **Purpose:** Skin tone and hair color selection
- **Props:** `type: 'skin' | 'hair'`, `selectedColor: string`, `onColorChange: (color: string) => void`, `visible: boolean`
- **State:** None (controlled component)
- **Responsibilities:**
  - Display color options as circular buttons
  - Show active selection
  - Handle color changes

#### 7. ActionButtons Component

- **Purpose:** Avatar actions (surprise, download, share)
- **Props:** `onSurprise: () => void`, `onDownload: () => void`, `onShare: () => void`
- **State:** None (controlled component)
- **Responsibilities:**
  - Provide action buttons with consistent styling
  - Handle action triggers

### Custom Hooks

#### 1. useAvatarState Hook

- **Purpose:** Manage avatar configuration state and related operations
- **Returns:** `{ avatarConfig, updatePart, generateRandom, resetAvatar }`
- **Responsibilities:**
  - Centralize avatar state management
  - Handle part selection logic
  - Manage skin tone and hair color filtering
  - Generate random configurations

#### 2. useAvatarParts Hook

- **Purpose:** Load and manage avatar parts manifest
- **Returns:** `{ parts, loading, error }`
- **Responsibilities:**
  - Fetch avatar parts manifest on mount
  - Filter parts by category, skin tone, hair color, body type
  - Handle loading and error states

#### 3. useImageCache Hook

- **Purpose:** Preload and cache avatar part images
- **Returns:** `{ cachedImages, preloadImages, isLoading }`
- **Responsibilities:**
  - Preload images for better performance
  - Maintain image cache
  - Track loading progress

#### 4. useUrlState Hook

- **Purpose:** Manage avatar state persistence in URL
- **Returns:** `{ encodeState, decodeState, shareUrl }`
- **Responsibilities:**
  - Encode avatar configuration to URL parameters
  - Decode avatar state from URL on load
  - Generate shareable URLs

### Type Definitions

```typescript
interface AvatarPart {
  id: string;
  src: string;
  category: string;
}

interface AvatarConfig {
  selectedParts: Record<string, string>;
  selectedItems: string[];
  skinTone: string;
  hairColor: string;
  brustAnsatz: boolean;
}

interface Category {
  id: string;
  name: string;
  multiSelect: boolean;
}

type Step = "body" | "values";

interface ProgressState {
  visitedTabs: Set<string>;
  currentProgress: number;
}
```

## Data Models

### Avatar Parts Manifest

The existing `avatar_parts_manifest.json` will be used as-is, containing:

- Part ID, source path, and category for each avatar component
- Organized by categories: head, face, hair, bodytype, clothes, shoes, accessories, handicap, values, strengths

### Category Configuration

```typescript
const CATEGORIES = [
  { id: "head", name: "Kopf", multiSelect: false },
  { id: "face", name: "Gesicht", multiSelect: true },
  { id: "hair", name: "Haare", multiSelect: false },
  { id: "bodytype", name: "Körper", multiSelect: false },
  { id: "clothes", name: "Kleidung", multiSelect: true },
  { id: "shoes", name: "Schuhe", multiSelect: false },
  { id: "accessoires", name: "Zubehör", multiSelect: true },
  { id: "handicap", name: "Hilfsmittel", multiSelect: true },
];

const VALUES_CATEGORIES = [
  { id: "values", name: "Das ist dir wichtig!", multiSelect: false },
  { id: "strengths", name: "Das kannst du gut!", multiSelect: false },
];
```

### Theme Configuration

Preserve existing CSS custom properties:

```css
:root {
  --brand-primary: #61398d;
  --brand-accent: #f59e0b;
  --background-primary: #fafaff;
  --background-secondary: #f8f9ff;
  /* ... other existing variables */
}
```

## Error Handling

### Image Loading Errors

- Implement fallback placeholders for failed image loads
- Display user-friendly error messages for manifest loading failures
- Graceful degradation when avatar parts are unavailable

### State Management Errors

- Validate avatar configurations before applying
- Handle malformed URL state gracefully
- Provide reset functionality for corrupted states

### Canvas Rendering Errors

- Catch and handle canvas context errors
- Implement retry logic for failed renders
- Fallback to placeholder when rendering fails

## Testing Strategy

### Component Testing

- Unit tests for all custom hooks using React Testing Library
- Component tests for UI interactions and state changes
- Mock avatar parts data for consistent testing

### Integration Testing

- Test complete avatar creation workflows
- Verify URL state encoding/decoding
- Test responsive behavior across device sizes

### Visual Testing

- Screenshot tests for avatar rendering consistency
- Cross-browser compatibility testing
- Performance testing for image loading and canvas rendering

### Accessibility Testing

- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation
- Touch target size verification

## Performance Considerations

### Image Optimization

- Implement progressive image loading
- Use image caching to prevent redundant requests
- Optimize avatar part images for web delivery

### Canvas Performance

- Debounce canvas updates during rapid interactions
- Use requestAnimationFrame for smooth animations
- Implement efficient layer compositing

### Bundle Optimization

- Code splitting for avatar parts and components
- Tree shaking for unused shadcn/ui components
- Lazy loading for non-critical features

### Memory Management

- Clean up canvas contexts and event listeners
- Implement proper image cache cleanup
- Monitor memory usage during extended sessions
