import React from 'react'

const AnimationControls: React.FC = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-brand-surface/90 backdrop-blur-md border border-brand-border rounded-full shadow-2xl z-20 transition-all hover:border-brand-primary/50 group text-brand-text">
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary hover:bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 group/btn border-2 border-brand-bg relative">
          <span className="text-xl ml-1">▶</span>
          <div className="absolute -top-10 scale-0 group-hover/btn:scale-100 transition-transform px-2 py-1 bg-brand-surface text-[10px] rounded border border-brand-border whitespace-nowrap z-50">Play Animation</div>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg hover:bg-brand-surface text-brand-text/50 transition-all active:scale-95 group/btn relative border border-brand-border">
          <span className="text-lg">■</span>
          <div className="absolute -top-10 scale-0 group-hover/btn:scale-100 transition-transform px-2 py-1 bg-brand-surface text-[10px] rounded border border-brand-border whitespace-nowrap z-50">Stop</div>
        </button>
      </div>

      <div className="w-px h-8 bg-brand-border" />

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 -mb-1">Speed</span>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="1" 
              max="60" 
              defaultValue="12"
              className="w-24 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <span className="font-mono text-xs text-brand-detail w-12 underline decoration-brand-detail/30 underline-offset-4">12 FPS</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 px-2 rounded-md hover:bg-brand-bg text-brand-text/40 hover:text-brand-text transition-colors text-xs font-medium">Loop</button>
        <button className="p-1 px-2 rounded-md hover:bg-brand-bg text-brand-text/40 hover:text-brand-text transition-colors text-xs font-medium">Ping-Pong</button>
      </div>
    </div>
  )
}

export default AnimationControls
