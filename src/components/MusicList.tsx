import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import * as RNFS from 'react-native-fs'
import TrackPlayer, { Capability, Event } from 'react-native-track-player'
import { getPhoto } from 'src/api/config'
import styled from 'styled-components/native'

const MusicBlock = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 15px;
`

const Text = styled.Text`
  font-size: 18px;
  color: white;
`

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])

  useEffect(() => {
    RNFS.readDir(`${RNFS.ExternalStorageDirectoryPath}/Music`)
      .then(res => res)
      .then(file => {
        setFiles(file.filter(item => item.name.endsWith('.mp3')))
      })
      .catch(err => console.log(err))
  }, [])

  const start = async (file: RNFS.ReadDirItem) => {
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Pause,
        Capability.Play,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      stopWithApp: true,
    })

    await TrackPlayer.setupPlayer()

    await TrackPlayer.add({
      id: 'trackId',
      url: 'file://' + file.path,
      title: file.name,
      artwork: await getPhoto(file.name),
    })

    await TrackPlayer.play()
  }

  return (
    <FlatList
      data={files}
      renderItem={({ item }) => (
        <MusicBlock onPress={() => start(item)}>
          {/* <Image
            source={{
              uri: uri,
            }}
          /> */}
          <Text>{item.name.replace('.mp3', '')}</Text>
        </MusicBlock>
      )}
    />
  )
}
