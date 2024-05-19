<script setup>
import { defineProps, ref, watch, onMounted } from 'vue'
const props = defineProps({
  tasks: Array,
})

const emit = defineEmits([
  'openModal',
  'closeModal',
  'editTask',
  'showDetail',
  'deleteTask',
  'statusDetail',
  'toggleSort',
  'sortStatus',
])

const sortedTasks = ref([...props.tasks])
const sortOrder = ref('Default')

const sortTasks = (order) => {
  sortOrder.value = order
  if (order === 'A-Z') {
    sortedTasks.value.sort((a, b) => a.status.name.localeCompare(b.status.name))
  } else if (order === 'Z-A') {
    sortedTasks.value.sort((a, b) => b.status.name.localeCompare(a.status.name))
  } else {
    sortedTasks.value = [...props.tasks]
  }
  emit('sortStatus', order)
}

// Watch for changes in the props.tasks to keep sortedTasks updated
watch(() => props.tasks, (newTasks) => {
  sortedTasks.value = [...newTasks]
  sortTasks(sortOrder.value)
})

// Initial sort to show default order
onMounted(() => {
  sortTasks('Default')
})
</script>

<template>
  <div class="w-full flex justify-center items-center">
    <div class="rounded-xl p-5">
      <div class="flex justify-end">
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg mb-4"
        >
          <router-link to="/statuses" @click="$emit('statusDetail')">
            Manage Status
          </router-link>
        </button>
      </div>
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300">
            <th>
              <img
                src="./icon/InsertBtn.svg"
                alt="Add Task"
                @click="$emit('openModal', true)"
                class="cursor-pointer itbkk-button-add"
              />
            </th>
            <th>Title</th>
            <th>Assignees</th>
            <th class="flex items-center">
              Status &nbsp;
              <div class="dropdown dropdown-bottom dropdown-end">
                <div
                  tabindex="0"
                  role="button"
                  class="btn btn-sm mt-1.5 btn-ghost"
                >
                  <img src="./icon/sortaz.svg" alt="sort" />
                </div>
                <ul
                  tabindex="1"
                  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                >
                  <li><a @click="sortTasks('Default')">Default</a></li>
                  <li><a @click="sortTasks('A-Z')">A-Z</a></li>
                  <li><a @click="sortTasks('Z-A')">Z-A</a></li>
                </ul>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in sortedTasks"
            :key="index"
            class="bg-blue-300 itbkk-item"
          >
            <td class="text-white text-center font-semibold flex">
              {{ index + 1 }}
              <div class="dropdown dropdown-right dropdown-end">
                <div tabindex="0" role="button" class="itbkk-button-action">
                  <img src="./icon/Threebtn.svg" />
                </div>
                <ul
                  class="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32"
                >
                  <li>
                    <button
                      @click="$emit('editTask', task.id)"
                      class="text-black itbkk-button-edit"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      @click="$emit('deleteTask', task.id, index + 1)"
                      class="text-red-600 itbkk-button-delete"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </td>

            <td
              class="text-blue-800 hover:underline itbkk-title font-semibold transition-property: transform;"
              @click="$emit('showDetail', task.id)"
            >
              {{ task.title }}
            </td>

            <td
              class="itbkk-assignees font-semibold"
              :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
              :class="task.assignees ? 'text-white' : 'text-gray-500'"
            >
              {{ task.assignees ? task.assignees : 'Unassigned' }}
            </td>
            <td>
              <button
                class="badge itbkk-status w-24"
                :class="{
                  'badge-success': task.status.name === 'DONE',
                  'badge-warning': task.status.name === 'DOING',
                  'badge-info': task.status.name === 'TO_DO',
                }"
              >
                {{ task.status.name }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.itbkk-status-sort {
  width: 24px;
  height: 20px;
}
</style>
