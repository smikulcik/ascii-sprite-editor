import React, { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import FrameSidebar from './components/FrameSidebar'
import SpriteCanvas from './components/SpriteCanvas'
import AnimationControls from './components/AnimationControls'
import DrawingToolbar from './components/DrawingToolbar'
import CanvasOptions from './components/CanvasOptions'
import ExportModal from './components/ExportModal'

const App: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false)
  const [showExport, setShowExport] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOptions(false)
        setShowExport(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30">
      <TopBar 
        onShowOptions={() => setShowOptions(true)} 
        onShowExport={() => setShowExport(true)} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <FrameSidebar />
        <DrawingToolbar docked={true} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden bg-brand-bg/50 shadow-inner">
          <SpriteCanvas />
          <AnimationControls />
        </main>

        {/* Canvas Options Modal */}
        {showOptions && (
          <div 
            className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowOptions(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div className="absolute -top-12 right-0">
                 <button 
                  onClick={() => setShowOptions(false)}
                  className="px-3 py-1 bg-brand-surface border border-brand-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-brand-text/80 hover:text-brand-primary transition-colors focus:ring-2 focus:ring-brand-primary/50 outline-none"
                >
                  Close ESC
                </button>
              </div>
              <CanvasOptions />
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExport && (
          <div 
            className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowExport(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div className="absolute -top-12 right-0">
                 <button 
                  onClick={() => setShowExport(false)}
                  className="px-3 py-1 bg-brand-surface border border-brand-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-brand-text/80 hover:text-brand-primary transition-colors focus:ring-2 focus:ring-brand-primary/50 outline-none"
                >
                  Close ESC
                </button>
              </div>
              <ExportModal onClose={() => setShowExport(false)} />
            </div>
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <footer className="h-6 bg-brand-surface border-t border-brand-border flex items-center px-4 text-[10px] text-brand-text/80 uppercase tracking-wider">
        <span>Ready</span>
        <div className="ml-auto flex gap-4 text-brand-detail font-bold">
          <span>10x5</span>
          <span>Layer: Base</span>
        </div>
      </footer>
    </div>
  )
}

export default App
