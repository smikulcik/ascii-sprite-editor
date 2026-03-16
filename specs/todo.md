# TODO

This is the high level todo list of things that will need more details and thinking before
we queue them up for the agent to start work on

## UI Layout

### Window

- [x] Make the window start in full screen
- [x] Improve UI contrast and font sizes
- [x] Implement sidebar scrolling for minimized windows
- [x] All tools visible in full screen
- [x] UI Contrast needs more. Gridlines and text in dark mode are too dark. same for light mode

### Drawing tools layout (Completed)

- [x] Move to left vertical side (docked)
- [x] Palette centric view
- [x] FG/BG indicators non-clickable
- [x] Shift-click for BG color
- [x] UI hint for shift-click
- [x] Show transparent/sprite background default color
- [x] Show Unicode char name/hex (e.g. U+1234)
- [x] When screen minimized, allow for sidebar to "Scroll".
- [x] Full screen should show all tools.

#### Canvas options (Completed)

- [x] Hidden behind options drop down / settings button
- [x] Show up as a modal with backdrop click-to-close
- [x] Show the background outside of the canvas to be a shade of gray
- [x] Within the canvas, show the default color. (Use the checker pattern for transparent)

## Export button (Completed)

- [x] Remove Export button from top right
- [x] Put it under File > Export
- [x] When you click it, show a modal with options
  - [x] Export as gif
  - [x] Export as bash script animation
  - [x] Export as sprite sheet png + coords for game engine import (JSON?)

## Timeline (Completed)

- [x] It shows up black even on white backgrounds. It should look like a mini view of the main screen but without the gridlines
- [x] Needs to auto-update when focus is changed from the main screen

## Grid Off

- Needs implementing

## Onion Skin

- Needs implementing
- I want to see it as red-tint/blue-tint of the previous/next frame

# Hotkeys

- [x] Needs implementing a hotkey system
- [x] Should have a good default
- [ ] Add a configuration option to change them

## Layers system

- TBD: Remove layer: Base untile we implmenet a proper layer system
- Once we start building sprites, we may want to start with a layers system. Composing
- multiple sprites in one scene
- We may also want to have a layer just for drawing within a frame

## Ollama integration

- Need to add AI tools for sprite generation and AI tweening

## Character selector

- ASCII art often uses odd characters.
- May want a "character palette" or set of palettes. Perhaps with user configurables ones
- may want these as external files to "load in".

## Rune explorer

- need a way to explore the full set of visible unicode characters
- Show which ones might not be supported for various fonts
- Need an index of useful characters by visual shape

## Rune indexer

- Need a way to index runes by visual shape
- Need to categorize in some Rune Vector DB to query for things for various contexts
- Ollama AI can identify what we're drawing, but then we need context specific
  chat that can suggest various "textures" and "styles".
  - Me: > starts drawing a dog <
  - Ollama: Looks like a dog
  - Me: How can I make it "poofy" or "shaggy"?

## Color palattes

- Importing palettes doesn't seem to work.

## View unused options

-= Remove Toggle Overlays
- Remove Reset layoutp

## Local storage

- migrate to ~/.config/ascii-sprite-editor

## Key controls

- [x] When I type, letters show up one by one
- [x] Delete: deletes the character and moves selected to the left
- [x] Enter: Move down and to the start of the "line" (line being where I placed my character on the "current row")
- [x] Shift+Enter: Move down one
- [x] Fn+Delete: Delete the character and move selected to the right

## Drawing tools

- [ ] Pencil should show the path as I draw it along with the characters that would be filled out. But hit "ESC" to cancel the path while holding down the cursor.
- [ ] Eraser should highlight the cells "Erased" as you go
- [ ] Box: Fill box of all the same character
- [ ] Shift+Box: Draw outline of box (Add lower right triangle to signify this is an option)

## Agent controls

- [ ] Update the AGENTS.md and perhaps backfill a knowledge base of how everything works
