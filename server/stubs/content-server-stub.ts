// server/stubs/content-server-stub.ts
// Stub for @nuxt/content server API to avoid build/prerender errors when nuxt-simple-sitemap
// attempts to import "#content/server". This stub returns no content entries.

export type ContentQueryChain = {
  where: (...args: any[]) => ContentQueryChain
  only: (...args: any[]) => ContentQueryChain
  sort: (...args: any[]) => ContentQueryChain
  limit: (...args: any[]) => ContentQueryChain
  find: () => Promise<any[]>
}

export function serverQueryContent(..._args: any[]): ContentQueryChain {
  const chain: ContentQueryChain = {
    where: () => chain,
    only: () => chain,
    sort: () => chain,
    limit: () => chain,
    find: async () => []
  }
  return chain
}

export default {}
