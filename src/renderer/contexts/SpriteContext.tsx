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
  filePath: string | null;
  isDirty: boolean;
  version: number;
  fps: number;
  
  // Actions
  updateCell: (row: number, col: number, data: Cell | null) => void;
  setCurrentFrame: (index: number) => void;
  addFrame: () => void;
  deleteFrame: (index: number) => void;
  resize: (width: number, height: number) => void;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
  setPaletteId: (id: string) => void;
  setFps: (fps: number) => void;
  newFile: () => void;
  openFile: (path: string, content: any) => void;
  saveFile: (silent?: boolean) => Promise<boolean>;
  
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
  const [fps, setFpsState] = useState(sprite.fps);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [version, setVersion] = useState(0);
  
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 50, y: 50 });

  // Update local state when sprite changes
  const refreshState = useCallback(() => {
    setWidth(sprite.width);
    setHeight(sprite.height);
    setFrames([...sprite.frames]);
    setCurrentFrameIndex(sprite.curFrame);
    setPaletteIdState(sprite.paletteId);
    setFpsState(sprite.fps);
    setVersion(v => v + 1);
  }, [sprite]);

  useEffect(() => {
    sprite.onDraw = refreshState;
    return () => { sprite.onDraw = () => {}; };
  }, [sprite, refreshState]);

  const updateCell = (row: number, col: number, data: Cell | null) => {
    sprite.setCell(row, col, data);
    setIsDirty(true);
    refreshState();
  };

  const setCurrentFrame = (index: number) => {
    sprite.curFrame = index;
    refreshState();
  };

  const addFrame = () => {
    sprite.insertFrame();
    setIsDirty(true);
    refreshState();
  };

  const deleteFrame = (index: number) => {
    sprite.deleteFrame(index);
    setIsDirty(true);
    refreshState();
  };

  const resize = (w: number, h: number) => {
    sprite.resize(w, h);
    setIsDirty(true);
    refreshState();
  };

  const setPaletteId = (id: string) => {
    sprite.paletteId = id;
    setIsDirty(true);
    setPaletteIdState(id);
  };

  const setFps = (newFps: number) => {
    sprite.fps = newFps;
    setIsDirty(true);
    setFpsState(newFps);
  };

  const newFile = () => {
    sprite.load({ width: 20, height: 10, frames: null, paletteId: 'nordic-aurora' });
    setFilePath(null);
    setIsDirty(false);
    refreshState();
  };

  const openFile = (path: string, content: any) => {
    sprite.load(content);
    setFilePath(path);
    setIsDirty(false);
    refreshState();
  };

  const saveFile = async (silent: boolean = false): Promise<boolean> => {
    const data = sprite.serialize();
    let result: { success: boolean, path: string | null };
    
    if (silent && filePath) {
      const success = await (window as any).api.saveSilent(filePath, data);
      result = { success, path: filePath };
    } else {
      const path = await (window as any).api.saveAs(data);
      result = { success: !!path, path };
    }

    if (result.success && result.path) {
      setFilePath(result.path);
      setIsDirty(false);
      return true;
    }
    return false;
  };

  const play = () => {
    sprite.play(1000 / sprite.fps);
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
      fps,
      setFps,
      filePath,
      isDirty,
      version,
      newFile,
      openFile,
      saveFile,
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
