<script setup>
defineProps({
  task: {
    type: Object,
    default: {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: 'NO_STATUS',
    },
  },
})

defineEmits(['saveTask', 'cancelTask'])
</script>

<template>
  <div>

    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Task
          </h2>
        </div>
        <form class="p-4 md:p-5 ">
          <div class="grid gap-4  mb-4 grid-cols-2">
            <div class="col-span-2">
              <label
                for="taskTitle"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Title</label
              >
              <input
                id="taskTitle"
                type="text"
                v-model="task.title"
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
                v-model="task.description"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
              </textarea>
            </div>
            <div class="row-span-8" >
              <label
                for="Assignees"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Assignees</label
              >
              <textarea
                id="taskAssignees"
                type="text"
                v-model="task.assignees"

                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-assignees h-5/6"
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
                v-model="task.status"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 itbkk-status"
              >
                <option value="NO_STATUS">No Status</option>
                <option value="TO_DO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          
          </div>
   
          <div class="flex justify-end ">
            <button
              @click="$emit('saveTask', task)"
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
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
