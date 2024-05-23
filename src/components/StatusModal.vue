<script setup>
import { defineProps, onMounted, ref, computed } from 'vue'
const props = defineProps({
  status: {
    type: Object,
    default: () => ({
      id: undefined,
      name: '',
      description: null,
      color: '#ffffff'
    }),
  },
})

onMounted(() => {
  getTimezone()
})
const showTime = ref({
  timezone: '',
})
const formatterCreateOn = computed(() => {
  if (!props.status || !props.status.createdOn) return ''
  const createdOn = new Date(props.status.createdOn).toLocaleString('en-GB')
  return createdOn
})
const formatterUpdatedOn = computed(() => {
  if (!props.status || !props.status.updatedOn) return ''
  const updatedOn = new Date(props.status.updatedOn).toLocaleString('en-GB')
  return updatedOn
})
const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

console.log(props.status)

defineEmits(['saveStatus', 'closeModal'])
</script>

<template>
  <div>
    <div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div
          class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700 itbkk-modal-status"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ props.status.id ? 'Edit status' : 'Add status' }}
            </h2>
          </div>
          <form class="p-4 md:p-5">
            <div class="grid gap-4 mb-4">
              <div class="col-span-2 ">
                <label
                  for="taskTitle"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Name</label
                >
                <div class="flex gap-2 ">
                  <input
                    id="taskTitle"
                    v-model.trim="props.status.name"
                    type="text"
                    maxlength="100"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-status-name"
                  />
                  <input
                    type="color"
                    v-model="props.status.color"
                    class="h-10"
                  />
                </div>
              </div>
              <div class="col-span-2 itbkk-status-description">
                <label
                  for="Description"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Description</label
                >

                <textarea
                  id="taskDescription"
                  v-model.trim="props.status.description"
                  type="text"
                  maxlength="500"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-description"
                >
                </textarea>
              </div>
            </div>
          </form>
          <div
            class="grid grid-rows-3 grid-flow-col gap-4 justify-between mx-2"
            v-if="props.status.id"
          >
            <div class="text-xs row-start-1 row-end-4 text-gray-400">
              <span class="font-semibold"> TimeZone:</span>
              {{ showTime.timezone }}
            </div>
            <div class="text-xs row-start-1 row-end-4 text-gray-400">
              <span class="font-semibold"> Created On:</span>
              {{ formatterCreateOn }}
            </div>
            <div class="text-xs row-start-1 row-end-4 text-gray-400">
              <span class="font-semibold"> Updated On:</span>
              {{ formatterUpdatedOn }}
            </div>
          </div>
          <div class="flex justify-end">
            <button
              @click="$emit('saveStatus', props.status)"
              class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50 itbkk-button-confirm"
              :disabled="!props.status.name"
            >
              Save
            </button>
            <button
              @click="$emit('closeModal')"
              class="px-4 py-2 bg-red-500 text-white rounded-md itbkk-button-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
