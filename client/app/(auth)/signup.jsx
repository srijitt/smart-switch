import { View, Text, ScrollView, Image } from 'react-native'
import React, {useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Alert } from 'react-native';
import { UserContext } from '../context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const [form, setform] = useState({
    email: '',
    password: '',
    fullname: ''
  })

  const  { register, login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    if (!form.fullname || !form.email || !form.password) {
      Alert.alert('Please fill all fields');
    }

    try {
      const result = await register(form);
      setLoading(false);

      if (!result) throw new Error('Failed to create user');
      else router.push('/create');

    } catch (error) {
      Alert.alert(error);
      console.log(error);
    } finally {
      setisSubmit(false);
    }
  }

  const [isSubmit, setisSubmit] = useState(false)

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center h-[85vh] px-6 my-6'>
        <Image
            source={images.logo}
            className='w-[70px] h-[84px]'
            resizeMode='contain' />
          <Text className='text-2xl text-white mt-2 font-pbold'>Signup</Text>
          <Text className='text-xs font-pregular mt-2 text-white'>New here? Welcome to the app. Enter your credentials and create your account. Don't forget them.</Text>


          <FormField
            title="Name"
            value={form.fullname}
            handleChangeText={(e) => setform({ ...form, fullname: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e })}
            otherStyles="mt-7"
          />


          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={loading}
          />

          <View className="justify-center pt-4 flex-row gap-2 mt-4">
            <Text className="text-white font-pregular">Have an account already?</Text>
            <Link href="/signin" className=" font-psemibold text-accent">Sign In</Link>
          </View>

        </View>




      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp