import { app, shell, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { parseTerminalProfile } from './utils/paletteParser'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize()
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron.ascii-sprite-editor')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // Set standard application menu for macOS parity
    const isMac = process.platform === 'darwin'
    const template: Electron.MenuItemConstructorOptions[] = [
        ...(isMac
            ? ([
                {
                    label: app.name,
                    submenu: [
                        { role: 'about' },
                        { type: 'separator' },
                        { role: 'services' },
                        { type: 'separator' },
                        { role: 'hide' },
                        { role: 'hideOthers' },
                        { role: 'unhide' },
                        { type: 'separator' },
                        { role: 'quit' }
                    ]
                }
            ] as any)
            : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'Import Terminal Profile...',
                    click: async (): Promise<void> => {
                        const result = await dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [{ name: 'Terminal Profiles', extensions: ['terminal'] }]
                        })

                        if (!result.canceled && result.filePaths.length > 0) {
                            const content = readFileSync(result.filePaths[0], 'utf8')
                            const palette = parseTerminalProfile(content)
                            if (palette) {
                                BrowserWindow.getFocusedWindow()?.webContents.send('palette:imported', palette)
                            }
                        }
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: async (): Promise<void> => {
                        BrowserWindow.getFocusedWindow()?.webContents.send('sprite:save-request')
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                        { role: 'pasteAndMatchStyle' },
                        { role: 'delete' },
                        { role: 'selectAll' },
                        { type: 'separator' },
                        {
                            label: 'Speech',
                            submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
                        }
                    ]
                    : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ]
                    : [{ role: 'close' }])
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('palette:import-request', async (event) => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Terminal Profiles', extensions: ['terminal'] }]
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const content = readFileSync(result.filePaths[0], 'utf8')
        const palette = parseTerminalProfile(content)
        if (palette) {
            event.reply('palette:imported', palette)
        }
    }
})

ipcMain.handle('sprite:open', async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(focusedWindow!, {
        title: 'Open Sprite',
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
    })

    if (!result.canceled && result.filePaths.length > 0) {
        try {
            const content = readFileSync(result.filePaths[0], 'utf8')
            return {
                path: result.filePaths[0],
                content: JSON.parse(content)
            }
        } catch (error) {
            console.error('Failed to open sprite:', error)
            return null
        }
    }
    return null
})

ipcMain.handle('sprite:save-as', async (_event, spriteData) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const result = await dialog.showSaveDialog(focusedWindow!, {
        title: 'Save Sprite As',
        defaultPath: 'animation.json',
        filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (!result.canceled && result.filePath) {
        try {
            writeFileSync(result.filePath, JSON.stringify(spriteData, null, 2), 'utf8')
            return result.filePath
        } catch (error) {
            console.error('Failed to save sprite:', error)
            return null
        }
    }
    return null
})

ipcMain.handle('sprite:save-silent', async (_event, path, spriteData) => {
    try {
        writeFileSync(path, JSON.stringify(spriteData, null, 2), 'utf8')
        return true
    } catch (error) {
        console.error('Failed to save sprite silently:', error)
        return false
    }
})

ipcMain.handle('sprite:save-gif', async (_event, buffer: ArrayBuffer) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const result = await dialog.showSaveDialog(focusedWindow!, {
        title: 'Export GIF',
        defaultPath: 'animation.gif',
        filters: [{ name: 'GIF Images', extensions: ['gif'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            writeFileSync(result.filePath, Buffer.from(buffer))
            return result.filePath
        } catch (error) {
            console.error('Failed to export GIF:', error)
            return null
        }
    }
    return null
})

ipcMain.handle('sprite:save-bash', async (_event, script: string) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const result = await dialog.showSaveDialog(focusedWindow!, {
        title: 'Export Bash',
        defaultPath: 'animation.sh',
        filters: [{ name: 'Bash Scripts', extensions: ['sh'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            writeFileSync(result.filePath, script, { encoding: 'utf8', mode: 0o755 })
            return result.filePath
        } catch (error) {
            console.error('Failed to export Bash script:', error)
            return null
        }
    }
    return null
})
