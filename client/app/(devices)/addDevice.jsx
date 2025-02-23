import { Text, View, ScrollView, Image, Alert, ToastAndroid, PermissionsAndroid } from 'react-native'
import { React, useEffect, useContext } from 'react'
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { useState } from 'react';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/userContext';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const addDevice = () => {
    const [form, setform] = useState({
        serialId: "",
        name: "",
        ssid: "",
        password: ""
    })

    // const [user, setUser] = useState(null);
    const { url, updateSwitch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const configureSwitch = async () => {
        try {
            const response = await fetch(`${url}/api/configure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),

            });
            if (response.ok) {
                const json = await response.json();
                console.log(json.message);
                return true;
            }
            else return false;

        } catch (error) {
            console.error(error);
        }
    }

    // const getPermissions = async () => {
    //     const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         {
    //             title: 'Location permission is required for WiFi connections',
    //             message: 'This app needs location permission as this is required to scan for wifi networks',
    //             buttonNegative: 'DENY',
    //             buttonPositive: 'ALLOW',
    //         }
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }



    // Request ACCESS_FINE_LOCATION permission on Android
async function requestLocationPermission() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Location permission is required for WiFi connections',
            message: 'This app needs location permission as this is required to scan for wifi networks',
            buttonNegative: 'DENY',
            buttonPositive: 'ALLOW',
        }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    } else {
        return false;
    }
}
  
  useEffect(() => {
    // Configure shouldFetchWiFiSSID for iOS if necessary
    NetInfo.configure({
      shouldFetchWiFiSSID: true,
    });
  
    // Request location permission on Android before fetching network info
    async function fetchNetworkInfo() {
      await requestLocationPermission();
      
      NetInfo.fetch().then(state => {
        
        const ssid = state.details && state.details.ssid ? state.details.ssid : 'Not Available';
        
        console.log("Connection SSID", ssid);
        setform({ ...form, ssid });
        
        console.log("Is connected?", state.isConnected);
      })
      .catch(error => console.error('Error fetching network info:', error));
    
  }
  
  fetchNetworkInfo();
  }, []);

    const showToast = () => {
        ToastAndroid.show('Device added successfully!', ToastAndroid.SHORT);
      }

    const submit = async () => {
        setLoading(true);

        const user = await AsyncStorage.getItem('user');

        const email = JSON.parse(user).email;
        if (!form.serialId || !form.password) {
            Alert.alert('Please fill all fields');
            return;
        }

        try {
            const res = await configureSwitch();

            if (res) {
                const response = await fetch(`${url}/api/insertSwitchToUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, serialId: form.serialId }),

                });
                if (response.ok) {
                    const result = await response.json();
                    const switches = result.user.switches;
                    console.log("Switches: ", switches);
                    if(JSON.parse(user).switches.length !== switches.length) {
                        await updateSwitch(switches, false);
                        setLoading(false);
                    }
                    showToast();
                    router.push('/create');
                } else {
                    Alert.alert('Error inserting switch to user');
                }
            }

            else {
                Alert.alert('Error configuring switch');
            }

        } catch (error) {
            Alert.alert(error);
            console.log(error);
        } finally {
            setisSubmit(false);
        }
    }
    const [isSubmit, setisSubmit] = useState(false)

    return (
        <SafeAreaView className="h-full bg-primary px-2 py-4">
            <View className="my-6 px-4 space-y-6">
                <View className="flex justify-between items-start flex-row mb-6">
                    <View>
                        <Text className="font-pmedium text-sm text-gray-100">
                            Add a device
                        </Text>
                        <Text className="text-2xl font-psemibold text-white">
                            Enter Details
                        </Text>
                    </View>

                    <View className="mt-1.5">
                        <Image
                            source={images.logo}
                            className="w-12 h-12"
                            resizeMode='contain' />
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4">
                <FormField
                    title="Wifi SSID"
                    value={form.ssid}
                    handleChangeText={(e) => setform({ ...form, ssid: e })}
                    otherStyles="mt-5"
                />

                <FormField
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => setform({ ...form, password: e })}
                    otherStyles="mt-5"
                />

                <FormField
                    title="Name"
                    value={form.name}
                    handleChangeText={(e) => setform({ ...form, name: e })}
                    otherStyles="mt-5"
                />

                <FormField
                    title="Serial No. (See back of product)"
                    value={form.serialId}
                    handleChangeText={(e) => setform({ ...form, serialId: e })}
                    otherStyles="mt-5"
                />

                <CustomButton
                    title="Submit"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={loading}
                />
            </ScrollView>

        </SafeAreaView>
    )
}

export default addDevice