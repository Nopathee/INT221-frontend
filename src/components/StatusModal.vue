<script setup>
import { defineProps, onMounted, ref , computed } from 'vue'
const props = defineProps({
   task: Object,
})
onMounted(() => {
  getTimezone()
})
const showTime = ref({
  timezone: '',
})
const formatterCreateOn = computed(() => {
  if (!props.task || !props.task.createdOn) return ''
  const createdOn = new Date(props.task.createdOn).toLocaleString('en-GB')
  return createdOn
})

const formatterUpdatedOn = computed(() => {
  if (!props.task || !props.task.updatedOn) return ''
  const updatedOn = new Date(props.task.updatedOn).toLocaleString('en-GB')
  return updatedOn
})
const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

defineEmits(['saveTask', 'cancelTask'])
</script>
<template >
<div>
  <div>
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 w-3/5 shadow-2xl dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
           Edit Status
          </h2>
        </div>
        <form class="p-4 md:p-5">
          <div class="grid gap-4 mb-4">
            <div class="col-span-2">
              <label
                for="taskTitle"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Name</label
              >

              <input
                id="taskTitle"
                type="text"
             
                maxlength="100"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-title"
              />
            </div>
            <div class="col-span-2">
              <label
                for="Description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Description</label
              >

              <textarea
                id="taskDescription"
                type="text"
          
                maxlength="500"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-description"
              >
              </textarea>
            </div>
          
            
          </div>
          
        </form>
        <div class="grid grid-rows-3 grid-flow-col gap-4  justify-between mx-2">
              <div class="row-start-1 row-end-4">TimeZone: {{showTime.timezone}}</div>
              <div class="row-start-1 row-end-4">Created On: {{ formatterCreateOn }} </div>
              <div class="row-start-1 row-end-4">Updated On: {{ formatterUpdatedOn }}</div>
            </div>
        <div class="flex justify-end">
          <button
            @click="$emit('saveTask')"
            class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50 itbkk-button-confirm"
          
          >
            Save
          </button>
          <button
            @click="$emit('cancelTask')"
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

<style scoped>
  
</style>