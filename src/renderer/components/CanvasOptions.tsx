import React from 'react'
import { Maximize2, Grid3X3, Layers } from 'lucide-react'
import { useSprite } from '../contexts/SpriteContext'

const CanvasOptions: React.FC = () => {
  const { width, height, resize } = useSprite()

  return (
    <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border p-4 rounded-2xl flex flex-col gap-6 shadow-2xl text-brand-text min-w-[300px]">
      <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Canvas Settings</h3>
        <p className="text-[10px] text-brand-text/40">Adjust dimensions and visibility</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-1">
            <Maximize2 size={12} className="text-brand-primary/60" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/70">Dimensions</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-bg/30 p-2 rounded-xl border border-brand-border/20">
            <InputGroup 
              label="Width" 
              value={width} 
              onChange={(val) => resize(val, height)}
            />
            <span className="text-brand-text/20 font-light px-2">×</span>
            <InputGroup 
              label="Height" 
              value={height} 
              onChange={(val) => resize(width, val)}
            />
          </div>
        </div>
        
        <div className="h-px bg-brand-border/50" />
        
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/70 px-1">Visibility</span>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-bg/50 hover:bg-brand-surface border border-brand-border/30 transition-all group">
              <Grid3X3 size={14} className="text-brand-text/40 group-hover:text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 group-hover:text-brand-text/80">Toggle Grid</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-bg/50 border border-brand-border/30 transition-all opacity-40 cursor-not-allowed">
              <Layers size={14} className="text-brand-text/40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">Onion Skin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const InputGroup: React.FC<{ label: string, value: number, onChange: (val: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center bg-brand-bg/50 rounded-lg border border-brand-border/50 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all shadow-inner">
    <span className="px-1.5 py-1 bg-brand-surface/50 text-[9px] font-bold text-brand-text/30 border-r border-brand-border/50 select-none">{label}</span>
    <input 
      type="number" 
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="w-10 px-1.5 py-1 bg-transparent text-xs font-mono text-brand-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
    />
  </div>
)

export default CanvasOptions
