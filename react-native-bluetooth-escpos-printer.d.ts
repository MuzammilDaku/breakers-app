declare module 'react-native-bluetooth-escpos-printer' {
  export interface Device {
    name: string;
    address: string;
  }

  export interface ScanResult {
    found: string; // JSON string of Device[]
    paired: string; // JSON string of Device[]
  }

  export const BluetoothManager: {
    isBluetoothEnabled(): Promise<boolean>;
    enableBluetooth(): Promise<boolean>;
    disableBluetooth(): Promise<boolean>;
    scanDevices(): Promise<ScanResult>;
    connect(address: string): Promise<void>;
    unpair(address: string): Promise<void>;
    disconnect(): Promise<void>;
    getConnectedDeviceAddress(): Promise<string>;
    getConnectedDeviceName(): Promise<string>;
    checkConnected(): Promise<boolean>;
  };

  export const BluetoothEscposPrinter: {
    // Printer alignments
    ALIGN: {
      LEFT: number;
      CENTER: number;
      RIGHT: number;
    };

    // Printer constants
    FONT_FAMILY: {
      A: number;
      B: number;
      C: number;
    };

    printerAlign(align: number): Promise<void>;
    setBlob(blob: number): Promise<void>;
    setEncoding(encoding: string): Promise<void>;
    setFontFamily(fontFamily: number): Promise<void>;
    setFontSize(width: number, height: number): Promise<void>;
    setTextSize(widthtimes: number, heigthtimes: number): Promise<void>;
    setLineSpacing(lineSpacing: number): Promise<void>;
    setTextDensity(density: number): Promise<void>;
    printText(
      text: string,
      options?: {
        encoding?: string;
        codepage?: number;
        widthtimes?: number;
        heigthtimes?: number;
        fonttype?: number;
      }
    ): Promise<void>;
    printColumn(
      columnWidths: number[],
      columnAligns: number[],
      columnTexts: string[],
      options?: {
        encoding?: string;
        codepage?: number;
        fonttype?: number;
      }
    ): Promise<void>;
    printPic(base64Image: string, options?: { width: number; left: number }): Promise<void>;
    printImage(
      imageUrl: string,
      options?: {
        width?: number;
        left?: number;
      }
    ): Promise<void>;
    printBarcode(
      content: string,
      type: number,
      width: number,
      height: number,
      hri: number
    ): Promise<void>;
    printQRCode(
      content: string,
      size: number,
      correctionLevel: number
    ): Promise<void>;
    cutOnePoint(): Promise<void>;
    cutTwoPoint(): Promise<void>;
    selfTest(): Promise<void>;
  };
}
