<script setup>
import { onMounted, ref } from 'vue'
import { StatusManagement } from '../libs/StatusManagement.js'
import { getItems } from '@/libs/fetchUtils'
const props = defineProps({
  task: {
    type: Object,
    default: {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: '',
    },
  },
})

const statuses = ref(new StatusManagement())

onMounted(async () => {
  const items = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
  )
  statuses.value.addStatuses(items)
  console.log(statuses.value.getStatuses())
})

console.log(props.task)

defineEmits(['saveTask', 'cancelTask'])
</script>

<template>
  <div>
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md shadow-2xl dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ props.task.id ? 'Edit Task' : 'Add Task' }}
          </h2>
        </div>
        <form class="p-4 md:p-5">
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="col-span-2">
              <label
                for="taskTitle"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Title</label
              >

              <input
                id="taskTitle"
                type="text"
                v-model.trim="props.task.title"
                maxlength="100"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-title"
              />
            </div>
            <div class="row-span-10">
              <label
                for="Description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Description</label
              >

              <textarea
                id="taskDescription"
                type="text"
                v-model.trim="props.task.description"
                maxlength="500"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-description"
              >
              </textarea>
            </div>
            <div class="row-span-8">
              <label
                for="Assignees"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Assignees</label
              >
              <textarea
                id="taskAssignees"
                type="text"
                v-model.trim="props.task.assignees"
                maxlength="30"
                class="itbkk-assignees bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-assignees h-5/6"
              >
              </textarea>
            </div>
            <div class="row-span-2 dropdown">
              <label
                for="Status"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Status:</label
              >
              <select
                v-model="props.task.status"
                class="itbkk-status bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-status"
              >
                <option value="" disabled>Select Status</option>
                <option
                  v-for="status in statuses.getStatuses()"
                  :key="status.id"
                  :value="status.id"
                >
                  {{ status.name }}
                </option>
              </select>
            </div>
          </div>
        </form>
        <div class="flex justify-end">
          <button
            @click="$emit('saveTask', props.task )"
            class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50 itbkk-button-confirm"
            :disabled="!props.task.title.trim()"
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
</template>

<style scoped></style>
