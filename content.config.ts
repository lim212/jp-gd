import { defineCollection } from '@nuxt/content'

export const collections = {
  content: defineCollection({
    source: 'index.yml',
    type: 'data'
  })
}
