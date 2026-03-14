import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, ChevronDown, Monitor, FileText, Settings, Layout, Layers, PlaySquare, Eye } from 'lucide-react'

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { name: 'File', icon: <FileText size={14} /> },
    { name: 'Edit', icon: <Settings size={14} />, disabled: true },
    { name: 'View', icon: <Eye size={14} /> },
  ]

  return (
    <header className="h-12 bg-brand-surface border-b border-brand-border flex items-center px-4 shrink-0 z-50 shadow-lg relative">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold text-lg shadow-brand-primary/20 shadow-lg text-white">
          A
        </div>
        <h1 className="font-bold tracking-tight text-brand-text">ASCII Sprite</h1>
      </div>
      
      <nav className="flex items-center gap-1" ref={menuRef}>
        {menuItems.map((item) => (
          <div key={item.name} className="relative">
            <button 
              onClick={() => !item.disabled && setActiveMenu(activeMenu === item.name ? null : item.name)}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-sm font-medium transition-all ${
                item.disabled 
                  ? 'text-brand-text/30 cursor-not-allowed' 
                  : activeMenu === item.name 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'hover:bg-brand-bg text-brand-text'
              }`}
            >
              {item.name}
              {!item.disabled && <ChevronDown size={12} className={`transition-transform ${activeMenu === item.name ? 'rotate-180' : ''}`} />}
            </button>

            {activeMenu === 'View' && item.name === 'View' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-brand-surface border border-brand-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-2 border-b border-brand-border bg-brand-bg/30">
                  <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest px-2">Appearance</span>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => { toggleTheme(); setActiveMenu(null); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm group"
                  >
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                      <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-brand-primary' : 'bg-brand-border'}`}>
                      <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm text-brand-text/50 cursor-not-allowed">
                    <Monitor size={16} />
                    <span>Follow System</span>
                  </button>
                </div>
                
                <div className="p-2 border-t border-brand-border bg-brand-bg/30">
                  <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest px-2">Layout</span>
                </div>
                <div className="p-1 pb-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm">
                    <Layout size={16} />
                    <span>Reset Layout</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm">
                    <Layers size={16} />
                    <span>Toggle Overlays</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeMenu === 'File' && item.name === 'File' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-brand-surface border border-brand-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm text-left">
                  <span>New Sprite</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm text-left">
                  <span>Open...</span>
                </button>
                <div className="my-1 border-t border-brand-border" />
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm text-left">
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="ml-auto flex items-center gap-2">
        <button className="px-4 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white rounded text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2">
          <PlaySquare size={16} />
          Export
        </button>
      </div>
    </header>
  )
}

export default TopBar
