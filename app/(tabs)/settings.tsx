import { useAppStore } from "@/context/appStore";
import {
    connectPrinter,
    scanDevices,
    StartBluetooth,
} from "@/services/printer";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsPage() {
  const setUser = useAppStore((state) => state.setUser);
  const [printerEnabled, setPrinterEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  async function ScanDevices() {
    const devices = await scanDevices();
    if (devices) {
      const { paired, found } = devices;
      const allDevices = [...paired, ...found];

      if (allDevices.length === 0) {
        Alert.alert(
          "No Devices Found",
          "Make sure your printer is powered on and in range."
        );
        return;
      }
      Alert.alert(
        "Select Printer",
        "Tap to connect:",
        allDevices.map((device) => ({
          text: `${device.name || "Unknown"} (${device.address})`,
          onPress: async () => {
            try {
              await connectPrinter(device.address);
              Alert.alert(
                "Connected",
                `Printer: ${device.name || device.address}`
              );
            } catch (err: any) {
              Alert.alert("Connection Failed", err.message || "Unknown error");
            }
          },
        })),
        { cancelable: true }
      );
    } else Alert.alert("Bluetooth", JSON.stringify(devices));
  }

  const handlePrinterConnect = async () => {
    setIsLoading(true);
    await StartBluetooth();
    await ScanDevices();
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setUser(null);
    router.replace("/auth/login")
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          printerEnabled ? styles.optionButtonActive : null,
        ]}
        onPress={handlePrinterConnect}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.optionText}>
          {printerEnabled && !isLoading ? (
            "Printer Connected"
          ) : isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            "Connect Printer"
          )}
        </Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  optionButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  optionButtonActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  optionText: {
    fontSize: 17,
    color: "#222",
    fontWeight: "600",
  },
  spacer: { flex: 1 },
  logoutButton: {
    backgroundColor: "#475ba3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
