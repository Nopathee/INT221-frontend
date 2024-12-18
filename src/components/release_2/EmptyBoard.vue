<script setup>
import { defineProps, ref, watch, onMounted, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import {
  getItems,
  addItem,
  deleteItemById,
  getItemById,
} from '@/libs/fetchUtils'
import TaskDetail from '../TaskDetail.vue'
import ConfirmDelete from '../ConfirmDelete.vue'
import TaskModal from '../TaskModal.vue'
import Limit from '../Limit.vue'
import { TaskManagement } from '../../libs/TaskManagement.js'
import { StatusManagement } from '../../libs/StatusManagement.js'
import Succes from '../Succes.vue'
import Delete from '../Delete.vue'
import Edit from '../Edit.vue'
import Error from '../Error.vue'
import { changeVisi, getUserBoard } from '@/libs/fetchUtils_release2'
import ConfirmChangeVisi from './ConfirmChangeVisi.vue'

const props = defineProps({
  tasks: Array,
  statuses: Array,
  boardId: String,

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
const boardName = ref('')
const deletedToast = ref(false)
const successToast = ref(false)
const editToast = ref(false)
const errorToast = ref(false)
const fullName = ref('')
const taskInsert = ref('')
const taskEdit = ref('')
const showModal = ref(false)
const limitModal = ref(false)
const confirmDelete = ref(false)
const showModalDetail = ref(false)
const confirmVisi = ref(false)
const sortedTasks = ref([])
const originalTasks = ref([])
const sortOrder = ref('Default')
const task = ref({
  id: undefined,
  title: '',
  description: null,
  assignees: null,
  status: {
    id: '1',
    name: 'No Status',
    description: 'A status has not been assigned',
    color: '#ffffff',
  },
})
const taskDetail = ref(null)
const deleteTask = ref(null)
const deleteIndex = ref(null)
const newVisi = ref('')
const visibility = ref('')
const boardVisibility = ref('')
const isAuthenticated = ref(false)
const isOwner = ref(false)
const writeAccess = ref(false)
const readOnly = ref(false)
const originalVisibility = ref('')
const tasks = ref(props.tasks || [])
const statuses = ref(props.statuses || [])
const allTask = ref(new TaskManagement())
const allStatuses = ref(new StatusManagement())
const selectedStatusIds = ref([])
const selectedStatusNames = ref([])

const decoded = () => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    const decoded = jwtDecode(token)
    fullName.value = decoded.name
  } else {
    fullName.value = 'Guest'
  }
}

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  router.push('/login')
}


onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  isAuthenticated.value = !!token
  try {
    // Fetch board data
    const board = await getItemById(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, props.boardId)

    if (!board || !board.item) {
      console.error('Board is undefined or missing item field:', board)
      return
    }

    boardVisibility.value = board.item.visibility

    // Check if the board is private and the user is not authenticated
    if (boardVisibility.value === 'PRIVATE' && !isAuthenticated.value) {
      console.error('Access denied, you do not have permission to view this page.')
      alert('You must be logged in to view this private board.')
      router.push('/login')
      return
    }
    if (props.tasks) {
      originalTasks.value = props.tasks
    }

    filterAndSortTasks()
    decoded()

    if (props.boardId) {
      // Fetch tasks and statuses
      const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`)
      const status = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`)

      // Fetch board name and visibility
      const board = await getUserBoard(
        `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}`, token
      )

      if (!board || !board.board) {
        console.error('Board data is undefined:', board)
        return
      }

      if (fullName.value === board.board.owner.name) {
        isOwner.value = true
      }
     
      if(board.board.accessRight === 'READ'){
        readOnly.value = true
      } else if (board.board.accessRight === 'WRITE'){
        writeAccess.value = true
      }
       
      boardName.value = board.board.boardName
      visibility.value = board.board.visibility
      isChecked.value = true
      // Add statuses and tasks
      allStatuses.value.addStatuses(status)
      allTask.value.addDtoTasks(items)
      tasks.value = items
      statuses.value = status
      sortedTasks.value = allTask.value.getTasks()
    } else {
      console.error('Board ID is undefined')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})


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

