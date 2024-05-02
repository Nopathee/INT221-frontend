<script setup>
import { onMounted, ref } from 'vue'
import Table from './Table.vue'

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

const showDetail = async (id) => {
  console.log(id)
  task.value = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/tasks`,
    id
  )

  router.push('/task/' + id)

  console.log(task.value)
  showModal.value = true
}
</script>

<template>
  <div>
    <Table
      :tasks="allTask.getTasks()"
      @openModal="showInsert"
      @showDetail="showDetail"
    />
    <Teleport to="#detailModal">
      <div v-show="showModal">
        <TaskModal @cancelTask="clearModal" @saveTask="saveTask" :task="task" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
