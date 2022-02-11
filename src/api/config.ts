import { getRandomNumber } from 'src/utils/utils'

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

export const getRandomPhoto = async () => {
  try {
    const response = await fetch(
      'https://api.unsplash.com/collections/1253578/photos?per_page=10&client_id=jApVh-CEQvV6P-RE4KTsHrzCn5rpEOhJJCTFHoIBdXc',
    )
    const result = await response.json()
    const index = getRandomNumber()
    return result[index].urls.regular
  } catch (error) {
    console.log(error)
  }
}
