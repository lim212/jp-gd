<template>
  <div class="mobile-input-container" :class="inputClasses">
    <!-- Input Group -->
    <div class="mobile-input-group">
      <!-- Input Field -->
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        class="mobile-input-field"
        :class="fieldClasses"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @change="handleChange"
      />

      <!-- Floating Label -->
      <label
        v-if="label"
        :for="inputId"
        class="mobile-input-label"
        :class="labelClasses"
      >
        {{ label }}
        <span v-if="required" class="mobile-input-required">*</span>
      </label>

      <!-- Input Icon (Left) -->
      <div v-if="iconLeft" class="mobile-input-icon mobile-input-icon-left">
        <UIcon :name="iconLeft" class="mobile-input-icon-svg" />
      </div>

      <!-- Input Icon (Right) -->
      <div v-if="iconRight || showPasswordToggle" class="mobile-input-icon mobile-input-icon-right">
        <button
          v-if="showPasswordToggle"
          type="button"
          class="mobile-input-password-toggle"
          @click="togglePasswordVisibility"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="mobile-input-icon-svg" />
        </button>
        <UIcon v-else-if="iconRight" :name="iconRight" class="mobile-input-icon-svg" />
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && inputValue && !disabled"
        type="button"
        class="mobile-input-clear"
        @click="clearInput"
        aria-label="Clear input"
      >
        <UIcon name="i-lucide-x" class="mobile-input-clear-icon" />
      </button>
    </div>

    <!-- Helper Text -->
    <div v-if="helperText || errorMessage" class="mobile-input-helper">
      <span v-if="errorMessage" class="mobile-input-error">
        <UIcon name="i-lucide-alert-circle" class="mobile-input-error-icon" />
        {{ errorMessage }}
      </span>
      <span v-else-if="helperText" class="mobile-input-helper-text">
        {{ helperText }}
      </span>
    </div>

    <!-- Character Count -->
    <div v-if="showCharacterCount && maxlength" class="mobile-input-count">
      <span class="mobile-input-count-text">
        {{ characterCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  // Basic props
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  
  // Input attributes
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: undefined
  },
  minlength: {
    type: Number,
    default: undefined
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  },
  pattern: {
    type: String,
    default: ''
  },
  
  // Icons
  iconLeft: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  },
  
  // Features
  clearable: {
    type: Boolean,
    default: false
  },
  showPasswordToggle: {
    type: Boolean,
    default: false
  },
  showCharacterCount: {
    type: Boolean,
    default: false
  },
  
  // Variants
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'filled', 'outlined'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  }
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  input: [event: Event]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
  change: [event: Event]
  clear: []
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const inputValue = ref(props.modelValue)
const isFocused = ref(false)
const showPassword = ref(false)

