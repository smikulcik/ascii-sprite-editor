# Color Palette Mechanism Spec

## Concept

ASCII art is historically frequented in dev spaces
with heavy presece of terminal usage. We want to provide
the "default" color system to adhere to paletted colors
so as to celebrate this historical context. Sure we can
have sprites that support full RGB colors, but for sprites
with "palatted color spaces", we want to lock the colors 
the the 8/16 colors of the terminal palatte. 


## Importing

We support importing MacOS Terminal profiles (`.terminal` files) as color palettes for ASCII sprites. This allows the editor to render sprites using the same "ANSI" colors defined in a user's terminal theme, ensuring visual consistency and allowing for rapid theme switching.

We may expand to more formats in the future, but for now we are only supporting MacOS Terminal profiles.

## Technical Design

### Palette Data Structure

A Palette defines the mapping of semantic terminal color names to specific RGBA values.

```typescript
interface Palette {
  id: string;               // Unique identifier
  name: string;             // Display name (e.g., "Solarized Dark")
  backgroundColor: string;  // Default background color (hex)
  textColor: string;        // Default foreground color (hex)
  ansi: string[];          // Array of 16 colors (indices 0-15)
}
```

### Extended Sprite Model

The `SpriteData` will be updated to include an optional reference to a palette.

```typescript
interface SpriteData {
  // ... existing fields ...
  paletteId?: string;       // Reference to a custom palette
}
```

### Semantic Color Resolution

The `Cell` data structure's `fg_color` and `bg_color` fields will support semantic references:

- `base:bg`: The palette's background color.
- `base:fg`: The palette's text (foreground) color.
- `ansi:0` - `ansi:15`: The 16 ANSI colors.

When the renderer encounters these strings, it will look up the hex value in the active palette. If no palette is active or the color is a standard hex string (e.g., `#FF0000`), it will be rendered as-is.

### Terminal Profile Parser

The parser will reside in the main process to handle file system access and heavy binary parsing.

1.  **Input**: A `.terminal` file (XML Plist).
2.  **Steps**:
    - Parse the XML Plist to extract `<data>` blobs for color keys (e.g., `ANSIBlackColor`, `NSBackgroundColor`).
    - Base64 decode the data blobs into binary Plists (`bplist00`).
    - Parse the binary Plist as an `NSKeyedArchive`.
    - Extract the color components (typically stored in a string like `0.5 0.2 0.8 1.0` representing RGBA).
    - Convert components to 8-bit hex strings.

#### Key Mapping
| Terminal Key | Palette Mapping |
| --- | --- |
| `BackgroundColor` | `backgroundColor` |
| `TextColor` | `textColor` |
| `ANSIBlackColor` | `ansi[0]` |
| `ANSIRedColor` | `ansi[1]` |
| `ANSIGreenColor` | `ansi[2]` |
| `ANSIYellowColor` | `ansi[3]` |
| `ANSIBlueColor` | `ansi[4]` |
| `ANSIMagentaColor` | `ansi[5]` |
| `ANSICyanColor` | `ansi[6]` |
| `ANSIWhiteColor` | `ansi[7]` |
| `ANSIBrightBlackColor` | `ansi[8]` |
| ... | ... |
| `ANSIBrightWhiteColor` | `ansi[15]` |

## Components & UI

### Palette Library
A global registry of available palettes, including:
- **Default Dark**: The "Nordic Aurora" theme.
- **Default Light**: The "Blueprint" theme.
- **User Imported**: Palettes loaded from `.terminal` files.

### Drawing Toolbar Updates
- The color picker will show the current palette's swatches prominently.
- Selecting a swatch will apply the semantic reference (e.g., `ansi:1`) instead of the hardcoded hex value to the cell.

### Theme Switching
Changing the palette on a sprite will immediately update the colors of all cells using semantic references. Cells with specific hex colors will remain unchanged.

## Verification Criteria

1.  **Import Success**: Importing the provided `sample-terminal-profile.terminal` results in a new palette named "Siomn" with correct hex values.
2.  **Rendering Accuracy**: A sprite drawn with `ansi:1` (Red) changes color when the sprite's palette is swapped.
3.  **Persistence**: The `paletteId` and semantic color references are correctly saved to and loaded from the sprite JSON.
4.  **Fallback**: If a sprite references a missing `paletteId`, it falls back to the system default theme.
