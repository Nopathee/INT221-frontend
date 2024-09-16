<script setup>
import { defineProps, ref, watch, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import { getItems } from '@/libs/fetchUtils'

const props = defineProps({
  tasks: Array,
  statuses: Array,
  boardId: {
    type: String,
    default: ''
  },
})

const emit = defineEmits([
  'openModal',
  'closeModal',
  'editTask',
  'showDetail',
  'deleteTask',
  'statusDetail',
  'limitModal',
])

const fullName = ref('')

const decoded = () => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    const decoded = jwtDecode(token)
    fullName.value = decoded.name
    console.log(fullName.value)
  }
}
const name = localStorage.getItem('boardName')
const logout = () => {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

const sortedTasks = ref([])
const originalTasks = ref([])
const sortOrder = ref('Default')

const tasks = ref(props.tasks || [])
const statuses = ref(props.statuses || [])

onMounted(async () => {
  try {
    if (props.tasks) {
      originalTasks.value = props.tasks
    }
    filterAndSortTasks()
    decoded()
    if (props.boardId) {
      const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`)
      const status = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`)
      statuses.value = status
      tasks.value = items
    } else {
      console.error('Board ID is undefined')
      // Handle the case when boardId is undefined, e.g., show an error message or redirect
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // Handle the error appropriately (e.g., show an error message to the user)
  }
})

const selectedStatusIds = ref([])

watch(
  () => props.tasks,
  (newTasks) => {
    originalTasks.value = newTasks
    filterAndSortTasks()
  }
)

watch(selectedStatusIds, () => {
  filterAndSortTasks()
})

const filterAndSortTasks = () => {
  let filteredTasks = [...tasks.value]

  if (selectedStatusIds.value.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      selectedStatusIds.value.includes(task.status.id)
    )
  }

  if (sortOrder.value === 'A-Z') {
    filteredTasks.sort((a, b) => a.status.name.localeCompare(b.status.name))
  } else if (sortOrder.value === 'Z-A') {
    filteredTasks.sort((a, b) => b.status.name.localeCompare(a.status.name))
  } else {
    filteredTasks.sort((a, b) => a.id - b.id)
  }

  sortedTasks.value = filteredTasks
}

const toggleSortOrder = () => {
  if (sortOrder.value === 'Default') {
    sortOrder.value = 'A-Z'
  } else if (sortOrder.value === 'A-Z') {
    sortOrder.value = 'Z-A'
  } else if (sortOrder.value === 'Z-A') {
    sortOrder.value = 'Default'
  }
  filterAndSortTasks()
}

const selectedStatusNames = ref([])

const updateSelectedStatusNames = (statusId) => {
  const status = props.statuses.find((s) => s.id === statusId)
  if (status) {
    if (!selectedStatusNames.value.includes(status)) {
      selectedStatusNames.value.push(status)
    } else {
      selectedStatusNames.value = selectedStatusNames.value.filter(
        (name) => name.name !== status.name
      )
    }
  }
}

const removeSelectedStatus = (statusId) => {
  selectedStatusNames.value = selectedStatusNames.value.filter(
    (status) => status.id !== statusId
  )
  selectedStatusIds.value = selectedStatusIds.value.filter(
    (id) => id !== statusId
  )
  filterAndSortTasks()
}
</script>

