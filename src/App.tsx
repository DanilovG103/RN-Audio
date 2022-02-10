import React from 'react'
import 'react-native-get-random-values'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { RootNavigation } from 'src/navigation/root'

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  )
}

export default App
