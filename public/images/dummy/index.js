// Dummy Images Index
export const DUMMY_IMAGES = [
  '/images/dummy/dummy-1.jpg',
  '/images/dummy/dummy-2.jpg',
  '/images/dummy/dummy-3.jpg',
  '/images/dummy/dummy-4.jpg',
  '/images/dummy/dummy-5.jpg',
  '/images/dummy/dummy-6.jpg',
  '/images/dummy/dummy-7.jpg',
  '/images/dummy/dummy-8.jpg',
  '/images/dummy/dummy-9.jpg',
  '/images/dummy/dummy-10.jpg',
  '/images/dummy/dummy-11.jpg',
  '/images/dummy/dummy-12.jpg',
  '/images/dummy/dummy-13.jpg',
  '/images/dummy/dummy-14.jpg',
  '/images/dummy/dummy-15.jpg',
  '/images/dummy/dummy-16.jpg',
  '/images/dummy/dummy-17.jpg',
  '/images/dummy/dummy-18.jpg',
  '/images/dummy/dummy-19.jpg',
  '/images/dummy/dummy-20.jpg'
]

export function getRandomDummyImage() {
  const randomIndex = Math.floor(Math.random() * DUMMY_IMAGES.length)
  return DUMMY_IMAGES[randomIndex]
}

export function getDummyImageByIndex(index) {
  return DUMMY_IMAGES[index % DUMMY_IMAGES.length]
}
