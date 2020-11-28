'use strict';

const electron = require('electron');
const app = electron.app;
const path = require('path');
const windowWrapper = require('./windowWrapper.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

app.disableHardwareAcceleration();

// https://stackoverflow.com/questions/35916158/how-to-prevent-multiple-instances-in-electron
// Enforce single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
}

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

const packageJson = require(path.join('../../package.json'));

app.setAboutPanelOptions({
  applicationName: app.getName(),
  version: app.getVersion(),
  authors: [packageJson.author],
  website: packageJson.homepage,
  iconPath: path.join(__dirname, '../../resources/icons/64.png')
});

app.whenReady().then(() => {
  mainWindow = windowWrapper('https://chat.google.com/');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});