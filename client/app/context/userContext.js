import { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const url = 'https://smart-switch-backend.onrender.com';

  // const url = 'http://192.168.40.94:3333';
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [logged, setLogged] = useState(false);

  const login = async (form) => {
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),

      });
      if (response.status === 200) {
        const json = await response.json();
        console.log(json);
        const token = json.token;
        const usr = json.user;

        // Storing the token securely
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(usr));
        setUserToken(token); setUser(JSON.stringify(usr)); setLogged(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }

  }

  const register = async (form) => {
    try {
      const response = await fetch(`${url}/api/insertUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),

      });
      if (response.status === 201) {
        const json = await response.json();
        console.log(json);
        return login(form);
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  };

  const updateSwitch = async (switches) => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);

    user.switches = switches;
    
    const updatedUserData = JSON.stringify(user);
    await AsyncStorage.setItem('user', updatedUserData);
    console.log(JSON.parse(updatedUserData).switches);
    console.log('Switches updated');
  }

  const deleteSwitch = async (serialId) => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);

    user.switches = user.switches.filter(sw => sw !== serialId);
    const updatedUserData = JSON.stringify(user);
    await AsyncStorage.setItem('user', updatedUserData);
    console.log('Switch deleted');
  }

  const isLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    if (token && user) {
      setUserToken(token); setUser(JSON.parse(user));
      setLogged(true);
    }
    else setLogged(false);
  }

  const logout = async () => {
    setUserToken(null); setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('Logged out');
  };

  return (
    <UserContext.Provider value={{ login, logout, register, updateSwitch, isLoggedIn, deleteSwitch, userToken, user, url }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };