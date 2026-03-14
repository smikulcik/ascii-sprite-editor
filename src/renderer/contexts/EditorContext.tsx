import React, { createContext, useContext, useState } from 'react';

export type Tool = 'pencil' | 'type' | 'box' | 'eraser';

interface EditorContextType {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  fgColor: string;
  setFgColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  currentCharacter: string;
  setCurrentCharacter: (char: string) => void;
  
  // Character styles
  bold: boolean;
  setBold: (v: boolean) => void;
  italic: boolean;
  setItalic: (v: boolean) => void;
  underline: boolean;
  setUnderline: (v: boolean) => void;
  strikeThrough: boolean;
  setStrikeThrough: (v: boolean) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<Tool>('type');
  const [fgColor, setFgColor] = useState('#c792ea'); // Default to Aurora Purple
  const [bgColor, setBgColor] = useState('transparent');
  const [currentCharacter, setCurrentCharacter] = useState('@');
  
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikeThrough, setStrikeThrough] = useState(false);

  return (
    <EditorContext.Provider value={{
      activeTool,
      setActiveTool,
      fgColor,
      setFgColor,
      bgColor,
      setBgColor,
      currentCharacter,
      setCurrentCharacter,
      bold,
      setBold,
      italic,
      setItalic,
      underline,
      setUnderline,
      strikeThrough,
      setStrikeThrough
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
