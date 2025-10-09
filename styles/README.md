# SurveyApp CSS Stylesheets

This directory contains all the CSS stylesheets for the SurveyApp, organized for maintainability and scalability.

## File Structure

### `index.css`
Main entry point that imports all CSS files in the correct order.
- Includes Tailwind CSS directives
- Imports all component and utility styles
- Contains global overrides and custom styles

### `globals.css`
Base styles and Tailwind CSS imports.
- `@tailwind` directives for base, components, and utilities
- Global CSS reset and base styles
- Typography and element defaults

### `components.css`
Reusable component styles.
- Apple-inspired design system
- Card components, buttons, inputs, modals
- Status indicators and loading states
- Form components and layouts

### `admin.css`
Admin interface specific styles.
- Dashboard layout and navigation
- Stats cards and overview sections
- Sidebar and header styling
- Admin-specific components

### `layout.css`
General layout and structural styles.
- Container classes and spacing utilities
- Grid systems and flex utilities
- Modal and form layouts
- Responsive design helpers

### `utilities.css`
Custom utility classes.
- Typography utilities (Apple system fonts)
- Color utilities (Apple color palette)
- Spacing, shadows, and animation utilities
- Responsive utilities and accessibility helpers

## Design System

The styles follow Apple's design principles:
- Clean, minimal aesthetic
- Generous white space
- Subtle shadows and borders
- Smooth transitions and animations
- Consistent typography hierarchy
- Accessible color contrasts

## Usage

Import styles in `_app.tsx`:
```tsx
import '../styles/index.css'
```

Use Tailwind classes for rapid development, and custom CSS classes for complex components.

## Customization

- Modify color variables in `utilities.css` for theming
- Add new component styles to `components.css`
- Extend layout utilities in `layout.css`
- Create page-specific styles in separate files as needed

## Performance

- CSS is optimized for fast loading
- Unused styles are purged in production
- Critical CSS is inlined where appropriate
- Minimal CSS footprint maintained