const addNewTask = () => {
  task.value = {
    id: undefined,
    title: '',
    description: null,
    assignees: null,
    status: {
      id: '',
      name: 'No Status',
      description: 'A status hos not been assigned',
      color: '#ffffff',
    },
  }
  showModal.value = true
  router.push(`/board/${props.boardId}/task/add`)
}

const showEdit = (taskToEdit) => {
  task.value = { ...taskToEdit }
  showModal.value = true
  router.push(`/board/${props.boardId}/task/${taskToEdit.id}/edit`)
}

const closeModal = () => {
  task.value = {
    id: undefined,
    title: '',
    description: null,
    assignees: null,
    status: {
      id: '',
      name: 'No Status',
      description: 'A status hos not been assigned',
      color: '#ffffff',
    },
  }
  showModal.value = false
  router.push(`/board/${props.boardId}`)
}

const saveTask = async (newTask) => {
  if (!newTask.status || !newTask.status.id) {
    console.error("Status or status ID is undefined");
    return;
  }
  if (!props.boardId) {
    console.error("Board ID is undefined");
    return;
  }
  const item = {
    id: newTask.id,
    title: newTask.title,
    description: newTask.description,
    assignees: newTask.assignees,
    status: newTask.status.id,
  }

  if (newTask.id === undefined) {
    const response = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`,
      item
    )
    if (!response) {
      console.error("Failed to create task. No response received.");
      return; // จบการทำงานถ้า response เป็น null
    }
    taskInsert.value = newTask.title
    allTask.value.addTask(
      response.id,
      response.title,
      response.description,
      response.assignees,
      response.status
    )

    showModal.value = false

    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: {
        id: '1',
        name: 'No Status',
        description: 'A status hos not been assigned',
        color: '#ffffff',
      },
    }
    router.push(`/board/${props.boardId}`)

    successToast.value = true

    setTimeout(() => {
      successToast.value = false
    }, 3000)
  } else {
    const updatedTask = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`,
      item
    )
    taskEdit.value = newTask.title

    allTask.value.updateTask(
      updatedTask.id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.assignees,
      updatedTask.status
    )
    editToast.value = true
    showModal.value = false
    setTimeout(() => {
      editToast.value = false
    }, 3000)
    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: {
        id: '1',
        name: 'No Status',
        description: 'A status hos not been assigned',
        color: '#ffffff',
      },
    }

    router.push(`/board/${props.boardId}`)

    successToast.value = true

    setTimeout(() => {
      successToast.value = false
    }, 3000)
  }
}

