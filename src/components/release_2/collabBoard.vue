<script setup>
import {  defineProps, onMounted, ref , watch} from 'vue'
import {  useRouter } from 'vue-router'
import { deleteItemById, getItemById} from '@/libs/fetchUtils.js'
import {  addCollab, getCollabs , getUserBoard ,changeAccessRight} from '@/libs/fetchUtils_release2'
import { jwtDecode } from 'jwt-decode'
import Succes from '../Succes.vue'
import Delete from '../Delete.vue'
import Error from '../Error.vue'
import CollabModal from './collabModal.vue'
import ChangeAccessRight from './EditDeleteModal.vue'
import EditDeleteModal from './EditDeleteModal.vue'
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

const ownerEmail = ref('')

const collabModal = ref(false)

const collab = ref([])

const fullName = ref('')

const readOnly = ref(false)

const isOwner = ref(false)

const deleteCollabModal = ref(false)
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
  const token = localStorage.getItem('accessToken');
  isAuthenticated.value = !!token;
 

  decoded()

  const userBoard = await getUserBoard(
        `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}`, token
      )

      if(fullName.value === userBoard.board.owner.name){
        isOwner.value = true
      }
      if(userBoard.board.accessRight === 'READ'){
        readOnly.value = true
      }
  // ดึงข้อมูล board
  const board = await getItemById(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, props.boardId);
  console.log(board);
  boardname.value = board.item.boardName;
  ownerEmail.value = board.item.owner.email
  console.log(ownerEmail.value);
  
  // ดึงข้อมูล collaborators
  const collaborators = await getCollabs(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs`, token);
  console.log(collaborators);
  
  collab.value = collaborators.showCollabDTOS;
  console.log(collab.value);

});


const back = () => {
  router.push(`/board/${props.boardId}`)
}




const addCollabModal = () => {
  collabModal.value = true
}

const emailInsert = ref('')

const saveCollab = async (newItem) => {
  console.log(newItem);
  emailInsert.value = newItem.email
  console.log(emailInsert.value);
  
  const item = {
    email: newItem.email,
    accessRight: newItem.accessRight,
  };
  try {
    // ส่งคำขอเพิ่ม collaborator ใหม่ผ่าน API
    const response = await addCollab(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs`, item
    );
    console.log(response);

    if (response.status === 201) {
      // สถานะ 201: เพิ่มสำเร็จ ปิด modal และอัปเดตตาราง
      collabModal.value = false;
      console.log("Before setting successToast:", successToast.value);
      successToast.value = true; // เปลี่ยนค่าให้ Toast แสดงผล
      console.log("After setting successToast:", successToast.value);
      console.log(collab.value);
      
      // อัปเดต collab ด้วยข้อมูลใหม่ที่ได้จาก API
      collab.value = response.collab.collaborators.map(collaborator => ({
      oid: collaborator.oid,
      name: collaborator.name,
      email: collaborator.email,
      access_right: collaborator.access_right,
      added_on: collaborator.added_on,
    }));
    console.log(collab.value);
      setTimeout(() => {
        successToast.value = false;
      }, 3000);
    } else if (response.status === 401) {
      alert("You are not authorized. Please log in again.");
    } else if (response.status === 403) {
      alert("You do not have permission to add board collaborator.");
      collabModal.value = false;
    } else if (response.status === 404) {
      alert("The user does not exist.");
    } else if (response.status === 409) {
      alert("The user is already a collaborator of this board.");
    } else if (response.status === 500) {
      alert("There is a problem. Please try again later.");
      collabModal.value = false;
    } else {
      collabModal.value = false;
    }
  } catch (error) {
    console.error("Error adding collaborator:", error);
    alert("An error occurred while adding the collaborator.");
    collabModal.value = false;
  }
};
const changeAccessModal = ref(false)

const collabName = ref('')
const currentAccessRight = ref('')
const changeAccess = (name, accessRight , oid) => {  
  console.log('Change Access for:', name, 'Current Access Right:', accessRight , 'Owner Id:' , oid);
  collabName.value = name
  currentAccessRight.value = accessRight
  changeAccessModal.value = true
  collabOid.value = oid
  console.log('Change Access for:', collabName.value, 'Current Access Right:', currentAccessRight.value , 'Owner Id:' , collabOid.value);
}


