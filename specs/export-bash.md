# Export as Bash Spec

## Objective
Implement an export option that generates a bash script. When this script is run in a terminal, it will animate the sprite using ANSI escape codes for colors and cursor positioning.

## Technical Design

### Generating the Bash Script
- Iterate over each frame of the animated sprite.
- For each cell, determine the ANSI escape sequences based on the `fg_color` and `bg_color`.
  - Maps `ansi:0` - `ansi:7` to standard ANSI terminal colors (Foreground: 30-37, Background: 40-47).
  - Maps `ansi:8` - `ansi:15` to bright ANSI terminal colors (Foreground: 90-97, Background: 100-107).
  - `base:bg` resets to default background (49) or uses nothing if transparent.
  - `base:fg` resets to default foreground (39).
- Text attributes like `bold`, `italic`, `underline`, `strike_through` can also be supported via ANSI codes (1, 3, 4, 9).
- Append frame strings to the bash script. Use `sleep` for the frame delay (e.g., `sleep 0.1`) and `\033[H` to move the cursor to the top-left for the next frame for smooth animation.
- A `clear` command should be run once at the beginning, followed by echoing frames in a `while true` loop.

### Exposing Export Option
- Add "Export as Bash Script" to `ExportModal.tsx`.
- Create a `saveBash` IPC handle in `main/index.ts` and expose it via preload.
  - Displays a save dialog with a `.sh` default extension.

## Verification
- Can export an animation as a `.sh` file.
- Running `bash <file>.sh` or executing it directly clears the terminal and animates the sprite within the terminal, maintaining colors.
