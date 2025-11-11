# Implementation Plan

- [x] 1. Update App.tsx with centered card layout and purple gradient background

  - Replace full-width layout with centered card container
  - Add purple gradient background to root div
  - Create white rounded card wrapper with proper max-width and responsive behavior
  - Remove old header component and fixed bottom action bar
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create CardHeader component

  - [x] 2.1 Implement CardHeader component with title, tagline, and info button
    - Create new component file at `src/components/layout/CardHeader.tsx`
    - Add "Futur-O-Mat" title with proper typography
    - Add tagline "Mach dir die Zukunft, wie sie dir gefällt!"
    - Position info button in top-right corner
    - Export from layout index
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Create ModeTabs component to replace StepNavigation

  - [x] 3.1 Implement ModeTabs component with inline tab buttons
    - Create new component file at `src/components/layout/ModeTabs.tsx`
    - Implement two side-by-side buttons for "Wer bist du?" and "Wie bist du?"
    - Add active/inactive state styling with purple theme
    - Handle mode switching
    - Export from layout index
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Update AvatarDisplay to work within card layout

  - [x] 4.1 Modify AvatarCanvas wrapper for centered card display

    - Remove white card wrapper from AvatarCanvas (already inside main card)
    - Adjust avatar sizing for card layout (400x480px desktop, scaled for mobile)
    - Add proper padding and centering
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 4.2 Add floating values/strengths badges above avatar
    - Position selected values and strengths as small circular icons above avatar
    - Implement absolute positioning relative to avatar container
    - Add smooth transitions when values change
    - _Requirements: 3.3_

- [x] 5. Update CategoryTabs for horizontal compact design

  - [x] 5.1 Modify CategoryTabs component styling
    - Reduce tab height to 40px
    - Change active indicator to bottom border instead of background
    - Improve horizontal scroll behavior
    - Add scroll fade indicators at edges
    - Update typography to 14px
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6. Transform PartsGrid to horizontal OptionsRow

  - [ ] 6.1 Create OptionsRow component for horizontal thumbnail display

    - Create new component file at `src/components/layout/OptionsRow.tsx`
    - Implement horizontal scrollable row layout
    - Use circular or rounded-square thumbnails (64-72px)
    - Add selected state styling with purple border
    - Add hover effects (scale and shadow)
    - Handle horizontal scroll with momentum
    - Export from layout index
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 6.2 Update BodyEditor to use OptionsRow instead of PartsGrid

    - Replace PartsGrid import with OptionsRow
    - Adjust layout to accommodate horizontal display
    - Test part selection functionality
    - _Requirements: 6.1, 6.5_

  - [ ] 6.3 Update ValuesEditor to use OptionsRow
    - Replace PartsGrid with OptionsRow in ValuesEditor
    - Ensure values and strengths display correctly
    - Test selection functionality
    - _Requirements: 6.1, 6.5_

- [ ] 7. Create PresetAvatars component

  - [ ] 7.1 Implement PresetAvatars component with thumbnail display
    - Create new component file at `src/components/avatar/PresetAvatars.tsx`
    - Define 4-5 preset avatar configurations
    - Render small thumbnails (48x48px) in horizontal row
    - Add selected state styling
    - Handle preset selection and apply to avatar config
    - Export from avatar index
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 8. Update SurpriseButton styling and placement

  - [ ] 8.1 Modify ActionButtons to separate SurpriseButton
    - Extract surprise button from ActionButtons component
    - Create standalone SurpriseButton component at `src/components/layout/SurpriseButton.tsx`
    - Apply orange-to-yellow gradient background
    - Make full-width with proper margins
    - Add star icon on left side
    - Set height to 52px with proper styling
    - Export from layout index
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Update ActionButtons for in-card placement

  - [ ] 9.1 Modify ActionButtons component for card bottom placement
    - Remove fixed positioning from ActionButtons
    - Update to side-by-side layout with white background and borders
    - Adjust button heights to 48px
    - Add proper margins (16px)
    - Update styling to match card design
    - Remove surprise button (now separate)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 10. Add responsive behavior and mobile optimizations

  - [ ] 10.1 Implement responsive card sizing

    - Add breakpoint-based max-width for card (520px desktop, full-width mobile)
    - Adjust padding for mobile (16px) vs desktop (24px)
    - Test card layout at all breakpoints
    - _Requirements: 1.4, 10.1, 10.2_

  - [ ] 10.2 Optimize avatar and thumbnail sizes for mobile

    - Scale avatar to 320x384px on mobile
    - Reduce thumbnail sizes to 56px on mobile
    - Adjust touch targets for mobile interaction
    - Test on various mobile devices
    - _Requirements: 10.3, 10.4_

  - [ ] 10.3 Adjust typography and spacing for mobile
    - Reduce title to 24px on mobile
    - Reduce tagline to 14px on mobile
    - Adjust button text to 15px on mobile
    - Reduce section gaps to 16px on mobile
    - _Requirements: 10.5_

- [ ] 11. Update color scheme and styling

  - [ ] 11.1 Apply purple gradient background

    - Update tailwind config if needed for custom purple shades
    - Apply gradient-to-br from purple-600 via purple-500 to purple-700
    - Test gradient appearance across browsers
    - _Requirements: 1.1_

  - [ ] 11.2 Update button and accent colors
    - Apply purple theme to active mode tabs
    - Update surprise button with orange-yellow gradient
    - Ensure color contrast meets accessibility standards
    - _Requirements: 8.1, 4.2_

- [ ] 12. Integrate all components in App.tsx

  - [ ] 12.1 Wire up all new and modified components

    - Import and place CardHeader at top of card
    - Add ModeTabs below avatar
    - Position PresetAvatars above SurpriseButton
    - Place SurpriseButton above ActionButtons
    - Ensure proper spacing between all sections
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 12.2 Test complete user flow
    - Test mode switching between "Wer bist du?" and "Wie bist du?"
    - Test category navigation and part selection
    - Test preset selection
    - Test surprise button functionality
    - Test download and share functionality
    - Verify all interactions work correctly
    - _Requirements: 4.4, 5.4, 6.5, 7.2, 8.3, 9.3_

- [ ] 13. Add animations and transitions

  - [ ] 13.1 Implement smooth transitions for interactive elements
    - Add transition effects for mode tab switching
    - Add scale and shadow transitions for thumbnails on hover
    - Add smooth scroll behavior for horizontal lists
    - Add fade-in animation for avatar updates
    - _Requirements: 3.2, 6.4_

- [ ] 14. Accessibility improvements

  - [ ] 14.1 Add ARIA labels and keyboard navigation
    - Add proper ARIA labels to all buttons and interactive elements
    - Ensure tab navigation works through all elements
    - Add keyboard shortcuts for category navigation
    - Test with screen reader
    - _Requirements: 2.3, 4.1, 5.1, 6.1_

- [ ] 15. Performance optimization

  - [ ] 15.1 Optimize image loading and rendering
    - Implement lazy loading for thumbnails
    - Add skeleton loaders for loading states
    - Optimize canvas rendering performance
    - Test performance on low-end devices
    - _Requirements: 3.2, 6.1_

- [ ] 16. Cross-browser and device testing
  - [ ] 16.1 Test across browsers and devices
    - Test on Chrome, Firefox, Safari, and Edge
    - Test on iOS and Android devices
    - Test touch interactions on mobile
    - Fix any browser-specific issues
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
