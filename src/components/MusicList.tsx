import { Artwork } from 'assets/icons/Artwork'
import React, { useState, useEffect } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as RNFS from 'react-native-fs'
import TrackPlayer, {
  Capability,
  RepeatMode,
  Track,
} from 'react-native-track-player'
import { getPhoto } from 'src/api/config'
import styled from 'styled-components/native'
import { CurrentTrack } from './CurrentTrack'

const MusicBlock = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 15px;
  flex-direction: row;
`

const Image = styled(FastImage)`
  width: 48px;
  height: 48px;
  border-radius: 5px;
`

const Text = styled.Text`
  font-size: 18px;
  color: white;
`

const CurrentTrackBlock = styled.View`
  position: absolute;
  bottom: 0;
  min-height: 60px;
  background-color: #efeeee;
  width: 100%;
`

interface Props {
  item: Track
}

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [visible, setVisible] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track>()

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
        const artwork = await getPhoto(file.name.replace('.mp3', ''))
        result.push({
          id: file.name,
          url: 'file://' + file.path,
          title: file.name.replace('.mp3', ''),
          artwork,
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

    setCurrentTrack(track)
    setVisible(true)
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    await TrackPlayer.play()
  }

  const renderItem = ({ item }: Props) => {
    return (
      <MusicBlock onPress={() => start(item)}>
        {item.artwork?.toString().length !== 0 ? (
          <Image
            resizeMode="contain"
            source={{ uri: item.artwork?.toString() }}
          />
        ) : (
          <Artwork />
        )}
        <Text>{item.title}</Text>
      </MusicBlock>
    )
  }

  return (
    <>
      <FlatList
        keyExtractor={(_, i) => i.toString()}
        data={tracks}
        renderItem={renderItem}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={300}
        removeClippedSubviews
      />
      <CurrentTrack
        track={currentTrack}
        visible={visible}
        setVisible={setVisible}
      />
      {currentTrack && (
        <CurrentTrackBlock>
          <Text style={{ color: 'black' }}>{currentTrack?.title}</Text>
          <TouchableWithoutFeedback onPress={() => TrackPlayer.pause()}>
            <Text>pause</Text>
          </TouchableWithoutFeedback>
        </CurrentTrackBlock>
      )}
    </>
  )
}
