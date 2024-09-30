<script setup>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import router from '@/router';
import { getUserBoard, createNewBoard } from '@/libs/fetchUtils_release2';

const fullName = ref('');
const addBoardModal = ref(false);
const showBoard = ref(false);
const boardName = ref('');


onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  console.log(token);

  if (token) {
    const decoded = jwtDecode(token);
    fullName.value = decoded.name;
    boardName.value = `${fullName.value}'s personal board`;
    console.log(fullName.value);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response.status);

      if (response.status === 401) {
        console.error("Unauthorized, redirecting to login");
        router.push('/login');
      } else {
        const data = await response.json();
        if (data && data.length > 0) {
          console.log(data);
          router.push(`/board/${data[0].boardId}`);
        } else {
          router.push('/board');
        }
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      router.push('/login');
    }
  } else {
    console.error("Error fetching boards:", error);
    router.push('/login');
  }
});

const logout = () => {
  localStorage.removeItem('accessToken');
  router.push('/login');
};

const addBoard = () => {
  addBoardModal.value = true;
};

const closeModal = () => {
  addBoardModal.value = false;
  boardName.value = '';
};

const createBoard = async () => {
  const token = localStorage.getItem('accessToken');
  console.log(token);

  try {
    console.log(boardName.value);
    const response = await createNewBoard(`${import.meta.env.VITE_API_ENDPOINT}/v3/boards`, token, boardName.value);
    console.log(response.status);

    if (response.status === 201) {
      const newBoard = response.board;
      console.log(newBoard.name);
      console.log(newBoard);

      if (newBoard) {
        router.push({
          name: 'emptyboard',
          params: { boardId: newBoard.id },
        });
        localStorage.setItem('boardName', boardName.value);
      }
      console.log(boardName.value);
    } else if (response.status === 401) {
      console.error('Unauthorized, redirecting to login');
      router.push('/login');
    } else {
      router.push('/login');
    }
  } catch (err) {
    console.error('Error creating board:', err);
  }

  closeModal();
};
</script>

<template>
  <nav v-if="!showBoard" class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="w-full flex flex-wrap items-center justify-between mx-auto p-4">
      <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
        IT-Bangmod Kradan Kanban SSI-3
      </h1>
      <div class="flex justify-between items-center w-full md:w-auto md:order-1 pt-7">
        <ul
          class="flex flex-col font-medium md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <details class="dropdown">
              <summary v-if="fullName"
                class="inline-flex items-center font-medium justify-center px-4 py-2 text-xl text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white itbkk-fullname">
                {{ fullName }}
              </summary>
              <ul
                class="p-2 shadow menu dropdown-content z-[1] bg-red-600 rounded-box w-full text-center my-2 text-black">
                <li>
                  <button @click="logout" class="flex justify-center">logout</button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="flex justify-center p-10" v-show="!showBoard">
    <button @click="addBoard" class="bg-green-600 text-black p-3 rounded-lg text-xl font-semibold itbkk-button-create">
      Create personal board
    </button>
  </div>

  <div v-if="addBoardModal" class="w-full h-full flex justify-center itbkk-modal-new">
    <div class="bg-white w-2/5 h-60 rounded-3xl p-5 modal-box">
      <h3 class="text-lg font-bold text-black">New Board</h3>
      <p class="py-4 text-black">Name</p>
      <input type="text" class="bg-white border w-full text-black itbkk-board-name" maxlength="120" v-model="boardName">
      <div class="modal-action">
        <button @click="createBoard" class="btn bg-green-500 text-black itbkk-button-ok">Submit</button>
        <button @click="closeModal" class="btn bg-slate-800 text-white itbkk-cancel">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
