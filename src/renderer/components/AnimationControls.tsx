import React, { useState } from 'react'
import { Play, Square, Repeat, RefreshCw } from 'lucide-react'
import { useSprite } from '../contexts/SpriteContext'

const AnimationControls: React.FC = () => {
  const { play, stop, isPlaying } = useSprite()
  const [fps, setFps] = useState(12)

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2 bg-brand-surface/90 backdrop-blur-md border border-brand-border rounded-full shadow-2xl z-20 transition-all hover:border-brand-primary/50 group text-brand-text">
      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <button 
            onClick={() => play(fps)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 group/btn border-2 border-brand-bg relative"
          >
            <Play size={18} className="ml-1 fill-current" />
            <Tooltip text="Play Animation" />
          </button>
        ) : (
          <button 
            onClick={stop}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg hover:bg-brand-surface text-brand-primary transition-all active:scale-95 group/btn relative border-2 border-brand-primary shadow-[0_0_15px_rgba(199,146,234,0.3)] anim-pulse"
          >
            <Square size={16} className="fill-current" />
            <Tooltip text="Stop" />
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-brand-border/50" />

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-text/30 select-none">Framerate</span>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={fps}
              onChange={(e) => {
                const newFps = parseInt(e.target.value)
                setFps(newFps)
                if (isPlaying) play(newFps)
              }}
              className="w-24 h-1 bg-brand-border/40 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <span className="font-mono text-[10px] font-bold text-brand-primary w-10">{fps} FPS</span>
          </div>
        </div>
      </div>
      
      <div className="w-px h-6 bg-brand-border/50" />

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 px-2 rounded-lg hover:bg-brand-bg text-brand-text/30 hover:text-brand-text transition-colors text-[10px] font-bold flex items-center gap-1">
          <Repeat size={12} />
          Loop
        </button>
        <button className="p-1 px-2 rounded-lg hover:bg-brand-bg text-brand-text/30 hover:text-brand-text transition-colors text-[10px] font-bold flex items-center gap-1">
          <RefreshCw size={12} />
          Bouncy
        </button>
      </div>
    </div>
  )
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/btn:scale-100 transition-all duration-200 px-2 py-1 bg-brand-surface text-[10px] font-bold rounded-lg border border-brand-border whitespace-nowrap z-50 shadow-2xl">
    {text}
  </div>
)

export default AnimationControls
