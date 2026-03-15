import { contextBridge, ipcRenderer } from 'electron'
import { exposeElectronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    onPaletteImported: (callback: (palette: any) => void) => 
        ipcRenderer.on('palette:imported', (_event, value) => callback(value)),
    removePaletteListeners: () => 
        ipcRenderer.removeAllListeners('palette:imported'),
    importTerminalProfile: () => ipcRenderer.send('palette:import-request'),
    openDialog: () => ipcRenderer.invoke('sprite:open'),
    saveAs: (spriteData: any) => ipcRenderer.invoke('sprite:save-as', spriteData),
    saveSilent: (path: string, spriteData: any) => ipcRenderer.invoke('sprite:save-silent', path, spriteData),
    onSaveRequest: (callback: () => void) => 
        ipcRenderer.on('sprite:save-request', () => callback()),
    removeSaveRequestListeners: () => 
        ipcRenderer.removeAllListeners('sprite:save-request')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        exposeElectronAPI()
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in d.ts)
    (window as any).api = api
}
