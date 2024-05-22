<script setup>
import { defineProps, onMounted, ref } from 'vue'
import router from '@/router'
import Edit from './Edit.vue'
import { StatusManagement } from '@/libs/StatusManagement'
import {
  deleteItemById,
  getItemById,
  getItems,
  transferItem,
  addItem,
  editItem,
} from '@/libs/fetchUtils.js'
import DeleteStatus from './DeleteStatus.vue'
import TransferDelete from './TransferDelete.vue'
import StatusModal from './StatusModal.vue'
import Succes from './Succes.vue'
import Delete from './Delete.vue'
import Error from './Error.vue'
defineProps({
  statuses: Array,
})

defineEmits(['addStatus'])

const statuses = ref(new StatusManagement())

const insertStatus = ref('')

const taskCount = ref(0)

const statusEdit = ref('')

const deletedToast = ref(false)

const successToast = ref(false)

const errorToast = ref(false)

const deletedStatus = ref('')

const editToast = ref(false)
const status = ref({
  id: undefined,
  name: '',
  description: null,
  color: null,
})

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
  color: null,
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

  deletedStatus.value = status.item.name

  taskCount.value = task.length
  console.log(task.length)
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

  if (status === 204) {
    statuses.value.removeStatus(id)
    deleteModal.value = false
    deletedToast.value = true
    setTimeout(() => {
      deletedToast.value = false
    }, 3000)
  } else {
    statuses.value.removeStatus(id)
    deleteModal.value = false
    errorToast.value = true
    setTimeout(() => {
      errorToast.value = false
    }, 3000)
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
    deletedToast.value = true
    setTimeout(() => {
      deletedToast.value = false
    }, 3000)
  }else{
    statuses.value.removeStatus(id)
    deleteModal.value = false
    errorToast.value = true
    setTimeout(() => {
      errorToast.value = false
    }, 3000)
  }
}

const editModal = ref(false)

const editStatus = async (id) => {
  const item = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
    id
  )

  status.value = await item.item
  console.log(status)
  editModal.value = true
}

const addStatus = () => {
  status.value = {
    id: undefined,
    name: '',
    description: null,
    color: null,
  }
  editModal.value = true
}

const saveStatus = async (status) => {
  console.log(status)
  const item = {
    name: status.name,
    description: status.description,
    color: status.color,
  }
  if (status.id === undefined) {
    const newStatus = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
      item
    )
    console.log(newStatus)
    console.log(newStatus.status)

    if (newStatus.status === 500) {
      status.value = {
        id: undefined,
        name: '',
        description: null,
        color: null,
      }
      editModal.value = false
      return
    } else {
      statuses.value.addStatus(
        newStatus.id,
        newStatus.name,
        newStatus.description,
        newStatus.color
      )
      insertStatus.value = status.name
      editModal.value = false

      status.value = {
        id: undefined,
        name: '',
        description: null,
        color: null,
      }
      successToast.value = true
      setTimeout(() => {
        successToast.value = false
      }, 3000)
    }
  } else {
    const updatedStatus = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`,
      status.id,
      item
    )
    statusEdit.value = status.name
    console.log(updatedStatus)
    statuses.value.updateStatus(
      updatedStatus.id,
      updatedStatus.name,
      updatedStatus.description,
      updatedStatus.color
    )
    editToast.value = true
    editModal.value = false
    setTimeout(() => {
      editToast.value = false
    }, 3000)
    status.value = {
      id: undefined,
      name: '',
      description: null,
      color: null,
    }
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
              class="text-2xl font-bold text-blue-500 mr-2 hover:underline itbkk-button-home"
            >
              HOME
            </h1>
            <span class="mr-2 font-semibold text-2xl px-2"> > Task Status</span>
          </div>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded itbkk-button-add"
            @click="addStatus"
          >
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
                class="text-blue-800 hover:underline itbkk-status-name font-semibold transition-property: transition-property: transform; itbkk-status-name"
              >
                {{ status.name }}
              </td>

              <td
                v-if="status.description"
                class="itbkk-status-description font-semibold text-white itbkk-status-description"
              >
                {{ status.description }}
              </td>
              <td
                v-else
                class="itbkk-status-description font-semibold italic text-gray-500"
              >
                No description provided
              </td>

              <td class="text-center">
                <button
                  @click="editStatus(status.id)"
                  class="btn btn-sm bg-slate-200 text-black itbkk-button-edit mr-2"
                  v-if="status.name !== 'No Status' && status.name !== 'Done' "
                >
                  Edit
                </button>
                <button
                  @click="deleteStatus(status.id)"
                  class="btn btn-sm btn-error itbkk-button-delete ml-2"
                  v-if="status.name !== 'No Status' && status.name !== 'Done'"
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
  <Succes
    v-if="successToast"
    :insertStatus="insertStatus"
    @closeToast="successToast = false"
  />
  <Delete
    v-if="deletedToast"
    :statusDelete="deletedStatus"
    @closeToast="deletedToast = false"
  />
  <Error v-if="errorToast" :status="true" @closeToast="errorToast = false" />
  <Edit
    v-if="editToast"
    :statusEdit="statusEdit"
    @closeToast="editToast = false"
  />
  <Teleport to="#modal">
    <div v-if="editModal">
      <StatusModal
        :status="status"
        @closeModal="editModal = false"
        @saveStatus="saveStatus"
      />
    </div>
  </Teleport>

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
        :taskCount="taskCount"
        :status="statusToDelete"
        :statuses="statuses.getStatuses()"
        @deleteStatus="transferStatus"
        @closeDeleteModal="transDelete = false"
      />
    </div>
  </Teleport>
</template>

<style scoped></style>
