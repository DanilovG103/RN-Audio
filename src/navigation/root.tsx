import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MusicList } from 'src/screens/MusicList'
import { Routes } from 'src/navigation/routes'
import { CurrentTrack } from 'src/screens/CurrentTrack'

const { Navigator, Screen } = createStackNavigator()

export const RootNavigation = () => {
  return (
    <Navigator>
      <Screen
        name={Routes.HOME}
        component={MusicList}
        options={{ headerShown: false }}
      />
      <Screen
        name={Routes.TRACK_PLAYER}
        component={CurrentTrack}
        options={{ headerShown: false }}
      />
    </Navigator>
  )
}