// Computed
const inputId = computed(() => `mobile-input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => [
  `mobile-input-${props.variant}`,
  `mobile-input-${props.size}`,
  {
    'mobile-input-focused': isFocused.value,
    'mobile-input-disabled': props.disabled,
    'mobile-input-readonly': props.readonly,
    'mobile-input-error': !!props.errorMessage,
    'mobile-input-has-value': !!inputValue.value,
    'mobile-input-has-icon-left': !!props.iconLeft,
    'mobile-input-has-icon-right': !!props.iconRight || props.showPasswordToggle
  }
])

const fieldClasses = computed(() => [
  {
    'mobile-input-field-focused': isFocused.value,
    'mobile-input-field-error': !!props.errorMessage,
    'mobile-input-field-disabled': props.disabled,
    'mobile-input-field-readonly': props.readonly
  }
])

const labelClasses = computed(() => [
  {
    'mobile-input-label-focused': isFocused.value,
    'mobile-input-label-error': !!props.errorMessage,
    'mobile-input-label-disabled': props.disabled,
    'mobile-input-label-floating': isFocused.value || !!inputValue.value
  }
])

const characterCount = computed(() => {
  return String(inputValue.value || '').length
})

// Methods
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const clearInput = () => {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  if (inputRef.value) {
    inputRef.value.type = showPassword.value ? 'text' : 'password'
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

// Watch for type changes
watch(() => props.type, (newType) => {
  if (newType === 'password' && !showPassword.value) {
    if (inputRef.value) {
      inputRef.value.type = 'password'
    }
  }
})
</script>

<style scoped>
/* Mobile Input Base Styles */
.mobile-input-container {
  position: relative;
  width: 100%;
  margin-bottom: var(--mobile-lg);
}

.mobile-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.mobile-input-field {
  width: 100%;
  padding: var(--mobile-lg);
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  font-size: var(--mobile-text-base);
  line-height: 1.5;
  transition: var(--mobile-transition);
  outline: none;
  box-sizing: border-box;
}

.mobile-input-field::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.mobile-input-field:focus {
  border-color: var(--mobile-primary);
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.mobile-input-field:disabled {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.mobile-input-field:read-only {
  background: rgba(0, 0, 0, 0.02);
  cursor: default;
}

/* Floating Label */
.mobile-input-label {
  position: absolute;
  left: var(--mobile-lg);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: var(--mobile-text-base);
  font-weight: 500;
  pointer-events: none;
  transition: var(--mobile-transition);
  background: var(--surface);
  padding: 0 var(--mobile-xs);
  z-index: 1;
}

.mobile-input-label-floating {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: var(--mobile-primary);
  font-weight: 600;
}

.mobile-input-required {
  color: var(--mobile-error);
  margin-left: 2px;
}

/* Input Icons */
.mobile-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  pointer-events: none;
  z-index: 2;
}

.mobile-input-icon-left {
  left: var(--mobile-md);
}

.mobile-input-icon-right {
  right: var(--mobile-md);
}

.mobile-input-icon-svg {
  width: 20px;
  height: 20px;
}

.mobile-input-password-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--mobile-xs);
  border-radius: 4px;
  transition: var(--mobile-transition);
  pointer-events: all;
}

.mobile-input-password-toggle:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
}

/* Clear Button */
.mobile-input-clear {
  position: absolute;
  right: var(--mobile-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--mobile-xs);
  border-radius: 4px;
  transition: var(--mobile-transition);
  z-index: 2;
}

.mobile-input-clear:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
}

.mobile-input-clear-icon {
  width: 16px;
  height: 16px;
}

/* Helper Text */
.mobile-input-helper {
  margin-top: var(--mobile-sm);
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
}

.mobile-input-helper-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

.mobile-input-error {
  font-size: var(--mobile-text-sm);
  color: var(--mobile-error);
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  line-height: 1.4;
}

.mobile-input-error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Character Count */
.mobile-input-count {
  margin-top: var(--mobile-xs);
  text-align: right;
}

.mobile-input-count-text {
  font-size: var(--mobile-text-xs);
  color: var(--text-secondary);
}

/* Input Variants */
.mobile-input-filled .mobile-input-field {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-bottom: 2px solid var(--border);
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.mobile-input-filled .mobile-input-label {
  left: 0;
  background: transparent;
}

.mobile-input-outlined .mobile-input-field {
  background: transparent;
  border: 2px solid var(--border);
}

/* Input Sizes */
.mobile-input-small .mobile-input-field {
  padding: var(--mobile-sm) var(--mobile-md);
  font-size: var(--mobile-text-sm);
}

.mobile-input-small .mobile-input-label {
  left: var(--mobile-md);
  font-size: var(--mobile-text-sm);
}

.mobile-input-large .mobile-input-field {
  padding: var(--mobile-xl) var(--mobile-lg);
  font-size: var(--mobile-text-lg);
}

.mobile-input-large .mobile-input-label {
  left: var(--mobile-lg);
  font-size: var(--mobile-text-lg);
}

/* Error State */
.mobile-input-error .mobile-input-field {
  border-color: var(--mobile-error);
}

.mobile-input-error .mobile-input-field:focus {
  border-color: var(--mobile-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.mobile-input-error .mobile-input-label {
  color: var(--mobile-error);
}

.mobile-input-error .mobile-input-label-floating {
  color: var(--mobile-error);
}

/* Disabled State */
.mobile-input-disabled .mobile-input-label {
  color: var(--text-secondary);
  opacity: 0.6;
}

.mobile-input-disabled .mobile-input-icon {
  opacity: 0.6;
}

/* Focus State */
.mobile-input-focused .mobile-input-label {
  color: var(--mobile-primary);
}

/* Dark Mode Adjustments */
.dark .mobile-input-field {
  background: var(--surface);
  border-color: var(--border);
}

.dark .mobile-input-field:disabled {
  background: rgba(255, 255, 255, 0.05);
}

.dark .mobile-input-field:read-only {
  background: rgba(255, 255, 255, 0.02);
}

.dark .mobile-input-label {
  background: var(--surface);
}

.dark .mobile-input-filled .mobile-input-field {
  background: rgba(255, 255, 255, 0.05);
}

.dark .mobile-input-filled .mobile-input-label {
  background: transparent;
}

.dark .mobile-input-password-toggle:hover,
.dark .mobile-input-clear:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .mobile-input-field {
    font-size: var(--mobile-text-lg);
  }
  
  .mobile-input-label {
    font-size: var(--mobile-text-lg);
  }
}

/* Performance Optimizations */
.mobile-input-field,
.mobile-input-label {
  will-change: transform, color, background;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-input-field,
  .mobile-input-label,
  .mobile-input-icon {
    transition: none;
  }
}

/* Focus Styles for Accessibility */
.mobile-input-field:focus-visible {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

.mobile-input-password-toggle:focus-visible,
.mobile-input-clear:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-input-field {
    border-width: 3px;
  }
  
  .mobile-input-field:focus {
    border-width: 3px;
  }
}
</style>

