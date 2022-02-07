export const getPhoto = async (props: string) => {
  const term = props.substring(0, props.length - 4).replace(' ', '+')
  const response = await fetch(`https://itunes.apple.com/search?term=${term}`)
  const result = await response.json()
  return result.results[0].artworkUrl100
}
