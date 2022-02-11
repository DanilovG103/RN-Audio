import { Artwork } from 'assets/icons/Artwork'
import React, { useState, useEffect } from 'react'
import { Dimensions, Platform } from 'react-native'
import * as RNFS from 'react-native-fs'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import styled from 'styled-components/native'
import { CurrentTrackBlock } from 'src/components/CurrentTrackBlock'
import { Colors } from 'src/theme/colors'
import { nanoid } from 'nanoid'
import BigList from 'react-native-big-list'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: ${Colors.gray};
`

const MusicBlock = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
`

const Text = styled.Text`
  font-size: 14px;
  line-height: 22px;
  color: ${Colors.beige};
`

const TextBlock = styled.View`
  width: ${Dimensions.get('window').width - 80}px;
  margin-left: 15px;
`

const TrackTitle = styled(Text)`
  font-size: 18px;
`

interface Props {
  item: Track
}

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [hasTrack, setHasTrack] = useState(false)
  const [isAccessDenied, setIsAccessDenied] = useState(true)
  const platform = Platform.OS

  if (platform === 'ios') {
    check(PERMISSIONS.IOS.MEDIA_LIBRARY).then(result => {
      if (result === RESULTS.GRANTED) {
        setIsAccessDenied(false)
      } else if (result === RESULTS.UNAVAILABLE) {
        request(PERMISSIONS.IOS.MEDIA_LIBRARY).then(() => {
          setIsAccessDenied(false)
        })
      }
    })
  } else {
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
      if (result === RESULTS.GRANTED) {
        setIsAccessDenied(false)
      } else if (result === RESULTS.DENIED) {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(() => {
          setIsAccessDenied(false)
        })
      }
    })
  }

  useEffect(() => {
    RNFS.readDir(`${RNFS.ExternalStorageDirectoryPath}/Music`)
      .then(res => res)
      .then(file => {
        setFiles(file.filter(item => item.name.endsWith('.mp3')))
      })
      .catch(err => console.log(err))
    return () => {
      TrackPlayer.destroy()
    }
  }, [])

  useTrackPlayerEvents([Event.PlaybackState], async event => {
    if (event.type === Event.PlaybackState) {
      setHasTrack(true)
    }
  })

  useEffect(() => {
    const fetchAsync = async () => {
      let result: Track[] = []
      for (const file of files) {
        const name = file.name.replace('.mp3', '')
        const title = name.replace(' - ', '\n').replace(/.*\n/gm, '')
        const artist = name.replace(' - ', '\n').replace(/\n.*/gm, '')
        result.push({
          id: nanoid(),
          url: 'file://' + file.path,
          title,
          artist,
        })
      }
      setTracks(result)
    }

    if (files.length > 0) {
      fetchAsync()
    }
  }, [files])

  const start = async (track: Track) => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    })

    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    await TrackPlayer.add(tracks)
    const trackIndex = tracks.findIndex(item => item.id === track.id)
    await TrackPlayer.skip(trackIndex)

    await TrackPlayer.play()
  }

  const renderItem = ({ item }: Props) => {
    return (
      <MusicBlock key={item.id} onPress={() => start(item)}>
        <Artwork />
        <TextBlock>
          <TrackTitle numberOfLines={1}>{item.title}</TrackTitle>
          <Text numberOfLines={1}>{item.artist}</Text>
        </TextBlock>
      </MusicBlock>
    )
  }

  return (
    <Wrapper>
      {isAccessDenied && (
        <Text>Please give permisions to read external storage</Text>
      )}
      <BigList data={tracks} renderItem={renderItem} itemHeight={60} />
      {hasTrack && <CurrentTrackBlock />}
    </Wrapper>
  )
}
