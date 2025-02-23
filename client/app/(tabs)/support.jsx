import { View, Text, Image, RefreshControl, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, icons } from '../../constants';
import { useLocalSearchParams } from 'expo-router';
import { UserContext } from '../context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const support = () => {

    const initialSetup = [{
        title: 'Click on "Add a Device"',
        description: 'To initally configure a smart plug, click on the "Add a Device" button on the home screen. You will be redirected to a new screen where you can enter your plug details'
    },
    {
        title: 'Enter your ssid details',
        description: 'Enter your ssid details in the form provided. Make sure you enter the correct details to avoid any issues. Along with this, you will have to enter the serial Id (printed on the plug itself) and a name for the plug (eg. Living Room Light)\nTIP: KEEP YOUR MOBILE LOCATION ON.'
    },
    {
        title: 'Hit Submit',
        description: 'After entering all the details, hit the submit button. If the details are correct, you will be redirected to the home screen where you can see your plug listed. If not, you will be prompted to enter the details again.'
    }];

    const updateDevice = [{
        title: 'Enter into the device panel',
        description: 'Click on the device you want to update. You will be redirected to the device control panel where you can see the details of the device.'
    },
    {
        title: 'Click on the edit button',
        description: 'Click on the edit button on the top right corner to update the details of the device. You can update the name, ssid details, and the password of the device. For security reasons, you will have to re-enter the password of the wifi to which the device is connected.'
    },
    {
        title: 'Hit Update',
        description: 'After updating the details, hit the update button. If the details are correct, you will be redirected to the home screen where you can see your plug listed. If not, you will be prompted to enter the details again.'
    }];


    return (
        <SafeAreaView className="h-full bg-primary px-2 py-4">
            <ScrollView>
                <View className="my-6 px-4 space-y-6">
                    <View className="flex flex-col justify-between items-center mb-6">
                        <Text className="font-pmedium text-sm text-gray-100">
                            User Manual
                        </Text>
                        <Text className="text-2xl font-psemibold text-white">
                            Having trouble?
                        </Text>
                    </View>
                </View>

                <View className="flex flex-col px-4 text-gray-100">
                    <View className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center">
                        <Text className="text-white flex-1 items-center justify-center font-pmedium text-lg">Initial Setup</Text>

                    </View>

                    {initialSetup.map((item, index) => (
                        <View className='mt-4'>
                            <Text className='text-white font-psemibold text-base'>{++index}. <Text className='text-secondary-100'>{item.title}: </Text><Text className='font-plight text-sm text-white'>{item.description}</Text></Text>
                        </View>
                    ))}




                </View>

                <View className="mt-8 flex flex-col px-4 text-gray-100">
                    <View className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center">
                        <Text className="text-white flex-1 items-center justify-center font-pmedium text-lg">Updating device details</Text>

                    </View>

                    {updateDevice.map((item, index) => (
                        <View className='mt-4'>
                            <Text className='text-white font-psemibold text-base'>{++index}. <Text className='text-secondary-100'>{item.title}: </Text><Text className='font-plight text-sm text-white'>{item.description}</Text></Text>
                        </View>
                    ))}

                </View>

                <View className="px-4">
                    <Text className='text-lg text-gray-100 mt-10 font-pbold'>Still having trouble?</Text>
                    <Text className='text-base font-pregular mt-2 text-white'>Contact support: <Text className='text-accent'>+91 998837 76655</Text></Text>

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default support