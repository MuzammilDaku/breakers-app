// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          codegenConfig: null,
        },
      },
    },
    'react-native-webview': {
      platforms: {
        android: {
          codegenConfig: null,
        },
      },
    },
    'react-native-edge-to-edge': {
      platforms: {
        android: {
          codegenConfig: null,
        },
      },
    },
    '@caohiep/react-native-bluetooth-escpos-printer': {
      platforms: {
        android: {
          packageInstance: 'new RNBluetoothEscposPrinterPackage()',
          packageImportPath: 'import cn.jystudio.bluetooth.RNBluetoothEscposPrinterPackage;',
        },
      },
    },
  },
  
  
};
