<script setup>
import { TaskManagement } from '@/libs/TaskManagement'
import { getItemById } from '@/libs/fetchUtils'
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const showTime = ref({
  timezone: '',
})

const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

defineEmits(['close'])
const props = defineProps({
  task: Object,
})

onMounted(() => {
  getTimezone()
})

const formatterCreateOn = computed(() => {
  if (!props.task || !props.task.createdOn) return ''
  const createdOn = new Date(props.task.createdOn).toLocaleString('en-GB')
  return createdOn
})

const formatterUpdatedOn = computed(() => {
  if (!props.task || !props.task.updatedOn) return ''
  const updatedOn = new Date(props.task.updatedOn).toLocaleString('en-GB')
  return updatedOn
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
console.log(props.task)
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="w-full flex justify-center p-10">
      <div class="bg-amber-800 w-3/4 flex flex-col p-2 gap-5 rounded-xl">
        <div class="font-semibold text-2xl text-white">
          <h1 class="itbkk-title">{{ props.task.title }}</h1>
        </div>
        <hr />
        <div class="flex gap-2">
          <div class="ml-2 w-2/3">
            <p class="text-sm text-white">Description</p>
            <textarea
              class="textarea border-2 border-white h-72 w-full itbkk-description rounded-md"
              :style="{
                fontStyle: props.task.description ? 'normal' : 'italic',
              }"
              :class="props.task.description ? 'text-black' : 'text-gray-500'"
              >{{
                props.task.description
                  ? props.task.description
                  : 'No Description Provided'
              }}</textarea
            >
          </div>
          <div class="flex flex-col gap-3 w-1/3">
            <div class="ml-1 mr-2">
              <p class="text-sm text-white">Assignees</p>
              <textarea
                class="textarea h-24 w-full itbkk-assignees rounded-md"
                :style="{
                  fontStyle: props.task.assignees ? 'normal' : 'italic',
                }"
                :class="props.task.assignees ? 'text-black' : 'text-gray-500'"
                >{{
                  props.task.assignees ? props.task.assignees : 'Unassigned'
                }}</textarea
              >
            </div>
            <div class="ml-1 mr-2">
              <p class="text-sm text-white">Status</p>
              <select
                class="select select-bordered w-full max-w-xs itbkk-status"
                v-model="props.task.status"
              >
                <option value="NO_STATUS">No Status</option>
                <option value="TO_DO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div class="m-1 flex">
              <p class="text-sm text-white">
                TimeZone:
                <label
                  class="itbkk-timezone bg-slate-100 p-1 px-10 mx-2 text-black rounded-lg"
                >
                  {{ showTime.timezone }}</label
                >
              </p>
            </div>
            <div class="m-1 flex">
              <p class="text-sm text-white">
                CreateOn:
                <label
                  class="itbkk-created-on bg-slate-100 p-1 px-5 mx-2 text-black rounded-lg"
                >
                  {{ formatterCreateOn }}</label
                >
              </p>
            </div>
            <div class="m-1 flex">
              <p class="text-sm text-white">
                UpdatedOn:
                <label
                  class="itbkk-updated-on bg-slate-100 p-1 px-3 mx-2 text-black rounded-lg"
                >
                  {{ formatterUpdatedOn }}</label
                >
              </p>
            </div>
            <div class="flex justify-end gap-3 pb-2 mr-2">
              <button
                class="mt-8 btn btn-success py-2 px-6 text-right"
                @click="$emit('close')"
              >
                Ok
              </button>

              <button
                class="mt-8 btn btn-error py-2 px-6 text-right"
                @click="$emit('close')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
