import React from 'react'

const TopBar: React.FC = () => {
  return (
    <header className="h-12 bg-brand-surface border-b border-brand-border flex items-center px-4 shrink-0 z-10 shadow-lg">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold text-lg shadow-brand-primary/20 shadow-lg text-white">
          A
        </div>
        <h1 className="font-bold tracking-tight text-brand-text">ASCII Sprite</h1>
      </div>
      
      <nav className="flex items-center gap-1">
        <button className="px-3 py-1.5 rounded hover:bg-brand-bg text-sm font-medium transition-colors text-brand-text">File</button>
        <button className="px-3 py-1.5 rounded hover:bg-brand-bg text-sm font-medium transition-colors text-brand-text/40">Edit</button>
        <button className="px-3 py-1.5 rounded hover:bg-brand-bg text-sm font-medium transition-colors text-brand-text/40">View</button>
      </nav>
      
      <div className="ml-auto flex items-center gap-2">
        <button className="px-4 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white rounded text-sm font-semibold transition-all shadow-md active:scale-95">
          Export
        </button>
      </div>
    </header>
  )
}

export default TopBar
