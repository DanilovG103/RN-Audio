import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import * as RNFS from 'react-native-fs'
import TrackPlayer from 'react-native-track-player'

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])

  useEffect(() => {
    RNFS.readDir(`${RNFS.ExternalStorageDirectoryPath}/Music`)
      .then(res => res)
      .then(file => setFiles(file.filter(item => item.name.endsWith('.mp3'))))
      .catch(err => console.log(err))
  }, [])

  console.log(files[0])

  const start = async (file: RNFS.ReadDirItem) => {
    // Set up the player
    await TrackPlayer.setupPlayer()

    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: 'file://' + file.path,
      title: 'Track Title',
      artist: 'Track Artist',
      // artwork: require('track.png'),
    })

    // Start playing it
    await TrackPlayer.play()
  }

  return (
    <FlatList
      data={files}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => start(item)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  )
}
