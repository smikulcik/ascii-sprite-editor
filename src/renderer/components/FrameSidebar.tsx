import React from 'react'

const FrameSidebar: React.FC = () => {
  // Mock frames for now
  const frames = [1, 2, 3]

  return (
    <aside className="w-56 bg-brand-surface border-r border-brand-border flex flex-col shrink-0 z-10 transition-all">
      <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-text/50">Timeline</h2>
        <button className="text-brand-primary hover:text-brand-primary/80 text-xs font-bold transition-colors">
          + Add Frame
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {frames.map((_, index) => (
          <div 
            key={index}
            className={`group relative rounded-lg border aspect-video flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm
              ${index === 0 ? 'border-brand-primary bg-brand-bg ring-1 ring-brand-primary/50 shadow-brand-primary/10' : 'border-brand-border bg-brand-bg/50 hover:border-brand-primary/50 hover:bg-brand-bg'}
            `}
          >
            <div className="absolute top-1 left-2 text-[10px] font-mono text-brand-text/30 group-hover:text-brand-text/50">
              #{index + 1}
            </div>
            
            <div className="font-mono text-[8px] text-brand-text/20 select-none">
              FRAME PREVIEW
            </div>
            
            {index === 0 && (
              <div className="absolute -left-1 w-1 h-8 bg-brand-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default FrameSidebar
