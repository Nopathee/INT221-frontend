<script setup>
import { onMounted, ref } from 'vue'
import Table from './Table.vue'
import TaskDetail from './TaskDetail.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import TaskModal from './TaskModal.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
} from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import router from '@/router'
console.log(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})

const deletedToast = ref(false)

const successToast = ref(false)

const showModal = ref(false)

const confirmDelete = ref(false)

const clearModal = (flagModal) => {
  task.value = {
    id: undefined,
    title: '',
    description: null,
    assignees: null,
    status: 'NO_STATUS',
  }
  showModal.value = flagModal
  router.push('/task')
}

const showInsert = (flagModal) => {
  showModal.value = flagModal
  router.push('/task/add')
}

const saveTask = async (task) => {
  console.log(task)
  if (task.id === undefined) {
    const newTask = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
      {
        title: task.title,
        description: task.description,
        assignees: task.assignees,
        status: task.status,
      }
    )
    console.log(newTask)
    allTask.value.addNewTask(
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.assignees,
      newTask.status
    )

    showModal.value = false

    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: 'NO_STATUS',
    }
    router.push('/task')

    successToast.value = true
  } else {
    const updatedTask = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
      task.id,
      {
        title: task.title,
        description: task.description,
        assignees: task.assignees,
        status: task.status,
      }
    )
    console.log(updatedTask)
    allTask.value.updateTask(
      updatedTask.id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.assignees,
      updatedTask.status
    )

    showModal.value = false

    task.value = {
      id: undefined,
      title: '',
      description: null,
      assignees: null,
      status: 'NO_STATUS',
    }

    router.push('/task')
  }
}

const task = ref({
  id: undefined,
  title: '',
  description: null,
  assignees: null,
  status: 'NO_STATUS',
})

const taskDetail = ref({
  id: '',
  title: '',
  description: null,
  assignees: null,
  status: 'NO_STATUS',
  createdOn: '',
  updatedOn: '',
})

const showModalDetail = ref(false)

const showDetail = async (id) => {
  console.log(id)

  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )
  console.log(detail.status)
  if (detail.status === 404) {
    alert('The requested task does not exist')
    router.push('/task')
  } else {
    taskDetail.value = await detail.item
    showModalDetail.value = true
    router.push(`/task/${id}`)
  }
}

// const showDetail = async (id) => {
//   console.log(id)

//   try {
//     const detail = await getItemById(
//       `${import.meta.env.VITE_API_ENDPOINT}/tasks/${id}`
//     );

//     // If the request is successful but the detail is null, it means the resource does not exist
//     if (!detail) {
//       alert('The requested task does not exist');
//       router.push("/task");
//       return;
//     }

//     taskDetail.value = detail;
//     showModalDetail.value = true;
//     router.push(`/task/${id}`);
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       alert('The requested task does not exist');
//       router.push("/task");
//     } else {
//       console.error("Error fetching task detail:", error);
//     }
//   }
// }

// const showDetail = async (id) => {
//
//       const response = await getItemById(
//         `${import.meta.env.VITE_BASE_URL}/v1/tasks/${id}`
//       )
//       if (response.ok) {
//         const data = await response.json()
//         taskDetail.value = data
//       } else if (response.status === 404) {
//         alert("The requested task does not exist")
//         router.push("/task")
// }

const deleteTask = ref('')

const showDelete = async (id) => {
  deleteTask.value = await id
  confirmDelete.value = true
  console.log(deleteTask.value)
}

const closeDelete = () => {
  confirmDelete.value = false
}

const closeDetail = () => {
  showModalDetail.value = false
  router.push('/task')
}

const confDelete = async (id) => {
  const status = await deleteItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )

  if (status === 200) {
    deletedToast.value = true
    allTask.value.removeTask(id)
    confirmDelete.value = false
  }
}

const showEdit = async (id) => {
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )
  task.value = await detail.item
  showModal.value = true
  router.push(`/task/${id}/edit`)
}
</script>

<template>
  <div class="toast toast-top toast-end">
    <div
      v-if="successToast"
      id="toast-success"
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">Item moved successfully.</div>
      <button
        type="button"
        class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
        @click="successToast = false"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
    <div
      v-if="deletedToast"
      id="toast-danger"
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
          />
        </svg>
        <span class="sr-only">Error icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">Item has been deleted.</div>
      <button
        @click="deletedToast = false"
        type="button"
        class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-danger"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </div>
  <div>
    <Table
      :tasks="allTask.getTasks()"
      @openModal="showInsert"
      @showDetail="showDetail"
      @deleteTask="showDelete"
      @editTask="showEdit"
    />
    <Teleport to="#modal">
      <div v-show="showModal">
        <TaskModal @cancelTask="clearModal" @saveTask="saveTask" :task="task" />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-if="confirmDelete">
        <ConfirmDelete
          @close="closeDelete"
          @confirm="confDelete"
          :id="deleteTask"
        />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-if="showModalDetail">
        <TaskDetail @close="closeDetail" :task="taskDetail" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
