import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';

const profile = () => {
  const { logout, url } = useContext(UserContext);

  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    await logout();
    router.push('/');
  }

  const getUser = async () => {
    try {
      const usr = await AsyncStorage.getItem('user');
      setUser(JSON.parse(usr));
      if (!usr) {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUser();
    console.log(user);
  }, []);

  return (
    <SafeAreaView className="h-full bg-primary px-2 py-4">
      <View className="my-6 px-4 space-y-6">
        <View className="flex justify-between items-center flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Profile
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              User Details
            </Text>
          </View>

          <View className="mt-1.5">
            <TouchableOpacity
              onPress={logoutUser}
              activeOpacity={0.7}>
              <Image
                source={icons.logout}
                className="w-6 h-6"
                resizeMode='contain' />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <View className='w-full justify-center items-center px-4 mt-4 mb-8'>
        <View className='relative flex flex-col justify-center items-center'>
          <Image
            source={images.logo}
            className='w-[100px] h-[80px]'
            resizeMode='contain' />
        </View>
      </View> */}

      <View className="px-4 space-y-6 mt-8">
        <View className="flex flex-col space-y-2">
          <Text className="text-sm text-gray-100">Full Name</Text>
          <View
            className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center"

          >
            <Text className="text-white flex-1 items-center justify-center font-pmedium text-lg">{user ? user.fullname : "Admin"}</Text>

          </View>
        </View>

        <View className="flex flex-col space-y-2">
          <Text className="text-sm text-gray-100">Email</Text>
          <View className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center">
            <Text className="text-white flex-1 items-center justify-center font-pmedium text-lg">{user ? user.email : "email"}</Text>

          </View>
        </View>

        <View className="flex flex-col space-y-2">
          <Text className="text-sm text-gray-100">Switches Added</Text>
          <View className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center">
            <Text className="text-white flex-1 items-center justify-center font-pmedium text-lg">{user ? user.switches.length : "0"}</Text>

          </View>
        </View>
      </View>

    </SafeAreaView >
  )
}

export default profile
