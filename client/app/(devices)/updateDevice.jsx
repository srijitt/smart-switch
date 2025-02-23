import { Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native'
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
import { useLocalSearchParams } from 'expo-router';

const updateDevice = () => {
    const { name, serialNo, id, connected } = useLocalSearchParams();

    const [form, setform] = useState({
        serialId: serialNo,
        name: name,
        ssid: connected,
        password: ""
    })

    // const [user, setUser] = useState(null);
    const { url, updateSwitch } = useContext(UserContext);

    const configureSwitch = async () => {
        try {
            const response = await fetch(`${url}/api/configure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),

            });
            console.log(response);
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

    /* const getPermissions = async () => {
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
    } */



    useEffect(() => {
        NetInfo.fetch().then(state => {
            console.log("Connection SSID", state.details.ssid);
            setform({ ...form, ssid: state.details.ssid });
            console.log("Is connected?", state.isConnected);
        })
    }, []);

    const deleteDevice = async () => {
        const userData = await AsyncStorage.getItem('user');
        const email = JSON.parse(userData).email;
        const response = await fetch(`${url}/api/deleteSwitchFromUser`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, serialId: serialNo })
        })
        const data = await response.json();
        console.log(data);
        if (data.message === 'Switch removed from user') {
            try {
                const res = await fetch(`${url}/api/userSwitches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                })
                const switches = await res.json();
                await updateSwitch(switches);
                router.push('/create');
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Device not deleted');
        }
    }

    const submit = async () => {

        if (!form.serialId || !form.password) {
            Alert.alert('Please fill all fields');
            return;
        }

        try {
            const res = await configureSwitch();

            if (res) {
                router.push('/create');
            }

            else {
                Alert.alert('Error updating switch');
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
                            {form.serialId}
                        </Text>
                        <Text className="text-2xl font-psemibold text-white">
                            {form.name}
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

                {/* <FormField
                    title="Serial No. (See back of product)"
                    value={form.serialId}
                    handleChangeText={(e) => setform({ ...form, serialId: e })}
                    otherStyles="mt-5"
                    disabled={true}
                /> */}

                <CustomButton
                    title="Update"
                    handlePress={submit}
                    containerStyles="mt-7 bg-accent"
                    isLoading={isSubmit}
                />
                <TouchableOpacity onPress={deleteDevice}>
                    <Text className="text-center text-alert font-pmedium mt-4">Delete</Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    )
}

export default updateDevice