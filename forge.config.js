const path = require("path");
module.exports = {
  packagerConfig: {
    appCopyright: 'Max Hu @MaxHu-arpg',
    icon: path.join("src","Ganyu.ico"),
    asar: {
      unpackDir: '{src/proxy,src/cmdScript}',
    },
    win32metadata: {
      'requested-execution-level': "requireAdministrator",
      FileDescription: 'This is a Grasscutter Client Launcher!',

    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
};
