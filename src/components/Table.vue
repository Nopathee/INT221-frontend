<script setup>
import { ref } from 'vue'

defineProps({
  tasks: Array,
})

const showModal = ref(false)
const toggleModal = () => {
  showModal.value = !showModal.value
  tasks.value = tasks.value.filter((tt) => tt == task.taskId)
}


defineEmits(['showDetail'])
</script>

<template>
  <h1 class="text-center text-2xl bg-black bg-clip-content">
    IT-Bangmod Kradan Kanban SSI-3
  </h1>
  <div>
    <table class="border-collapse bg-white border w-full">
      <thead>
        <tr class="text-black bg-gray-400">
          <th></th>
          <th>Title</th>
          <th>Assignees</th>
          <th>Status</th>
        </tr>
        <tr v-for="(task, index) in tasks" :key="index" class="itbkk-item">
          <td class="text-black text-center">{{ task.taskId }}</td>
          <td class="text-blue-400 hover:underline itbkk-title">
            <button @click="$emit('showDetail',task.taskId)">{{ task.taskTitle }}</button>
          </td>
          <td class="text-black itbkk-assignees" :style="{ fontStyle: task.assignees ? 'normal' : 'italic' }" ç>{{ task.assignees ? task.assignees : "Unassigned" }}</td>

          <td
            class="bg-green-500/60 bg-left bg-clip-content rounded-full size-1 text-black itbkk-status"
          >
            {{ task.status }}
          </td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style scoped>
td {
  padding: 24px;
  border: 3px black solid;
}
th {
  padding: 12px;
  border: 3px black solid;
}
</style>
