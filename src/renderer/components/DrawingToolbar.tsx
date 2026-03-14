import React from 'react'
import { Pencil, Square, Type, Eraser, Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough } from 'lucide-react'
import { useEditor } from '../contexts/EditorContext'

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
      <div className="flex items-center gap-4 px-1">
        <div className="flex flex-col gap-1 items-center">
          <div className="relative group">
            <input 
              type="color" 
              value={fgColor} 
              onChange={(e) => setFgColor(e.target.value)}
              className="w-6 h-6 rounded-md cursor-pointer border border-brand-border overflow-hidden bg-transparent"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100" />
          </div>
          <span className="text-[8px] uppercase font-bold text-brand-text/40 tracking-tighter">FG Color</span>
        </div>

        <div className="flex flex-col gap-1 items-center">
           <div className="relative group">
            <button 
              onClick={() => setBgColor(bgColor === 'transparent' ? '#000000' : 'transparent')}
              className={`w-6 h-6 rounded-md border border-brand-border flex items-center justify-center transition-all overflow-hidden ${bgColor === 'transparent' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdtzMENADAIw8C9/6YDsAnKz8I6SkUBCgXpMv4KAtD7vO929S4YHgIEn+9LmgAAAABJRU5ErkJggg==")]' : ''}`}
              style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
            >
              {bgColor !== 'transparent' && (
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </button>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100" />
          </div>
          <span className="text-[8px] uppercase font-bold text-brand-text/40 tracking-tighter">BG Color</span>
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

export default DrawingToolbar
