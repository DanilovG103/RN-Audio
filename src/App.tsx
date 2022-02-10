import React from 'react'

import { MusicList } from 'src/components/MusicList'
import styled from 'styled-components/native'

const Wrapper = styled.SafeAreaView`
  flex: 1;
`

const App = () => {
  return (
    <Wrapper>
      <MusicList />
    </Wrapper>
  )
}

export default App
