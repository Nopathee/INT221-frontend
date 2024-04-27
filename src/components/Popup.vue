<script setup>
import { defineProps, defineEmits, ref, onMounted , computed ,  } from 'vue';

defineEmits(['close'])
const props = defineProps({
  task: {type: Object,
        default: () => {
      return {
        title: '',
        description: '',
        assignees: '',
        status: '',
        createdOn: '',
        updatedOn: ''
      }
    }
  }
})

const showTask = computed(() => {
  console.log(props.task)
  return props.task
  
})

const showTime = ref({
  timezone: ''
});

const getTimezone = () => {
  showTime.value.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
};

onMounted(() => {
  getTimezone();
});

const formattedCreateOn = computed(() => {
  if (!props.task || !props.task.createdOn) return ''; 
  const date = new Date(props.task.createdOn); 
  const dateString = date.toLocaleDateString("en-GB");
  const timeString = date.toLocaleTimeString("en-GB");
  return `${dateString} ${timeString}`;
});

const formattedUpdatedOn = computed(() => {
  if (!props.task || !props.task.updatedOn) return ''; 
  const date = new Date(props.task.updatedOn); 
  const dateString = date.toLocaleDateString("en-GB");
  const timeString = date.toLocaleTimeString("en-GB");
  return `${dateString} ${timeString}`;
});

</script>

<template>
  <div class=" flex flex-col p-2 gap-5">
    <h1 class = "font-semibold text-2xl itbkk-title text-black" > {{ showTask ? showTask.title : ''}}</h1>
  </div>
  <hr>
  <div class=" flex">
    <div class=" ml-2">

      <p class=" text-sm text-black">Desription</p>
      <textarea class="border-2 border-black h-52 w-96 itbkk-description " >{{ showTask ? showTask.description : '' }}</textarea>
    </div>
    <div class=" flex flex-col">
      <div class=" ml-1">
        <p class=" text-sm text-black">Assignees</p>
        <textarea class=" border-2 border-slate-600 h-24 w-72 itbkk-assignees" >{{ showTask ? showTask.assignees : '' }}</textarea>
      </div>
      <div class="ml-1">
        <p class="text-sm">Status</p>
        <select class="border-2 border-slate-600 h-7 w-72 itbkk-status" >
          <option value="No Status">No Status</option>
          <option value="To Do">To Do</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>

        </select>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm text-black">TimeZone : {{ showTime.timezone }}</p>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm text-black">CreateOn : {{ formattedCreateOn }}</p>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm text-black">UpdatedOn : {{ formattedUpdatedOn }}</p>
        </div>
    </div>
  </div>
  <div class="flex justify-end gap-3 px-2">
    <button class="text-black mt-8 bg-green-400 rounded-lg py-2 px-6 text-right" @click="$emit('close')">Close</button>
  </div>
</template>
        

<style scoped></style>
