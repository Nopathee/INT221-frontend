<script setup>
import { onMounted, ref } from 'vue'
import Table from './Table.vue'
import TaskDetail from './TaskDetail.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import TaskModal from './TaskModal.vue'
import Succes from './Succes.vue'
import Delete from './Delete.vue'
import Error from './Error.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
} from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import router from '@/router'
console.log(`${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})

const deletedToast = ref(false)

const successToast = ref(false)

const showModal = ref(false)

const confirmDelete = ref(false)

const taskInsert = ref('')

const errorToast = ref(false)

const task = ref({
  id: undefined,
  title: '',
  description: null,
  assignees: null,
  status: '1',
})

const clearModal = (flagModal) => {
  task.value = {
    id: undefined,
    title: '',
    description: null,
    assignees: null,
    status: '1',
  }
  showModal.value = flagModal
  router.push('/task')
}

const showInsert = (flagModal) => {
  showModal.value = flagModal
  router.push('/task/add')
}

const saveTask = async (selectedTask) => {
  console.log(selectedTask)
  if (selectedTask.id === undefined) {
    const newTask = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
      {
        title: selectedTask.title,
        description: selectedTask.description,
        assignees: selectedTask.assignees,
        status: selectedTask.status,
      }
    )

    taskInsert.value = selectedTask.title

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
      status: '1',
    }
    router.push('/task')

    successToast.value = true

    setTimeout(() => {
      successToast.value = false
    }, 3000)
  } else {
    const updatedTask = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
      selectedTask.id,
      {
        title: selectedTask.title,
        description: selectedTask.description,
        assignees: selectedTask.assignees,
        status: selectedTask.status,
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
      status: '1',
    }

    router.push('/task')
  }
}

const taskDetail = ref({
  id: '',
  title: '',
  description: null,
  assignees: null,
  status: '1',
  createdOn: '',
  updatedOn: '',
})

const showModalDetail = ref(false)

const showDetail = async (id) => {
  console.log(id)
  router.push(`/task/${id}`)
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
    id
  )
  console.log(detail.status)
    
    taskDetail.value = await detail.item
    showModalDetail.value = true
}

const deleteTask = ref('')
const deleteIndex = ref('')

const showDelete = async (id, index) => {
  const task = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
    id
  )

  deleteTask.value = task
  deleteIndex.value = await index
  confirmDelete.value = true
  console.log(deleteTask.value)
  console.log(deleteIndex.value)
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
    `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
    id
  )

  if (status === 200) {
    deletedToast.value = true
    setTimeout(() => {
      deletedToast.value = false
    }, 3000)
    allTask.value.removeTask(id)
    confirmDelete.value = false
  } else {
    errorToast.value = true
    setTimeout(() => {
      errorToast.value = false
    }, 3000)
    confirmDelete.value = false
  }
}

const showEdit = async (id) => {
  router.push(`/task/${id}/edit`)
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v1/tasks`,
    id
  )
  task.value = await detail.item
  showModal.value = true
  
}
</script>

<template>
  <div>
    <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
      IT-Bangmod Kradan Kanban SSI-3
    </h1>
    <Succes v-if="successToast" :taskInsert="taskInsert" @closeToast="successToast = false" />
    <Delete v-if="deletedToast" :taskDelete="deleteTask.item.title" @closeToast="deletedToast = false"/>
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
          :task="deleteTask"
          :index="deleteIndex"
        />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-if="showModalDetail">
        <TaskDetail @close="closeDetail" :task="taskDetail" />
      </div>
    </Teleport>
    <Error v-if="errorToast" :errorTask="deleteTask.item.title" @closeToast="errorToast = false"/>
  </div>
</template>

<style scoped></style>
