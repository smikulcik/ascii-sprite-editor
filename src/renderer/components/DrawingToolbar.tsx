import React from 'react'
import { 
  Pencil, Square, Type, Eraser, 
  Bold as BoldIcon, Italic as ItalicIcon, 
  Underline as UnderlineIcon, Strikethrough,
  Palette as PaletteIcon,
  ChevronDown
} from 'lucide-react'
import { useEditor } from '../contexts/EditorContext'
import { useSprite } from '../contexts/SpriteContext'
import { usePalette, ANSI_COLOR_NAMES } from '../contexts/PaletteContext'

interface DrawingToolbarProps {
  onShowOptions?: () => void;
  docked?: boolean;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({ docked }) => {
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

  const handleColorClick = (color: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setBgColor(color)
    } else {
      setFgColor(color)
    }
  }

  const transparentOverlay = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 8 8\'%3E%3Crect width=\'4\' height=\'4\' fill=\'%23ffffff\'/%3E%3Crect width=\'4\' height=\'4\' x=\'4\' y=\'4\' fill=\'%23ffffff\'/%3E%3Crect width=\'4\' height=\'4\' x=\'4\' fill=\'%23e5e5e5\'/%3E%3Crect width=\'4\' height=\'4\' y=\'4\' fill=\'%23e5e5e5\'/%3E%3C/svg%3E")';

