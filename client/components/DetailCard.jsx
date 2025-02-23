import { View, Text } from 'react-native'
import React from 'react'

const DetailCard = ({ title, value }) => {
    return (
        <View
            className="justify-center w-full h-16 px-4 mb-4 bg-primary-100 rounded-2xl flex flex-row items-center"

        >
            <Text className={`text-white opacity-80 flex-1 items-center justify-center font-pregular text-lg`}>{title}: <Text className="text-white-100 flex-1 items-center justify-center font-pmedium text-lg">{value}</Text></Text>
        </View>
    )
}

export default DetailCard