import React from 'react'
import DrawingToolbar from './DrawingToolbar'
import CanvasOptions from './CanvasOptions'

const SpriteCanvas: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVQYV2P8//8/AwXgYBjVgx99AgAsmBUDRYv96gAAAABJRU5ErkJggg==')] bg-repeat">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          <CanvasOptions />
          <DrawingToolbar />
        </div>
      </div>
      
      <div className="relative shadow-2xl border-4 border-brand-border rounded bg-black overflow-hidden flex items-center justify-center min-w-[400px] min-h-[300px]">
        {/* The Actual Canvas would go here */}
        <div className="w-full h-full flex flex-col items-center justify-center text-brand-text font-mono text-xl select-none uppercase tracking-tighter opacity-10">
          Drawing Area
        </div>
      </div>
    </div>
  )
}

export default SpriteCanvas
