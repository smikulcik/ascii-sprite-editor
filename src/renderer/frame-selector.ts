import { Sprite } from './sprite';
import { FONT_ASPECT_RATIO, clamp } from './editor';

export class FrameSelector {
    context: CanvasRenderingContext2D;
    sprite: Sprite;
    offset_y: number = 0;
    frame_width: number = 100;
    cell_width: number;
    cell_height: number;
    frame_height: number;
    checker_img: HTMLImageElement;

    constructor(context: CanvasRenderingContext2D, sprite: Sprite, checker_img: HTMLImageElement) {
        this.context = context;
        this.sprite = sprite;
        this.cell_width = this.frame_width / this.sprite.width;
        this.cell_height = this.cell_width / FONT_ASPECT_RATIO;
        this.frame_height = this.cell_height * this.sprite.height;
        this.checker_img = checker_img;
    }

    draw(): void {
        const pattern = this.context.createPattern(this.checker_img, 'repeat');
        if (pattern) {
            this.context.fillStyle = pattern;
            this.context.fillRect(0, 0, 100, 400);
        }

        for (let i = 0; i < this.sprite.frames.length; i++) {
            this.sprite.draw(
                this.context,
                i,
                0,
                this.offset_y + i * (this.frame_height + 10),
                this.cell_width,
                this.cell_height
            );
            this.context.beginPath();
            this.context.strokeStyle = i === this.sprite.curFrame ? 'green' : 'grey';
            this.context.lineWidth = 2;
            this.context.rect(0, this.offset_y + i * (this.frame_height + 10), this.frame_width, this.frame_height);
            this.context.stroke();
        }
    }

    select(idx: number): void {
        this.sprite.curFrame = clamp(idx, 0, this.sprite.frames.length - 1);
    }
}
