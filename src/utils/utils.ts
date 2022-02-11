import TrackPlayer from 'react-native-track-player'

export const pause = async () => {
  await TrackPlayer.pause()
}

export const play = async () => {
  await TrackPlayer.play()
}

export const next = async () => {
  await TrackPlayer.skipToNext()
}

export const back = async () => {
  await TrackPlayer.skipToPrevious()
}

export const getRandomNumber = () => {
  return Math.floor(Math.random() * 10)
}
