import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSprite } from '../contexts/SpriteContext'
import { useEditor } from '../contexts/EditorContext'
import { usePalette } from '../contexts/PaletteContext'

const SpriteCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { sprite, width, height, currentFrameIndex, activeCell, setActiveCell, updateCell, zoom, setZoom, offset, setOffset } = useSprite()
  const { activeTool, fgColor, bgColor, currentCharacter, bold, italic, underline, strikeThrough } = useEditor()
  const { resolveColor } = usePalette()
  
  const [isPanning, setIsPanning] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  const cellWidth = 20 * zoom
  const cellHeight = 40 * zoom // 2:1 ratio roughly for courier

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isDark = document.documentElement.classList.contains('dark')

    // Draw inside background (Checkerboard for transparency)
    const spriteWidthPx = width * cellWidth
    const spriteHeightPx = height * cellHeight

    const pCanvas = document.createElement('canvas')
    pCanvas.width = 16
    pCanvas.height = 16
    const pCtx = pCanvas.getContext('2d')
    if (pCtx) {
      pCtx.fillStyle = isDark ? '#2a2a2a' : '#f0f0f0'
      pCtx.fillRect(0, 0, 16, 16)
      pCtx.fillStyle = isDark ? '#222222' : '#cccccc'
      pCtx.fillRect(0, 0, 8, 8)
      pCtx.fillRect(8, 8, 8, 8)
      const pattern = ctx.createPattern(pCanvas, 'repeat')
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.save()
        ctx.translate(offset.x, offset.y)
        ctx.fillRect(0, 0, spriteWidthPx, spriteHeightPx)
        ctx.restore()
      }
    }

    // Draw grid
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
    ctx.lineWidth = 1
    for (let r = 0; r <= height; r++) {
      ctx.beginPath()
      ctx.moveTo(offset.x, offset.y + r * cellHeight)
      ctx.lineTo(offset.x + width * cellWidth, offset.y + r * cellHeight)
      ctx.stroke()
    }
    for (let c = 0; c <= width; c++) {
      ctx.beginPath()
      ctx.moveTo(offset.x + c * cellWidth, offset.y)
      ctx.lineTo(offset.x + c * cellWidth, offset.y + height * cellHeight)
      ctx.stroke()
    }

    // Draw Sprite
    sprite.draw(ctx, currentFrameIndex, offset.x, offset.y, cellWidth, cellHeight, resolveColor)

    // Draw active cell highlight
    if (activeCell) {
      ctx.strokeStyle = 'var(--primary)'
      ctx.lineWidth = 2
      ctx.strokeRect(
        offset.x + activeCell.col * cellWidth,
        offset.y + activeCell.row * cellHeight,
        cellWidth,
        cellHeight
      )
      
      // Secondary subtle highlight
      ctx.fillStyle = 'rgba(199, 146, 234, 0.1)'
      ctx.fillRect(
        offset.x + activeCell.col * cellWidth,
        offset.y + activeCell.row * cellHeight,
        cellWidth,
        cellHeight
      )
    }
  }, [sprite, width, height, currentFrameIndex, activeCell, offset, cellWidth, cellHeight, resolveColor])

  useEffect(() => {
    render()
  }, [render, zoom])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      return
    }

    if (e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const col = Math.floor((mouseX - offset.x) / cellWidth)
      const row = Math.floor((mouseY - offset.y) / cellHeight)
      
      if (col >= 0 && col < width && row >= 0 && row < height) {
        setActiveCell({ row, col })
        
        if (activeTool === 'pencil') {
          updateCell(row, col, {
            value: currentCharacter,
            fg_color: fgColor,
            bg_color: bgColor,
            weight: bold ? 'bold' : 'normal',
            italic,
            underline,
            strike_through: strikeThrough
          })
        } else if (activeTool === 'eraser') {
          updateCell(row, col, null)
        }
      } else {
        setActiveCell(null)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x
      const dy = e.clientY - lastMousePos.y
      setOffset({ x: offset.x + dx, y: offset.y + dy })
      setLastMousePos({ x: e.clientX, y: e.clientY })
      return
    }

    if (e.buttons === 1 && activeCell) {
       const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const col = Math.floor((mouseX - offset.x) / cellWidth)
      const row = Math.floor((mouseY - offset.y) / cellHeight)
      
      if (col >= 0 && col < width && row >= 0 && row < height) {
        if (activeTool === 'pencil') {
          updateCell(row, col, {
            value: currentCharacter,
            fg_color: fgColor,
            bg_color: bgColor,
            weight: bold ? 'bold' : 'normal',
            italic,
            underline,
            strike_through: strikeThrough
          })
        } else if (activeTool === 'eraser') {
          updateCell(row, col, null)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(Math.max(0.1, Math.min(5, zoom * delta)))
    } else {
      setOffset({ x: offset.x - e.deltaX, y: offset.y - e.deltaY })
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!activeCell) return

    if (e.key === 'ArrowUp') {
      setActiveCell({ row: Math.max(0, activeCell.row - 1), col: activeCell.col })
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      setActiveCell({ row: Math.min(height - 1, activeCell.row + 1), col: activeCell.col })
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      setActiveCell({ row: activeCell.row, col: Math.max(0, activeCell.col - 1) })
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      setActiveCell({ row: activeCell.row, col: Math.min(width - 1, activeCell.col + 1) })
      e.preventDefault()
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      updateCell(activeCell.row, activeCell.col, null)
      if (e.key === 'Backspace' && activeCell.col > 0) {
        setActiveCell({ row: activeCell.row, col: activeCell.col - 1 })
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Type tool logic
      if (activeTool === 'type') {
        updateCell(activeCell.row, activeCell.col, {
          value: e.key,
          fg_color: fgColor,
          bg_color: bgColor,
          weight: bold ? 'bold' : 'normal',
          italic,
          underline,
          strike_through: strikeThrough
        })
        
        // Move selection
        if (activeCell.col < width - 1) {
          setActiveCell({ row: activeCell.row, col: activeCell.col + 1 })
        } else if (activeCell.row < height - 1) {
          setActiveCell({ row: activeCell.row + 1, col: 0 })
        }
      }
    }
  }, [activeCell, activeTool, height, width, fgColor, bgColor, bold, italic, underline, strikeThrough, updateCell, setActiveCell])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-200 dark:bg-slate-900 transition-colors"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      tabIndex={0}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#82aaff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <canvas
        ref={canvasRef}
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 600}
        className="cursor-crosshair w-full h-full"
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="bg-brand-surface border border-brand-border rounded-full px-3 py-1 text-[10px] font-mono text-brand-text/80 shadow-lg">
          ZOOM: {Math.round(zoom * 100)}%
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-full px-3 py-1 text-[10px] font-mono text-brand-text/80 shadow-lg">
          X: {offset.x} Y: {offset.y}
        </div>
      </div>
    </div>
  )
}

export default SpriteCanvas
