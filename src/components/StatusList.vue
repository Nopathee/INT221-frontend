<script setup>
import { defineProps, onMounted, ref } from 'vue'
import router from '@/router'
import { TaskManagement } from '../libs/TaskManagement.js'
import { StatusManagement } from '@/libs/StatusManagement'
import { getItems } from '@/libs/fetchUtils'

defineProps({
  statuses: Array,
})

defineEmits(['addStatus'])

const statuses = ref(new StatusManagement())

// const status = ref({
//   id: undefined,
//   name: '',
//   description: null,
//   action: null,

// })

onMounted(async () => {
  const items = await getItems(
    `${import.meta.env.VITE_API_ENDPOINT}/v2/statuses`
  )
  statuses.value.addStatuses(items)
  console.log(statuses.value.getStatuses())
})

const back = () => {
  router.go(-1)
}
</script>

<template>
  <h1 class="text-center text-2xl bg-clip-content p-3 font-extrabold mt-5">
        IT-Bangmod Kradan Kanban SSI-3
    </h1>
    <div class=" flex justify-center">
  <table class="table w-3/4 flex justify-center items-center">
    <div class="rounded-xl p-5">
      
      <div class="text-left flex items-center justify-between">
        <div class="flex items-center">
          <h1
            @click="back"
            class="text-2xl font-bold text-blue-500 mr-2 hover:underline"
          >
            HOME
          </h1>
          <span class="mr-2"> > </span>
          <h1>Task Status</h1>
        </div>
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          @click="$emit('addStatus')"
        >
          Add Status
        </button>
      </div>

      <table
        class="w-full table table-lg rounded-lg overflow-hidden mt-5"  
      >
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300">
            <th></th>
            <th>Name</th>
            <th>Desciption</th>
            <th class=" text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(status, index) in statuses.getStatuses()"
            :key="index"
            class="bg-blue-300 itbkk-item"
          >
            <td class="text-white text-center font-semibold">
              {{ index + 1 }}
              <div class="dropdown dropdown-right dropdown-end"></div>
            </td>

            <td
              class="text-blue-800 hover:underline itbkk-status-name font-semibold transition-property: transition-property: transform;"
            >
              {{ status.name }}
            </td>

            <td class="itbkk-status-description font-semibold text-white">
              {{ status.description }}
            </td>

            <td class=" text-right">
              <button
                @click="$emit('editStatus', status.id)"
                class="btn bg-slate-200 text-black itbkk-button-edit mx-2"
              >
                Edit
              </button>
              <button
                @click="$emit('deleteStatus', status.id)"
                class="btn btn-error itbkk-button-delete mx-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </table>
  </div>
</template>

<style scoped></style>
