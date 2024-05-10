<script setup>
import { defineProps, onMounted, ref } from 'vue'
import router from '@/router'
import { TaskManagement } from '../libs/TaskManagement.js'
import { StatusManagement } from '@/libs/StatusManagement'
import { deleteItemById, getItemById, getItems, transferItem } from '@/libs/fetchUtils.js'
import DeleteStatus from './DeleteStatus.vue'
import TransferDelete from './TransferDelete.vue'
import StatusModal from './StatusModal.vue'
defineProps({
  statuses: Array,
})

defineEmits(['addStatus'])

const statuses = ref(new StatusManagement())

const editStatus = ref(false)

const clearModal = () => {
  editStatus.value = false
}

const editModal = async () => {
  
  editStatus.value = true
  
}

onMounted(async () => {
  const items = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
  )
  statuses.value.addStatuses(items)
  console.log(statuses.value.getStatuses())
})

const back = () => {
  router.go(-1)
}

const statusToDelete = ref({
  id: undefined,
  name: '',
  description: null,
})

const transDelete = ref(false)

const deleteStatus = async (id) => {
  console.log(id)

  const status = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
    id
  )
  const allTask = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/tasks`
  )
  const task = allTask.filter((task) => task.status.id === status.item.id)

  if (task.length > 0) {
    statusToDelete.value = status
    transDelete.value = true
  } else {
    statusToDelete.value = status
    deleteModal.value = true
  }
}

const deleteModal = ref(false)

const confirmDelete = async (id) => {
  const status = await deleteItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
    id
  )

  console.log(status)

  if (status === 200) {
    statuses.value.removeStatus(id)
    deleteModal.value = false
  }
}

const transferStatus = async (id, newId) => {
  const status = await transferItem(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
    id,
    newId
  )

  console.log(status)
  if (status === 200) {
    statuses.value.removeStatus(id)
    transDelete.value = false
  }
}
</script>

<template>
  <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
    IT-Bangmod Kradan Kanban SSI-3
  </h1>
  <div class="flex justify-center">
    <div class="flex justify-center items-center">
      <div class="rounded-xl p-5">
        <div class="text-left flex items-center justify-between">
          <div class="flex items-center">
            <h1
              @click="back"
              class="text-2xl font-bold text-blue-500 mr-2 hover:underline"
            >
              HOME
            </h1>
            <span class="mr-2 font-semibold text-2xl px-2"> > 
          Task Status</span>
          </div>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            @click="$emit('addStatus')"
          >
            Add Status
          </button>
        </div>

        <table class="w-full table table-lg rounded-lg overflow-hidden mt-5">
          <thead>
            <tr class="font-bold text-red-800 text-lg bg-pink-300">
              <th></th>
              <th>Name</th>
              <th>Desciption</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(status, index) in statuses.getStatuses()"
              :key="index"
              class="bg-blue-300 itbkk-item"
            >
              <td class="text-white text-center font-semibold">
                {{ index + 1 }}
                <div class="dropdown dropdown-right dropdown-end"></div>
              </td>

              <td
                class="text-blue-800 hover:underline itbkk-status-name font-semibold transition-property: transition-property: transform;"
              >
                {{ status.name }}
              </td>

              <td class="itbkk-status-description font-semibold text-white">
                {{ status.description }}
              </td>

              <td class="text-center">
                <button
                  @click="editModal"
                  class="btn bg-slate-200 text-black itbkk-button-edit mr-2"
                  v-if="index !== 0"
                >
                  Edit
                </button>
                <button
                  @click="deleteStatus(status.id)"
                  class="btn btn-error itbkk-button-delete ml-2"
                  v-if="index !== 0"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Teleport to="#modal"> </Teleport>

  <Teleport to="#modal">
    <div v-if="deleteModal">
      <DeleteStatus
        :status="statusToDelete"
        @closeDeleteModal="deleteModal = false"
        @deleteStatus="confirmDelete"
      />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="transDelete">
      <TransferDelete
        :status="statusToDelete"
        :statuses="statuses.getStatuses()"
        @deleteStatus="transferStatus"
        @closeDeleteModal="transDelete = false"
      />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="editStatus">
        <StatusModal  @cancelTask="clearModal" @saveTask="saveTask">
          
        
        
        </StatusModal>
      </div>
  </Teleport>
</template>

<style scoped></style>
