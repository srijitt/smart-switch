import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
     onPress={handlePress}
     activeOpacity={0.7}
     className={`bg-secondary-100 flex flex-row rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    >
        
        {isLoading ?
        <ActivityIndicator size={30} color="black" /> : <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>}
        
    </TouchableOpacity>
  )
}

export default CustomButton