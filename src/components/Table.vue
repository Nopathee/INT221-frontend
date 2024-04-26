<script setup>
import { ref } from 'vue'

import Popup from '../components/Popup.vue'

defineProps({
  tasks: Array,
})

const showModal = ref(false)
const toggleModal = () => {
  showModal.value = !showModal.value
  tasks.value = tasks.value.filter((tt) => tt == task.taskId)
}
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
        <tr v-for="(task, index) in tasks" :key="index">
          <td class="text-black text-center">{{ task.taskId }}</td>
          <td @click="showModal = true" class="text-blue-400 hover:underline">
            {{ task.taskTitle }}
          </td>
          <td class="text-black">{{ task.assignees }}</td>

          <td
            class="bg-green-500/60 bg-left bg-clip-content rounded-full size-1 text-black"
          >
            {{ task.status }}
          </td>
        </tr>
      </thead>
    </table>
    <Popup :showModal="showModal" @close="toggleModal" ;>
      <div class="text-black">{{ tasks[0].taskTitle }}</div>
      <div class="text-black">Description</div>
      <div class="text-black">Assignees</div>
      <div class="text-black">Status</div>
      <div class="text-black">Timezone</div>
      <div class="text-black">Created On</div>
      <div class="text-black">Updated On</div>
    </Popup>
  </div>
  >>>>>>> aukky
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
