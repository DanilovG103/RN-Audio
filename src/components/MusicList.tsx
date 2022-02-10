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
import { CurrentTrack } from 'src/components/CurrentTrack'
import Icon from 'react-native-vector-icons/AntDesign'

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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`

const ActionsBlock = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

interface Props {
  item: Track
}

export const MusicList = () => {
  const [files, setFiles] = useState<RNFS.ReadDirItem[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [visible, setVisible] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

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

    if (files.length > 0) {
      fetchAsync()
    }
  }, [files, currentTrack])

  const getCurrentTrack = async () => {
    const position = await TrackPlayer.getCurrentTrack()
    if (position !== null) {
      const track = await TrackPlayer.getTrack(position)
      setCurrentTrack(track)
    }
  }

  const pause = async () => {
    await TrackPlayer.pause()
    setIsPlaying(false)
  }

  const play = async () => {
    await TrackPlayer.play()
    setIsPlaying(true)
  }

  const next = async () => {
    await TrackPlayer.skipToNext()
    await getCurrentTrack()
  }

  const back = async () => {
    await TrackPlayer.skipToPrevious()
    await getCurrentTrack()
  }

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

    setVisible(true)
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    setIsPlaying(true)
    await TrackPlayer.play()
    await getCurrentTrack()
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
          <Text style={{ color: 'black' }}>{currentTrack.title}</Text>
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
        </CurrentTrackBlock>
      )}
    </>
  )
}
