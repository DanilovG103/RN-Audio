import React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const Artwork = (props: SvgProps) => (
  <Svg width={48} height={48} {...props}>
    <Path fill="#E91E63" d="M19 24a9 9 0 1 0 0 18 9 9 0 1 0 0-18Z" />
    <Path fill="#E91E63" d="M24 6v27h4V14l11 3v-7z" />
  </Svg>
)
