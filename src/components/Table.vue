<script setup>

defineProps({
  tasks: Array,
})

</script>

<template>
  <div class="w-full gap-5 p-5">
    <h1 class="text-center text-2xl bg-clip-content p-3">
      IT-Bangmod Kradan Kanban SSI-3
    </h1>
    <div class="flex justify-center">
      <table class="border-collapse bg-amber-200 border w-3/4">
        <thead>
          <tr class="bg-amber-800 text-white">
            <th></th>
            <th>Title</th>
            <th>Assignees</th>
            <th>Status</th>
          </tr>
          <tr v-for="(task, index) in tasks" :key="index" class="itbkk-item">
            <td class="text-black text-center">{{ task.taskId }}</td>
            <td class="text-blue-400 hover:underline itbkk-title">
              <RouterLink
                :to="{ name: 'taskDetail', params: { id: task.taskId } }"
                >{{ task.taskTitle }}</RouterLink
              >
            </td>
            <td
              class="text-black itbkk-assignees"
              :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }"
            >
              {{ task.assignees ? task.assignees : 'Unassigned' }}
            </td>

            <td
              class="bg-left bg-clip-content rounded-full size-1 text-black itbkk-status"
              :style="{
                backgroundColor:
                  task.status === 'To Do'
                    ? 'red'
                    : task.status === 'Doing'
                    ? 'yellow'
                    : task.status === 'Done'
                    ? 'green'
                    : 'grey',
              }"
            >
              {{ task.status }}
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style scoped>
td {
  padding: 24px;
  border: 3px orange solid;
}
th {
  padding: 12px;
  border: 3px orange solid;
}
</style>
