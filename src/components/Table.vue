<script setup>
import { defineProps, ref } from 'vue';
defineProps({
  tasks: Array,
})

const changeFormatStatus = (status) => {
  switch (status) {
    case 'TO_DO':
      return 'To Do'
    case 'DOING':
      return 'Doing'
    case 'DONE':
      return 'Done'
    case 'NO_STATUS':
      return 'No Status'
  }
}


const isModalOpen = ref(false);
const newTask = ref({
  title: '',
  description: '',
  assignees: '',
  status: 'NO_STATUS'
});

const openModal = () => {
  console.log("Opening modal");
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveTask = async () => {
  if (!newTask.value.title.trim()) {
    alert('Title is required!');
    return;
  }

  try {
    const response = await axios.post('/api/tasks', newTask.value);

    if (response.status === 201) {
      alert('The task has been successfully added');


      newTask.value = {
        title: '',
        description: '',
        assignees: '',
        status: 'NO_STATUS'
      };

      closeModal();
    } else {
      alert('There was a problem adding the task');
    }
  } catch (error) {
    console.error('Error saving task:', error);
    alert('There was an error while saving the task');
  }
};

const cancelTask = () => {
  console.log('cancel')
  window.history.back();
};

</script>

<template>
  <div class="w-full flex justify-center items-center">
    <div class="rounded-xl p-5">
      <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold">
        IT-Bangmod Kradan Kanban SSI-3
      </h1>
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300">
            <th><img src="./icon/InsertBtn.svg" alt="Add Task" @click="openModal" class="cursor-pointer" /></th>
            <th>Title</th>
            <th>Assignees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks" :key="index" class="bg-blue-300 itbkk-item">
            <td class="text-white text-center font-semibold">
              {{ task.id }}
              <div class="dropdown dropdown-top">
                <div tabindex="0" role="button">
                  <img src="./icon/Threebtn.svg" />
                </div>
                <ul class="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32">

                  <li><a class="text-black">Edit</a></li>
                  <li><a class="text-red-600">Delete</a></li>
                </ul>
              </div>
            </td>
            <td class="text-blue-800 hover:underline itbkk-title font-semibold flex justify-center">
              <RouterLink :to="{ name: 'taskDetail', params: { id: task.id } }">{{ task.title }}</RouterLink>
            </td>
            <td class="itbkk-assignees font-semibold" :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
              :class="task.assignees ? 'text-white' : 'text-gray-500'">
              {{ task.assignees ? task.assignees : 'Unassigned' }}
            </td>

            <td>
              <button class="badge itbkk-status w-24" :class="{
                'badge-success': task.status === 'DONE',
                'badge-warning': task.status === 'DOING',
                'badge-info': task.status === 'TO_DO',
              }">
                {{ changeFormatStatus(task.status) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black opacity-5"></div>
        <div class="bg-white rounded-lg p-8 max-w-md dark:bg-gray-700">
          <button @click="closeModal" class="absolute top-0 right-0 p-2">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h2>
          </div>
          <form class="p-4 md:p-5">
            <div class="grid gap-4 mb-4 grid-cols-2">
              <div class="col-span-2">
                <label for="taskTitle"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                <input id="taskTitle" type="text" v-model="newTask.title"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"required="">
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label for="Assignees"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assignees</label>
                <input id="taskAssignees"type="text" v-model="newTask.assignees"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              </div>
              <div class="col-span-2 sm:col-span-1 dropdown dropdown-top">
                <label for="Status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status:</label>
                <select v-model="newTask.status"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option value="NO_STATUS">No Status</option>
                  <option value="TO_DO">To Do</option>
                  <option value="DOING">Doing</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div class="col-span-2">
                <label for="Description"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea v-model="newTask.description"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                </textarea>
              </div>
            </div>
            <div class="flex justify-end">
              <button @click="saveTask" class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 "
                :disabled="!newTask.title.trim()">Save</button>
              <button @click="cancelTask" class="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>