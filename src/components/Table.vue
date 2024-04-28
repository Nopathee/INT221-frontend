<script setup>
defineProps({
  tasks: Array,
})
</script>

<template>
  <div class="w-full gap-5 p-5">
    <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold">
      IT-Bangmod Kradan Kanban SSI-3
    </h1>
    <div class="flex justify-center">
      <table class="w-3/4 table table-lg">
        <thead>
          <div class="bg-pink-300 rounded-xl w-full">
            <tr class="font-bold text-red-800 text-lg">
              <th></th>
              <th>Title</th>
              <th>Assignees</th>
              <th>Status</th>
            </tr>

            <tr
              v-for="(task, index) in tasks"
              :key="index"
              class="bg-blue-300 itbkk-item"
            >
              <td class="text-white text-center font-semibold">
                {{ task.taskId }}
              </td>
              <td
                class="text-blue-800 hover:underline itbkk-title font-semibold"
              >
                <RouterLink
                  :to="{ name: 'taskDetail', params: { id: task.taskId } }"
                  >{{ task.taskTitle }}</RouterLink
                >
              </td>
              <td
                class="text-white itbkk-assignees font-semibold"
                :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
              >
                {{ task.assignees ? task.assignees : 'Unassigned' }}
              </td>

              <td>
                <button
                  class="badge itbkk-status w-24"
                  :class="{
                    'badge-success': task.status === 'Done',
                    'badge-warning': task.status === 'Doing',
                    'badge-info': task.status === 'To Do',
                  }"
                >
                  {{ task.status }}
                </button>
              </td>
            </tr>
          </div>
        </thead>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
