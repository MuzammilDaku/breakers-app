import { AppContext } from "@/context/AppContext";
import { LoginUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const context = useContext(AppContext);
  const { setUser ,user} = context;
  const [credentials, setCredentials] = useState<{ phone: string, password: string }>({
    phone: "03121212121",
    password: "Test12@"
  });

  const handleSubmit = async () => {
    try {
      if (!credentials.phone || !credentials.password) {
        alert("Please fill in all fields");
        return;
      }
      // Here you would typically call your login API
      // For example:
      const response = await LoginUser(credentials);
      console.log(response);

      if (!response.error) {
        setUser(response)
        return router.push("/(tabs)");
      }
      return alert(response.error || "Login failed. Please try again.");
    } catch (error) {
      console.log("Login error:", error);
    }

  };


  const handleChange = (field: 'phone' | 'password') => (value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(()=>{
    
    if(user){
      router.push("/(tabs)")
    }
  },[router])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <AntDesign name="phone" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="number-pad"
          onChangeText={handleChange('phone')}
          // onBlur={handleBlur('email')}
          value={credentials.phone}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={handleChange('password')}
          // onBlur={handleBlur('password')}
          value={credentials.password}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      // disabled={!isValid}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signUp: {
    color: '#000',
  },
  signUpLink: {
    color: '#1E90FF',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});