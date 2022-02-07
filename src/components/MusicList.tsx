import React, { useState, useEffect } from 'react'
import { FlatList, Image } from 'react-native'
import * as RNFS from 'react-native-fs'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  Track,
} from 'react-native-track-player'
import { getPhoto } from 'src/api/config'
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
      let result = []
      for (const file of files) {
        const artwork = await getPhoto(file.name)
        result.push({
          id: file.name,
          url: 'file://' + file.path,
          title: file.name,
          artwork,
        })
        setTracks(result)
      }
    }

    if (files.length > 0) {
      fetchAsync()
    }
  }, [files])

  console.log(tracks.length)

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
        artwork: track.artwork,
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

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext(),
  )

  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => await TrackPlayer.skipToPrevious(),
  )

  const renderItem = ({ item }: Props) => {
    return (
      <MusicBlock onPress={() => start(item)}>
        <Image width={45} height={45} source={{ uri: item.artwork }} />
        <Text>{item.title}</Text>
      </MusicBlock>
    )
  }

  return <FlatList data={tracks} renderItem={renderItem} />
}
