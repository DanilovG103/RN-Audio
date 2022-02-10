import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Text, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Routes } from 'src/navigation/routes'
import TrackPlayer, { State, Track } from 'react-native-track-player'

const Block = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  min-height: 60px;
  background-color: #efeeee;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`

const ActionsBlock = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

export const CurrentTrackBlock = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const [isPlaying, setIsPlaying] = useState(false)
  const { navigate } = useNavigation()
  const pause = async () => {
    await TrackPlayer.pause()
  }

  const play = async () => {
    await TrackPlayer.play()
  }

  const next = async () => {
    await TrackPlayer.skipToNext()
  }

  const back = async () => {
    await TrackPlayer.skipToPrevious()
  }

  useEffect(() => {
    const getCurrentTrack = async () => {
      const position = await TrackPlayer.getCurrentTrack()
      if (position !== null) {
        const track = await TrackPlayer.getTrack(position)
        setCurrentTrack(track)
      }
    }

    const getState = async () => {
      const state = await TrackPlayer.getState()
      if (state === State.Playing) {
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }
    getCurrentTrack()
    getState()
  }, [currentTrack])

  return (
    <Block activeOpacity={0.9} onPress={() => navigate(Routes.TRACK_PLAYER)}>
      <Text style={{ color: 'black' }}>{currentTrack?.title}</Text>
      <ActionsBlock>
        <TouchableWithoutFeedback onPress={back}>
          <Icon name="stepbackward" color="black" size={25} />
        </TouchableWithoutFeedback>
        {isPlaying ? (
          <TouchableWithoutFeedback onPress={pause}>
            <Icon name="pausecircleo" color="black" size={25} />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={play}>
            <Icon name="playcircleo" color="black" size={25} />
          </TouchableWithoutFeedback>
        )}
        <TouchableWithoutFeedback onPress={next}>
          <Icon name="stepforward" color="black" size={25} />
        </TouchableWithoutFeedback>
      </ActionsBlock>
    </Block>
  )
}
