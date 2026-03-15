export interface Cell {
    value: string;
    fg_color: string;
    bg_color: string;
    weight?: 'normal' | 'bold' | 'bright' | 'dim';
    italic?: boolean;
    underline?: boolean;
    blink?: boolean;
    strike_through?: boolean;
}

export type Frame = (Cell | null)[][];

export class Sprite {
    width: number = 20;
    height: number = 10;
    frames: Frame[] = [];
    curFrame: number = 0;
    paletteId: string = 'nordic-aurora';
    animator: NodeJS.Timeout | null = null;
    onDraw: () => void = () => { };

    constructor(width: number = 20, height: number = 10) {
        this.width = width;
        this.height = height;
        this.frames.push(this.newFrame());
    }

    newFrame(): Frame {
        const frame: Frame = [];
        for (let i = 0; i < this.height; i++) {
            frame.push(new Array(this.width).fill(null));
        }
        return frame;
    }

    resize(newWidth: number, newHeight: number): void {
        const oldFrames = this.frames;
        this.width = newWidth;
        this.height = newHeight;
        this.frames = oldFrames.map((frame) => {
            const newFrame = this.newFrame();
            for (let i = 0; i < Math.min(frame.length, newHeight); i++) {
                for (let j = 0; j < Math.min(frame[i].length, newWidth); j++) {
                    newFrame[i][j] = frame[i][j];
                }
            }
            return newFrame;
        });
    }

    insertFrame(): void {
        const newFrame = JSON.parse(JSON.stringify(this.frames[this.curFrame]));
        this.frames.splice(this.curFrame + 1, 0, newFrame);
    }

    deleteFrame(index: number): void {
        if (this.frames.length <= 1) return;
        this.frames.splice(index, 1);
        if (this.curFrame >= this.frames.length) {
            this.curFrame = this.frames.length - 1;
        }
    }

    draw(
        context: CanvasRenderingContext2D,
        frame_idx: number,
        offset_x: number,
        offset_y: number,
        cell_width: number,
        cell_height: number,
        resolveColor: (color: string) => string = (c) => c
    ): void {
        const frame = this.frames[frame_idx];
        if (!frame) return;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const cell = frame[i][j];
                if (cell !== null) {
                    const x = offset_x + j * cell_width;
                    const y = offset_y + i * cell_height;

                    const resolvedBg = resolveColor(cell.bg_color);
                    const resolvedFg = resolveColor(cell.fg_color);

                    // Draw background
                    if (resolvedBg && resolvedBg !== 'transparent') {
                        context.fillStyle = resolvedBg;
                        context.fillRect(x, y, cell_width, cell_height);
                    }

                    // Prepare text style
                    let fontStyle = '';
                    if (cell.italic) fontStyle += 'italic ';
                    if (cell.weight === 'bold' || cell.weight === 'bright') fontStyle += 'bold ';
                    
                    const font_size = cell_height * 0.8;
                    context.font = `${fontStyle}${font_size}px Courier, monospace`;
                    context.textBaseline = 'middle';
                    context.textAlign = 'center';

                    // Draw text
                    context.fillStyle = resolvedFg === 'transparent' ? 'rgba(0,0,0,0)' : resolvedFg;
                    context.fillText(cell.value, x + cell_width / 2, y + cell_height / 2);

                    // Underline
                    if (cell.underline) {
                        context.beginPath();
                        context.moveTo(x + 2, y + cell_height - 2);
                        context.lineTo(x + cell_width - 2, y + cell_height - 2);
                        context.strokeStyle = resolvedFg;
                        context.lineWidth = 1;
                        context.stroke();
                    }

                    // Strike-through
                    if (cell.strike_through) {
                        context.beginPath();
                        context.moveTo(x + 2, y + cell_height / 2);
                        context.lineTo(x + cell_width - 2, y + cell_height / 2);
                        context.strokeStyle = resolvedFg;
                        context.lineWidth = 1;
                        context.stroke();
                    }
                }
            }
        }
    }

    setCell(row: number, col: number, cellData: Cell | null): void {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) return;
        const frame = this.frames[this.curFrame];
        frame[row][col] = cellData;
    }

    play(interval: number = 250): void {
        this.stop();
        this.animator = setInterval(() => {
            this.curFrame = (this.curFrame + 1) % this.frames.length;
            this.onDraw();
        }, interval);
    }

    stop(): void {
        if (this.animator) {
            clearInterval(this.animator);
            this.animator = null;
        }
    }
}
