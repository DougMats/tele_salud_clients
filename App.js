import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import UserProvider from './contexts/UserProvider'
import Splash from './screens/Splash';
import Home from './screens/Home';
import Sala from './screens/Sala.js'
import Meet from './screens/Meet.js'
import Historyclinic from './screens/HistoryClinic.js';
import UploadPhotos from './screens/UploadPhotos.js';
import QuotationView from './screens/QuotationView.js'
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen headerMode={'none'} name="Home" component={Home} />
          <Stack.Screen headerMode={'none'} name="Splash" component={Splash} />
          <Stack.Screen headerMode={'none'} name="Sala" component={Sala} />
          <Stack.Screen headerMode={'none'} name="Historyclinic" component={Historyclinic} />
          <Stack.Screen headerMode={'none'} name="UploadPhotos" component={UploadPhotos} />
          <Stack.Screen headerMode={'none'} name="Meet" component={Meet} />
          <Stack.Screen headerMode={'none'} name="QuotationView" component={QuotationView} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  )
}
console.disableYellowBox = true
export default App;