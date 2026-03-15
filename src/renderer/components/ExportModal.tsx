import React, { useState } from 'react'
import { Download, FileImage, Loader2 } from 'lucide-react'
import { useSprite } from '../contexts/SpriteContext'
import { usePalette } from '../contexts/PaletteContext'
// @ts-ignore
import { GIFEncoder, quantize, applyPalette } from 'gifenc'

const ExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { sprite, frames } = useSprite()
  const { resolveColor } = usePalette()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportGif = async () => {
    setIsExporting(true)
    try {
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const cellW = 20
      const cellH = 40
      const canvasWidth = sprite.width * cellW
      const canvasHeight = sprite.height * cellH

      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) throw new Error('Could not get 2d context')

      const encoder = new GIFEncoder()
      
      for (let i = 0; i < frames.length; i++) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        
        // Use default background color if no transparent
        const bg = resolveColor('base:bg')
        if (bg && bg !== 'transparent') {
          ctx.fillStyle = bg
          ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        }
        
        sprite.draw(ctx, i, 0, 0, cellW, cellH, resolveColor)
        
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
        const palette = quantize(imageData.data, 256, { format: 'rgba4444', clearAlpha: true })
        const index = applyPalette(imageData.data, palette)
        
        const transparentIndex = palette.findIndex((p: any) => p[3] === 0)
        const isTransparent = transparentIndex !== -1

        encoder.writeFrame(index, canvasWidth, canvasHeight, { 
          palette, 
          delay: 1000 / sprite.fps,
          transparent: isTransparent,
          transparentIndex: isTransparent ? transparentIndex : undefined
        })
      }

      encoder.finish()
      const buffer = encoder.bytes()
      
      const path = await (window as any).api?.saveGif(buffer)
      if (path) {
        console.log('GIF Exported successfully:', path)
      }
    } catch (e) {
      console.error('Failed to export GIF', e)
      alert('Failed to export GIF')
    } finally {
      setIsExporting(false)
      onClose()
    }
  }

  return (
    <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border p-4 rounded-2xl flex flex-col gap-6 shadow-2xl text-brand-text min-w-[320px]">
      <div className="flex flex-col gap-1 border-b border-brand-border pb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Export Sprite</h3>
        <p className="text-[10px] text-brand-text/40">Choose an export format</p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleExportGif}
          disabled={isExporting}
          className={`flex items-center gap-4 bg-brand-bg/50 p-4 rounded-xl border border-brand-border/30 transition-all group text-left ${
            isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-primary/50 hover:bg-brand-primary/5'
          }`}
        >
          <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shrink-0">
            {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-text">
              {isExporting ? 'Exporting...' : 'Export as GIF'}
            </span>
            <span className="text-[10px] text-brand-text/70 mt-0.5 leading-tight">Animated image sequence of all frames</span>
          </div>
        </button>

        <button 
          onClick={() => { alert('PNG + JSON export coming soon!'); onClose(); }}
          className="flex items-center gap-4 bg-brand-bg/50 p-4 rounded-xl border border-brand-border/30 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-brand-secondary/10 rounded-lg flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform shrink-0">
            <FileImage size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-text">Sprite Sheet</span>
            <span className="text-[10px] text-brand-text/70 mt-0.5 leading-tight">PNG + JSON coordinates for game engines</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ExportModal
