import { PermissionsAndroid, Platform } from "react-native";

export async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') return;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ];

  const results = await PermissionsAndroid.requestMultiple(permissions);

  const allGranted = permissions.every(
    (perm) => results[perm] === PermissionsAndroid.RESULTS.GRANTED
  );

  if (!allGranted) {
    console.warn('Not all permissions granted:', results);
  } else {
    console.log('All Bluetooth permissions granted');
  }
}
