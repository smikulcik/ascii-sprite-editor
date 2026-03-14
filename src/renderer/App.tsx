import React from 'react'
import TopBar from './components/TopBar'
import FrameSidebar from './components/FrameSidebar'
import SpriteCanvas from './components/SpriteCanvas'
import AnimationControls from './components/AnimationControls'

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <FrameSidebar />
        
        <main className="flex-1 flex flex-col relative overflow-hidden bg-brand-bg/50 shadow-inner">
          <SpriteCanvas />
          <AnimationControls />
        </main>
      </div>
      
      {/* Status Bar */}
      <footer className="h-6 bg-brand-surface border-t border-brand-border flex items-center px-4 text-[10px] text-brand-text/60 uppercase tracking-wider">
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
