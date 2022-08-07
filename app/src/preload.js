const {
  contextBridge,
  ipcRenderer,
  shell,
} = require("electron")


window.addEventListener('DOMContentLoaded', () => {
// you can run dom scripts here
})

// contextBridge only works when contextIsolation: true,
// but breaks nodeIntegration: true from working
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
  ipcSend: (channel, data) => {
    let validChannels = ['showDialog', 'fetch-error', 'update-info']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  ipcOn: (channel, func) => {
    let validChannels = ['fetch-error', 'update-info']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (...args) => func(...args))
    }
  },
  openExternal: (link) => {
    shell.openExternal(link)
  },
})
