<script setup>

import { ref } from 'vue';
defineEmits(['saveLimit', 'cancleLimit' , 'closeToast'])

const limitStatus = ref(false)
const confirmModal = ref(false)
const islimitDisabled = ref(false)
const limitNumber = ref(0)



const toggleLimit = () => {
  limitStatus.value = !limitStatus.value
 console.log(limitStatus.value)
  if(limitStatus.value === true){
  confirmModal.value = true
 } 
 
}

const save = () => {
  confirmModal.value = false
  islimitDisabled.value = true
  
}

const close = () => {
  confirmModal.value = false
  islimitDisabled.value = false
  limitStatus.value = false
}



</script>

<template>
    <div>
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div
        class="bg-white rounded-lg p-8 max-w-md shadow-2xl dark:bg-gray-700"
      >
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Limit task in status
          </h2>
        </div>
        <div class="flex"> 
            <h1>The user can enable/disable a maximum limit of 10 tasks except "No status" and "Done"</h1>
            <input @click="toggleLimit" type="checkbox" class="toggle" /> 

        </div>
        <div class="flex justify-between p-4" v-show="islimitDisabled"> 
             <h1>maximum task</h1>
             <input type="number" min="0" max="10" class="rounded-lg text-center" v-model="limitNumber"/>
             
             </div>
        <div class="flex justify-end">
          
          <button
            @click="$emit('saveLimit', limitNumber)"
            class="px-4 py-2 bg-green-500 text-white rounded-md mr-2 disabled:opacity-50"
            
          >
            Save
          </button>
          <button
            @click="$emit('cancelLimit')"
            class="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
      <div v-show="confirmModal" class="fixed inset-0 items-center flex justify-center">
      <div class="bg-white items-center drop-shadow-xl border rounded-lg">
        <h1 class="flex text-xl justify-center font-bold itbkk-message">
          Confirm
        </h1>
        <h2 class=" flex justify-center itbkk-message mx-6">
          The Kanban board will limit the number of tasks in each status to 10<span class=" font-semibold italic text-red-800"></span> ?
        </h2>
        <div class="flex justify-center gap-2 mt-3 mb-6">
          <button
            class="btn btn-sm w-16 bg-red-500 text-white hover:bg-red-700 itbkk-button-confirm"
            @click="save"
          >
            Confirm
          </button>
          <button
            class="btn btn-sm w-16 bg-slate-400 hover:bg-slate-600 text-white itbkk-button-cancel"
            @click="close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  
  </div>
  
</template>

<style scoped></style>
