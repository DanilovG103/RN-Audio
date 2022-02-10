import React from 'react'
import Modal from 'react-native-modal'
import { Text } from 'react-native'
import { Track } from 'react-native-track-player'

interface Props {
  track: Track
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const CurrentTrack = ({ track, visible, setVisible }: Props) => {
  const closeModal = () => setVisible(false)
  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={closeModal}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      statusBarTranslucent
      useNativeDriver
      hideModalContentWhileAnimating>
      <Text>{track?.title}</Text>
    </Modal>
  )
}
