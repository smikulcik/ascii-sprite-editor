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

### Canvas Options
- **Sprite Dimensions**: Adjustable width/height (grid cells).
- **Character Sizing**: Base font size and scaling.
- **Background**: Toggle between transparent (checkerboard) and solid background.

### Toolset
- **Draw Tool**: Repeat current character.
- **Type Tool**: Free-form typing.
- **Box Tool**: Draw rectangle regions.
- **Eraser**: Clear cells to transparent.
- **Style**: Character attributes (Bold, Italic, Color).

### Menu System
- **File**: New, Open, Save, Save As, Export (GIF/PNG).
- **View**: Theme Toggle, Grid Toggle, Onion Skinning (future).

## Component Architecture

### SpriteContext
All sprite-related state (width, height, frames, current frame, animation state) should be managed in a `SpriteContext`. This allows sibling components like the Sidebar, Canvas, and Animation Controls to stay in sync.

### SpriteCanvas Component
The core editing area.
- **Rendering**: Uses a `<canvas>` element.
  - Draws a checkerboard background for transparency.
  - Renders the current sprite frame using a fixed-width pixel-perfect font.
  - Overlays a grid (toggleable) to help with character placement.
  - Highlights the selected cell with a focus border.
- **Interaction**:
  - **Panning**: Middle-mouse drag or Space+Drag to move the canvas.
  - **Zooming**: Ctrl+Wheel or pinch-to-zoom (future).
  - **Selection**: Clicking a cell selects it.
  - **Drawing**:
    - **Pencil/Brush**: Click and drag to apply the selected character and style to cells.
    - **Type Tool**: When a cell is selected, typing directly inserts characters and moves the selection (similar to a code editor).
  - **Shortcuts**:
    - `Backspace/Delete`: Clear the selected cell.
    - `Arrow Keys`: Move the selection.
    - `Z/Y`: Undo/Redo (future improvement).

### FrameSidebar Component
- **Thumbnails**: Each frame is rendered as a small preview.
- **Active State**: The currently selected frame is highlighted.
- **Drag & Drop**: (Future) Reorder frames by dragging.
- **Controls**: Buttons to add, delete, or duplicate frames.

### DrawingToolbar Component
- **Floating/Docked**: Centered at the top of the canvas for easy access.
- **Visual Feedback**: Shows active tool and selected colors.
- **Style Persistence**: Remembers the last used character, fg_color, and bg_color.

### AnimationControls Component
- **Real-time Preview**: Small preview window that runs the animation while the user edits.
- **Playback**: Play/Pause toggle with FPS slider.
- **Timeline**: Visual scrubber for moving between frames.

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
