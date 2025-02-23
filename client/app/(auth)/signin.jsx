import { View, Text, ScrollView, Image, ToastAndroid } from 'react-native'
import React, {useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useState, useContext } from 'react';
import { Link } from 'expo-router';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { UserContext } from '../context/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [form, setform] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);

  const submit = async () => {
    setLoading(true);
    if (!form.email || !form.password) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const response = await login(form);
      if(response) {
        await isLoggedIn();
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(error);
      console.log(error);
    } finally {
      setisSubmit(false);
    }
  }

  const [isSubmit, setisSubmit] = useState(false);
  const [logged, setLogged] = useState(false);

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token === null) {
        setLogged(false);
      } else setLogged(true);
    } catch (error) {
      console.error(error);
    }

  }

  const showToast = () => {
    ToastAndroid.show('Logged in successfully!', ToastAndroid.SHORT);
  }

  useEffect(() => {
    isLoggedIn();
    console.log(logged);
    if (logged === true) {
      showToast();
      router.push('/create');
    }
  }, [logged]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center h-[85vh] px-6 my-6'>

          <Image
            source={images.logo}
            className='w-[70px] h-[84px]'
            resizeMode='contain' />
            
          <Text className='text-2xl text-white mt-10 font-pbold'>Login</Text>
          <Text className='text-sm font-pregular mt-2 text-white'>Sign in to your smart switch account using your credentials.</Text>



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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={loading}
          />

          <View className="justify-center pt-4 flex-row gap-2 mt-4">
            <Text className="text-white font-pregular">Don't have an account?</Text>
            <Link href="/signup" className="text-accent font-psemibold">Sign Up</Link>
          </View>

        </View>




      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn