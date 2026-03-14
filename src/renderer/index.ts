import { Sprite } from './sprite';
import { Editor, clamp, FONT_ASPECT_RATIO } from './editor';
import { FrameSelector } from './frame-selector';

let sprite: Sprite;
let editor: Editor;
let frameSelector: FrameSelector;
let isDragging = false;
let frameisDragging = false;

const checker_img = new Image();
checker_img.src = new URL('./img/checker.png', import.meta.url).href;

function drawAll(): void {
    editor.draw();
    frameSelector.draw();
}

window.addEventListener('DOMContentLoaded', () => {
    const editorCanvas = document.getElementById('editorCanvas') as HTMLCanvasElement;
    const frameSelectorCanvas = document.getElementById('frameSelectorCanvas') as HTMLCanvasElement;

    if (!editorCanvas || !frameSelectorCanvas) return;

    const context = editorCanvas.getContext('2d')!;
    const frameSelectorCtx = frameSelectorCanvas.getContext('2d')!;

    sprite = new Sprite();
    editor = new Editor(context, sprite, checker_img);
    frameSelector = new FrameSelector(frameSelectorCtx, sprite, checker_img);

    sprite.onDraw = drawAll;

    // Event Listeners
    editorCanvas.addEventListener('mousedown', (_e) => {
        isDragging = false;
    });

    editorCanvas.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) {
            isDragging = true;
            editor.offset_x += e.movementX;
            editor.offset_y += e.movementY;
            drawAll();
        }
    });

    editorCanvas.addEventListener('mouseup', (e) => {
        if (!isDragging) {
            const col = clamp(
                Math.floor((e.offsetX - editor.offset_x) / editor.cell_width),
                0,
                editor.sprite.width - 1
            );
            const row = clamp(
                Math.floor((e.offsetY - editor.offset_y) / editor.cell_height),
                0,
                editor.sprite.height - 1
            );
            editor.select(row, col);
            drawAll();
        } else {
            isDragging = false;
        }
    });

    window.addEventListener('keypress', (e) => {
        if (e.which >= 32) {
            const fgColor = document.getElementById('fgColor') as HTMLInputElement;
            const bgColor = document.getElementById('bgColor') as HTMLInputElement;
            sprite.setCell(
                editor.selected.y,
                editor.selected.x,
                String.fromCharCode(e.charCode),
                fgColor.value,
                bgColor.value
            );
            editor.selectNextLoc();
            drawAll();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Backspace') {
            sprite.setCell(editor.selected.y, editor.selected.x, null);
            editor.selectPrevLoc();
            drawAll();
        } else if (e.key === 'Delete') {
            sprite.setCell(editor.selected.y, editor.selected.x, null);
            editor.selectNextLoc();
            drawAll();
        } else if (e.key === 'ArrowUp') {
            editor.selected.y = clamp(editor.selected.y - 1, 0, sprite.height - 1);
            drawAll();
        } else if (e.key === 'ArrowDown') {
            editor.selected.y = clamp(editor.selected.y + 1, 0, sprite.height - 1);
            drawAll();
        } else if (e.key === 'ArrowLeft') {
            editor.selected.x = clamp(editor.selected.x - 1, 0, sprite.width - 1);
            drawAll();
        } else if (e.key === 'ArrowRight') {
            editor.selected.x = clamp(editor.selected.x + 1, 0, sprite.width - 1);
            drawAll();
        }
    });

    document.getElementById('insertFrame')?.addEventListener('click', () => {
        sprite.insertFrame();
        drawAll();
    });

    frameSelectorCanvas.addEventListener('mousedown', (_e) => {
        frameisDragging = false;
    });

    frameSelectorCanvas.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) {
            frameisDragging = true;
            frameSelector.offset_y = clamp(
                frameSelector.offset_y + e.movementY,
                Math.min(400 - sprite.frames.length * (frameSelector.frame_height + 10) + 10, 0),
                0
            );
            frameSelector.draw();
        }
    });

    frameSelectorCanvas.addEventListener('mouseup', (e) => {
        if (!frameisDragging) {
            const row = clamp(
                Math.floor((e.offsetY - frameSelector.offset_y) / (frameSelector.frame_height + 10)),
                0,
                sprite.frames.length - 1
            );
            frameSelector.select(row);
            drawAll();
        } else {
            frameisDragging = false;
        }
    });

    document.getElementById('playBtn')?.addEventListener('click', () => {
        const durationInput = document.querySelector('#bottompane input') as HTMLInputElement;
        const duration = parseInt(durationInput.value) || 250;
        sprite.play(duration);
    });

    document.getElementById('stopBtn')?.addEventListener('click', () => {
        sprite.stop();
    });

    document.getElementById('canvaswidth')?.addEventListener('change', (e) => {
        const newWidth = parseInt((e.target as HTMLInputElement).value);
        if (newWidth > 0) {
            sprite.resize(newWidth, sprite.height);
            editor.cell_width = editor.cell_height * FONT_ASPECT_RATIO;
            frameSelector.cell_width = frameSelector.frame_width / sprite.width;
            frameSelector.cell_height = frameSelector.cell_width / FONT_ASPECT_RATIO;
            frameSelector.frame_height = frameSelector.cell_height * sprite.height;
            drawAll();
        }
    });

    document.getElementById('canvasheight')?.addEventListener('change', (e) => {
        const newHeight = parseInt((e.target as HTMLInputElement).value);
        if (newHeight > 0) {
            sprite.resize(sprite.width, newHeight);
            frameSelector.frame_height = frameSelector.cell_height * sprite.height;
            drawAll();
        }
    });

    document.getElementById('saveBtn')?.addEventListener('click', () => {
        const data = JSON.stringify({
            width: sprite.width,
            height: sprite.height,
            frames: sprite.frames
        });
        // In a real app, we'd use IPC to save to a file.
        // For now, let's just log it or use a simple blob download.
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sprite.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    checker_img.onload = () => {
        drawAll();
    };
});
