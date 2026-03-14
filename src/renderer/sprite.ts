export interface Cell {
    value: string;
    fg_color: string;
    bg_color: string;
}

export type Frame = (Cell | null)[][];

export class Sprite {
    width: number = 10;
    height: number = 5;
    frames: Frame[] = [];
    curFrame: number = 0;
    animator: NodeJS.Timeout | null = null;
    onDraw: () => void = () => { };

    constructor() {
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
        this.width = newWidth;
        this.height = newHeight;
        this.frames = this.frames.map((frame) => {
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

    draw(
        context: CanvasRenderingContext2D,
        frame_idx: number,
        offset_x: number,
        offset_y: number,
        cell_width: number,
        cell_height: number
    ): void {
        const font_size = cell_height * (2 / 3) - 0.059; // font-size in pt
        context.font = `normal ${font_size}pt Courier`;
        context.textBaseline = 'top';
        context.textAlign = 'left';

        const frame = this.frames[frame_idx];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const cell = frame[i][j];
                if (cell !== null) {
                    context.fillStyle = cell.bg_color;
                    context.fillRect(offset_x + j * cell_width, offset_y + i * cell_height, cell_width, cell_height);
                    context.fillStyle = cell.fg_color;
                    context.fillText(cell.value, offset_x + j * cell_width, offset_y + i * cell_height);
                }
            }
        }
    }

    setCell(row: number, col: number, value: string | null, fg_color?: string, bg_color?: string): void {
        const frame = this.frames[this.curFrame];
        if (value === null) {
            frame[row][col] = null;
            return;
        }
        frame[row][col] = {
            value: value,
            fg_color: fg_color || '#ffffff',
            bg_color: bg_color || '#000000'
        };
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
