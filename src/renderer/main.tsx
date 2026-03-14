import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { SpriteProvider } from './contexts/SpriteContext'
import { EditorProvider } from './contexts/EditorContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SpriteProvider>
        <EditorProvider>
          <App />
        </EditorProvider>
      </SpriteProvider>
    </ThemeProvider>
  </React.StrictMode>
)
