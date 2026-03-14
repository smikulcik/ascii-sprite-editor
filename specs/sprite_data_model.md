# Sprite Data Model Spec

## Objective
Define a consistent data structure for ASCII sprites that supports animation, multi-color cells, and efficient rendering.

## Data Structures

### Cell
The smallest unit of a sprite, representing a single character at a specific position.
```typescript
interface Cell {
  value: string;      // The ASCII character (single char)
  fg_color: string;   // Foreground color (hex or CSS color or transparent)
  bg_color: string;   // Background color (hex or CSS color or transparent)
  weight: string;     // Weight (normal, bold, bright, dim)
  italic: boolean;    // Italic
  underline: boolean; // Underlined
  blink: boolean;     // Blinking
  strike_through: boolean; // Strike-Through
}
```

### Frame
A 2D grid of cells representing a single state in an animation.
- A frame is a 2D array: `(Cell | null)[][]`
- `null` represents a transparent cell (no character, no background).
- Dimensions: `height` rows by `width` columns.

### Sprite
The top-level container for an animated ASCII character.
```typescript
interface SpriteData {
  width: number;       // Grid width in characters
  height: number;      // Grid height in characters
  frames: Frame[];     // Sequence of frames for animation
  fps: number;         // Animation speed (frames per second)
}
```

## Behavior & Logic

### Coordinate System
- Origin `(0,0)` is the top-left corner.
- `x` increases to the right (`col`).
- `y` increases downwards (`row`).

### Scaling & Aspect Ratio
- Drawing uses a fixed-width font (e.g., Courier).
- Typical aspect ratio for Courier: `0.53097` (width/height). This must be accounted for when rendering to ensure characters aren't stretched.

### Animation Logic
- Frames are indexed from `0` to `frames.length - 1`.
- Playback cycles through frames based on `fps`.
- When inserting a frame, it typically clones the current frame to allow for iterative animation (onion skinning support is a desired future enhancement).

### Persistence
- Sprites are serialized to JSON.
- Standard file format includes `width`, `height`, and the `frames` array.
