<script setup>
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
            <th></th>
            <th>Title</th>
            <th>Assignees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in tasks"
            :key="index"
            class="bg-blue-300 itbkk-item"
          >
            <td class="text-white text-center font-semibold">
              {{ task.id }}
              <div class="dropdown dropdown-top">
                <div tabindex="0" role="button">
                  <img src="./icon/Threebtn.svg" />
                </div>
                <ul
                  class="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32"
                >
                  <li><a class="text-black">Edit</a></li>
                  <li><a class="text-red-600">Delete</a></li>
                </ul>
              </div>
            </td>
            <td
              class="text-blue-800 hover:underline itbkk-title font-semibold flex justify-center"
            >
              <RouterLink
                :to="{ name: 'taskDetail', params: { id: task.id } }"
                >{{ task.title }}</RouterLink
              >
            </td>
            <td
              class="itbkk-assignees font-semibold"
              :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
              :class="task.assignees ? 'text-white' : 'text-gray-500'"
            >
              {{ task.assignees ? task.assignees : 'Unassigned' }}
            </td>

            <td>
              <button
                class="badge itbkk-status w-24"
                :class="{
                  'badge-success': task.status === 'DONE',
                  'badge-warning': task.status === 'DOING',
                  'badge-info': task.status === 'TO_DO',
                }"
              >
                {{ changeFormatStatus(task.status) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
