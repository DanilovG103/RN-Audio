import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import * as RNFS from 'react-native-fs'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  Track,
} from 'react-native-track-player'
import styled from 'styled-components/native'

const MusicBlock = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 15px;
  flex-direction: row;
`

const Text = styled.Text`
  font-size: 18px;
  color: white;
`

interface Props {
  item: Track
}

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    RNFS.readDir(`${RNFS.ExternalStorageDirectoryPath}/Music`)
      .then(res => res)
      .then(file => {
        setFiles(file.filter(item => item.name.endsWith('.mp3')))
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    const fetchAsync = async () => {
      let result: Track[] = []
      for (const file of files) {
        result.push({
          id: file.name,
          url: 'file://' + file.path,
          title: file.name,
        })
        setTracks(result)
      }
    }

    if (files.length > 0) {
      fetchAsync()
    }
  }, [files])

  const start = async (track: Track) => {
    await TrackPlayer.setupPlayer({ maxCacheSize: 1000 })

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Pause,
        Capability.Play,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      stopWithApp: true,
    })

    await TrackPlayer.add([
      {
        id: track.title,
        url: track.url,
        title: track.title,
      },
      ...tracks,
    ])

    TrackPlayer.setRepeatMode(RepeatMode.Queue)

    await TrackPlayer.play()
  }

  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => await TrackPlayer.pause(),
  )

  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play(),
  )

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext()
  })

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious()
  })

  const renderItem = ({ item }: Props) => {
    return (
      <MusicBlock onPress={() => start(item)}>
        <View>
          <Text>{item.title}</Text>
        </View>
      </MusicBlock>
    )
  }

  return (
    <FlatList
      keyExtractor={(_, i) => i.toString()}
      data={tracks}
      renderItem={renderItem}
    />
  )
}
