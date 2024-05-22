<script setup>
import { onMounted, ref, computed } from 'vue'
import Table from './Table.vue'
import TaskDetail from './TaskDetail.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import TaskModal from './TaskModal.vue'
import Succes from './Succes.vue'
import Delete from './Delete.vue'
import Error from './Error.vue'
import Edit from './Edit.vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
} from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import router from '@/router'
import { StatusManagement } from '@/libs/StatusManagement'

console.log(`${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`)
const allTask = ref(new TaskManagement())
const allStatuses = ref(new StatusManagement())

const deletedToast = ref(false)

const successToast = ref(false)

const editToast = ref(false)

const showModal = ref(false)

const confirmDelete = ref(false)

const taskInsert = ref('')

const taskEdit = ref('')

const errorToast = ref(false)

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`)
  const status = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
  )
  allStatuses.value.addStatuses(status)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})

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
      `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
      {
        title: selectedTask.title,
        description: selectedTask.description,
        assignees: selectedTask.assignees,
        status: selectedTask.status,
      }
    )

    taskInsert.value = selectedTask.title

    console.log(newTask)
    console.log(newTask.status.toString())
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
      status: '',
    }
    router.push('/task')

    successToast.value = true

    setTimeout(() => {
      successToast.value = false
    }, 3000)
  } else {
    console.log(selectedTask)
    const updatedTask = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
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
    taskEdit.value = selectedTask.title
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
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
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
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
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
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
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
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
    id
  )
  console.log(detail.item)
  task.value = await detail.item
  showModal.value = true
  router.push(`/task/${id}/edit`)
}

const filteredTasks = ref(allTask.value.getTasks())
console.log(filteredTasks.value)

const filterTask = (selectedStatusIds) => {
  console.log(selectedStatusIds)
  filteredTasks.value = allTask.value
    .getTasks()
    .filter((task) => selectedStatusIds.includes(task.status.id))
  console.log(filteredTasks.value)
}

const computedTasks = computed(() => {
  console.log(filteredTasks.value)
  return filteredTasks.value
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
      IT-Bangmod Kradan Kanban SSI-3
    </h1>
    <Succes
      v-if="successToast"
      :taskInsert="taskInsert"
      @closeToast="successToast = false"
    />
    <Delete
      v-if="deletedToast"
      :taskDelete="deleteTask.item.title"
      @closeToast="deletedToast = false"
    />
    <Edit
      v-if="editToast"
      :taskEdit="taskEdit"
      @closeToast="editToast = false"
    />

    <Table
      :tasks="computedTasks"
      :statuses="allStatuses.getStatuses()"
      @openModal="showInsert"
      @showDetail="showDetail"
      @deleteTask="showDelete"
      @editTask="showEdit"
      @selectedStatusChanged="filterTask"
    />

    <Teleport to="#modal">
      <div v-if="showModal">
        <TaskModal
          @cancelTask="clearModal"
          @saveTask="saveTask"
          :task="task"
          :statuses="allStatuses.getStatuses()"
        />
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
    <Error
      v-if="errorToast"
      :errorTask="deleteTask.item.title"
      @closeToast="errorToast = false"
    />
  </div>
</template>

<style scoped></style>
