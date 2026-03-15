import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Sprite, Cell, Frame } from '../sprite';

interface SpriteContextType {
  sprite: Sprite;
  width: number;
  height: number;
  frames: Frame[];
  currentFrameIndex: number;
  activeCell: { row: number; col: number } | null;
  selection: { start: { row: number; col: number }; end: { row: number; col: number } } | null;
  paletteId: string;
  
  // Actions
  updateCell: (row: number, col: number, data: Cell | null) => void;
  setCurrentFrame: (index: number) => void;
  addFrame: () => void;
  deleteFrame: (index: number) => void;
  resize: (width: number, height: number) => void;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
  setPaletteId: (id: string) => void;
  
  // Editor State
  zoom: number;
  setZoom: (zoom: number) => void;
  offset: { x: number; y: number };
  setOffset: (offset: { x: number; y: number }) => void;
  
  // Playback
  play: (fps?: number) => void;
  stop: () => void;
  isPlaying: boolean;
}

const SpriteContext = createContext<SpriteContextType | undefined>(undefined);

export const SpriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sprite] = useState(new Sprite(20, 10));
  const [width, setWidth] = useState(sprite.width);
  const [height, setHeight] = useState(sprite.height);
  const [frames, setFrames] = useState<Frame[]>([...sprite.frames]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(sprite.curFrame);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [selection] = useState<{ start: { row: number; col: number }; end: { row: number; col: number } } | null>(null);
  const [paletteId, setPaletteIdState] = useState(sprite.paletteId);
  
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 50, y: 50 });

  // Update local state when sprite changes
  const refreshState = useCallback(() => {
    setWidth(sprite.width);
    setHeight(sprite.height);
    setFrames([...sprite.frames]);
    setCurrentFrameIndex(sprite.curFrame);
    setPaletteIdState(sprite.paletteId);
  }, [sprite]);

  useEffect(() => {
    sprite.onDraw = refreshState;
    return () => { sprite.onDraw = () => {}; };
  }, [sprite, refreshState]);

  const updateCell = (row: number, col: number, data: Cell | null) => {
    sprite.setCell(row, col, data);
    refreshState();
  };

  const setCurrentFrame = (index: number) => {
    sprite.curFrame = index;
    refreshState();
  };

  const addFrame = () => {
    sprite.insertFrame();
    refreshState();
  };

  const deleteFrame = (index: number) => {
    sprite.deleteFrame(index);
    refreshState();
  };

  const resize = (w: number, h: number) => {
    sprite.resize(w, h);
    refreshState();
  };

  const setPaletteId = (id: string) => {
    sprite.paletteId = id;
    setPaletteIdState(id);
  };

  const play = (fps: number = 12) => {
    sprite.play(1000 / fps);
  };

  const stop = () => {
    sprite.stop();
    refreshState();
  };

  return (
    <SpriteContext.Provider value={{
      sprite,
      width,
      height,
      frames,
      currentFrameIndex,
      activeCell,
      selection,
      updateCell,
      setCurrentFrame,
      addFrame,
      deleteFrame,
      resize,
      setActiveCell,
      paletteId,
      setPaletteId,
      zoom,
      setZoom,
      offset,
      setOffset,
      play,
      stop,
      isPlaying: !!sprite.animator
    }}>
      {children}
    </SpriteContext.Provider>
  );
};

export const useSprite = () => {
  const context = useContext(SpriteContext);
  if (context === undefined) {
    throw new Error('useSprite must be used within a SpriteProvider');
  }
  return context;
};
