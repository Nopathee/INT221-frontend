<script setup>
import { defineProps, onMounted, ref } from 'vue'
import router from '@/router'
import { TaskManagement } from '../libs/TaskManagement.js'
import { StatusManagement } from '@/libs/StatusManagement'
import StatusModal from './StatusModal.vue'
import {
  getItems,
  getItemById,
  addItem,
  editItem
} from '@/libs/fetchUtils.js'


defineProps({
  statuses: Array,
})

const statuses = ref(new StatusManagement())
console.log(`${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
  const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`)
  allTask.value.addDtoTasks(items)
  console.log(allTask.value.getTasks())
})


const successToast = ref(false)

const showModal = ref(false)

const taskInsert = ref('')




const task = ref({
  id: '',
  statusName: '',
  description: ''
})


const clearModal = (flagModal) => {
  task.value = {
    id: '',
    statusName: '',
    description: ''
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
        statusName: selectedTask.statusName,
        description: selectedTask.description
      }
    )

    taskInsert.value = selectedTask.title

    console.log(newTask)
    console.log(newTask.status.toString())
    allTask.value.addNewTask(
      newTask.id,
      newTask.statusName,
      newTask.description
    )

    showModal.value = false

    task.value = {
      id: '',
      statusName: '',
      description: ''
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
        statusName: selectedTask.statusName,
        description: selectedTask.description
      }
    )
    console.log(updatedTask)
    allTask.value.updateTask(
      updatedTask.id,
      updatedTask.statusName,
      updatedTask.description
    )

    showModal.value = false

    task.value = {
      id: '',
      statusName: '',
      description: ''
    }

    router.push('/task')
  }
}

const showEdit = async (id) => {
  router.push(`/task/${id}/edit`)
  const detail = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`,
    id
  )
  console.log(detail.item)
  task.value = await detail.item
  showModal.value = true
}

const openModal = () => {
  showModal.value = true
}




// const openModal = () => {
//   showModalStatus.value = true
// }

// const clearModal = () => {
//   showModalStatus.value = false
//   editStatus.value = false
// }

// const editModal = async () => {

//   editStatus.value = true

// }

const back = () => {
  router.go(-1)
}
</script>

<template>
  <h1 class="  text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
    IT-Bangmod Kradan Kanban SSI-3
  </h1>
  <div class=" flex justify-center">
    <div class=" flex justify-center items-center">
      <div class="rounded-xl p-5">

        <div class="text-left flex items-center justify-between">
          <div class="flex items-center">
            <h1 @click="back" class="text-2xl font-bold text-blue-500 mr-2 hover:underline">
              HOME
            </h1>
            <span class="mr-2"> > </span>
            <h1>Task Status</h1>
          </div>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            @click="openModal">
            Add Status
          </button>
        </div>

        <table class="w-full table table-lg rounded-lg overflow-hidden mt-5">
          <thead>
            <tr class="font-bold text-red-800 text-lg bg-pink-300">
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(status, index) in statuses.getStatuses()" :key="index" class="bg-blue-300 itbkk-item">
              <td class="text-white text-center font-semibold">
                {{ status.id }}
                <div class="dropdown dropdown-right dropdown-end"></div>
              </td>

              <td
                class="text-blue-800 hover:underline itbkk-status-name font-semibold transition-property: transition-property: transform;">
                {{ status.name }}
              </td>

              <td class="itbkk-status-description font-semibold text-white">
                {{ status.description }}
              </td>

              <td class="text-center">
                <button @click="editStatus" class="btn bg-slate-200 text-black itbkk-button-edit mr-2"
                  v-if="index !== 0">
                  Edit
                </button>

                <button @click="$emit('deleteStatus', status.id)" class="btn btn-error itbkk-button-delete ml-2 "
                  v-if="index !== 0">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>

  <Table :tasks="allTask.getTasks()" @editTask="showEdit" />

  <Teleport to="#modal">
    <div v-if="showModal">
      <StatusModal @cancelTask="clearModal" @saveTask="saveTask" />
    </div>
  </Teleport>

</template>

<style scoped></style>