  const getUnicodeHex = (char: string) => {
    if (!char) return 'U+----';
    return `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
  }

  const getColorName = (colorRef: string) => {
    if (colorRef === 'transparent') return 'Trans';
    if (colorRef === 'base:bg') return 'BG';
    if (colorRef === 'base:fg') return 'FG';
    if (colorRef.startsWith('ansi:')) {
      const index = parseInt(colorRef.split(':')[1]);
      const name = ANSI_COLOR_NAMES[index] || colorRef;
      if (name === 'Bright Black (Gray)') return 'Gray';
      return name.replace('Bright ', 'B.');
    }
    return colorRef;
  };

  return (
    <div className={`bg-brand-surface border-r border-brand-border flex flex-col items-center w-10 transition-all ${docked ? 'h-full border-l-0' : 'rounded-lg shadow-2xl overflow-hidden'}`}>
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden p-0.5 flex flex-col items-center gap-1.5 scrollbar-thin scrollbar-thumb-brand-border/50 scrollbar-track-transparent scrollbar-gutter-stable scrollbar-hide-fullscreen pb-2">
        {/* Tool Selection */}
        <div className="flex flex-col gap-0.5 w-full bg-brand-bg/30 rounded border border-brand-border/20 shrink-0">
          <ToolButton 
            active={activeTool === 'pencil'} 
            onClick={() => setActiveTool('pencil')}
            icon={<Pencil size={18} />} 
            label="Pencil" 
            shortcut="P"
          />
          <ToolButton 
            active={activeTool === 'box'} 
            onClick={() => setActiveTool('box')}
            icon={<Square size={18} />} 
            label="Box" 
            shortcut="B"
          />
          <ToolButton 
            active={activeTool === 'type'} 
            onClick={() => setActiveTool('type')}
            icon={<Type size={18} />} 
            label="Type" 
            shortcut="T"
          />
          <ToolButton 
            active={activeTool === 'eraser'} 
            onClick={() => setActiveTool('eraser')}
            icon={<Eraser size={18} />} 
            label="Eraser" 
            shortcut="E"
          />
        </div>

        {/* Modifier Controls */}
        <div className="flex flex-col gap-0.5 w-full bg-brand-bg/30 rounded border border-brand-border/20 shrink-0 items-center">
          <ModifierButton active={bold} onClick={() => setBold(!bold)} icon={<BoldIcon size={18} />} label="Bold" />
          <ModifierButton active={italic} onClick={() => setItalic(!italic)} icon={<ItalicIcon size={18} />} label="Italic" />
          <ModifierButton active={underline} onClick={() => setUnderline(!underline)} icon={<UnderlineIcon size={18} />} label="Underline" />
          <ModifierButton active={strikeThrough} onClick={() => setStrikeThrough(!strikeThrough)} icon={<Strikethrough size={18} />} label="Strike" />
        </div>

        {/* Character Input */}
        <div className="flex flex-col gap-1 items-center shrink-0 w-full py-1 border-y border-brand-border/10">
          <span className="text-[8px] uppercase font-black text-brand-text/40 tracking-tighter">Char</span>
          <input 
            type="text" 
            maxLength={1} 
            value={currentCharacter}
            onChange={(e) => setCurrentCharacter(e.target.value)}
            className="w-8 h-8 bg-brand-bg border border-brand-border/40 rounded text-center font-mono text-base focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-brand-text shadow-sm"
            placeholder="@"
          />
          <span className="text-[8px] font-mono font-bold text-brand-primary leading-none opacity-60">{getUnicodeHex(currentCharacter).replace('U+', '')}</span>
        </div>

        {/* Color Indicators (Compact) */}
        <div className="relative w-full flex flex-col items-center shrink-0 mb-1 mt-1 px-0.5">
          <span className="text-[6px] font-mono font-bold text-brand-text/60 mb-1 uppercase text-center block w-full truncate leading-none">{getColorName(fgColor)}</span>
          <div className="relative w-8 h-8">
            {/* BG Color */}
            <div 
              className={`absolute bottom-0 right-0 w-6 h-6 rounded-sm border border-brand-border shadow-sm overflow-hidden bg-white`}
              style={{ backgroundImage: transparentOverlay }}
              title={`Background: ${getColorName(bgColor)}`}
            >
              {bgColor !== 'transparent' && <div className="absolute inset-0" style={{ backgroundColor: resolveColor(bgColor) }} />}
            </div>
            {/* FG Color */}
            <div 
              className={`absolute top-0 left-0 w-6 h-6 rounded-sm border border-brand-primary shadow-md overflow-hidden bg-white z-10`}
              style={{ backgroundImage: transparentOverlay }}
              title={`Foreground: ${getColorName(fgColor)}`}
            >
              {fgColor !== 'transparent' && <div className="absolute inset-0" style={{ backgroundColor: resolveColor(fgColor) }} />}
            </div>
          </div>
          <span className="text-[6px] font-mono font-bold text-brand-text/60 mt-1 uppercase text-center block w-full truncate leading-none">{getColorName(bgColor)}</span>
        </div>

        {/* Palette Selector Section */}
        <div className="flex flex-col items-center gap-1 w-full shrink-0">
          {/* Palette Dropdown Move to Top */}
          <div className="relative w-full flex justify-center">
            <button 
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              className="w-full h-8 flex items-center justify-center bg-brand-bg/40 hover:bg-brand-surface border border-brand-border/20 rounded transition-all text-brand-primary hover:text-white"
            >
              <PaletteIcon size={16} />
            </button>
            
            {showPaletteMenu && (
              <div className={`absolute left-full top-0 ml-1 w-48 bg-brand-surface border border-brand-border rounded-lg shadow-2xl z-50 p-1 animate-in fade-in slide-in-from-left-2 border-l-2 border-l-brand-primary`}>
                <div className="px-2 py-1 text-[9px] font-black text-brand-text/40 uppercase tracking-widest border-b border-brand-border/20 mb-1">
                  Palettes
                </div>
                {palettes.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePalette(p.id)
                      setPaletteId(p.id)
                      setShowPaletteMenu(false)
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-all ${activePalette?.id === p.id ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-text/60 hover:bg-brand-bg/80 hover:text-brand-text'} text-xs`}
                  >
                    <span className="truncate pr-1">{p.name}</span>
                    {activePalette?.id === p.id && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-brand-border/10 shrink-0" />

          {/* Special colors (Transparent only) */}
          <div className="w-full flex justify-center p-0.5">
            <button
              onClick={(e) => handleColorClick('transparent', e)}
              className="w-6 h-6 rounded border border-brand-border hover:scale-110 transition-all shadow-sm relative overflow-hidden group bg-white"
              style={{ backgroundImage: transparentOverlay }}
              title="Transparent (Click: FG, Shift-Click: BG)"
            >
              {(fgColor === 'transparent' || bgColor === 'transparent') && (
                <div className={`absolute inset-0 border-2 ${fgColor === 'transparent' ? 'border-brand-primary' : 'border-white/40 border-dashed'} rounded-sm z-10`} />
              )}
            </button>
          </div>

          <div className="w-full h-px bg-brand-border/10 shrink-0" />

          {/* ANSI Grid (2x8) */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-brand-bg/20 rounded border border-brand-border/10">
            {activePalette && activePalette.ansi.map((_, i) => (
              <button
                key={i}
                onClick={(e) => handleColorClick(`ansi:${i}`, e)}
                className={`w-4 h-4 rounded-sm border border-brand-border/40 hover:scale-110 transition-all shadow-sm relative group`}
                style={{ backgroundColor: resolveColor(`ansi:${i}`) }}
                title={`${ANSI_COLOR_NAMES[i]}`}
              >
                {(fgColor === `ansi:${i}` || bgColor === `ansi:${i}`) && (
                  <div className={`absolute inset-0 border-2 ${fgColor === `ansi:${i}` ? 'border-white' : 'border-white/40 border-dashed'} rounded-sm z-10`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const ToolButton: React.FC<{ active?: boolean, icon: React.ReactNode, label: string, shortcut?: string, onClick: () => void }> = ({ active, icon, label, shortcut, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all relative group shrink-0
    ${active ? 'bg-brand-primary text-white shadow-md z-10' : 'text-brand-text/40 hover:bg-brand-surface hover:text-brand-text'}
  `}>
    {icon}
    <div className="absolute left-full ml-2 px-2 py-1 bg-brand-surface border border-brand-border text-brand-text text-[9px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider translate-x-1 group-hover:translate-x-0 flex gap-2 items-center">
      <span>{label}</span>
      {shortcut && <span className="bg-brand-primary text-white px-1 py-0.5 rounded font-mono text-[8px] shadow-sm">{shortcut}</span>}
    </div>
  </button>
)

const ModifierButton: React.FC<{ active?: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-9 h-9 flex items-center justify-center rounded-sm border transition-all relative group shrink-0
    ${active ? 'bg-brand-primary/20 border-brand-primary text-brand-primary shadow-inner' : 'border-transparent text-brand-text/30 hover:bg-brand-surface hover:text-brand-text'}
  `}>
    {icon}
    <div className="absolute left-full ml-2 px-2 py-1 bg-brand-surface border border-brand-border text-brand-text text-[9px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider translate-x-1 group-hover:translate-x-0">
      {label}
    </div>
  </button>
)

export default DrawingToolbar
