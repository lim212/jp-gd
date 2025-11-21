// Minimal Vue runtime DOM augmentation to relax event handler types
// This reduces noisy TS errors from template handlers expecting exact event types

import 'vue'

declare module 'vue' {
  // Allow any function types for common DOM events to avoid strict mismatches
  interface HTMLAttributes {
    onKeydown?: any
    onClick?: any
    onTouchstart?: any
    onMouseenter?: any
    onMouseleave?: any
  }

  // Nuxt UI often uses Booleanish for booleans-as-strings
  type Booleanish = boolean | 'true' | 'false' | '' | 'on' | 'off' | string
}
