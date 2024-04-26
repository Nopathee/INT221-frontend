<script setup>
import { onMounted, ref } from 'vue';
import Table from './Table.vue';

import { getItems , getItemById } from '@/libs/fetchUtils.js'
import { TaskManagement } from '../libs/TaskManagement.js'
import Popup from './Popup.vue';
console.log(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
const allTask = ref(new TaskManagement())

onMounted(async () => {
    const items = await getItems(`${import.meta.env.VITE_API_ENDPOINT}/tasks`)
    allTask.value.addDtoTasks(items)
    console.log(allTask.value.getTasks())
})

const showModal = ref(false)

const selectedTask = ref(null)

const clearModal = (flagModal) => {
    showModal.value = flagModal
}

const showDetailModal = async (task) => {
    selectedTask.value = await taskToShow(task.taskId)
    showModal.value = true
    console.log(selectedTask.value)
}

const taskToShow = async (taskId) => {
    const task = await getItemById(`${import.meta.env.VITE_API_ENDPOINT}/tasks`, taskId)
    return task
}

</script>
 
<template>
<div>
    <Table :tasks="allTask.getTasks()" @showDetail="showDetailModal"/>
    <Teleport to="#detailModal">
      <div
        v-show="showModal"
        class="absolute left-0 right-0 top-1/3 m-auto bg-slate-50 w-2/4 h-96 shadow-lg rounded-md"
      >
        <Popup @close="clearModal" :task="selectedTask"/> </div>
    </Teleport>
</div>
</template>
 
<style scoped>

</style>