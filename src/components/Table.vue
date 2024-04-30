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
    default:
      return 'No status'
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
            </td>
            <td class="text-blue-800 hover:underline itbkk-title font-semibold">
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
