import React from 'react'
import { Stack } from 'expo-router'

const DevLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="addDevice"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="updateDevice"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="controlPanel"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  )
}

export default DevLayout