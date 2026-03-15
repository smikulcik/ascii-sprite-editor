import React from 'react'
import { Pencil, Square, Type, Eraser, Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough } from 'lucide-react'
import { useEditor } from '../contexts/EditorContext'
import { useSprite } from '../contexts/SpriteContext'
import { usePalette } from '../contexts/PaletteContext'
import { Palette as PaletteIcon, ChevronDown } from 'lucide-react'

const DrawingToolbar: React.FC = () => {
  const { 
    activeTool, setActiveTool, 
    fgColor, setFgColor, 
    bgColor, setBgColor,
    currentCharacter, setCurrentCharacter,
    bold, setBold,
    italic, setItalic,
    underline, setUnderline,
    strikeThrough, setStrikeThrough
  } = useEditor()
  const { activePalette, setActivePalette, palettes, resolveColor } = usePalette()
  const { setPaletteId } = useSprite()
  
  const [showPaletteMenu, setShowPaletteMenu] = React.useState(false)
  const [showFgPicker, setShowFgPicker] = React.useState(false)
  const [showBgPicker, setShowBgPicker] = React.useState(false)

  const pickerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowFgPicker(false)
        setShowBgPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-brand-surface/95 backdrop-blur-md border border-brand-border p-1.5 rounded-2xl shadow-2xl flex items-center gap-3">
      {/* Tool Selection */}
      <div className="flex bg-brand-bg/50 p-1 rounded-xl border border-brand-border/30">
        <ToolButton 
          active={activeTool === 'pencil'} 
          onClick={() => setActiveTool('pencil')}
          icon={<Pencil size={18} />} 
          label="Pencil" 
        />
        <ToolButton 
          active={activeTool === 'box'} 
          onClick={() => setActiveTool('box')}
          icon={<Square size={18} />} 
          label="Box Tool" 
        />
        <ToolButton 
          active={activeTool === 'type'} 
          onClick={() => setActiveTool('type')}
          icon={<Type size={18} />} 
          label="Type Tool" 
        />
        <ToolButton 
          active={activeTool === 'eraser'} 
          onClick={() => setActiveTool('eraser')}
          icon={<Eraser size={18} />} 
          label="Eraser" 
        />
      </div>

      <div className="w-px h-8 bg-brand-border/50" />

      {/* Style Controls */}
      <div className="flex items-center gap-4 px-1" ref={pickerRef}>
        <div className="flex flex-col gap-1 items-center relative">
          <div className="relative group">
            <button 
              onClick={() => setShowFgPicker(!showFgPicker)}
              className="w-6 h-6 rounded-md border border-brand-border overflow-hidden bg-transparent shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: resolveColor(fgColor) }}
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100" />
            
            {showFgPicker && (
              <PaletteColorPicker 
                onSelect={(val) => { setFgColor(val); setShowFgPicker(false); }} 
                activeColor={fgColor}
                resolveColor={resolveColor}
                palette={activePalette}
              />
            )}
          </div>
          <div className="flex gap-1 mt-1">
            <button 
              onClick={() => setFgColor('base:fg')}
              className={`w-3 h-3 rounded-full border border-brand-border shadow-sm transition-transform hover:scale-125 ${fgColor === 'base:fg' ? 'ring-1 ring-brand-primary' : ''}`}
              style={{ backgroundColor: resolveColor('base:fg') }}
              title="Reset to Base FG"
            />
            <span className="text-[8px] uppercase font-bold text-brand-text/40 tracking-tighter">FG</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center relative">
           <div className="relative group">
            <button 
              onClick={() => setShowBgPicker(!showBgPicker)}
              className={`w-6 h-6 rounded-md border border-brand-border flex items-center justify-center transition-all overflow-hidden shadow-sm hover:scale-105 ${bgColor === 'transparent' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdtzMENADAIw8C9/6YDsAnKz8I6SkUBCgXpMv4KAtD7vO929S4YHgIEn+9LmgAAAABJRU5ErkJggg==")]' : ''}`}
              style={{ backgroundColor: bgColor !== 'transparent' ? resolveColor(bgColor) : undefined }}
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100" />
            
            {showBgPicker && (
              <PaletteColorPicker 
                onSelect={(val) => { setBgColor(val); setShowBgPicker(false); }} 
                activeColor={bgColor}
                resolveColor={resolveColor}
                palette={activePalette}
                allowTransparent
              />
            )}
          </div>
          <div className="flex gap-1 mt-1">
            <button 
              onClick={() => setBgColor('base:bg')}
              className={`w-3 h-3 rounded-full border border-brand-border shadow-sm transition-transform hover:scale-125 ${bgColor === 'base:bg' ? 'ring-1 ring-brand-primary' : ''}`}
              style={{ backgroundColor: resolveColor('base:bg') }}
              title="Reset to Base BG"
            />
            <span className="text-[8px] uppercase font-bold text-brand-text/40 tracking-tighter">BG</span>
          </div>
        </div>
      </div>

      <div className="w-px h-8 bg-brand-border/50" />

      {/* Modifier Controls */}
      <div className="flex gap-1 bg-brand-bg/50 p-1 rounded-xl">
        <ModifierButton active={bold} onClick={() => setBold(!bold)} icon={<BoldIcon size={14} />} label="Bold" />
        <ModifierButton active={italic} onClick={() => setItalic(!italic)} icon={<ItalicIcon size={14} />} label="Italic" />
        <ModifierButton active={underline} onClick={() => setUnderline(!underline)} icon={<UnderlineIcon size={14} />} label="Underline" />
        <ModifierButton active={strikeThrough} onClick={() => setStrikeThrough(!strikeThrough)} icon={<Strikethrough size={14} />} label="Strike" />
      </div>

      <div className="w-px h-8 bg-brand-border/50" />

      {/* Character Input */}
      <div className="flex gap-2 items-center bg-brand-bg/50 p-1 px-2 rounded-xl border border-brand-border/30">
        <input 
          type="text" 
          maxLength={1} 
          value={currentCharacter}
          onChange={(e) => setCurrentCharacter(e.target.value)}
          className="w-8 h-8 bg-brand-surface border border-brand-border rounded-lg text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-brand-text placeholder-brand-text/20 shadow-inner"
          placeholder="@"
        />
        <span className="text-[9px] uppercase font-bold text-brand-text/50 text-center leading-none">Primary<br/>Char</span>
      </div>

      <div className="w-px h-8 bg-brand-border/50" />

      {/* Palette Selector */}
      <div className="flex gap-1.5 items-center px-1">
        <div className="grid grid-cols-8 gap-1">
          {activePalette && activePalette.ansi.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                if (e.shiftKey) setBgColor(`ansi:${i}`)
                else setFgColor(`ansi:${i}`)
              }}
              className={`w-4 h-4 rounded-sm border border-brand-border/50 hover:scale-110 transition-transform shadow-sm relative group`}
              style={{ backgroundColor: resolveColor(`ansi:${i}`) }}
              title={`ANSI:${i}${fgColor === `ansi:${i}` ? ' (Selected FG)' : ''}${bgColor === `ansi:${i}` ? ' (Selected BG)' : ''}`}
            >
              {(fgColor === `ansi:${i}` || bgColor === `ansi:${i}`) && (
                <div className={`absolute inset-0 border-2 ${fgColor === `ansi:${i}` ? 'border-white' : 'border-white/50 border-dashed'} rounded-sm`} />
              )}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-brand-surface text-brand-text text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-50 border border-brand-border">
                ANSI:{i}
              </div>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowPaletteMenu(!showPaletteMenu)}
            className="flex items-center gap-1 px-2 py-1 bg-brand-bg/50 hover:bg-brand-surface border border-brand-border/30 rounded-lg transition-colors text-brand-text/60 hover:text-brand-text"
          >
            <PaletteIcon size={14} />
            <span className="text-[9px] font-bold uppercase tracking-wider max-w-[60px] truncate">{activePalette?.name || 'Default'}</span>
            <ChevronDown size={10} />
          </button>
          
          {showPaletteMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-brand-surface border border-brand-border rounded-xl shadow-2xl z-50 p-1 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-3 py-2 text-[10px] font-bold text-brand-text/40 uppercase tracking-widest border-bottom border-brand-border/30 mb-1">
                Select Palette
              </div>
              {palettes.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePalette(p.id)
                    setPaletteId(p.id)
                    setShowPaletteMenu(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${activePalette?.id === p.id ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-text/60 hover:bg-brand-bg/50 hover:text-brand-text'}`}
                >
                  <span className="font-semibold">{p.name}</span>
                  {activePalette?.id === p.id && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ToolButton: React.FC<{ active?: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all relative group
    ${active ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105 z-10' : 'text-brand-text/40 hover:bg-brand-surface hover:text-brand-text'}
  `}>
    {icon}
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-surface text-brand-text text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-brand-border font-bold">
      {label}
    </span>
  </button>
)

const ModifierButton: React.FC<{ active?: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all relative group
    ${active ? 'bg-brand-primary/20 border-brand-primary text-brand-primary shadow-inner' : 'border-transparent text-brand-text/40 hover:bg-brand-surface hover:text-brand-text'}
  `}>
    {icon}
    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-surface text-brand-text text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-brand-border font-bold">
      {label}
    </span>
  </button>
)

const PaletteColorPicker: React.FC<{ 
  onSelect: (color: string) => void, 
  activeColor: string, 
  resolveColor: (c: string) => string,
  palette: any,
  allowTransparent?: boolean
}> = ({ onSelect, activeColor, resolveColor, palette, allowTransparent }) => (
  <div className="absolute bottom-full left-0 mb-2 p-2 bg-brand-surface border border-brand-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 w-[160px]">
    <div className="grid grid-cols-4 gap-2 mb-2">
      {palette?.ansi.map((_: string, i: number) => (
        <button
          key={i}
          onClick={() => onSelect(`ansi:${i}`)}
          className={`w-6 h-6 rounded border border-brand-border/50 transition-all hover:scale-110 relative ${activeColor === `ansi:${i}` ? 'ring-2 ring-brand-primary ring-offset-1 ring-offset-brand-surface' : ''}`}
          style={{ backgroundColor: resolveColor(`ansi:${i}`) }}
          title={`ANSI:${i}`}
        />
      ))}
    </div>
    
    <div className="w-full h-px bg-brand-border/50 my-2" />
    
    <div className="flex flex-col gap-1.5">
      <button 
        onClick={() => onSelect('base:fg')}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${activeColor === 'base:fg' ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'hover:bg-brand-bg/50 text-brand-text/60'}`}
      >
        <div className="w-3 h-3 rounded-full border border-brand-border" style={{ backgroundColor: resolveColor('base:fg') }} />
        <span>Base FG</span>
      </button>
      <button 
        onClick={() => onSelect('base:bg')}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${activeColor === 'base:bg' ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'hover:bg-brand-bg/50 text-brand-text/60'}`}
      >
        <div className="w-3 h-3 rounded-full border border-brand-border" style={{ backgroundColor: resolveColor('base:bg') }} />
        <span>Base BG</span>
      </button>
      
      {allowTransparent && (
        <button 
          onClick={() => onSelect('transparent')}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${activeColor === 'transparent' ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'hover:bg-brand-bg/50 text-brand-text/60'}`}
        >
          <div className="w-3 h-3 rounded-full border border-brand-border bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdtzMENADAIw8C9/6YDsAnKz8I6SkUBCgXpMv4KAtD7vO929S4YHgIEn+9LmgAAAABJRU5ErkJggg==')]" />
          <span>Transparent</span>
        </button>
      )}

      <div className="relative mt-1 group/input">
        <input 
          type="color" 
          value={activeColor.startsWith('#') ? activeColor : resolveColor(activeColor)}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-6 rounded border border-brand-border cursor-pointer bg-transparent"
        />
        <div className="absolute inset-x-0 -bottom-1 h-px bg-brand-primary scale-x-0 group-hover/input:scale-x-100 transition-transform" />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-white/40 pointer-events-none font-mono">HEX</span>
      </div>
    </div>
  </div>
)

export default DrawingToolbar
