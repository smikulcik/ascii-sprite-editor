import React from 'react'

const DrawingToolbar: React.FC = () => {
  return (
    <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border p-2 rounded-xl shadow-2xl flex items-center gap-4">
      {/* Tool Selection */}
      <div className="flex bg-brand-bg/50 p-1 rounded-lg border border-brand-border/50">
        <ToolButton active icon="✎" label="Draw" />
        <ToolButton icon="▭" label="Box" />
        <ToolButton icon="T" label="Type" />
        <ToolButton icon="⌫" label="Eraser" />
      </div>

      <div className="w-px h-8 bg-brand-border" />

      {/* Style Controls */}
      <div className="flex items-center gap-3">
        <label className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-white border border-brand-border shadow-sm" />
          <span className="text-[9px] uppercase font-bold text-brand-text/50">FG</span>
        </label>
        <label className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-black border border-brand-border shadow-sm" />
          <span className="text-[9px] uppercase font-bold text-brand-text/50">BG</span>
        </label>
      </div>

      <div className="w-px h-8 bg-brand-border" />

      {/* Modifier Controls */}
      <div className="flex gap-1">
        <ModifierButton label="B" />
        <ModifierButton label="I" />
        <ModifierButton label="U" />
        <ModifierButton label="S" />
      </div>

      <div className="w-px h-8 bg-brand-border" />

      {/* Brush & Line Style */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 items-center">
          <select className="bg-brand-bg border border-brand-border rounded text-[10px] px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-text">
            <option>Point</option>
            <option>Circle</option>
          </select>
          <span className="text-[9px] uppercase font-bold text-brand-text/50">Brush</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <select className="bg-brand-bg border border-brand-border rounded text-[10px] px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-brand-text">
            <option>Solid</option>
            <option>Dashed</option>
          </select>
          <span className="text-[9px] uppercase font-bold text-brand-text/50">Line</span>
        </div>
      </div>

      <div className="w-px h-8 bg-brand-border" />

      {/* Character Input */}
      <div className="flex flex-col gap-1 text-brand-text">
        <input 
          type="text" 
          maxLength={1} 
          className="w-8 h-8 bg-brand-bg border border-brand-border rounded text-center font-mono text-lg focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-brand-text placeholder-brand-text/20"
          placeholder="@"
        />
        <span className="text-[9px] uppercase font-bold text-brand-text/50 text-center">Char</span>
      </div>
    </div>
  )
}

const ToolButton: React.FC<{ active?: boolean, icon: string, label: string }> = ({ active, icon, label }) => (
  <button className={`w-10 h-10 flex items-center justify-center rounded-md transition-all relative group
    ${active ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-brand-text/40 hover:bg-brand-bg hover:text-brand-text'}
  `}>
    <span className="text-lg">{icon}</span>
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-surface text-brand-text text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-brand-border">
      {label}
    </span>
  </button>
)

const ModifierButton: React.FC<{ active?: boolean, label: string }> = ({ active, label }) => (
  <button className={`w-8 h-8 flex items-center justify-center rounded border transition-all font-bold
    ${active ? 'bg-brand-primary/20 border-brand-primary text-brand-primary shadow-sm' : 'border-brand-border text-brand-text/30 hover:border-brand-text/50 hover:text-brand-text'}
  `}>
    <span className="text-xs">{label}</span>
  </button>
)

export default DrawingToolbar
