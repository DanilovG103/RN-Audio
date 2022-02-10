import React, { useState } from 'react'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Dimensions, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Routes } from 'src/navigation/routes'
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import { Colors } from 'src/theme/colors'

const Block = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  min-height: 60px;
  background-color: ${Colors.lightGray};
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`

const ActionsBlock = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: ${Dimensions.get('window').width / 3}px;
`

const TrackInfo = styled.View`
  width: ${Dimensions.get('window').width / 2 + 5}px;
`

const TrackTitle = styled.Text`
  font-size: 16px;
  color: ${Colors.black};
`

const TrackArtist = styled(TrackTitle)`
  font-size: 14px;
`

export const CurrentTrackBlock = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const playbackState = usePlaybackState()
  const { navigate } = useNavigation()
  const isPlaying = playbackState === State.Playing
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

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack)
      setCurrentTrack(track)
    }
  })

  return (
    <Block activeOpacity={0.9} onPress={() => navigate(Routes.TRACK_PLAYER)}>
      <TrackInfo>
        <TrackTitle numberOfLines={1}>{currentTrack?.title}</TrackTitle>
        <TrackArtist numberOfLines={1}>{currentTrack?.artist}</TrackArtist>
      </TrackInfo>
      <ActionsBlock>
        <TouchableWithoutFeedback onPress={back}>
          <Icon name="stepbackward" color="black" size={28} />
        </TouchableWithoutFeedback>
        {isPlaying ? (
          <TouchableWithoutFeedback onPress={pause}>
            <Icon name="pausecircleo" color="black" size={28} />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={play}>
            <Icon name="playcircleo" color="black" size={28} />
          </TouchableWithoutFeedback>
        )}
        <TouchableWithoutFeedback onPress={next}>
          <Icon name="stepforward" color="black" size={28} />
        </TouchableWithoutFeedback>
      </ActionsBlock>
    </Block>
  )
}
