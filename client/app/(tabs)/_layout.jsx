import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex flex-col items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-white text-xs`}>
        {name}
      </Text>
    </View>
  )

}

const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#AD49E1',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#27273C',
          borderTopWidth: 0,
          borderTopColor: '#BBFB4C',
          height: 70,
          paddingTop: 8,
          paddingBottom: 4,
        },
      }}>

        <Tabs.Screen
          name='support'
          options={{
            title: 'Support',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.support}
                color={color}
                name="Support"
                focused={focused} />
            )
          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: 'Devices',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Devices"
                focused={focused} />
            )
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused} />
            )
          }}
        />


      </Tabs>
    </>
  )
}

export default TabsLayout