<template>
  <section class="flex flex-col sm-items-center max-w-full h-auto">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div
        class="w-full flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <h1
          class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5"
        >
          IT-Bangmod Kradan Kanban SSI-3
        </h1>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 pt-7"
        >
          <ul
            class="flex flex-col font-medium md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <details class="dropdown">
                <summary
                  v-if="fullName"
                  class="inline-flex items-center font-medium justify-center px-4 py-2 text-xl text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white itbkk-fullname"
                >
                  {{ fullName }}
                </summary>
                <ul
                  class="p-2 shadow menu dropdown-content z-[1] bg-red-600 rounded-box w-full text-center my-2 text-black"
                >
                  <li>
                    <button @click="logout" class="flex justify-center">
                      logout
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details class="dropdown itbkk-status-filter">
                <summary
                  class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg mb-4 itbkk-filter-item"
                >
                  Filter Statuses
                </summary>
                <ul
                  class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 itbkk-status-choice"
                >
                  <span
                    v-for="status in props.statuses"
                    :key="status.id"
                    class="mx-3 my-2 flex itbkk-filter-item"
                  >
                    <input
                      type="checkbox"
                      class="checkbox"
                      :id="status.id"
                      :value="status.id"
                      v-model="selectedStatusIds"
                      @change="updateSelectedStatusNames(status.id)"
                    />
                    <label :for="status.id" class="ml-2 font-semibold">{{
                      status.name
                    }}</label>
                  </span>
                </ul>
              </details>
            </li>
            <li>
              <button
                class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg mb-4 itbkk-manage-status"
              >
                <router-link to="/status" @click="$emit('statusDetail')">
                  Manage Status
                </router-link>
              </button>
            </li>
            <li>
              <button
                class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg mb-4 itbkk-manage-status"
                @click="$emit('limitModal', true)"
              >
                Limit tasks
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="w-full flex justify-center items-center">
      <div class="rounded-xl p-5 w-5/6">
        <div v-if="selectedStatusNames.length > 0">
          <div class="font-semibold text-lg">Selected Statuses:</div>
        </div>
        <div class="flex gap-2">
          <div v-if="selectedStatusNames.length > 0">
            <button
              class="btn btn-sm btn-error btn-outline itbkk-filter-clear"
              @click="
                ;(selectedStatusIds = []),
                  (selectedStatusNames = []),
                  filterAndSortTasks()
              "
            >
              Clear All
            </button>
            <div class="w-1/2 h-1 bg-gray-400 my-2"></div>
          </div>
          <template
            v-for="(statusName, index) in selectedStatusNames"
            :key="index"
          >
            <div
              class="badge m-2 itbkk-filter-item"
              :style="{ backgroundColor: statusName.color }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-4 h-4 stroke-current itbkk-filter-item-clear"
                @click="removeSelectedStatus(statusName.id)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              {{ statusName.name }}
            </div>
          </template>
        </div>
        <div class="text-3xl flex justify-center p-8">
          <h1>{{ name }}</h1>
        </div>
        <table class="w-full table table-lg rounded-lg overflow-hidden">
          <thead>
            <tr class="font-bold text-red-800 text-lg bg-pink-300">
              <th class="w-1/12">
                <img
                  src="../icon/InsertBtn.svg"
                  alt="Add Task"
                  @click="$emit('openModal', true)"
                  class="cursor-pointer itbkk-button-add"
                />
              </th>
              <th class="w-5/12">Title</th>
              <th class="w-3/12">Assignees</th>
              <th class="justify-end w-1/12">
                <div class="flex">
                  Status &nbsp;
                  <button
                    @click="toggleSortOrder"
                    class="btn btn-sm btn-ghost itbkk-status-sort"
                  >
                    <img
                      v-if="sortOrder === 'A-Z'"
                      src="../icon/sortaz.svg"
                      alt="sort Default"
                    />
                    <img
                      v-else-if="sortOrder === 'Z-A'"
                      src="../icon/sortza.svg"
                      alt="sort A-Z"
                    />
                    <img v-else src="../icon/sort.svg" alt="sort Z-A" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in sortedTasks" :key="task.id">
              <td class="font-bold">
                <img
                  src="../icon/Edit.svg"
                  alt="edit"
                  @click="$emit('editTask', task)"
                  class="cursor-pointer itbkk-button-edit"
                />
              </td>
              <td>
                <button
                  @click="$emit('showDetail', task)"
                  class="w-full text-left font-bold itbkk-button-detail"
                >
                  {{ task.title }}
                </button>
              </td>
              <td>
                <div class="flex">
                  <img
                    v-for="assignee in task.assignees"
                    :src="assignee.avatar"
                    :alt="assignee.name"
                    :key="assignee.id"
                    class="w-8 h-8 rounded-full border-2 border-gray-200 shadow-md itbkk-avatar"
                  />
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :style="{ backgroundColor: task.status.color }"
                >
                  {{ task.status.name }}
                </span>
              </td>
              <td class="font-bold">
                <img
                  src="../icon/Delete.svg"
                  alt="delete"
                  @click="$emit('deleteTask', task)"
                  class="cursor-pointer itbkk-button-delete"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
