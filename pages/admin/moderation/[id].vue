// pages/admin/moderation/[id].vue
<script setup lang="ts">
const route = useRoute()
const { data: queueItem } = await useFetch(
  `/api/moderation/queue/${route.params.id}`
)

const moderatorNotes = ref('')

async function handleModeration(approve: boolean) {
  try {
    await $fetch(`/api/moderation/process`, {
      method: 'POST',
      body: {
        queueId: route.params.id,
        approve,
        moderatorNotes: moderatorNotes.value
      }
    })

    await navigateTo('/admin/moderation')
  } catch (error) {
    console.error('Moderation error:', error)
  }
}
</script>

<template>
  <div v-if="queueItem" class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">
          Content Moderation: {{ queueItem.title }}
        </h1>

        <UBadge
          :color="queueItem.status === 'pending' ? 'yellow' : 'gray'"
        >
          {{ queueItem.status }}
        </UBadge>
      </div>

      <div class="prose max-w-none mb-8">
        <div v-html="queueItem.content" />
      </div>

      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
        <h3 class="font-semibold mb-4">Moderator Notes</h3>
        <UTextarea
          v-model="moderatorNotes"
          placeholder="Add notes about moderation decision..."
          class="mb-4"
        />

        <div class="flex gap-4">
          <UButton
            color="green"
            @click="handleModeration(true)"
          >
            Approve
          </UButton>

          <UButton
            color="red"
            variant="soft"
            @click="handleModeration(false)"
          >
            Reject
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
