export const getPhoto = async (props: string) => {
  const term = props.replace(' ', '+')
  const response = await fetch(`https://itunes.apple.com/search?term=${term}`)
  const result = await response.json()
  return result
}
