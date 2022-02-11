import React, { useEffect, useState } from 'react'
import Slider from '@react-native-community/slider'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, {
  Event,
  RepeatMode,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import Icon from 'react-native-vector-icons/AntDesign'
import { getPhoto } from 'src/api/config'
import { Colors } from 'src/theme/colors'
import styled from 'styled-components/native'
import { back, next, pause, play } from 'src/utils/utils'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: ${Colors.gray};
  padding: 15px;
  align-items: center;
  justify-content: center;
`

const Image = styled(FastImage)`
  width: 240px;
  height: 240px;
`

const Progress = styled(Slider)`
  width: 100%;
  margin: 30px 0;
`

const Artist = styled.Text`
  font-size: 19px;
`

const Title = styled.Text`
  font-size: 23px;
  font-weight: 700;
`

const Actions = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-around;
  margin: 30px 0;
`

export const CurrentTrack = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>()
  const playbackState = usePlaybackState()
  const isPlaying = playbackState === State.Playing
  const { position, duration } = useProgress()
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Queue)
  const isQueue = repeatMode === RepeatMode.Queue
  const isRepeatOff = repeatMode === RepeatMode.Off
  const repeatIconColor = isQueue ? Colors.primary : Colors.lightGray
  const [shuffled, setShuffled] = useState(false)
  const shuffleIconColor = shuffled ? Colors.primary : Colors.lightGray

  const toggleRepeatMode = () => {
    if (isQueue) {
      setRepeatMode(RepeatMode.Track)
    } else if (isRepeatOff) {
      setRepeatMode(RepeatMode.Queue)
    } else {
      setRepeatMode(RepeatMode.Off)
    }
  }

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack)
      const artwork = await getPhoto(`${track.artist} ${track.title}`)
      setCurrentTrack({ ...track, artwork })
    }
  })

  useEffect(() => {
    const getTrack = async () => {
      const index = await TrackPlayer.getCurrentTrack()
      const track = await TrackPlayer.getTrack(index)
      const artwork = await getPhoto(`${track.artist} ${track.title}`)
      setCurrentTrack({ ...track, artwork })
    }
    getTrack()
  }, [])

  const shuffle = (array: Track[]) => {
    const newArr = [...array]
    newArr.sort(() => Math.random() - 0.5)
    return newArr
  }

  const toggleShuffleMode = async () => {
    const queue = await TrackPlayer.getQueue()
    if (!shuffled) {
      const shuffledQueue = shuffle(queue)
      await TrackPlayer.removeUpcomingTracks()
      await TrackPlayer.add(shuffledQueue)
      setShuffled(true)
    } else {
      setShuffled(false)
      await TrackPlayer.reset()
      await TrackPlayer.add(queue)
    }
  }

  useEffect(() => {
    TrackPlayer.setRepeatMode(repeatMode)
  }, [repeatMode])

  return (
    <Wrapper>
      <Image resizeMode="contain" source={{ uri: currentTrack?.artwork }} />
      <Progress
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor={Colors.primary}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor="#FFFFFF"
        onSlidingComplete={async value => {
          await TrackPlayer.seekTo(value)
        }}
      />
      <Title>{currentTrack?.title}</Title>
      <Artist>{currentTrack?.artist}</Artist>
      <Actions>
        <TouchableOpacity onPress={toggleShuffleMode}>
          <IconM color={shuffleIconColor} name="shuffle-variant" size={35} />
        </TouchableOpacity>
        <TouchableOpacity onPress={back}>
          <Icon name="stepbackward" size={35} />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity onPress={pause}>
            <Icon name="pausecircleo" size={35} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={play}>
            <Icon name="playcircleo" size={35} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={next}>
          <Icon name="stepforward" size={35} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeatMode}>
          {isQueue || isRepeatOff ? (
            <IconM name="repeat" size={30} color={repeatIconColor} />
          ) : (
            <IconM name="repeat-once" color="#FFD479" size={30} />
          )}
        </TouchableOpacity>
      </Actions>
    </Wrapper>
  )
}
