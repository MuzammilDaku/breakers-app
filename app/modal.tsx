import { useAppStore } from '@/context/appStore';
import { useOfflineStore } from '@/context/offlineStore';
import { baseUrl } from '@/services/base';
import { AddCheckIn } from '@/services/table';
import { getRandomId } from '@/services/utilities/getRandomId';
import { isInternetConnected } from '@/services/utilities/isInternetConnected';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
export default function Modal() {
  const params = useLocalSearchParams();
  const { table_name, rate, total_bill, total_frame, table_id } = params

  const {setResetTableId,user,addHistory} = useAppStore();
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [receivedAmount, setReceivedAmount] = useState("")

  const [loader,setLoader] = useState(false);
  const {addToQueue} = useOfflineStore()

  const handleAddCheckIn = async () => {
    if (!customerName || !customerPhone || !receivedAmount) {
      return alert("Please fill in all fields !")
    }
    setLoader(true)

    const payload = {
      table_id:table_id as string,
      total_frame:Number(total_frame),
      customer_name: customerName,
      customer_phone: customerPhone,  
      received_amount: Number(receivedAmount),
      total_bill:Number(total_bill),
      status: Number(receivedAmount) == Number(total_bill) ? "paid" : "unpaid",
      created_by: user?._id,
      _id:getRandomId(),
      date:new Date().toISOString()
    };

    const isConnected = await isInternetConnected();

    if(isConnected) {
      const response = await AddCheckIn(payload);
      if (!response.error) {
        router.back()
      }
    }
    else {
       addToQueue({
        method:"POST",
        url:baseUrl+'/check-in',
        body:payload,
        id:getRandomId()
       })
        router.back()

    }
    addHistory(payload)
    setResetTableId(table_id as string);
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
            {loader ? <ActivityIndicator color={'#fefe'}/> : 'Save & Print Bill'}
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
