<script setup>
import { computed, ref } from 'vue';

defineEmits(['close'])
const props = defineProps({
  task: Object
})

const showTask = computed(() => {
  console.log(props.task)
  return props.task
  
})


</script>

<template>
  <div class=" flex flex-col p-2 gap-5">
    <h1 class = "font-semibold text-2xl itbkk-title " >{{ props.task ? props.task.title : '' }}</h1>
  </div>
  <hr>
  <div class=" flex">
    <div class=" ml-2">
      <p class=" text-sm">Desription</p>
      <textarea class="border-2 border-black h-52 w-96 itbkk-description " >{{ props.task ? props.task.desription : '' }}</textarea>
    </div>
    <div class=" flex flex-col">
      <div class=" ml-1">
        <p class=" text-sm">Assignees</p>
        <textarea class=" border-2 border-slate-600 h-24 w-72 itbkk-assignees" >{{ props.task ? props.task.assignees : '' }}</textarea>
      </div>
      <div class=" ml-1">
        <p class=" text-sm">Status</p>
        <select class=" border-2 border-slate-600 h-7 w-72 itbkk-status" placeholder="Status" >
          <option value=""></option>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm">TimeZone</p>
        <input type="text" class="  border-2 border-slate-600 h-5 w-56 itbkk-timezone" >{{ showTask.title ? showTask.title.toLocaleString() : '' }}</input>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm">CreateOn</p>
        <input type="text" class="  border-2 border-slate-600 h-5 w-56 itbkk-create-on">{{ showTask.title ? showTask.title.CreateOn : '' }}</input>
      </div>
      <div class=" m-1 flex">
        <p class=" text-sm">UpdatedOn</p>
        <input type="text" class="  border-2 border-slate-600 h-5 w-56 itbkk-updated-on">{{ showTask.title ? showTask.title.UpdatedOn : '' }}</input>
        </div>
    </div>
  </div>
  <div class=" flex justify-end gap-3 px-2">
    <button
      class="text-black mt-8 bg-green-400 rounded-lg py-2 px-6 text-right"
      @click="$emit('close')"
    >
      Ok
    </button>
    <button
      class="text-black mt-8 bg-red-500 rounded-lg py-2 px-6 text-right"
      @click="$emit('close', false)"
    >
      Close
    </button>
  </div>
</template>

<style scoped></style>