const saveChange = async (newAccess) => {

  console.log(newAccess);
  
  try {
    // ส่งข้อมูลไปยัง API
    const response = await changeAccessRight(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs/${newAccess.collabOid}`,
      newAccess
    );
    console.log(response);
    
    // ตรวจสอบสถานะการตอบกลับจาก API
    if (response.status === 200) {
      // ถ้าการบันทึกสำเร็จ ให้ปิด modal และแสดงข้อความสำเร็จ
      console.log("Access right updated successfully");
      console.log(collab.value);
      changeAccessModal.value = false;

      // อัปเดตข้อมูลของ collab โดยตรง

      const updatedCollab = response.accessRight;  // สมมุติว่า response ส่งข้อมูล collaborator กลับมา

      
      const collabToUpdate = collab.value.find(c => c.oid === newAccess.collabOid);
      if (collabToUpdate) {
        collabToUpdate.access_right = updatedCollab.accessRight;  // อัปเดตข้อมูล access_right
      }

      console.log(collab.value);
      
      alert('Access rights updated successfully!');
    }else if (response.status === 401) {
      alert("You are not authorized. Please log in again.");
    } else if (response.status === 403) {
      alert("You do not have permission to change collaborator access right.");
      collabModal.value = false;
    } else {
      alert("There is a problem. Please try again later.");
      collabModal.value = false;
    }
  } catch (error) {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้นในระหว่างการเรียก API
    console.error('Error in saveChange:', error);
  }

  // ล็อกค่า newAccess
  console.log(newAccess);
};

const collabOid = ref('')

const closeModal = () => {
  collabModal.value = false
  changeAccessModal.value = false
  deleteCollabModal.value = false
  router.push(`/board/${props.boardId}/collab`)
}

watch(emailInsert,(newEmail) => {
  console.log(newEmail);
  
}) 



watch(collab,(newAccess) => {
  console.log(newAccess);
})


const removeCollab = (oid , name) => {
  deleteCollabModal.value = true
  collabName.value = name
  collabOid.value = oid
  console.log('Change Access for:', collabName.value, 'Current Access Right:', currentAccessRight.value , 'Owner Id:' , collabOid.value);
}

const confirmRemove = async (removeCollab) => {
  try {
    // ส่งข้อมูลไปยัง API
    const response = await deleteItemById(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/collabs`,
      removeCollab
    );
    console.log(response);
    

    if (response === 200) {

      collab.value = collab.value.filter(c => c.oid !== removeCollab);
      console.log(collab.value);
      deleteCollabModal.value = false;


      alert('Delete collaborator successfully!');
    } else if (response === 401) {
      alert("You are not authorized. Please log in again.");
    } else if (response === 403) {
      alert("You do not have permission to remove collaborator.");
      collabModal.value = false;
    } else if (response === 404) {
      // ใช้ removeCollab เพื่อแสดงข้อมูลในข้อความ
      const removedCollab = collab.value.find(c => c.oid === removeCollab);
      const collabName = removedCollab ? removedCollab.name : 'The user';
      alert(`${collabName} is not a collaborator.`);
    }  else {
      alert("There is a problem. Please try again later.");
      collabModal.value = false;
    }
  } catch (error) {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้นในระหว่างการเรียก API
    console.error('Error in saveChange:', error);
    alert('An error occurred while delete collaborator. Please try again.');
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
              class="text-2xl font-bold text-blue-500 mr-2 hover:underline itbkk-board-name"
            >
              {{ boardname}}
            </h1>
            <span class="mr-2 font-semibold text-2xl px-2"> > Collaborator</span>
          </div>
          <button
            class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded itbkk-collaborator-add"
            @click="addCollabModal"
            :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || !isOwner || readOnly }"
            :disabled="!isAuthenticated || !isOwner || readOnly"
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
              <button @click="changeAccess(collaborator.name, collaborator.access_right , collaborator.oid)">
              <td class="font-semibold italic text-gray-500 itbkk-access-right">
                {{ collaborator.access_right }}
              </td>
            </button>
              <td class="text-center">
                <button
                  class="bg-red-500 text-white text-sm py-2 px-4 rounded ml-2 itbkk-collab-remove"
                  :class="{ 'cursor-not-allowed opacity-50': !isAuthenticated || !isOwner || readOnly }"
                  @click="removeCollab(collaborator.oid , collaborator.name)"
                  :disabled="!isAuthenticated || !isOwner || readOnly"
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
    :collab-insert="emailInsert"
    @closeToast="successToast = false"
  />
  <Delete
    v-if="deletedToast"
    @closeToast="deletedToast = false"
  />
  <Error
    v-if="errorToast"
    @closeToast="errorToast = false"
  />

  <Teleport to="#modal">
    <div v-if="collabModal">
      <CollabModal
        :email="ownerEmail"
        @closeModal="closeModal"
        @addCollab="saveCollab"
      />
    </div>
  </Teleport>

  <Teleport to="#modal">
    <div v-if="changeAccessModal || deleteCollabModal ">
      <EditDeleteModal
        :edit="changeAccessModal"
        :delete="deleteCollabModal"
        :name="collabName"
        :accessRight="currentAccessRight"
        :collabOid="collabOid"
        @closeModalAccess="closeModal"
        @confirm="saveChange"
        @closeModalDelete="closeModal"
        @confirmDelete="confirmRemove"
      />
    </div>
  </Teleport>

</template>

<style scoped>
</style>
