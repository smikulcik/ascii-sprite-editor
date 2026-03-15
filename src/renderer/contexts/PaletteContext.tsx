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
  backgroundColor: '#0F111A',
  textColor: '#A6ACCD',
  ansi: [
    '#0F111A', '#F07178', '#C3E88D', '#FFCB6B', '#82AAFF', '#C792EA', '#89DDFF', '#A6ACCD',
    '#4A4D62', '#F07178', '#C3E88D', '#FFCB6B', '#82AAFF', '#C792EA', '#89DDFF', '#FFFFFF'
  ]
};

const BLUEPRINT: Palette = {
  id: 'blueprint',
  name: 'Blueprint',
  backgroundColor: '#fafafa',
  textColor: '#111827',
  ansi: [
    '#000000', '#dc2626', '#16a34a', '#ca8a04', '#2563eb', '#9333ea', '#0891b2', '#4b5563',
    '#6b7280', '#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#06b6d4', '#111827'
  ]
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export const PaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palettes, setPalettes] = useState<Palette[]>(() => {
    const saved = localStorage.getItem('palettes');
    if (saved) return JSON.parse(saved);
    return [NORDIC_AURORA, BLUEPRINT];
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
