import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import UserContext from '../contexts/UserContext'
import RequestPermission from '../permission.js';
import Splash from './Splash'
import Login from './Login'
import Dashboard from './Dashboard'

function HomeScreen(props) {
  const [isSplashing, setIsSplashing] = useState(true)
  const { setUserDetails } = useContext(UserContext)
  const userDetails = useContext(UserContext)

  const _retrieveData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@Passport'));
      if (value) {
        setUserDetails(value)
        setTimeout(() => {
          setIsSplashing(false)
        }, 1000)
        return value
      } else {
        setTimeout(() => {
          setIsSplashing(false)
        }, 3000)
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RequestPermission().then(_ => {
        console.log('requested!');
      });
    }
    _retrieveData()
  }, [])

  console.log("___________________Email: ", userDetails.userDetails.email, "___________________");

  if (isSplashing === true) {
    setTimeout(() => {
      setIsSplashing(false)
    }, 3000)
    return <Splash />
  }
  if (isSplashing === false) {
    if (userDetails.userDetails.email !== null) {
      return <Dashboard {...props} />
    }
    


    else {
      if (userDetails.userDetails.email === null || userDetails.userDetails.email === undefined) {
        return <Login {...props} />
      }
    }
  }
}
export default HomeScreen