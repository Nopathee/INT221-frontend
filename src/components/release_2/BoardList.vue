<script setup>
import { ref, onMounted, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import router from '@/router';
import { createNewBoard , getCollabs } from '@/libs/fetchUtils_release2'
import EditDeleteModal from './EditDeleteModal.vue';
import { deleteItemById } from '@/libs/fetchUtils';
const addBoardModal = ref(false)
const showBoard = ref(false)
const boardName = ref('')
const fullName = ref('');
const personalBoards = ref([]);
const collabBoards = ref([]); // เก็บข้อมูล collab boards
const showPersonalboard = ref(false)
const showCollabBoard = ref(false)
const boardData = ref([])
onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = jwtDecode(token);
    fullName.value = decoded.name;
    boardName.value = `${fullName.value} personal board`
    // ดึงข้อมูล boards เมื่อ component ถูก mount
    await fetchBoards();
  } else {
    console.error("Error fetching boards: Unauthorized");
    router.push('/login');
  }
});

const fetchBoards = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    
    // แยก personal boards และ collab boards
    personalBoards.value = data.personalBoards.sort((a, b) => new Date(a.created_on) - new Date(b.created_on)); // เรียงลำดับจากวันที่สร้าง
    collabBoards.value = data.collabBoards.sort((a, b) => new Date(a.added_on) - new Date(b.added_on)); // เรียงลำดับจากวันที่เพิ่ม
    console.log(data);
    boardData.value = data
    console.log(personalBoards.value);
    showPersonalboard.value = data.personalBoards && data.personalBoards.length > 0;
    showCollabBoard.value = data.collabBoards && data.collabBoards.length > 0;

  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};


const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  router.push('/login');
};

const goToBoard = (boardId) => {
  router.push(`/board/${boardId}`);
};

const findCollabOid = (collaborators, fullname) => {
  // ค้นหา collaborator ที่มีชื่อตรงกับ fullname
  const collab = collaborators.find(c => c.name === fullname);

  // ถ้าพบ collaborator ที่มีชื่อตรงกับ fullname ให้คืนค่า oid
  if (collab) {
    return collab.oid;
  } else {
    console.log('Collaborator not found.');
    return null;
  }
};

const leaveBoard = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("No access token found");
    return;
  }
  console.log(leaveOid.value);
  console.log(leaveBoardId.value);

  
  
  try {
    // ใช้ DELETE method สำหรับการออกจาก board
    const response = await deleteItemById(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${leaveBoardId.value}/collabs`, leaveOid.value )

    console.log(response);
    
    if (response === 200) {
      // ทำการอัพเดต collabBoards หลังจากออกจาก board
      collabBoards.value = collabBoards.value.filter(board => board.id !== leaveBoardId.value);
      leaveBoardModal.value = false
      console.log(`Successfully left the board with ID: ${leaveBoardId.value}`);
      alert(`Successfully left the board with ID: ${leaveBoardId.value}`)
    } else {
      console.error("Error leaving the board:", response);
    }
  } catch (error) {
    console.error("Error leaving the board:", error);
  }
};

const leaveBoardModal = ref(false)

const leaveBoardId = ref('')

const leaveOid = ref('')

const leaveBoardName = ref('')

const showLeaveModal = async (boardId , name , boardName) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error("No access token found");
    return;
  }
  leaveBoardName.value = boardName
  console.log(leaveBoardName.value);
  

  leaveBoardModal.value = true
  console.log(leaveBoardModal.value);
  const fullName = name
  const collaborators = await getCollabs(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${boardId}/collabs`, token);
  console.log(collaborators);
  const collabOid = findCollabOid(collaborators.showCollabDTOS, fullName);
  console.log(fullName);
  console.log(boardData.value.collabBoards);
  
  const selectedBoardId = findBoardIdByName(boardData.value.collabBoards, boardName)
  console.log(selectedBoardId);
  
  console.log(collabOid);
  leaveBoardId.value = selectedBoardId
  leaveOid.value = collabOid
}

const addBoard = () => {
  addBoardModal.value = true
}

const closeModal = () => {
  addBoardModal.value = false
  
}

const findBoardIdByName = (boardData, boardName) => {
  console.log(boardData);
  console.log(boardName);

  
  const board = boardData.find((board) => board.boardName === boardName);
  return board ? board.id : null; 
};

const closeModalLeave = () => {
  leaveBoardModal.value = false
  console.log('test');
  
}

