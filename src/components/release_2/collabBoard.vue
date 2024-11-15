<script setup>
import {  defineProps, onMounted, ref } from 'vue'
import {  useRouter } from 'vue-router'

import {
  getItemById,
  getItems,
} from '@/libs/fetchUtils.js'
 
import { addCollab, getCollabs } from '@/libs/fetchUtils_release2'

import Succes from '../Succes.vue'
import Delete from '../Delete.vue'
import Error from '../Error.vue'
import CollabModal from './collabModal.vue'
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

const deletedToast = ref(false)

const successToast = ref(false)

const errorToast = ref(false)


const isAuthenticated = ref(false)

const boardname = ref('')


onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  isAuthenticated.value = !!token;

  // ดึงข้อมูล boards
  const items = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v3/boards`
  );
  
  // ดึงข้อมูล board
  const board = await getItemById(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, props.boardId);
  console.log(board);
  boardname.value = board.item.boardName;

  // ดึงข้อมูล collaborators
  const collaborators = await getCollabs(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs`, token);
  collab.value = collaborators.showCollabDTOS;
  console.log(collab.value);
  
});


const back = () => {
  router.push(`/board/${props.boardId}`)
}


// const confirmDelete = async (id) => {
//   const status = await deleteItemById(
//     `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`,
//     id
//   )
//   if (status === 200) {
//     statuses.value.removeStatus(id)
//     deleteModal.value = false
//     deletedToast.value = true
//     setTimeout(() => {
//       deletedToast.value = false
//     }, 3000)
//   } else {
//     statuses.value.removeStatus(id)
//     deleteModal.value = false
//     errorToast.value = true

//     setTimeout(() => {
//       errorToast.value = false
//       errorDelete.value = false
//     }, 3000)
//   }
// }

const collabModal = ref(false)


const addCollabModal = () => {
  collabModal.value = true
}

const saveCollab = async (newItem) => {
  const token = localStorage.getItem('accessToken')
  console.log(newItem);
  const item = {
    email: newItem.email,
    accessRight: newItem.accessRight,
  }

  try {
    // ทำการเพิ่ม collaborator ใหม่ผ่าน API
    const newCollab = await addCollab(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs`, token , item
    )
    if (!newCollab) {
      // กรณีเกิดข้อผิดพลาดในการเพิ่ม collaborator
      collabModal.value = false;
      return;
    }
    if (newCollab.status === 500) {
      // กรณีเกิดข้อผิดพลาดในการเพิ่ม collaborator
      collabModal.value = false
      return
    } else {
      // เมื่อเพิ่ม collaborator สำเร็จ ทำการปิด modal และแสดง toast แสดงความสำเร็จ
      collabModal.value = false
      successToast.value = true
      setTimeout(() => {
        successToast.value = false
      }, 3000)
    }
  } catch (error) {
    console.error("Error adding collaborator:", error)
    collabModal.value = false
  }
}

const closeModal = () => {
  collabModal.value = false
  router.push(`/board/${props.boardId}/collab`)
}

const collab = ref([])
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
              class="text-2xl font-bold text-blue-500 mr-2 hover:underline itbkk-board-name"
            >
              {{ boardname}}
            </h1>
            <span class="mr-2 font-semibold text-2xl px-2"> > Collaborator</span>
          </div>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded itbkk-collaborator-add"
            @click="addCollabModal"
            :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated }"
            :disabled="!isAuthenticated"
          >
            Add Collaborator
          </button>
        </div>

        <table class="w-full table table-lg rounded-lg overflow-hidden mt-5">
          <thead>
            <tr class="font-bold text-red-800 text-lg bg-pink-300">
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Access Right</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(collaborator, index) in collab" :key="collaborator.oid" class="bg-blue-300 itbkk-item">
              <td class="text-white text-center font-semibold">
                {{ index + 1 }}
              </td>
              <td class="text-blue-800 hover:underline font-semibold transition-property: transform; itbkk-name">
                {{ collaborator.name }}
              </td>
              <td class="font-semibold text-white itbkk-status-description itbkk-email">
                {{ collaborator.email }}
              </td>
              <td class="font-semibold italic text-gray-500 itbkk-access-right">
                {{ collaborator.access_right }}
              </td>
              <td class="text-center">
                <button
                  class="bg-red-500 text-white text-sm py-2 px-4 rounded ml-2 itbkk-collab-remove"
                  @click="deleteCollab(collaborator.oid)"
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

  <Teleport to="#modal">
    <div v-if="collabModal">
      <CollabModal
        @closeModal="closeModal"
        @addCollab="saveCollab"
      />
    </div>
  </Teleport>

</template>

<style scoped>
</style>
