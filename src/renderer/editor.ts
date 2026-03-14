import { Sprite } from './sprite';

export const FONT_ASPECT_RATIO = 0.5309734513274337; // courier aspect ratio

export function clamp(val: number, min: number, max: number): number {
    return Math.max(Math.min(val, max), min);
}

export class Editor {
    cell_height: number = 100; // height in pixels
    cell_width: number;
    offset_x: number = 15;
    offset_y: number = 20;
    context: CanvasRenderingContext2D;
    sprite: Sprite;
    selected: { x: number; y: number } = { x: 0, y: 0 };
    checker_img: HTMLImageElement;

    constructor(context: CanvasRenderingContext2D, sprite: Sprite, checker_img: HTMLImageElement) {
        this.context = context;
        this.sprite = sprite;
        this.cell_width = this.cell_height * FONT_ASPECT_RATIO;
        this.checker_img = checker_img;
    }

    clear(): void {
        const pattern = this.context.createPattern(this.checker_img, 'repeat');
        if (pattern) {
            this.context.fillStyle = pattern;
            this.context.fillRect(0, 0, 800, 600);
        }
    }

    drawOverlays(): void {
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#333';
        for (let i = 0; i <= this.sprite.width * this.cell_width + 0.01; i = i + this.cell_width) {
            this.context.beginPath();
            this.context.moveTo(this.offset_x + i, this.offset_y + 0);
            this.context.lineTo(this.offset_x + i, this.offset_y + this.cell_height * this.sprite.height);
            this.context.stroke();
        }

        for (let i = 0; i <= this.sprite.height * this.cell_height; i = i + this.cell_height) {
            this.context.beginPath();
            this.context.moveTo(this.offset_x + 0, this.offset_y + i);
            this.context.lineTo(this.offset_x + this.cell_height * FONT_ASPECT_RATIO * this.sprite.width, this.offset_y + i);
            this.context.stroke();
        }

        if (this.selected !== null) {
            this.context.beginPath();
            this.context.strokeStyle = 'green';
            this.context.lineWidth = 2;
            this.context.rect(
                this.offset_x + this.selected.x * this.cell_width,
                this.offset_y + this.selected.y * this.cell_height,
                this.cell_width,
                this.cell_height
            );
            this.context.stroke();
        }
    }

    draw(): void {
        this.clear();
        this.sprite.draw(this.context, this.sprite.curFrame, this.offset_x, this.offset_y, this.cell_width, this.cell_height);
        this.drawOverlays();
    }

    select(row: number, col: number): void {
        this.selected = { x: col, y: row };
    }

    selectNextLoc(): void {
        if (this.selected.x < this.sprite.width - 1 || this.selected.y === this.sprite.height - 1) {
            this.selected.x = clamp(this.selected.x + 1, 0, this.sprite.width - 1);
        } else {
            this.selected.x = 0;
            this.selected.y = clamp(this.selected.y + 1, 0, this.sprite.height - 1);
        }
    }

    selectPrevLoc(): void {
        if (this.selected.x > 0 || this.selected.y === 0) {
            this.selected.x = clamp(this.selected.x - 1, 0, this.sprite.width - 1);
        } else {
            this.selected.x = this.sprite.width - 1;
            this.selected.y = clamp(this.selected.y - 1, 0, this.sprite.height - 1);
        }
    }
}
