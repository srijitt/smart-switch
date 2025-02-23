import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, {useContext, useEffect} from 'react'
import { icons } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../app/context/userContext'


const DeviceCard = (props) => {

    const { url, deleteSwitch } = useContext(UserContext);

    

    return (
        <View className={`my-4 px-4 space-y-6 bg-primary-100 rounded-xl border-[0px] ${props.status === 'on' ? ` border-accent` : `border-alert`} py-2`}>
            <View className="flex justify-between items-center flex-row py-2">
                <View className="flex-1 justify-center">
                    <Text className="font-pregular text-md text-secondary-100">
                        {props.serialNo}
                    </Text>

                    <Text className="text-xl font-pmedium text-white-100">
                        {props.name}
                    </Text>
                </View>

                <View className="mt-1.5 flex flex-col items-end">
                        <Image
                            source={icons.rightArrow}
                            className="w-8 h-3"
                            resizeMode='contain' />
                    <Text className="font-pregular text-md text-gray-100">
                        Status:
                        <Image
                            source={props.status === 'on' ? icons.on : icons.off}
                            className="w-8 h-8"
                            resizeMode="contain"
                        />
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default DeviceCard