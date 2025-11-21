
// Profile Icon Composable for Vue
import { computed } from 'vue'
import { profileIconSelector } from '~/utils/profile-icon-selector'

export const useProfileIcon = (authorName) => {
  const profileIcon = computed(() => {
    if (!authorName) return profileIconSelector.getIconById(1)
    return profileIconSelector.getConsistentIcon(authorName)
  })

  const iconUrl = computed(() => profileIcon.value.url)
  const iconName = computed(() => profileIcon.value.name)
  const iconId = computed(() => profileIcon.value.id)

  return {
    profileIcon,
    iconUrl,
    iconName,
    iconId
  }
}
