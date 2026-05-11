/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.yoink.app',
  productName: 'Yoink!',
  directories: { output: 'release' },
  files: ['dist/**', 'dist-electron/**', 'assets/**'],

  asarUnpack: [
    'node_modules/ffmpeg-static/**',
    'node_modules/@ffprobe-installer/**',
    'node_modules/youtube-dl-exec/bin/**',
  ],

  win: {
    icon: 'assets/icon.png',
    target: [{ target: 'nsis', arch: ['x64'] }],
    requestedExecutionLevel: 'asInvoker',
  },

  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Yoink!',
  },

  mac: {
    icon: 'assets/icon.png',
    target: [{ target: 'dmg', arch: ['arm64', 'x64'] }],
  },

  linux: {
    icon: 'assets/icon.png',
    target: 'AppImage',
  },
};
