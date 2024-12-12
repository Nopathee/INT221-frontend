<script setup>
import { computed, onMounted, ref } from 'vue'
import { StatusManagement } from '../libs/StatusManagement.js'
import { getItems } from '@/libs/fetchUtils'

const showTime = ref({
  timezone: '',
})

const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
}

defineEmits(['close'])
const props = defineProps({
  task: Object,
  statuses: Array,
  boardId: String,
})


const formatterCreateOn = computed(() => {
  if (!props.task || !props.task.item.createdOn) return ''
  const createdOn = new Date(props.task.item.createdOn).toLocaleString('en-GB')
  return createdOn
})

const formatterUpdatedOn = computed(() => {
  if (!props.task || !props.task.item.updatedOn) return ''
  const updatedOn = new Date(props.task.item.updatedOn).toLocaleString('en-GB')
  return updatedOn
})

const statuses = ref(new StatusManagement())

onMounted(async () => {
  try {
    const items = await getItems(
      `${import.meta.env.VITE_API_ENDPOINT}/v3/boards/${props.boardId}/statuses`
    );

    if(items.status === 200) {
      statuses.value.addStatuses(items);
      getTimezone()
    }  else {
      console.error('Expected an array but got:', response);
    }
      
  } catch (error) {
    console.error('Error fetching statuses:', error);
  }
});



</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="w-full flex justify-center p-10 itbkk-modal-task">
      <div class="bg-white shadow-lg w-3/4 flex flex-col p-2 gap-5 rounded-xl">
        <div class="font-bold text-2xl">
          <h1 class="itbkk-title mt-3 ml-2">{{ props.task.item.title }}</h1>
        </div>
        <hr />
        <div class="flex gap-2">
          <div class="ml-2 w-2/3">
            <p class="text-sm font-semibold">Description</p>
            <textarea
              class="textarea bg-slate-100 border-slate-300 h-72 w-full itbkk-description rounded-md"
              readonly="true"
              :style="{
                fontStyle: props.task.item.description ? 'normal' : 'italic',
              }"
              :class="props.task.item.description ? 'text-black' : 'text-gray-500'"
              >{{
                props.task.item.description
                  ? props.task.item.description
                  : 'No Description Provided'
              }}</textarea
            >
          </div>
          <div class="flex flex-col gap-3 w-1/3">
            <div class="ml-1 mr-2">
              <p class="text-sm font-semibold">Assignees</p>
              <textarea
                class="textarea h-24 w-full itbkk-assignees rounded-md bg-slate-100 border-slate-300"
                readonly="true"
                :style="{
                  fontStyle: props.task.item.assignees ? 'normal' : 'italic',
                }"
                :class="props.task.item.assignees ? 'text-black' : 'text-gray-500'"
                >{{
                  props.task.item.assignees ? props.task.item.assignees : 'Unassigned'
                }}</textarea
              >
            </div>
            <div class="ml-1 mr-2">
              <p class="text-sm">Status</p>
              <span class="bg-slate-100 p-1 px-10 mx-2 text-black rounded-lg itbkk-status">
                {{ props.task.item.status.name}}
              </span>
            </div>
            <div class="m-1 flex">
              <p class="text-sm">
                TimeZone:
                <label
                  class="itbkk-timezone bg-slate-100 p-1 px-10 mx-2 text-black rounded-lg"
                >
                  {{ showTime.timezone }}</label
                >
              </p>
            </div>
            <div class="m-1 flex">
              <p class="text-sm">
                CreateOn:
                <label
                  class="itbkk-created-on bg-slate-100 p-1 px-5 mx-2 text-black rounded-lg"
                >
                  {{ formatterCreateOn }}</label
                >
              </p>
            </div>
            <div class="m-1 flex">
              <p class="text-sm">
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
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
