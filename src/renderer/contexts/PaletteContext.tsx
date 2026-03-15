import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Palette {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  ansi: string[];
}

interface PaletteContextType {
  palettes: Palette[];
  activePalette: Palette | null;
  addPalette: (palette: Palette) => void;
  setActivePalette: (paletteId: string) => void;
  resolveColor: (colorRef: string) => string;
}

const NORDIC_AURORA: Palette = {
  id: 'nordic-aurora',
  name: 'Nordic Aurora',
  backgroundColor: 'transparent',
  textColor: '#A6ACCD',
  ansi: [
    '#0F111A', '#F07178', '#C3E88D', '#FFCB6B', '#82AAFF', '#C792EA', '#89DDFF', '#A6ACCD',
    '#4A4D62', '#F07178', '#C3E88D', '#FFCB6B', '#82AAFF', '#C792EA', '#89DDFF', '#FFFFFF'
  ]
};

const BLUEPRINT: Palette = {
  id: 'blueprint',
  name: 'Blueprint',
  backgroundColor: 'transparent',
  textColor: '#111827',
  ansi: [
    '#000000', '#dc2626', '#16a34a', '#ca8a04', '#2563eb', '#9333ea', '#0891b2', '#4b5563',
    '#6b7280', '#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#06b6d4', '#111827'
  ]
};

export const ANSI_COLOR_NAMES = [
  'Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White',
  'Gray', 'Bright Red', 'Bright Green', 'Bright Yellow', 'Bright Blue', 'Bright Magenta', 'Bright Cyan', 'Bright White'
];

const VGA_CONSOLE: Palette = {
  id: 'vga-console',
  name: 'VGA Console',
  backgroundColor: 'transparent',
  textColor: '#C4C4C4',
  ansi: [
    '#000000', '#C40000', '#00C400', '#C47E00', '#0000C4', '#C400C4', '#00C4C4', '#C4C4C4',
    '#4E4E4E', '#DC4E4E', '#4EDC4E', '#F3F34E', '#4E4EDC', '#F34EF3', '#4EF3F3', '#FFFFFF'
  ]
};

const XTERM: Palette = {
  id: 'xterm',
  name: 'xterm',
  backgroundColor: 'transparent',
  textColor: '#FFFFFF',
  ansi: [
    '#000000', '#CD0000', '#00CD00', '#CDCD00', '#0000EE', '#CD00CD', '#00CDCD', '#E5E5E5',
    '#7F7F7F', '#FF0000', '#00FF00', '#FFFF00', '#5C5CFF', '#FF00FF', '#00FFFF', '#FFFFFF'
  ]
};

const WINDOWS_10: Palette = {
  id: 'windows-10',
  name: 'Windows 10',
  backgroundColor: 'transparent',
  textColor: '#CCCCCC',
  ansi: [
    '#0C0C0C', '#C50F1F', '#13A10E', '#C19C00', '#0037DA', '#881798', '#3A96DD', '#CCCCCC',
    '#767676', '#E74856', '#16C60C', '#F9F1A5', '#3B78FF', '#B4009E', '#61D6D6', '#F2F2F2'
  ]
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>(() => {
    const defaultPalettes = [NORDIC_AURORA, BLUEPRINT, VGA_CONSOLE, XTERM, WINDOWS_10];
    const saved = localStorage.getItem('palettes');
    if (saved) {
      try {
        const parsed: Palette[] = JSON.parse(saved);
        const customPalettes = parsed.filter(p => !defaultPalettes.some(dp => dp.id === p.id));
        return [...defaultPalettes, ...customPalettes];
      } catch (e) {
        return defaultPalettes;
      }
    }
    return defaultPalettes;
  });

  const [activePaletteId, setActivePaletteId] = useState<string>(() => {
    return localStorage.getItem('activePaletteId') || 'nordic-aurora';
  });

  useEffect(() => {
    localStorage.setItem('palettes', JSON.stringify(palettes));
  }, [palettes]);

  useEffect(() => {
    localStorage.setItem('activePaletteId', activePaletteId);
  }, [activePaletteId]);

  useEffect(() => {
    const handleImported = (palette: Palette) => {
      setPalettes(prev => {
        if (prev.find(p => p.name === palette.name)) return prev;
        return [...prev, palette];
      });
      setActivePaletteId(palette.id);
    };

    (window as any).api?.onPaletteImported(handleImported);
    return () => {
      (window as any).api?.removePaletteListeners();
    };
  }, []);

  const activePalette = palettes.find(p => p.id === activePaletteId) || NORDIC_AURORA;

  const addPalette = (palette: Palette) => {
    setPalettes(prev => [...prev, palette]);
  };

  const setActivePalette = (paletteId: string) => {
    setActivePaletteId(paletteId);
  };

  const resolveColor = (colorRef: string): string => {
    if (!colorRef) return 'transparent';
    if (!activePalette) return colorRef;

    if (colorRef === 'base:bg') return activePalette.backgroundColor;
    if (colorRef === 'base:fg') return activePalette.textColor;
    if (colorRef.startsWith('ansi:')) {
      const index = parseInt(colorRef.split(':')[1]);
      if (index >= 0 && index < 16) {
        return activePalette.ansi[index];
      }
    }
    return colorRef;
  };

  return (
    <PaletteContext.Provider value={{ palettes, activePalette, addPalette, setActivePalette, resolveColor }}>
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error('usePalette must be used within a PaletteProvider');
  }
  return context;
};
