/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.yoink.app',
  productName: 'Yoink',
  directories: { output: 'release' },
  files: ['dist', 'dist-electron'],
  mac: { icon: 'public/icon.icns', target: 'dmg' },
  win: { icon: 'public/icon.ico', target: 'nsis' },
  linux: { target: 'AppImage' },
};
