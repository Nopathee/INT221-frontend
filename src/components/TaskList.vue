<script setup>
import { onMounted, ref } from 'vue'
import Table from './Table.vue'
import TaskDetail from './TaskDetail.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import TaskModal from './TaskModal.vue'
import { getItems, getItemById } from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import router from '@/router'
console.log(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})

const showModal = ref(false)

const confirmDelete = ref(false)

const clearModal = (flagModal) => {
  showModal.value = flagModal
  router.push('/task')
}

const showInsert = (flagModal) => {
  showModal.value = flagModal
  router.push('/task/add')
}

const saveTask = async (task) => {
  console.log(task)
  showModal.value = false
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

  router.push('/task/' + id)

  taskDetail.value = { ...detail }
  console.log(taskDetail.value)
  showModalDetail.value = true
}

const deleteTask = ref('')

const showDelete = (id) => {
  deleteTask.value = id
  confirmDelete.value = true
}

const closeDelete = () => {
  confirmDelete.value = false
}

const closeDetail = () => {
  showModalDetail.value = false
  router.push('/task')
}
</script>

<template>
  <div>
    <Table
      :tasks="allTask.getTasks()"
      @openModal="showInsert"
      @showDetail="showDetail"
      @deleteTask="showDelete"
    />
    <Teleport to="#modal">
      <div v-show="showModal">
        <TaskModal @cancelTask="clearModal" @saveTask="saveTask" :task="task" />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-show="confirmDelete">
        <ConfirmDelete @close="closeDelete" :id="deleteTask" />
      </div>
    </Teleport>
    <Teleport to="#modal">
      <div v-show="showModalDetail">
        <TaskDetail @close="closeDetail" :task="taskDetail" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
