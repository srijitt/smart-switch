import { View, Text, Image, Alert, TouchableOpacity, ToastAndroid, TextInput } from 'react-native'
import { Link } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, icons } from '../../constants';
import { useLocalSearchParams } from 'expo-router';
import { UserContext } from '../context/userContext';
import DetailCard from '../../components/DetailCard';
import { useTimer } from '../context/timerContext';

const ControlPanel = () => {
  const { name, serialNo, deviceState, id } = useLocalSearchParams();
  const [isOn, setIsOn] = useState(deviceState === 'on' ? true : false);
  const [connected, setConnected] = useState('');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const data = { topic: serialNo };
  const { url } = useContext(UserContext);
  
  const { timers, dispatch } = useTimer();

  const currentTimer = timers.find(timer => timer.id === id);

  // Add these state variables at the top with other states
  const [showTimerInput, setShowTimerInput] = useState(false);

  const toggleSwitch = async () => {
    try {
      const response = await fetch(`${url}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setIsOn(json.isOn);
    } catch (error) {
      console.error(error);
    }
  }

  const startTimer = () => {
    const totalSeconds = (parseInt(minutes) * 60) + parseInt(seconds);
    
    if (totalSeconds > 0) {
      dispatch({
        type: 'ADD_TIMER',
        payload: {
          deviceId: id,
          duration: totalSeconds,
          remaining: totalSeconds,
          serialNo,
          url
        }
      });
      setIsTimerActive(true);
      setTimeLeft(totalSeconds);
      setShowTimerInput(false);
    }
  };

  const showToast = () => {
    ToastAndroid.show(`Device is ${isOn ? 'on' : 'off'}`, ToastAndroid.SHORT);
  }

  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${url}/api/getSwitchTopic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),

        });
        const json = await response.json();
        setIsOn(json.status === 'on' ? true : false);
        setConnected(json.ssid);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStatus();
    showToast();
    console.log(`\n\nisOn: ${isOn}`);
  }, [isOn]);


  const handleTimerEnd = async () => {
    try {
      const response = await fetch(`${url}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log(json);
      setIsOn(json.isOn);
      ToastAndroid.show(`Timer completed! Device is ${json.isOn ? 'on' : 'off'}`, ToastAndroid.LONG);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelTimer = () => {
    dispatch({ type: 'REMOVE_TIMER', payload: { deviceId: id } });
    setShowTimerInput(false);
    setIsTimerActive(false);
    setTimeLeft(0);

    ToastAndroid.show('Timer cancelled', ToastAndroid.SHORT);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Modify the timer section in the return statement
  return (
    <SafeAreaView className="h-full bg-primary px-2 py-4">
      <View className="mt-4 px-4 space-y-6">
        <View className="flex justify-between items-center flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Device Name
            </Text>
            <Text className="text-2xl font-psemibold text-white-100">
              {name}
            </Text>
          </View>

            <Link 
              href={{pathname: '/updateDevice', params: {name, serialNo, id, connected}}}
            >
          <View className="mt-1.5">
              <Image
                source={icons.edit}
                className="w-6 h-6"
                resizeMode='contain' />
          </View>
            </Link>
        </View>
      </View>

      <View className="flex-1 justify-center items-center">
        {/* ... existing device control code ... */}
        <View className="my-6 px-4 w-full">
          <DetailCard title="Serial No" value={serialNo} />
          <DetailCard title="Connected to" value={connected} />
        </View>

        <View className="flex-1 items-center mt-4">
          <TouchableOpacity onPress={toggleSwitch}
            activeOpacity={0.7}
            className={`bg-primary-100 shadow-md border-2 ${isOn ? 'border-accent shadow-accent' : 'border-alert shadow-alert'} rounded-full h-[30vh] w-[60vw] justify-center items-center`}
            disabled={isTimerActive}
            >
            <Image
              source={isOn ? icons.poweron : icons.poweroff}
              className="w-[40vw] h-[40vh]"
              resizeMode='contain' />
            {/* <Text className='text-white font-psemibold text-lg mt-4'>{isOn ? 'Turn Off' : 'Turn On'}</Text> */}
          </TouchableOpacity>
        </View>

        {/* Timer Section */}
        <View className="my-6 px-4 w-full space-y-4">
          {currentTimer ? (
            <View className="bg-primary-200 p-4 rounded-lg items-center">
              <Text className="text-white-100 font-pmedium mb-2">
                Active Timer
              </Text>
              <Text className="text-accent text-2xl font-psemibold mb-4">
                {formatTime(currentTimer.remaining)}
              </Text>
              <TouchableOpacity
                onPress={cancelTimer}
                className="bg-alert px-6 py-2 rounded-full"
              >
                <Text className="text-white-100 font-psemibold">Cancel Timer</Text>
              </TouchableOpacity>
            </View>
          ) : showTimerInput ? (
            <View className="bg-primary-100 p-4 rounded-lg">
              <View>
              <Text className="text-white-100 text-lg font-psemibold text-center mb-0">
                Set Timer
              </Text>
              <Text className="text-white-100 text-xs font-plight text-center mb-4">
                Switch will turn {isOn ? 'off' : 'on'} after the timer ends.
              </Text>
              </View>
              <View className="flex-row justify-center space-x-4 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-100 font-pmedium mb-1">Minutes</Text>
                  <TextInput
                    className="border-2 border-white text-white px-4 py-2 rounded-md"
                    keyboardType="numeric"
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder=""
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-100 font-pmedium mb-1">Seconds</Text>
                  <TextInput
                    className="border-2 border-white text-white px-4 py-2 rounded-md"
                    keyboardType="numeric"
                    value={seconds}
                    onChangeText={setSeconds}
                    placeholder=""
                  />
                </View>
              </View>
              <View className="flex-row justify-between space-x-4">
                <TouchableOpacity
                  onPress={() => setShowTimerInput(false)}
                  className="bg-gray-500 px-4 py-2 rounded-lg flex-1"
                >
                  <Text className="text-white font-psemibold text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={startTimer}
                  className="bg-secondary px-4 py-2 rounded-lg flex-1"
                >
                  <Text className="text-white-100 font-psemibold text-center">Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowTimerInput(true)}
              className="bg-primary-100 py-4 rounded-md"
            >
              <Text className="text-white-100 text-lg font-psemibold text-center">
                Set Timer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ControlPanel;