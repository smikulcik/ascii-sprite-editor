import React from 'react'

const CanvasOptions: React.FC = () => {
  return (
    <div className="bg-brand-surface/80 backdrop-blur-sm border border-brand-border/50 p-3 rounded-lg flex items-center gap-6 shadow-xl text-brand-text">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50">Sprite</span>
        <div className="flex items-center gap-2">
          <InputGroup label="W" defaultValue="10" />
          <span className="text-brand-border text-xs">×</span>
          <InputGroup label="H" defaultValue="5" />
        </div>
      </div>
      
      <div className="w-px h-6 bg-brand-border/50" />
      
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50">Cell</span>
        <div className="flex items-center gap-2">
          <InputGroup label="W" defaultValue="12" />
          <span className="text-brand-border text-xs">×</span>
          <InputGroup label="H" defaultValue="20" />
        </div>
      </div>

      <div className="w-px h-6 bg-brand-border/50" />

      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="w-4 h-4 rounded border border-brand-border flex items-center justify-center group-hover:border-brand-primary transition-colors">
          <div className="w-2 h-2 rounded bg-brand-primary" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50 group-hover:text-brand-text/80 transition-colors">Background</span>
      </label>
    </div>
  )
}

const InputGroup: React.FC<{ label: string, defaultValue: string }> = ({ label, defaultValue }) => (
  <div className="flex items-center bg-brand-bg rounded border border-brand-border overflow-hidden focus-within:border-brand-primary transition-all">
    <span className="px-1.5 py-1 bg-brand-surface text-[10px] font-bold text-brand-text/40 border-r border-brand-border">{label}</span>
    <input 
      type="number" 
      defaultValue={defaultValue}
      className="w-10 px-1.5 py-1 bg-transparent text-xs font-mono text-brand-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
)

export default CanvasOptions
