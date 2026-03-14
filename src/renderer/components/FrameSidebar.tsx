import React, { useRef, useEffect } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import { useSprite } from '../contexts/SpriteContext'
import { Frame } from '../sprite'

const FrameSidebar: React.FC = () => {
  const { frames, currentFrameIndex, setCurrentFrame, addFrame, deleteFrame, sprite } = useSprite()

  return (
    <aside className="w-60 bg-brand-surface border-r border-brand-border flex flex-col shrink-0 z-10 transition-all shadow-xl">
      <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50 backdrop-blur-sm sticky top-0 z-20">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">Timeline</h2>
        <button 
          onClick={addFrame}
          className="bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white p-1.5 rounded-lg transition-all shadow-sm group"
        >
          <Plus size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
        {frames.map((frame, index) => (
          <FrameItem 
            key={index}
            frame={frame}
            index={index}
            isActive={index === currentFrameIndex}
            onClick={() => setCurrentFrame(index)}
            onDelete={() => deleteFrame(index)}
            sprite={sprite}
          />
        ))}
      </div>
    </aside>
  )
}

interface FrameItemProps {
  frame: Frame;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  sprite: any;
}

const FrameItem: React.FC<FrameItemProps> = ({ frame, index, isActive, onClick, onDelete, sprite }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Transparent background pattern
    ctx.fillStyle = '#1a1c25'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw frame preview
    const scale = Math.min(canvas.width / (sprite.width * 10), canvas.height / (sprite.height * 20))
    const cellW = 10 * scale
    const cellH = 20 * scale
    const offsetX = (canvas.width - sprite.width * cellW) / 2
    const offsetY = (canvas.height - sprite.height * cellH) / 2

    // Use a simplified draw for preview
    sprite.draw(ctx, index, offsetX, offsetY, cellW, cellH)
  }, [frame, sprite, index])

  return (
    <div 
      className={`group relative rounded-xl border flex flex-col cursor-pointer transition-all duration-200 overflow-hidden
        ${isActive 
          ? 'border-brand-primary bg-brand-bg shadow-[0_0_15px_rgba(199,146,234,0.15)] ring-1 ring-brand-primary/50' 
          : 'border-brand-border bg-brand-bg/40 hover:border-brand-primary/40 hover:bg-brand-bg/80 hover:shadow-lg'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-brand-surface/40 border-b border-brand-border/30">
        <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-brand-primary' : 'text-brand-text/30'}`}>
          FRAME #{index + 1}
        </span>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-brand-text/30 hover:text-brand-primary transition-colors">
            <Copy size={10} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-brand-text/30 hover:text-red-400 transition-colors"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      <div className="aspect-video bg-[#0a0c14] relative p-2 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={180} 
          height={100} 
          className="w-full h-full object-contain"
        />
        
        {isActive && (
          <div className="absolute inset-0 border-2 border-brand-primary/30 pointer-events-none" />
        )}
      </div>

      {isActive && (
        <div className="absolute top-1/2 -left-0.5 w-1 h-8 -translate-y-1/2 bg-brand-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
      )}
    </div>
  )
}

export default FrameSidebar
