import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, FlatList, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { router } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import { UserContext } from '../context/userContext';
import DeviceCard from '../../components/DeviceCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Empty from '../../components/Empty';

const Create = () => {

  const [SSID, setSsid] = useState('');
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState([]);
  const [devices, setDevices] = useState([]);
  const deviceSet = new Set();
  const { url, logout } = useContext(UserContext);


  const updateDeviceList = async () => {
    const user = await AsyncStorage.getItem('user');
    const email = JSON.parse(user).email;
    const response = await fetch(`${url}/api/userSwitches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    const switches = await response.json();
    for (let i = 0; i < switches.length; i++) {
      const device = await getSwitch(switches[i]);
      deviceSet.add(device);
    }
    setDevices([...deviceSet]);
  }

  const getSwitch = async (id) => {
    const res = await fetch(`${url}/api/${id}`)
    const device = await res.json();
    return device;
  }

  const getUser = async () => {
    try {
      const usr = await AsyncStorage.getItem('user');
      if (usr) {
        setUser(JSON.parse(usr));
      }
    } catch (error) {
      console.error(error);
    }
  }


  const getDeviceList = async () => {
    try {
      const user = await AsyncStorage.getItem('user');

      if(user) {
        
        const switches = JSON.parse(user).switches;


        for (let i = 0; i < switches.length; i++) {
          const res = await fetch(`${url}/api/${switches[i]}`)
          const device = await res.json();
          deviceSet.add(device);
        }
        setDevices([...deviceSet]);
      }


    } catch (error) {
      console.error('error:   ', error);
    }
  }

  const onPress = (device) => {
    return () => {
      router.push({pathname: '/controlPanel', params: {
        name: device.name,
        serialNo: device.serialId,
        deviceState: device.status,
        id: device._id
      }} )
    }
  }

  useEffect(() => {
    getDeviceList().then(() => {
      NetInfo.fetch().then(state => {
        setSsid(state.details.ssid);
        //console.log(JSON.stringify(state.details));
        setConnected(state.isConnected);
      });
    });
    getUser();

  }, [devices]);

  return (
    <SafeAreaView className="h-full bg-primary px-2 py-4">
      
      <View className="my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            
            <Text className="text-3xl font-psemibold text-white">
              {user.fullname}
            </Text>

            <Text className="font-pmedium text-sm text-gray-100">
              {user.email}
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

      <ScrollView className="flex-1">
        <View className="px-2">
          <TouchableOpacity
            onPress={() => { router.push('/addDevice') }}
            activeOpacity={0.7}
            className={`border-2 border-gray-100 rounded-xl flex flex-row space-x-2 min-h-[62px] justify-center items-center`}
          >
            <Image source={icons.plus} className="w-5 h-6" resizeMode='contain' />
            <Text className={`text-white-100 font-pregular text-base`}>Add Device</Text>
          </TouchableOpacity>
        </View>

        <View className="px-2 mt-4">

          {devices.length === 0 ? /* <View className="mt-24"><ActivityIndicator size={60} color="#4f4f6e" /></View> */ <Empty title="No devices" subtitle="Click on add devices"/>
            :
            devices.map((device, index) => (
              <TouchableOpacity key={index} activeOpacity={0.6} onPress={onPress(device)}>
                <DeviceCard
                  key={index}
                  name={device.name}
                  serialNo={device.serialId}
                  status={device.status}
                  id={device._id}
                />
              </TouchableOpacity>
            ))}
        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

export default Create