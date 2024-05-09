<script setup>
import { defineProps, ref } from 'vue'
defineProps({
  tasks: Array,
})

defineEmits(['openModal', 'closeModal', 'editTask', 'showDetail', 'deleteTask','statusDetail'  ])

</script>

<template>
  <div class="w-full flex justify-center items-center">
    <div class="rounded-xl p-5">
      <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg  mb-4 "><router-link to="/task/statuses" @click="$emit('statusDetail')">
  Manage Status</router-link>
</button>
      <table class="w-full table table-lg rounded-lg overflow-hidden">
        <thead>
          <tr class="font-bold text-red-800 text-lg bg-pink-300">
            <th>
              <img
                src="./icon/InsertBtn.svg"
                alt="Add Task"
                @click="$emit('openModal', true)"
                class="cursor-pointer itbkk-button-add"
              />
            </th>
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
            <td class="text-white text-center font-semibold flex">
              {{ index + 1 }}
              <div class="dropdown dropdown-right dropdown-end">
                <div tabindex="0" role="button" class="itbkk-button-action">
                  <img src="./icon/Threebtn.svg" />
                </div>
                <ul
                  class="p-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32"
                >
                  <li>
                    <button
                      @click="$emit('editTask', task.id)"
                      class="text-black itbkk-button-edit"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      @click="$emit('deleteTask', task.id , index + 1)"
                      class="text-red-600 itbkk-button-delete"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </td>

            <td
              class="text-blue-800 hover:underline itbkk-title font-semibold transition-property: transition-property: transform;"
              @click="$emit('showDetail', task.id)"
            >
              {{ task.title }}
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
                  'badge-success': task.status.name === 'DONE',
                  'badge-warning': task.status.name === 'DOING',
                  'badge-info': task.status.name === 'TO_DO',
                }"
              >
                {{ task.status.name }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
