import { Artwork } from 'assets/icons/Artwork'
import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as RNFS from 'react-native-fs'
import TrackPlayer, {
  Capability,
  RepeatMode,
  Track,
} from 'react-native-track-player'
import { getPhoto } from 'src/api/config'
import styled from 'styled-components/native'
import { CurrentTrackBlock } from 'src/components/CurrentTrackBlock'

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: #3f3f3f;
`

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

interface Props {
  item: Track
}

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [hasTrack, setHasTrack] = useState(false)

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

    isHasTrack()
    if (files.length > 0) {
      fetchAsync()
    }
  }, [files])

  const isHasTrack = async () => {
    const position = await TrackPlayer.getCurrentTrack()
    if (position !== null) {
      setHasTrack(true)
    }
  }

  const start = async (track: Track) => {
    await TrackPlayer.setupPlayer({ maxCacheSize: 1000 })
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    })

    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    await TrackPlayer.add([
      {
        id: track.title,
        url: track.url,
        title: track.title,
        artwork: track.artwork,
      },
      ...tracks,
    ])

    await isHasTrack()

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
    <Wrapper>
      <FlatList
        keyExtractor={(_, i) => i.toString()}
        data={tracks}
        renderItem={renderItem}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={300}
        removeClippedSubviews
      />
      {hasTrack && <CurrentTrackBlock />}
    </Wrapper>
  )
}
