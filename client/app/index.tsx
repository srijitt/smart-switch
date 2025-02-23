import React, { useContext, useEffect, useState } from 'react'
import { Link, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { UserContext } from './context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {


  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token === null) {
        return false;
      } else return true;
    } catch (error) {
      console.error(error);
    }

  }

  const start = async () => {
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      router.push('/create');
    } else {
      router.push('/signin');
    }
  }


  return (
    <SafeAreaView>
      <View className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full justify-center items-center min-h-[85vh] px-4 mt-4">
            <View className='relative flex-1 justify-center items-center mt-2'>
              <Image
                source={images.logo}
                className='w-[100px] h-[50px]'
                resizeMode='contain' />

              <Text className='text-sm text-white-100 mt-4 text-center font-pbold'>Smart Switch</Text>
            </View>

            <Image
              source={images.cards}
              className='max-w-[380px] w-full h-[320px]'
              resizeMode='contain' />

            <View className='relative mt-3'>
              <Text className='text-2xl text-white-100 font-psemibold text-center'>
                Discover seamless home control with {''}
                <Text className=' text-secondary font-pbold'>Smart Switch</Text>
              </Text>
            </View>

            <Text className='text-xs font-pregular px-4 text-white-100 mt-6 text-center'>Control your devices from anywhere using the smart plug. Forgot to turn off the AC? Don't worry, we've got you!</Text>

            <CustomButton title="Get Started" handlePress={start} containerStyles="w-full mt-7" />
          </View>
        </ScrollView>

        <StatusBar backgroundColor='#161622' style='light' />
      </View>
    </SafeAreaView>
  );
}

