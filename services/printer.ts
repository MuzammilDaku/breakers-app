import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from '@ccdilan/react-native-bluetooth-escpos-printer';



export async function StartBluetooth() {
  try {
    await BluetoothManager.enableBluetooth()
  } catch (error) {
    
  }
}


export async function scanDevices() {
  try {
    // await BluetoothManager.start();

    const devices = await BluetoothManager.scanDevices();

    const paired = devices.paired ? JSON.parse(devices.paired) : [];
    const found = devices.found ? JSON.parse(devices.found) : [];

    return { paired, found };
  } catch (e) {
    console.log("Scan Error", e);
    return { paired: [], found: [] }; // fallback
  }
}

export async function isBluetoothEnabled () {
  return await BluetoothManager.isBluetoothEnabled()
}



export async function connectPrinter(address: string) {
    try {
        await BluetoothManager.connect(address);
        console.log('Connected to', address);
    } catch (err) {
        console.log('Connection error:', err);
    }
}

export async function printBill(body: string) {
  try {
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText(body + "\n\r", {
      encoding: "GBK",
      codepage: 0,
      widthtimes: 1,
      heigthtimes: 1,
      fonttype: 1,
    });
    await BluetoothEscposPrinter.printText("\n\r", {});
  } catch (e) {
    console.log("Print Error:", e);
  }
}

export function generateBillText(payload: any): string {
  const date = payload.date ?? new Date().toLocaleString();

  return `
  ${payload.customer_name}
  -----------------------------
  Games: ${payload.game_type.join(", ")}
  Modes: ${payload.game_mode.join(", ")}
  Tables: ${payload.table_names.join(", ")}

  Total Bill: Rs. ${payload.total_bill}

  ${
    payload.total_frame ? `Total Frames: ${payload.total_frame}` : ""
  }
  ${
    payload.time_played ? `Time Played: ${payload.time_played}` : ""
  }

  Date: ${date}
  Thank you for visiting Breakers!
  `.trim();
}