const createBoard = async () => {
  const token = localStorage.getItem('accessToken')
  console.log(token)
  try {
    console.log(boardName.value)
    const response = await createNewBoard(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, token, boardName.value)
    console.log(response.status)
    if (response.status === 201) {
      const newBoard = response.board
      console.log(newBoard.name)
      console.log(newBoard)
      if (newBoard) {
        router.push({
          name: 'emptyboard',
          params: { boardId: newBoard.id },
        })
      }
      console.log(newBoard.value)
    } else if (response.status === 401) {
      console.error('Unauthorized, redirecting to login');
      router.push('/login');
    } else {
      router.push('/login')
    }
  } catch (err) {
    console.error('Error creating board:', err);
  }
  closeModal();
};


</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="w-full flex flex-wrap items-center justify-between mx-auto p-4">
      <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
        IT-Bangmod Kradan Kanban SSI-3
      </h1>
      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 pt-7">
        <ul
          class="flex flex-col font-medium md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8  md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <details class="dropdown">
              <summary v-if="fullName"
                class="inline-flex items-center font-medium justify-center px-4 py-2 text-xl text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white itbkk-fullname">
                {{ fullName }}
              </summary>
              <ul
                class="p-2 shadow menu dropdown-content z-[1] bg-red-600 rounded-box w-full text-center my-2 text-black">
                <li>
                  <button @click="logout" class="flex justify-center">
                    logout
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="text-center p-5 text-4xl font-semibold itbkk-personal-board">
      <p>Personal Boards</p>
    </div>
  <div v-if="showPersonalboard">
    <div class="pl-10 pr-10">
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300 text-center">
            <th class="w-1/12"> No</th>
            <th class="w-8/12">Name</th>
            <th class="w-3/12">Visibility</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(board, index) in personalBoards" :key="board.id" class="bg-blue-300">
            <td class="text-center text-black">{{ index + 1 }}</td>
            <td class="text-black hover:underline font-semibold cursor-pointer" @click="goToBoard(board.id)">
              {{ board.boardName }}
            </td>
            <td class="text-center font-semibold">
              <span
                :class="{ 'text-black': board.visibility === 'private', 'text-green-500': board.visibility === 'public' }">
                {{ board.visibility.toUpperCase() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="!showPersonalboard">
    <div class="flex justify-center p-10" v-show="!showBoard">
      <button @click="addBoard"
      class="p-3 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 itbkk-button-create">
        Create personal board</button>
    </div>
    <div v-if="addBoardModal" class="w-full h-full flex justify-center itbkk-modal-new">
      <div class="bg-white w-2/5 h-60 rounded-3xl p-5 modal-box">
        <h3 class="text-lg font-bold text-black">New Board</h3>
        <p class="py-4 text-black ">Name</p>
        <input type="text" class="bg-white border w-full text-black itbkk-board-name" maxlength="120"
          v-model="boardName">
        <div class="modal-action">
          <button @click="createBoard" class="btn bg-green-500 text-black itbkk-button-ok">Submit</button>
          <button @click="closeModal" class="btn bg-slate-800 text-white itbkk-cancel">Close</button>
        </div>
      </div>
    </div>
  </div>
    <div v-if="showCollabBoard === true">
    <div class="text-center p-5 text-4xl font-semibold itbkk-personal-board">
      <p>Collab Boards</p>
    </div>
    <div class="pl-10 pr-10">
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300 text-center">
            <th class="w-1/12"> No</th>
            <th class="w-8/12">Name</th>
            <th class="w-3/12">Owner</th>
            <th class="w-3/12">Access Right</th>
            <th class="w-3/12">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(board, index) in collabBoards" :key="board.id" class="bg-blue-300 font-semibold text-black">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="hover:underline font-semibold cursor-pointer" @click="goToBoard(board.id)">
              {{ board.boardName }}
            </td>
            <td class="text-center">{{ board.owner.name }}</td>
            <td class="text-center">{{ board.accessRight }}</td>
            <td>
              <button @click="showLeaveModal(board.id , fullName , board.boardName)" class=" hover:underline bg-red-500 rounded-lg px-4 py-2">
                Leave
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Teleport to="#modal">
    <div v-if="showLeaveModal">
      <EditDeleteModal
        :leave="leaveBoardModal"
        :boardName="leaveBoardName"
        @closeModalLeave="closeModalLeave"
        @confirmLeave="leaveBoard"
      />
    </div>
  </Teleport>

</template>

<style scoped></style>