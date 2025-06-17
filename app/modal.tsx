import { AppContext } from '@/context/AppContext';
import { AddCheckIn } from '@/services/table';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Modal() {
  const params = useLocalSearchParams();
  const { table_name, rate, total_bill, total_frame, table_id } = params

  const context = useContext(AppContext);
  const {setResetTableId,user} = context;
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [receivedAmount, setReceivedAmount] = useState("")

  const [loader,setLoader] = useState(false)

const ensureBluetoothPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  const grantedScan = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
  const grantedConnect = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  const grantedLocation = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

  if (grantedScan && grantedConnect && grantedLocation) {
    return true; // ✅ Already granted
  }

  // 🟡 Ask only if not already granted
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);

  return (
    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
  );
};


  const handleAddCheckIn = async () => {
    setLoader(true)
    if (!customerName || !customerPhone || !receivedAmount) {
      return alert("Please fill in all fields !")
    }
    const payload = {
      table_id,
      total_frame,
      customer_name: customerName,
      customer_phone: customerPhone,  
      received_amount: receivedAmount,
      total_bill,
      status: Number(receivedAmount) == Number(total_bill) ? "paid" : "unpaid",
      created_by: user?._id
    };

    const response = await AddCheckIn(payload);

    if (!response.error) {
      setResetTableId(table_id as string);
      // Print the bill after saving to db
      // You can use expo-print for printing in React Native Expo
      import('expo-print').then(({ printAsync }) => {
      printAsync({
        html: `
        <h1>Snooker Club Bill</h1>
        <p><strong>Table Name:</strong> ${table_name}</p>
        <p><strong>Table Rate:</strong> ${rate}</p>
        <p><strong>Total Frames:</strong> ${total_frame}</p>
        <p><strong>Grand Total:</strong> ${total_bill}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Phone:</strong> ${customerPhone}</p>
        <p><strong>Received Amount:</strong> ${receivedAmount}</p>
        <p><strong>Status:</strong> ${Number(receivedAmount) == Number(total_bill) ? "Paid" : "Unpaid"}</p>
        `,
      });
      });
    }
    router.back()
    setLoader(false)
  }
  return (
    <View style={styles.container}>
      <View style={paramStyles.list}>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Table Name</Text>
          <Text style={paramStyles.value}>{table_name}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Table Rate</Text>
          <Text style={paramStyles.value}>{rate}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Total Frames</Text>
          <Text style={paramStyles.value}>{total_frame}</Text>

        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Grand Total</Text>
          <Text style={paramStyles.value}>{total_bill}</Text>
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Customer Name *</Text>
          <TextInput
            style={[paramStyles.value, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8,  paddingVertical: 10 ,width:"50%"}]}
            placeholder="Customer Name"
            value={customerName}
            onChangeText={(value) => setCustomerName(value)}
          />
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Customer Phone *</Text>
          <TextInput
            style={[paramStyles.value, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 10,width:"50%" }]}
            placeholder="Customer Phone"
            value={customerPhone}
            onChangeText={(value) => setCustomerPhone(value)}
          />
        </View>
        <View style={paramStyles.row}>
          <Text style={paramStyles.key}>Received Amount *</Text>
          <TextInput
            style={[paramStyles.value, { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 10,width:"50%" }]}
            placeholder="Received Amount"
            value={receivedAmount}
            onChangeText={(value) => setReceivedAmount(value)}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 24 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{
              backgroundColor: '#008000',
              color: '#fff',
              textAlign: 'center',
              paddingVertical: 14,
              borderRadius: 6,
              fontWeight: 'bold',
              fontSize: 16,
            }}
            disabled={loader}
            // onPress handler for save and print bill
            onPress={handleAddCheckIn}
          >
            Save & Print Bill
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              textAlign: 'center',
              paddingVertical: 14,
              borderRadius: 6,
              fontWeight: 'bold',
              fontSize: 16,
            }}
            // onPress handler for close
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
          >
            Close
          </Text>
        </View>
      </View>
    </View>
  );
}


const paramStyles = StyleSheet.create({
  list: {
    marginTop: 24,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  key: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  value: {
    color: '#555',
    fontSize: 16,
  },
});

// Usage inside Modal component
// Replace <Text>Params: {JSON.stringify(params)}</Text> with:
{/* <ParamList params={params} /> */ }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
