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

export async function printReceipt(body: string) {
    try {
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.setBlob(0);
        await BluetoothEscposPrinter.printText(body, {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 2,
            heigthtimes: 2,
            fonttype: 1,
        });
        await BluetoothEscposPrinter.printText("Thank you!\n\r", {});
        await BluetoothEscposPrinter.printText("\n\r", {});
    } catch (e) {
        console.log(e);
    }
}