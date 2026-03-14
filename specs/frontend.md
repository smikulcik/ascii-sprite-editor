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
