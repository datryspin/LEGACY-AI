const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("legacyDesktop", {
openDashboard: () => ipcRenderer.send("legacy:open-dashboard"),
minimizeCompanion: () => ipcRenderer.send("legacy:minimize-companion"),
closeCompanion: () => ipcRenderer.send("legacy:close-companion"),
  synthesizeVoice: (text, profileId) => ipcRenderer.invoke("legacy:synthesize", text, profileId),
});
