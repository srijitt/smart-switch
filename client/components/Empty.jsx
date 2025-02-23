import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const Empty = ({ title, subtitle }) => {
    return (
        <View className="flex justify-center items-center px-4 mt-32">
            <Image
                source={images.empty}
                className="w-[100px] h-[100px]"
                resizeMode='contain'
            />

            <Text className="text-xl font-psemibold text-accent">
                {title}
            </Text>
            <Text className="font-pmedium text-sm text-gray-100">
                {subtitle}
            </Text>
        </View>
    )
}

export default Empty