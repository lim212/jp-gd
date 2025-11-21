// components/blog/FeedbackWidget.vue
<script setup lang="ts">
const props = defineProps<{
  postId: number
}>()

const { $analytics } = useNuxtApp()
const feedback = ref({
  rating: 0,
  comment: '',
  helpful: null as boolean | null
})

const submitted = ref(false)

async function submitFeedback() {
  try {
    await $fetch('/api/blog/feedback', {
      method: 'POST',
      body: {
        postId: props.postId,
        ...feedback.value
      }
    })

    submitted.value = true

    await $analytics.trackEvent('Feedback Submitted', {
      postId: props.postId,
      rating: feedback.value.rating,
      helpful: feedback.value.helpful
    })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
  }
}
</script>

<template>
  <div class="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <template v-if="!submitted">
      <h3 class="text-xl font-semibold mb-4">
        Was this article helpful?
      </h3>

      <div class="flex gap-4 mb-6">
        <UButton
          v-for="option in ['Yes', 'No']"
          :key="option"
          :color="feedback.helpful === (option === 'Yes') ? 'primary' : 'gray'"
          variant="soft"
          @click="feedback.helpful = option === 'Yes'"
        >
          {{ option }}
        </UButton>
      </div>

      <div v-if="feedback.helpful !== null">
        <label class="block mb-2">Rating</label>
        <URating
          v-model="feedback.rating"
          :length="5"
        />

        <label class="block mt-4 mb-2">Additional Comments</label>
        <UTextarea
          v-model="feedback.comment"
          placeholder="Share your thoughts..."
          class="mb-4"
        />

        <UButton
          color="primary"
          :disabled="!feedback.rating"
          @click="submitFeedback"
        >
          Submit Feedback
        </UButton>
      </div>
    </template>

    <div v-else class="text-center">
      <UIcon
        name="i-heroicons-check-circle"
        class="text-green-500 w-12 h-12 mb-2"
      />
      <p class="text-lg">Thank you for your feedback!</p>
    </div>
  </div>
</template>

