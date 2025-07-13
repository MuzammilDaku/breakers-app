import { PaidBill } from '@/context/appStore';
import {
    BluetoothEscposPrinter,
    BluetoothManager,
} from '@ccdilan/react-native-bluetooth-escpos-printer';


export async function scanDevices() {
    //   await requestBluetoothPermission();
    try {
        const devices = await BluetoothManager.scanDevices();
        const paired = JSON.parse(devices.paired);   // already paired devices
        const found = JSON.parse(devices.found);     // found nearby devices
        console.log('Paired:', paired);
        console.log('Found:', found);
        return { paired, found };
    } catch (e) {
        console.log(e);
    }
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

export function generateBillText(payload: PaidBill): string {
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