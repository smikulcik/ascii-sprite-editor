import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { SpriteProvider } from './contexts/SpriteContext'
import { EditorProvider } from './contexts/EditorContext'
import { PaletteProvider } from './contexts/PaletteContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <PaletteProvider>
        <SpriteProvider>
          <EditorProvider>
            <App />
          </EditorProvider>
        </SpriteProvider>
      </PaletteProvider>
    </ThemeProvider>
  </React.StrictMode>
)
