<script setup>
import { defineProps, ref, watch, onMounted } from 'vue'

const props = defineProps({
  tasks: Array,
  statuses: Array,
})

const emit = defineEmits([
  'openModal',
  'closeModal',
  'editTask',
  'showDetail',
  'deleteTask',
  'statusDetail',
])

const sortedTasks = ref([])
const originalTasks = ref([])
const sortOrder = ref('Default')

onMounted(() => {
  originalTasks.value = props.tasks
  filterAndSortTasks()
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
  let filteredTasks = [...originalTasks.value]

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
  <div class="w-full flex justify-center items-center">
    <div class="rounded-xl p-5 w-5/6">
      <div class="flex justify-end gap-2">
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

        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg mb-4 itbkk-manage-status"
        >
          <router-link to="/status" @click="$emit('statusDetail')">
            Manage Status
          </router-link>
        </button>
      </div>
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
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300">
            <th class="w-1/12">
              <img
                src="./icon/InsertBtn.svg"
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
                    src="./icon/sortaz.svg"
                    alt="sort Default"
                  />
                  <img
                    v-else-if="sortOrder === 'Z-A'"
                    src="./icon/sortza.svg"
                    alt="sort A-Z"
                  />
                  <img v-else src="./icon/sort.svg" alt="sort Z-A" />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in sortedTasks.length > 0
              ? sortedTasks
              : props.tasks"
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
                class="badge itbkk-status font-semibold"
                :style="{ backgroundColor: task.status.color }"
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

<style scoped></style>
