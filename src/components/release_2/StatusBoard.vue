<script setup>
import { defineProps, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Edit from '../Edit.vue'
import { StatusManagement } from '@/libs/StatusManagement'
import {
  deleteItemById,
  getItemById,
  getItems,
  transferItem,
  addItem,
  editItem,
} from '@/libs/fetchUtils.js'
import DeleteStatus from '../DeleteStatus.vue'
import TransferDelete from '../TransferDelete.vue'
import StatusBoardModal from './StatusBoardModal.vue'
import { getUserBoard } from '@/libs/fetchUtils_release2'
import Succes from '../Succes.vue'
import Delete from '../Delete.vue'
import Error from '../Error.vue'
import { jwtDecode } from 'jwt-decode'

const props = defineProps({
  statuses: Array,
  id: String,
  item: Object,
  notFound: Boolean,
  boardId: String,
  statusId: String
})

defineEmits(['addStatus'])

const router = useRouter()

const statuses = ref(new StatusManagement())

const insertStatus = ref('')

const taskCount = ref(0)

const statusEdit = ref('')

const deletedToast = ref(false)

const successToast = ref(false)

const errorToast = ref(false)

const deletedStatus = ref('')

const statusNotFound = ref(false)

const editToast = ref(false)

const isAuthenticated = ref(false)

const isOwner = ref(false)

const readOnly = ref(false)

const fullName = ref('')

const status = ref({
  id: undefined,
  name: '',
  description: null,
  color: '#ffffff',
})



const decoded = () => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    const decoded = jwtDecode(token)
    console.log(decoded);
    fullName.value = decoded.name
    console.log(fullName.value)
  } else {
    fullName.value = 'Guest'
  }
}

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  isAuthenticated.value = !!token
  const items = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`
  )
  console.log(items)
  statuses.value.addStatuses(items)
  const board = await getUserBoard(
        `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}`, token
  )
  decoded()

  if(fullName.value === board.board.owner.name){
        isOwner.value = true
      }
      if(board.board.accessRight === 'READ'){
        readOnly.value = true
      }
})

const back = () => {
  router.push(`/board/${props.boardId}`)
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
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
    id
  )
  const allTask = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/tasks`
  )
  const task = allTask.filter((task) => task.status.id === status.item.id)
  console.log(status.item.name)
  deletedStatus.value = status.item.name

  taskCount.value = task.length
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
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
    id
  )

  if (status === 200) {
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
      errorDelete.value = false
    }, 3000)
  }
}

const transferStatus = async (id, newId) => {
  const status = await transferItem(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
    id,
    newId
  )

  if (status === 200) {
    statuses.value.removeStatus(id)
    transDelete.value = false
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

const editModal = ref(false)

const editStatus = async (id) => {
  const item = await getItemById(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
    id
  )
  router.push(`/board/${props.boardId}/status/${id}/edit`)
  if (item.status === 404) {
    notFound.value = true
    errorToast.value = true
    setTimeout(() => {
      errorToast.value = false
      notFound.value = false
    }, 3000)
    router.push(`/boards/${props.boardId}/status`)
  }
  status.value = await item.item
  editModal.value = true
}

const addStatus = () => {
  status.value = {
    id: undefined,
    name: '',
    description: null,
    color: '#ffffff',
  }
  editModal.value = true
}

const saveStatus = async (status) => {
  const item = {
    name: status.name,
    description: status.description,
    color: status.color,
  }
  if (status.id === undefined) {
    const newStatus = await addItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
      item
    )

    if (newStatus.status === 500) {
      status.value = {
        id: undefined,
        name: '',
        description: null,
        color: '#ffffff',
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
        color: '#ffffff',
      }

      router.push(`/board/${props.boardId}/status`)

      successToast.value = true
      setTimeout(() => {
        successToast.value = false
      }, 3000)
    }
  } else {
    const updatedStatus = await editItem(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
      status.id,
      item
    )
    statusEdit.value = status.name
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
      color: '#ffffff',
    }

    router.push(`/board/${props.boardId}/status`)
  }
}

const closeEditModal = () => {
  editModal.value = false
  router.push(`/board/${props.boardId}/status`)
}

if (props.notFound) {
  statusNotFound.value = true
  errorToast.value = true
  setTimeout(() => {
    errorToast.value = false
    notFound.value = false
  }, 3000)
  router.push(`/board/${props.boardId}/status`)
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
            :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || !isOwner || readOnly }"
            :disabled="!isAuthenticated || !isOwner || readOnly "
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
                class="text-blue-800 hover:underline itbkk-status-name font-semibold transition-property: transition-property: transform;"
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
                No description is provided
              </td>

              <td class="text-center">
                <button
                  @click="editStatus(status.id)"
                  class="bg-slate-200 text-black text-sm py-2 px-4 rounded mr-2 itbkk-button-edit"
                  v-if="status.name !== 'No Status' && status.name !== 'Done'"
                   :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || !isOwner || readOnly }"
                  :disabled="!isAuthenticated || !isOwner || readOnly "
                >
                  Edit
                </button>
                <button
                  @click="deleteStatus(status.id)"
                  class="bg-red-500 text-white text-sm py-2 px-4 rounded ml-2 itbkk-button-delete"
                  v-if="status.name !== 'No Status' && status.name !== 'Done'"
                  :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated  || !isOwner || readOnly }"
                  :disabled="!isAuthenticated || !isOwner || readOnly "
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
  <Error
    v-if="errorToast"
    :notFound="statusNotFound"
    :status="true"
    @closeToast="errorToast = false"
  />
  <Edit
    v-if="editToast"
    :statusEdit="statusEdit"
    @closeToast="editToast = false"
  />
  <Teleport to="#modal">
    <div v-if="editModal">
      <StatusBoardModal
        :status="status"
        :allStatuses="statuses.getStatuses()"
        @closeModal="closeEditModal"
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

<style scoped>
</style>
