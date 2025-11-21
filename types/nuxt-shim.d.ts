// Shims to help IDE Code Analysis when .nuxt types are not generated yet
// These provide minimal typings for Nuxt virtual modules and globals

declare module '#app' {
  export interface NuxtError {
    statusCode?: number | string
    statusMessage?: string
    message?: string
    [key: string]: unknown
  }
  export function defineNuxtPlugin(plugin: any): any
  export function useRuntimeConfig(): any
}

// Provide typings for virtual imports (when .nuxt is not generated yet)
declare module '#imports' {
  export const useRoute: any
  export const useRouter: any
  export const useColorMode: any
  export const useHead: any
  export const useSeoMeta: any
  export const useLoadingIndicator: any
  export const useNuxtApp: any
  export const defineI18nConfig: any
  export const useRequestHeaders: any
  export const useRuntimeConfig: any
  export function computed<T = any>(getter?: any): any
  export function ref<T = any>(value?: T): any
  export function watch<T = any>(source: any, cb?: any, opts?: any): any
  export function watchEffect(effect: any): any
  export function onMounted(hook: () => any): void
  export function onBeforeUnmount(hook: () => any): void
  export function nextTick(): Promise<void>
  export function useAsyncData<T = any>(key: any, handler?: any, opts?: any): Promise<any>
  export function useFetch<T = any>(url: any, opts?: any): Promise<any>
  export function useState<T = any>(key: string, init?: any): any
  export function useCookie<T = any>(name: string): { value: T | null }
  export const navigateTo: any
  export const queryCollection: any
  export function definePageMeta(meta: any): void
}

// Nuxt components stub
declare module '#components' {
  export const ClientOnly: any
  export const NuxtPage: any
}

// Declare globals used by Nuxt macros and auto-imports
declare global {
  // Nuxt macros
  function defineAppConfig(config: any): any
  function defineNuxtPlugin(plugin: any): any
  function definePageMeta(meta: any): any

  // Common auto-imports exposed as globals for analysis convenience
  // (These are actually imported from '#imports' by Nuxt at build time)
  function useRoute(...args: any[]): any
  function useRouter(...args: any[]): any
  function useColorMode(...args: any[]): any
  function useHead(...args: any[]): any
  function useSeoMeta(...args: any[]): any
  function useLoadingIndicator(...args: any[]): any
  function useNuxtApp(...args: any[]): any
  function defineI18nConfig(...args: any[]): any
  function useRequestHeaders(...args: any[]): any
  function useRuntimeConfig(...args: any[]): any
  function computed<T = any>(...args: any[]): any
  function ref<T = any>(...args: any[]): any
  function watch<T = any>(...args: any[]): any
  function watchEffect(...args: any[]): any
  function onMounted(...args: any[]): any
  function onBeforeUnmount(...args: any[]): any
  function nextTick(...args: any[]): any
  function useAsyncData<T = any>(...args: any[]): any
  function useFetch<T = any>(...args: any[]): any
  function useState<T = any>(...args: any[]): any
  function useCookie<T = any>(name: string): { value: T | null }
  function navigateTo(...args: any[]): any
  function queryCollection(...args: any[]): any

  // Project-wide globals
  // Provide a callable $fetch so generic calls like $fetch<T>() don't error in analysis
  function $fetch<T = any>(...args: any[]): Promise<T>

  interface LiveChatConfig {
    license?: number
    integration_name?: string
    product_name?: string
    asyncInit?: boolean
    [key: string]: unknown
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface LiveChatWidgetApi { [key: string]: any }

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $fetch: any
    __lc?: LiveChatConfig
    LiveChatWidget?: LiveChatWidgetApi
    // Optional network quality helper exposed at runtime by layout (typing only)
    detectNetworkQuality?: () => void
  }

  // Provide a loose global declaration so references type-check
  function detectNetworkQuality(): void

  // Additional loose globals used in server utilities (stubs for analysis only)
  function randomUUID(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function sendEmail(to: string, template: string, data?: any): Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updatePost(id: number, data: any): Promise<any>
}

export {}
