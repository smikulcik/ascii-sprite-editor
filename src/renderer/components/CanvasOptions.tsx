import React from 'react'
import { Maximize2, Grid3X3, Layers } from 'lucide-react'
import { useSprite } from '../contexts/SpriteContext'

const CanvasOptions: React.FC = () => {
  const { width, height, resize } = useSprite()

  return (
    <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border/50 p-1.5 rounded-xl flex items-center gap-4 shadow-2xl text-brand-text">
      <div className="flex items-center gap-3 px-2">
        <div className="flex items-center gap-1.5">
          <Maximize2 size={12} className="text-brand-primary/60" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50">Dimensions</span>
        </div>
        <div className="flex items-center gap-2">
          <InputGroup 
            label="W" 
            value={width} 
            onChange={(val) => resize(val, height)}
          />
          <span className="text-brand-text/20 font-light translate-y-[1px]">×</span>
          <InputGroup 
            label="H" 
            value={height} 
            onChange={(val) => resize(width, val)}
          />
        </div>
      </div>
      
      <div className="w-px h-6 bg-brand-border/50" />
      
      <div className="flex items-center gap-2 px-1">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-brand-bg transition-colors group">
          <Grid3X3 size={12} className="text-brand-text/40 group-hover:text-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 group-hover:text-brand-text/80">Grid Off</span>
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-brand-bg transition-colors group opacity-40 cursor-not-allowed">
          <Layers size={12} className="text-brand-text/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40">Onion Skin</span>
        </button>
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
