# Frontend Spec

## Stack

- Vite/React
- Tailwind CSS

## Editor

- The editor is the primary interface for this tool
- Users are focused on drawing the animated sprites
- Secondary use cases is viewing/reviewing sprite files
- As an animation platform, we need to be able to see for each
  sprite open what the frames are

### Layout

- Main View
  - Top Bar
  - Sprite View
    - Frame Sidebar
      - List of frames
      - buttons for inserting frames
    - Sprite Canvas
      - Canvas options
        - Sprite
          - Width
           - Height
        - Character
          - Width
          - Height
        - Background (transparent, or default background color)
      - Drawing toolbar (top)
        - Color Palate Selector (Future enhancement - use default palatte for now)
          - Modal for selecting color palates (Future enhancement)
        - Character Style Selector
          - Color selector (foreground, background) - from the palatte 
          - Weight Selectors (Bold, Bright, Dim)
          - Italic
          - Underlined
          - Blinking
          - Strike-Through
        - Character selector (applies for draw tool, and box tool)
        - Brush selector (point, circle of radius) (possibly extensible later)
        - Line style (preset line styles) - possibly extensible later
        - Type tool - Type character in style
        - Draw tool - same character repeated
        - Box tool - Draw a box and fill with same character
        - Eraser tool - put it back to transparent (or default background color)
    - Animation Controls
      - Play
      - Stop
      - Frame rate selector
- File options
  - New
  - Open
  - Save
  - Save As (JSON)
  - Export
    - GIF
- View options
  - Theme Switcher (Light / Dark)

## Style

### Dark Mode: Nordic Aurora
- Background: `#0f111a`
- Surface: `#1a1c25`
- Primary: `#c792ea` (Purple)
- Secondary: `#f78c6c` (Orange)
- Accent: `#ffcb6b` (Gold)
- Detail: `#82aaff` (Blue)
- Border: `#292d3e`
- Text: `#a6accd`

### Light Mode: Blueprint
- Background: `#fafafa`
- Surface: `#f1f5f9`
- Primary: `#2563eb` (Blue)
- Secondary: `#4f46e5` (Indigo)
- Accent: `#ea580c` (Rust Orange)
- Text: `#111827` (Deep Ink)
- Border: `#e1e4e8`
