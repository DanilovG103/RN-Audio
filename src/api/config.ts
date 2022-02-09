export const getPhoto = async (term: string) => {
  try {
    const response = await fetch(
      'https://itunes.apple.com/search?' +
        new URLSearchParams({ term }).toString(),
    )
    const result = await response.json()
    return result.resultCount > 0 ? result.results[0].artworkUrl100 : ''
  } catch (error) {
    return ''
  }
}