const showDetail = async (taskToShow) => {
  try {
    const showTask = await getItemById(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`,
      taskToShow
    )
    taskDetail.value = showTask
    showModalDetail.value = true
  } catch (error) {
    console.error('Error fetching task details:', error);
  }

}

const closeDetail = () => {
  showModalDetail.value = false
}

const showDelete = async (taskToDelete, index) => {
  const task = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`,
    taskToDelete
  )
  deleteTask.value = task
  deleteIndex.value = await index
  confirmDelete.value = true
}

const closeDelete = () => {
  confirmDelete.value = false
}

const confDelete = async () => {
  try {
    await deleteItemById(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`,
      deleteTask.value.item.id
    )
    allTask.value.removeTask(deleteTask.value.item.id)
    tasks.value = tasks.value.filter((t) => t.id !== deleteTask.value.item.id)
    filterAndSortTasks()
  } catch (error) {
    console.error('Error deleting task:', error)
  }
  confirmDelete.value = false
}

const confChangeVisi = async (newVisi) => {
  const token = localStorage.getItem('accessToken')
  try {
    const response = await changeVisi(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}`, token, newVisi)
    if (response && response.status === 200) {
      visibility.value = newVisi
    } else if(response.status === 403){
      alert('you do not have permission to change board visibility mode.')
    } else if (response.status === 500){
      alert('There is a problem. Please try again later.')
    }
  } catch (err) {
    console.error('Error changing visibility:', err)
  }
  confirmVisi.value = false
}

const toggleVisibility = () => {
  originalVisibility.value = visibility.value
  newVisi.value = visibility.value === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
  confirmVisi.value = true

}

const isChecked = computed(() => {
  if (visibility.value === 'PRIVATE') {
    return false
  } else if (visibility.value === 'PUBLIC') {
    return true
  }
})

const closeVisiModal = () => {
  confirmVisi.value = false
  newVisi.value = originalVisibility.value
}


const goHome = () => {
  router.push('/board'); // เปลี่ยนเส้นทางไปยังหน้า boards
};

</script>

<template>
  <section class="flex flex-col sm-items-center max-w-full h-auto">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
          IT-Bangmod Kradan Kanban SSI-3
        </h1>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 pt-7">
          <ul
            class="flex flex-row font-medium md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li class="flex items-center space-x-2  relative group">
              <span class="label-text">PRIVATE</span>
              <input type="checkbox" class="toggle itbkk-board-visibility" :checked="isChecked"
                @change="toggleVisibility" :disabled="!isAuthenticated || !isOwner  || readOnly" />
              <span class="label-text">PUBLIC</span>
              <div
                v-if="!isOwner"
                class="absolute top-full mt-1 w-auto bg-gray-800 text-white text-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                role="tooltip"
              >
                You need to be board owner to perform this action.
              </div>
            </li>

            <li class="flex item-center">
              <button @click="goHome"
                class="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 ">
                Home
              </button>
            </li>
            <li class="flex items-center">
              <details class="dropdown itbkk-status-filter">
                <summary
                  class="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 itbkk-filter-statuses">
                  Filter Statuses
                </summary>
                <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 itbkk-status-choice">
                  <span v-for="status in props.statuses" :key="status.id" class="mx-3 my-2 flex itbkk-filter-item">
                    <input type="checkbox" class="checkbox" :id="status.id" :value="status.id"
                      v-model="selectedStatusIds" @change="updateSelectedStatusNames(status.id)" />
                    <label :for="status.id" class="ml-2 font-semibold">{{
                      status.name
                    }}</label>
                  </span>
                </ul>
              </details>
            </li>
            <li>
              <button
                class="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 itbkk-manage-status">
                <router-link :to="`/board/${props.boardId}/status`" @click="$emit('statusDetail')">
                  Manage Status
                </router-link>
              </button>
            </li>
            <li>
              <button
                class="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 itbkk-manage-collaborator"
                >
                <router-link :to="`/board/${props.boardId}/collab`">
                  Manage Collaborator
                </router-link>

              </button>
            </li>
            <li>
              <button
                class="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50"
                @click="$emit('limitModal', true)">
                Limit tasks
              </button>
            </li>
            <li class="flex items-center">
              <details class="dropdown">
                <summary v-if="fullName"
                  class="inline-flex items-center font-medium justify-center px-4 py-2 text-xl text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white itbkk-fullname">
                  {{ fullName }}
                </summary>
                <ul
                  class="p-2 shadow menu dropdown-content z-[1] bg-red-600 rounded-box w-full text-center my-2 text-black">
                  <li class="flex items-center">
                    <button @click="logout" class="flex justify-center">
                      logout
                    </button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="text-2xl flex justify-center pt-5 font-semibold">
      <p>{{ boardName }}</p>
    </div>
    <div class="w-full flex justify-center items-center">
      <div class="rounded-xl p-5 w-5/6">
        <div v-if="selectedStatusNames.length > 0">
          <div class="font-semibold text-lg">Selected Statuses:</div>
        </div>
        <div class="flex gap-2">
          <div v-if="selectedStatusNames.length > 0">
            <button class="btn btn-sm btn-error btn-outline itbkk-filter-clear" @click="
                ; (selectedStatusIds = []),
              (selectedStatusNames = []),
              filterAndSortTasks()
              ">
              Clear All
            </button>
            <div class="w-1/2 h-1 bg-gray-400 my-2"></div>
          </div>
          <template v-for="(statusName, index) in selectedStatusNames" :key="index">
            <div class="badge m-2 itbkk-filter-item" :style="{ backgroundColor: statusName.color }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block w-4 h-4 stroke-current itbkk-filter-item-clear"
                @click="removeSelectedStatus(statusName.id)">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ statusName.name }}
            </div>
          </template>
        </div>
        <table class="w-full table table-lg rounded-lg overflow-hidden">
          <thead>
            <tr class="font-bold text-red-800 text-lg bg-pink-300">
              <th class="w-1/12">
                <button @click="addNewTask" class="cursor-pointer itbkk-button-add relative group"
                  :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly}"
                  :disabled="!isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly">
                  <img src="../icon/InsertBtn.svg" alt="Add Task" />
                </button>

              </th>
              <th class="w-5/12">Title</th>
              <th class="w-3/12">Assignees</th>
              <th class="justify-end w-1/12">
                <div class="flex">
                  Status &nbsp;
                  <button @click="toggleSortOrder" class="btn btn-sm btn-ghost itbkk-status-sort">
                    <img v-if="sortOrder === 'A-Z'" src="../icon/sortaz.svg" alt="sort Default" />
                    <img v-else-if="sortOrder === 'Z-A'" src="../icon/sortza.svg" alt="sort A-Z" />
                    <img v-else src="../icon/sort.svg" alt="sort Z-A" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>


          <tbody>
            <tr v-for="(task, index) in sortedTasks" :key="task.id" class="bg-blue-300 itbkk-item">
              <td class="text-white text-center font-semibold flex">
                {{ index + 1 }}
                <div class="dropdown dropdown-right dropdown-end tra itbkk-button-action">
                  <div tabindex="0" role="button">
                    <img src="../icon/Threebtn.svg" />
                  </div>
                  <ul class="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32">
                    <li class="">
                      <button @click="showEdit(task)" class="text-black dark:text-white itbkk-button-edit"
                        :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly }"
                        :disabled="!isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly">
                        Edit
                      </button>
                    </li>
                    <li>
                      <button @click="showDelete(task.id, index + 1)" class="text-red-600 itbkk-button-delete"
                        :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly }"
                        :disabled="!isAuthenticated || (isOwner === false && writeAccess === false)  || readOnly" >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>

              <td class="text-blue-800 hover:underline itbkk-title font-semibold transition-property: transform;"
                @click="showDetail(task.id)">
                {{ task.title }}
              </td>

              <td class="itbkk-assignees font-semibold" :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
                :class="task.assignees ? 'text-white' : 'text-gray-500'">
                {{ task.assignees ? task.assignees : 'Unassigned' }}
              </td>
              <td>
                <button class="badge itbkk-status font-semibold" :style="{ backgroundColor: task.status.color }">
                  {{ task.status.name }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Succes v-if="successToast" :taskInsert="taskInsert" @closeToast="successToast = false" />
  <Delete v-if="deletedToast" :taskDelete="deleteTask.item.title" @closeToast="deletedToast = false" />
  <Edit v-if="editToast" :taskEdit="taskEdit" @closeToast="editToast = false" />
  <Error v-if="errorToast" @closeToast="errorToast = false" />
  <Teleport to="#modal">
    <div v-if="showModal">
      <TaskModal @cancelTask="closeModal" @saveTask="saveTask" :task="task" :statuses="allStatuses.getStatuses()" />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="showModalDetail">
      <TaskDetail @close="closeDetail" :task="taskDetail" />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="confirmDelete">
      <ConfirmDelete @close="closeDelete" @confirm="confDelete" :task="deleteTask" :index="deleteIndex" />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="confirmVisi">
      <ConfirmChangeVisi @close="closeVisiModal" @confirm="confChangeVisi" :newVisi="newVisi" />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="limitModal">
      <Limit @cancelLimit="limitModal = false" @saveLimit="saveLimit" :limitNumber="limitNumber" />
    </div>
  </Teleport>
</template>

<style scoped></style>
